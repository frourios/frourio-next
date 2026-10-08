import { readFileSync } from 'fs';
import { createServer } from 'http';
import { expect, expectTypeOf, test } from 'vitest';
import { z } from 'zod';
import * as client from '../../projects/basic/app/api/test-client/redirect/frourio.client';
import { createRoute } from '../../projects/basic/app/api/test-client/redirect/frourio.server';
import * as routes from '../../projects/basic/app/api/test-client/redirect/route';
import type { FrourioSpec } from '../../src/index';

test('redirect destinations drive client validation and OpenAPI while server returns redirects', async () => {
  const redirect = await routes.GET(new Request('http://localhost/'));
  expect(redirect.status).toBe(301);
  expect(redirect.headers.get('location')).toBe('/users');
  expect(redirect.cookies.get('session')?.value).toBe('token');
  expect(await redirect.text()).toBe('');
  expect(
    await (await routes.POST(new Request('http://localhost/', { method: 'POST' }))).text(),
  ).toBe('Moved');
  const cached = createRoute({
    ...routes.controller,
    get: async () => ({ status: 304, headers: { etag: 'version' } }),
  });
  expect(await (await cached.GET(new Request('http://localhost/'))).text()).toBe('');
  const fetcher =
    (body: unknown, status = 200, headers?: HeadersInit) =>
    async () =>
      Response.json(body, { status, ...(headers ? { headers } : {}) });
  expect(
    await client.$fc({ fetch: fetcher({ user: 'Alice' }, 200, { 'x-result': 'ok' }) }).$get(),
  ).toEqual({ user: 'Alice' });
  expect(await client.$fc({ fetch: fetcher({ direct: true }) }).$get()).toEqual({ direct: true });
  expect(
    (await client.fc({ fetch: fetcher({ forbidden: true }, 403) }).$get()).failure?.body,
  ).toEqual({ forbidden: true });
  await expect(client.$fc({ fetch: fetcher({ forbidden: true }, 403) }).$get()).rejects.toThrow(
    '403',
  );
  await expect(
    client.$fc({ fetch: fetcher({ user: 123 }, 200, { 'x-result': 'ok' }) }).$get(),
  ).rejects.toThrow();
  expect(await client.$fc({ fetch: fetcher(42, 201) }).$post()).toBe(42);
  expect(await client.$fc({ fetch: fetcher({ external: true }) }).$put()).toEqual({
    external: true,
  });
  expect(
    await client.$fc({ fetch: async () => new Response(null, { status: 204 }) }).$patch(),
  ).toBeUndefined();
  await expect(client.$fc({ fetch: fetcher(false, 403) }).$delete()).rejects.toThrow('403');
  const seenMethods: string[] = [];
  const origin = createServer(async (req, res) => {
    if (req.url === '/users') {
      seenMethods.push(req.method ?? 'GET');
      res.writeHead(req.method === 'POST' ? 201 : 200, {
        'content-type': 'application/json',
        'x-result': 'ok',
      });
      res.end(JSON.stringify(req.method === 'POST' ? 42 : { user: 'Alice' }));
    } else {
      const handler = req.method === 'POST' ? routes.POST : routes.GET;
      const response = await handler(
        new Request('http://localhost/', { method: req.method ?? 'GET' }),
      );
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(await response.text());
    }
  });
  await new Promise<void>((resolve) => origin.listen(0, '127.0.0.1', resolve));
  try {
    const address = origin.address();
    if (!address || typeof address === 'string') throw new Error('Missing HTTP address');
    const networkClient = client.$fc({ baseURL: `http://127.0.0.1:${address.port}` });
    expect(await networkClient.$get()).toEqual({ user: 'Alice' });
    expect(await networkClient.$post()).toBe(42);
    expect(seenMethods).toEqual(['GET', 'POST']);
  } finally {
    await new Promise<void>((resolve, reject) =>
      origin.close((error) => (error ? reject(error) : resolve())),
    );
  }
  const doc = JSON.parse(readFileSync('projects/basic/public/openapi.json', 'utf8')).paths[
    '/api/test-client/redirect'
  ];
  expect(Object.keys(doc.get.responses)).toEqual(['200', '304', '403']);
  expect(doc.get.responses['200'].content['application/json'].schema.anyOf).toHaveLength(2);
  expect(doc.get.responses['200'].headers['x-result'].required).toBe(false);
  expect(doc.get.responses['304']).not.toHaveProperty('content');
  expect(doc.post.responses).toHaveProperty('201');
  expect(doc.post.responses).not.toHaveProperty('307');
  expect(doc.put.responses).toHaveProperty('302');
  expect(doc.patch.responses['204']).not.toHaveProperty('content');
  expect(doc.options.responses).toHaveProperty('300');
});

test('generated redirect client types describe final responses', () => {
  expectTypeOf<
    Awaited<ReturnType<ReturnType<typeof client.$fc>['$put']>>
  >().toEqualTypeOf<unknown>();
  expectTypeOf<Awaited<ReturnType<ReturnType<typeof client.$fc>['$get']>>>().toEqualTypeOf<
    { direct: true } | { user: string }
  >();
});

test('304 has no body and destinations are restricted to redirect responses', () => {
  type GetRes = NonNullable<NonNullable<FrourioSpec['get']>['res']>;
  expectTypeOf<NonNullable<GetRes[304]>['body']>().toEqualTypeOf<undefined>();
  expectTypeOf<'304'>().not.toExtend<keyof NonNullable<NonNullable<FrourioSpec['post']>['res']>>();
  expectTypeOf<NonNullable<GetRes[200]>['dest']>().toEqualTypeOf<undefined>();
  const spec = {
    get: { res: { 302: { dest: { 200: { body: z.string() } } } } },
  } satisfies FrourioSpec;
  expect(spec.get.res[302].dest[200].body.parse('ok')).toBe('ok');
});
