import { NextRequest, NextResponse } from 'next/server';
import { expect, test, vi } from 'vitest';
import { createMiddleware as createChildMiddleware } from '../../projects/basic/app/api/middleware-request/child/frourio.middleware';
import { createMiddleware } from '../../projects/basic/app/api/middleware-request/frourio.middleware';

test('middleware validates request schemas without context and inherits parent middleware', async () => {
  const callback = vi.fn<Parameters<typeof createMiddleware>[0]>(
    async ({ headers, cookies, query, next }) => {
      expect(headers).toEqual({ 'x-token': 'token' });
      expect(cookies).toEqual({ session: 'hello world' });
      expect(query).toEqual({ count: 2, active: true, ids: [1, 3] });
      return next();
    },
  );
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
});
