import { NextRequest, NextResponse } from 'next/server';
import { expect, expectTypeOf, test, vi } from 'vitest';
import { $fc, fc } from '../../projects/basic/app/api/optional-request/frourio.client';
import { createMiddleware } from '../../projects/basic/app/api/optional-request/frourio.middleware';
import { createRoute } from '../../projects/basic/app/api/optional-request/frourio.server';

const missing = (args: object) => {
  for (const key of ['cookies', 'headers', 'query']) expect(Object.hasOwn(args, key)).toBe(false);
};

test('optional request objects are omitted when no declared keys are present', async () => {
  const get = vi.fn<Parameters<typeof createRoute>[0]['get']>(async (args) => {
    missing(args);
    return { status: 200, body: args };
  });
  const middleware = vi.fn<Parameters<typeof createMiddleware>[0]>(async (args) => {
    missing(args);
    return args.next();
  });
  const handler = createRoute({ get, post: async () => ({ status: 200 }) }).GET;
  const middlewareHandler = createMiddleware(middleware)(async () => NextResponse.json({}));
  for (const RequestType of [Request, NextRequest]) {
    const req = new RequestType('http://localhost/?unrelated=1', {
      headers: { 'x-other': 'value', cookie: 'other=value' },
    });
    expect((await handler(req)).status).toBe(200);
    expect((await middlewareHandler(req)).status).toBe(200);
  }
  expect(get).toHaveBeenCalledTimes(2);
  expect(middleware).toHaveBeenCalledTimes(2);
});

test('presence of any declared key triggers full validation, including empty values', async () => {
  const middleware = createMiddleware(async ({ next }) => next());
  const get = vi.fn<Parameters<typeof createRoute>[0]['get']>(async (args) => ({
    status: 200,
    body: args,
  }));
  const route = createRoute({ get, post: async () => ({ status: 200 }) }).GET;
  const middlewareHandler = middleware(async () => NextResponse.json({}));
  for (const [query, headers] of [
    ['?count=2', {}],
    ['?count=bad&active=true', {}],
    ['', { 'x-token': 'token' }],
    ['', { 'x-token': '', 'x-user': 'user' }],
    ['', { cookie: 'session=value' }],
    ['', { cookie: 'session=; user=value' }],
  ] as const) {
    for (const handler of [route, middlewareHandler]) {
      expect((await handler(new Request(`http://localhost/${query}`, { headers }))).status).toBe(
        422,
      );
    }
  }
  expect(get).not.toHaveBeenCalled();
  const req = new Request('http://localhost/?count=2&active=false', {
    headers: { 'x-token': 'token', 'X-User': 'user', cookie: 'session=hello%20world; user=user' },
  });
  expect(await (await route(req)).json()).toEqual({
    headers: { 'X-Token': 'token', 'x-user': 'user' },
    cookies: { session: 'hello world', user: 'user' },
    query: { count: 2, active: false },
  });
});

test('optional headers and query can be omitted by generated clients', async () => {
  expectTypeOf<Parameters<ReturnType<typeof $fc>['$get']>[0]>().toExtend<
    { headers?: unknown; query?: unknown } | undefined
  >();
  const fetcher = vi.fn(async () => Response.json({}));
  expect(await $fc({ fetch: fetcher }).$get()).toEqual({});
  expect(await $fc({ fetch: fetcher }).$build()[1]()).toEqual({});
  expect((await fc({ fetch: fetcher }).$build()[1]()).isValid).toBe(true);
  expect(fetcher).toHaveBeenCalledTimes(3);
});
