import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import ts from 'typescript';
import { expect, test, vi } from 'vitest';
import { generate } from '../../src/generate';

test('middleware validates request schemas without context and inherits parent middleware', async () => {
  const appDir = mkdtempSync(path.resolve('tests/node/.middleware-request-'));
  const child = path.join(appDir, 'child');
  mkdirSync(child);
  try {
    writeFileSync(
      path.join(appDir, 'frourio.ts'),
      `
import { z } from 'zod';
import type { FrourioSpec } from '@frourio/next';
export const frourioSpec = { middleware: {
  headers: z.object({ 'x-token': z.string().min(1) }),
  cookies: z.object({ session: z.string() }),
  query: z.object({ count: z.number(), active: z.boolean(), ids: z.array(z.number()), flags: z.array(z.boolean()).optional(), label: z.string().optional() }),
} } satisfies FrourioSpec;
`,
    );
    writeFileSync(
      path.join(appDir, 'route.middleware.ts'),
      `
import { createMiddleware } from './frourio.middleware';
export const middleware = createMiddleware(async ({ next }) => next());
`,
    );
    writeFileSync(
      path.join(child, 'frourio.ts'),
      `
import { z } from 'zod';
import type { FrourioSpec } from '@frourio/next';
export const frourioSpec = { middleware: { cookies: z.object({ session: z.string() }), context: z.object({ user: z.string() }) } } satisfies FrourioSpec;
`,
    );
    await generate({ appDir, basePath: undefined });
    const program = ts.createProgram(
      [path.join(appDir, 'frourio.middleware.ts'), path.join(child, 'frourio.middleware.ts')],
      {
        noEmit: true,
        strict: true,
        skipLibCheck: true,
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
      },
    );
    expect(
      ts
        .getPreEmitDiagnostics(program)
        .map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n')),
    ).toEqual([]);
    const { createMiddleware } = await import(
      /* @vite-ignore */ path.join(appDir, 'frourio.middleware.ts')
    );
    const callback = vi.fn(async ({ headers, cookies, query, next }) => {
      expect(headers).toEqual({ 'x-token': 'token' });
      expect(cookies).toEqual({ session: 'hello world' });
      expect(query).toEqual({ count: 2, active: true, ids: [1, 3] });
      return next();
    });
    const next = vi.fn(async () => NextResponse.json({ ok: true }));
    const handler = createMiddleware(callback)(next);
    for (const RequestType of [Request, NextRequest]) {
      const response = await handler(
        new RequestType('http://localhost/?count=2&active=true&ids=1&ids=3', {
          headers: { 'x-token': 'token', cookie: 'session=hello%20world' },
        }),
      );
      expect(response.status).toBe(200);
    }
    for (const [url, headers] of [
      ['?count=bad&active=true&ids=1', { 'x-token': 'token', cookie: 'session=hello' }],
      ['?count=2&active=true&ids=1', { cookie: 'session=hello' }],
      ['?count=2&active=true&ids=1', { 'x-token': 'token' }],
    ] as const) {
      const response = await handler(new Request(`http://localhost/${url}`, { headers }));
      expect(response.status).toBe(422);
      expect((await response.json()).issues.length).toBeGreaterThan(0);
    }
    expect(callback).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalledTimes(2);
    const { createMiddleware: createChildMiddleware } = await import(
      /* @vite-ignore */ path.join(child, 'frourio.middleware.ts')
    );
    const childHandler = createChildMiddleware(
      async ({
        cookies,
        next,
      }: {
        cookies: { session: string };
        next: (ctx: { user: string }) => Promise<NextResponse>;
      }) => next({ user: cookies.session }),
    )(async (_: unknown, ctx: { user: string }) => NextResponse.json(ctx));
    const response = await childHandler(
      new Request('http://localhost/child?count=2&active=true&ids=1', {
        headers: { 'x-token': 'token', cookie: 'session=user' },
      }),
    );
    expect(await response.json()).toEqual({ user: 'user' });
    const invalidParent = await childHandler(
      new Request('http://localhost/child', { headers: { cookie: 'session=user' } }),
    );
    expect(invalidParent.status).toBe(422);
  } finally {
    rmSync(appDir, { recursive: true, force: true });
  }
}, 20000);
