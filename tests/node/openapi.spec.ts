import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { expect, test } from 'vitest';
import { generateOpenapi } from '../../src/openapi/generateOpenapi';

test('OpenAPI preserves template components except schemas and replaces paths', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'frourio-openapi-'));
  const template = path.join(dir, 'template.json');
  const output = path.join(dir, 'openapi.json');
  const components = {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer' } },
    responses: { Unauthorized: { description: 'Authentication required' } },
    parameters: { Limit: { name: 'limit', in: 'query', schema: { type: 'integer' } } },
    headers: { RequestId: { schema: { type: 'string' } } },
    requestBodies: { Message: { content: { 'text/plain': { schema: { type: 'string' } } } } },
    examples: { Message: { value: 'hello' } },
    links: { Next: { operationId: 'next' } },
    callbacks: {},
    pathItems: { Health: { get: { responses: { 200: { description: 'OK' } } } } },
    'x-custom': { enabled: true },
  };
  const security = [{ bearerAuth: [] }];

  try {
    writeFileSync(
      template,
      JSON.stringify({
        openapi: '3.1.0',
        info: { title: 'Test API', version: '1.0.0' },
        security,
        components: { ...components, schemas: { TemplateOnly: { type: 'string' } } },
        paths: { '/template-only': { get: { responses: { 200: { description: 'OK' } } } } },
      }),
    );

    generateOpenapi({
      appDir: path.resolve('projects/basic/app'),
      basePath: undefined,
      root: undefined,
      template,
      output,
    });

    const doc = JSON.parse(readFileSync(output, 'utf8'));
    const baseline = JSON.parse(readFileSync('projects/basic/public/openapi.json', 'utf8'));
    const { schemas, ...preservedComponents } = doc.components;

    expect(preservedComponents).toEqual(components);
    expect(schemas).toEqual(baseline.components.schemas);
    expect(schemas).not.toHaveProperty('TemplateOnly');
    expect(doc.paths).toEqual(baseline.paths);
    expect(doc.paths['/api/test-client/cookie'].get.parameters).toContainEqual({
      name: 'val',
      in: 'cookie',
      required: false,
      schema: { type: 'string' },
    });
    expect(doc.paths['/api/test-client/cookie'].post.parameters).toContainEqual({
      name: 'val',
      in: 'cookie',
      required: false,
      schema: { type: 'string' },
    });
    const cookieResponses = doc.paths['/api/test-client/cookie'];
    expect(cookieResponses.get.responses['200'].headers['Set-Cookie']).toEqual({
      description: 'Each value is sent as a separate Set-Cookie header.',
      schema: { type: 'array', items: { type: 'string' } },
      example: ['legacy=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'],
    });
    expect(cookieResponses.post.responses['200'].headers).toEqual({
      'x-cookie-test': { schema: { type: 'string', const: 'set' }, required: true },
      'Set-Cookie': {
        description: 'Each value is sent as a separate Set-Cookie header.',
        schema: { type: 'array', items: { type: 'string' } },
        example: [
          'val=string; Path=/',
          'enabled=true; Path=/',
          'count=1; Path=/api; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=3600; Domain=example.com; Secure; HttpOnly; SameSite=lax; Partitioned; Priority=high',
          'legacy=; Path=/api; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=3600; Domain=example.com',
        ],
      },
    });
    expect(cookieResponses.post.responses['400']).not.toHaveProperty('headers');
    expect(doc.security).toEqual(security);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}, 100000);

test('OpenAPI cookie examples preserve literals and enums and represent complex value types', () => {
  // Keep the fixture under the repository so its imports resolve the installed packages.
  const dir = mkdtempSync(path.resolve('tests/node/.openapi-cookies-'));
  const template = path.join(dir, 'template.json');
  const output = path.join(dir, 'openapi.json');

  try {
    writeFileSync(
      template,
      JSON.stringify({ openapi: '3.1.0', info: { title: 'Cookie examples', version: '1' } }),
    );
    writeFileSync(
      path.join(dir, 'frourio.ts'),
      `
import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';

export const frourioSpec = {
  get: {
    cookies: z.object({ session: z.string(), preference: z.string().optional() }),
    res: {
      200: {
        cookies: {
          literal: { command: 'set', value: z.literal('hello world') },
          theme: { command: 'set', value: z.enum(['dark', 'light']) },
          mixed: { command: 'set', value: z.union([z.literal('ok'), z.object({ id: z.number() }), z.null()]) },
          nil: { command: 'set', value: z.null() },
          array: { command: 'set', value: z.array(z.string()) },
          object: { command: 'set', value: z.object({ name: z.string() }) },
          unknown: { command: 'set', value: z.unknown() },
          dated: {
            command: 'set', value: z.string(),
            options: { expires: new Date('2030-01-01'), secure: false, httpOnly: false,
              sameSite: false, partitioned: false } as const,
          },
        },
      },
      204: { cookies: {} },
    },
  },
} satisfies FrourioSpec;
`,
    );
    generateOpenapi({ appDir: dir, root: dir, basePath: undefined, template, output });

    const doc = JSON.parse(readFileSync(output, 'utf8'));
    const method = doc.paths['/'].get;
    expect(method.parameters).toEqual([
      { name: 'session', in: 'cookie', required: true, schema: { type: 'string' } },
      { name: 'preference', in: 'cookie', required: false, schema: { type: 'string' } },
    ]);
    expect(method.responses['200'].headers['Set-Cookie']).toEqual({
      description: 'Each value is sent as a separate Set-Cookie header.',
      schema: { type: 'array', items: { type: 'string' } },
      example: [
        'literal=hello%20world; Path=/',
        'theme=dark; Path=/',
        'mixed=%5Bobject%20Object%5D; Path=/',
        'nil=null; Path=/',
        'array=; Path=/',
        'object=%5Bobject%20Object%5D; Path=/',
        'unknown=; Path=/',
        'dated=string; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      ],
    });
    expect(method.responses['204']).not.toHaveProperty('headers');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}, 100000);
