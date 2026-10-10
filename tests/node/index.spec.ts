import assert from 'assert';
import { execSync } from 'child_process';
import fs, { existsSync } from 'fs';
import { unlink } from 'fs/promises';
import path from 'path';
import Ajv2020 from 'ajv/dist/2020.js';
import { NextRequest } from 'next/server';
import { expect, test } from 'vitest';
import type { z } from 'zod';
import type {
  MaybeId,
  frourioSpec as querySpec,
  SymbolId,
  ZodId,
} from '../../projects/basic/app/(group1)/[pid]/frourio';
import * as queryRoute from '../../projects/basic/app/(group1)/[pid]/route';
import * as numberRoute from '../../projects/basic/app/(group1)/blog/[...slug]/route';
import * as stringRoute from '../../projects/basic/app/(group1)/blog/hoge/[[...fuga]]/route';
import * as paramsRoute from '../../projects/basic/app/[a]/[b]/[...c]/route';
import { createRoute as createCookieRoute } from '../../projects/basic/app/api/test-client/cookie/frourio.server';
import * as cookieRoute from '../../projects/basic/app/api/test-client/cookie/route';
import * as baseRoute from '../../projects/basic/app/route';
import type { frourioSpec as formSpec } from '../../projects/src-dir/src/app/api/frourio';
import * as formReqRoute from '../../projects/src-dir/src/app/api/route';
import { CLIENT_FILE, MIDDLEWARE_SERVER_FILE, PARAMS_FILE, SERVER_FILE } from '../../src/constants';
import { generate } from '../../src/generate';
import { listFrourioDirs } from '../../src/listFrourioDirs';
import { generateMsw } from '../../src/msw/generateMsw';
import { getMswConfig } from '../../src/msw/getMswConfig';
import { generateOpenapi } from '../../src/openapi/generateOpenapi';
import { getOpenapiConfig } from '../../src/openapi/getOpenapiConfig';

test('generate', async () => {
  const projectDirs = fs
    .readdirSync('./projects', { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.posix.join(process.cwd(), './projects', d.name));

  await Promise.all(
    projectDirs.map(async (dir) => {
      const openapiConfig = await getOpenapiConfig({
        output: undefined,
        template: undefined,
        root: undefined,
        dir,
      });

      assert(openapiConfig.appDir);

      const frourioDirs = listFrourioDirs(openapiConfig.appDir);

      await Promise.all([
        ...frourioDirs.map(
          (dir) => existsSync(path.join(dir, SERVER_FILE)) && unlink(path.join(dir, SERVER_FILE)),
        ),
        ...frourioDirs.map(
          (dir) => existsSync(path.join(dir, CLIENT_FILE)) && unlink(path.join(dir, CLIENT_FILE)),
        ),
        ...frourioDirs.map(
          (dir) =>
            existsSync(path.join(dir, MIDDLEWARE_SERVER_FILE)) &&
            unlink(path.join(dir, MIDDLEWARE_SERVER_FILE)),
        ),
        ...frourioDirs.map(
          (dir) => existsSync(path.join(dir, PARAMS_FILE)) && unlink(path.join(dir, PARAMS_FILE)),
        ),
      ]);
      await generate(openapiConfig);
      await generate(openapiConfig);

      const mswConfig = await getMswConfig({ output: undefined, dir });

      if (existsSync(mswConfig.output)) fs.unlinkSync(mswConfig.output);
      if (existsSync(openapiConfig.output)) fs.unlinkSync(openapiConfig.output);
      if (existsSync(openapiConfig.template)) fs.unlinkSync(openapiConfig.template);

      generateMsw(mswConfig);
      generateOpenapi(openapiConfig);

      generateMsw(mswConfig);
      generateOpenapi(openapiConfig);
    }),
  );

  const out = execSync('git status projects', { encoding: 'utf8' });

  expect(out).toMatch('nothing to commit, working tree clean');
}, 100000);

test('validate openapi.json', async () => {
  const documentSchema = JSON.parse(
    fs.readFileSync('./tests/node/openapi_v3.1/schema.2026-08-03.json', 'utf8'),
  );
  const baseDialect = 'https://spec.openapis.org/oas/3.1/dialect/2024-11-10';
  // schema-base fixes the dialect, so resolve its dynamic references explicitly for Ajv.
  const resolveBaseDialect = (value: unknown): void => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach(resolveBaseDialect);
      return;
    }
    const schema = value as Record<string, unknown>;
    if (schema.$dynamicRef === '#meta') {
      delete schema.$dynamicRef;
      schema.$ref = baseDialect;
    }
    Object.values(schema).forEach(resolveBaseDialect);
  };
  resolveBaseDialect(documentSchema);

  const ajv = new Ajv2020({
    strictTypes: false,
    allowMatchingProperties: true,
    validateFormats: false,
    schemas: [
      documentSchema,
      JSON.parse(fs.readFileSync('./tests/node/openapi_v3.1/dialect.2024-11-10.json', 'utf8')),
      JSON.parse(fs.readFileSync('./tests/node/openapi_v3.1/meta.2024-11-10.json', 'utf8')),
    ],
  });
  const validate = ajv.compile(
    JSON.parse(fs.readFileSync('./tests/node/openapi_v3.1/schema-base.2026-08-03.json', 'utf8')),
  );
  const projectDirs = fs
    .readdirSync('./projects', { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.posix.join(process.cwd(), './projects', d.name));

  await Promise.all(
    projectDirs.map(async (dir) => {
      const openapiConfig = await getOpenapiConfig({
        output: undefined,
        template: undefined,
        root: undefined,
        dir,
      });

      const isValid = validate(JSON.parse(fs.readFileSync(openapiConfig.output, 'utf8')));
      expect(validate.errors, openapiConfig.output).toBeNull();
      expect(isValid).toBeTruthy();
    }),
  );
});

test('request cookies', async () => {
  const url = 'http://example.com/api/test-client/cookie';
  const missing = await cookieRoute.GET(new Request(url));
  expect(missing.status).toBe(200);
  await expect(missing.json()).resolves.toEqual({});

  const decoded = await cookieRoute.GET(
    new Request(url, { headers: { cookie: 'val=hello%20world; another=a=b; val=ignored' } }),
  );
  expect(decoded.status).toBe(200);
  await expect(decoded.json()).resolves.toEqual({ val: 'hello world' });

  const invalid = await cookieRoute.GET(new Request(url, { headers: { cookie: 'val=x' } }));
  expect(invalid.status).toBe(422);

  const invalidPost = await cookieRoute.POST(
    new Request(url, {
      method: 'POST',
      headers: { cookie: 'val=x' },
      body: JSON.stringify({ val: 'new' }),
    }),
  );
  expect(invalidPost.status).toBe(422);
});

test('response cookie sets validated values and applies options and deletion', async () => {
  const started = Date.now();
  const { POST } = createCookieRoute({
    async get() {
      return { status: 200, body: {}, cookies: { legacy: { command: 'delete' } } };
    },
    async post() {
      return {
        status: 200,
        headers: { 'x-cookie-test': 'set' },
        cookies: {
          val: { command: 'set', value: '  hello world  ' },
          count: { command: 'set', value: 42 },
          enabled: { command: 'set', value: false },
          legacy: { command: 'delete' },
        },
      };
    },
  });
  const res = await POST(
    new Request('http://example.com/api/test-client/cookie', {
      method: 'POST',
      body: JSON.stringify({ val: 'input' }),
    }),
  );

  expect(res.status).toBe(200);
  expect(res.headers.get('x-cookie-test')).toBe('set');
  expect(res.headers.getSetCookie()).toHaveLength(4);
  expect(res.headers.getSetCookie()).toContain('val=hello%20world; Path=/');
  expect(res.headers.getSetCookie()).toContain('enabled=false; Path=/');
  expect(res.cookies.get('count')).toMatchObject({
    value: '42',
    path: '/api',
    domain: 'example.com',
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    partitioned: true,
    priority: 'high',
    maxAge: 3600,
  });
  const legacy = res.cookies.get('legacy');
  expect(legacy).toMatchObject({ value: '', path: '/api', domain: 'example.com', maxAge: 3600 });
  expect(legacy?.expires).toBeInstanceOf(Date);
  const expires = legacy?.expires as Date;
  expect(expires.getTime()).toBeGreaterThanOrEqual(started + 3600 * 1000);
  expect(expires.getTime()).toBeLessThanOrEqual(Date.now() + 3600 * 1000);
  expect(res.headers.getSetCookie()).toContain(
    `legacy=; Path=/api; Expires=${expires.toUTCString()}; Max-Age=3600; Domain=example.com`,
  );
  expect(await res.text()).toBe('');
});

test('response cookie skips optional values and supports explicit deletion and omission of non-required cookies', async () => {
  const url = 'http://example.com/api/test-client/cookie';
  const res = await cookieRoute.POST(
    new Request(url, {
      method: 'POST',
      body: JSON.stringify({ val: 'new' }),
    }),
  );
  expect(res.status).toBe(200);
  expect(res.cookies.get('val')?.value).toBe('new');
  expect(res.cookies.has('count')).toBe(false);
  expect(res.cookies.has('enabled')).toBe(false);

  const deleted = await cookieRoute.GET(new Request(url));
  expect(deleted.status).toBe(200);
  expect(deleted.headers.getSetCookie()).toEqual([
    'legacy=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ]);
  expect(deleted.cookies.get('legacy')?.maxAge).toBeUndefined();
  await expect(deleted.json()).resolves.toEqual({});
});

test('response cookie rejects invalid values before sending any Set-Cookie headers', async () => {
  for (const cookie of [
    undefined,
    {},
    { val: { command: 'set', value: 'valid' } },
    { val: { command: 'delete' }, legacy: { command: 'delete' } },
    { val: { command: 'set', value: 'valid' }, legacy: { command: 'set', value: 'wrong' } },
    { val: null, legacy: { command: 'delete' } },
    { val: { command: 'set', value: 'x' }, legacy: { command: 'delete' } },
    {
      val: { command: 'set', value: 'valid' },
      count: { command: 'set', value: '42' },
      legacy: { command: 'delete' },
    },
    {
      val: { command: 'set', value: 'valid' },
      enabled: { command: 'set', value: 'false' },
      legacy: { command: 'delete' },
    },
  ]) {
    const { POST } = createCookieRoute({
      async get() {
        return { status: 200, body: {}, cookies: { legacy: { command: 'delete' } } };
      },
      async post() {
        return { status: 200, headers: { 'x-cookie-test': 'set' }, cookies: cookie as never };
      },
    });
    const res = await POST(
      new Request('http://example.com/api/test-client/cookie', {
        method: 'POST',
        body: JSON.stringify({ val: 'input' }),
      }),
    );
    expect(res.status).toBe(500);
    expect(res.headers.getSetCookie()).toEqual([]);
    await expect(res.json()).resolves.toMatchObject({ error: 'Internal Server Error' });
  }
});

test('response cookie applies only to its declared response status', async () => {
  const { POST } = createCookieRoute({
    async get() {
      return { status: 200, body: {}, cookies: { legacy: { command: 'delete' } } };
    },
    async post() {
      return { status: 400 };
    },
  });
  const res = await POST(
    new Request('http://example.com/api/test-client/cookie', {
      method: 'POST',
      body: JSON.stringify({ val: 'input' }),
    }),
  );
  expect(res.status).toBe(400);
  expect(res.headers.getSetCookie()).toEqual([]);
});

test('base handler', async () => {
  const res1 = await baseRoute.GET(new Request('http://example.com/'));

  expect(res1.status).toBe(422);

  const val = 'foo';
  const res2 = await baseRoute.GET(new Request(`http://example.com/?aa=${val}`));

  await expect(res2.json()).resolves.toEqual({ bb: val });

  const res3 = await baseRoute.POST(new NextRequest('http://example.com/'));

  expect(res3.status).toBe(422);

  const body = { bb: 3 };
  const res4 = await baseRoute.POST(
    new Request('http://example.com/', { method: 'POST', body: JSON.stringify(body) }),
  );

  await expect(res4.json()).resolves.toEqual([body.bb]);

  expect(res4.headers.get('Set-Cookie')).toBe('aaa');
});

test('params handler', async () => {
  const res = await paramsRoute.POST(new NextRequest('http://example.com/aaa/bbb/ccc'), {
    params: Promise.resolve({ a: 111, b: 'bbb', c: ['ccc'] }),
  });

  await expect(res.json()).resolves.toEqual({ value: [111, 'bbb', 'ccc'] });
});

test('response string or number', async () => {
  const res1 = await stringRoute.GET(new Request('http://example.com/blog/hoge/aaa'), {
    params: Promise.resolve({ fuga: ['aaa'] }),
  });

  await expect(res1.text()).resolves.toEqual('aaa');

  const res2 = await numberRoute.GET(new Request('http://example.com/blog/123/456'), {
    params: Promise.resolve({ slug: [123, 456] }),
  });

  await expect(res2.json()).resolves.toEqual(123);
});

type Query = z.infer<typeof querySpec.get.query>;

test('query', async () => {
  await Promise.all(
    [
      {
        requiredNum: 1,
        requiredNumArr: [1, 2],
        id: '1',
        strArray: [],
        disable: 'false',
        bool: true,
        boolArray: [false, true],
        symbolIds: ['aaa' as SymbolId],
        optionalZodIds: [1 as ZodId],
        maybeIds: [0 as MaybeId],
      } satisfies Query,
      {
        requiredNum: 2,
        emptyNum: 0,
        requiredNumArr: [],
        id: '1',
        strArray: ['aa'],
        disable: 'false',
        bool: false,
        optionalBool: true,
        boolArray: [],
        optionalBoolArray: [true, false, false],
        symbolIds: [],
        maybeIds: [],
      } satisfies Query,
    ].map(async (val) => {
      const query = new URLSearchParams();

      Object.entries(val).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => query.append(key, String(item)));
        } else {
          query.set(key, String(value));
        }
      });

      const res = await queryRoute.GET(new NextRequest(`http://example.com/111?${query}`), {
        params: Promise.resolve({ pid: '111' }),
      });

      await expect(res.json()).resolves.toEqual({ pid: '111', query: val });
    }),
  );

  await Promise.all(
    [
      {
        requiredNum: 0,
        requiredNumArr: [],
        id: '1',
        disable: 'no boolean',
        bool: false,
        boolArray: [],
      },
      {
        requiredNum: 0,
        requiredNumArr: [],
        id: '2',
        disable: 'true',
        bool: false,
        boolArray: ['no boolean'],
      },
      {
        requiredNum: 0,
        requiredNumArr: ['no number'],
        id: '3',
        disable: 'true',
        bool: false,
        boolArray: [],
      },
      {
        requiredNum: 1,
        requiredNumArr: [1, 2],
        id: 'no number',
        disable: 'true',
        bool: false,
        boolArray: [],
      },
    ].map(async (val) => {
      const query = new URLSearchParams();

      Object.entries(val).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => query.append(key, String(item)));
        } else {
          query.set(key, String(value));
        }
      });

      const res = await queryRoute.GET(new Request(`http://example.com/111?${query}`), {
        params: Promise.resolve({ pid: '111' }),
      });

      expect(res.status).toBe(422);
    }),
  );
});

type FormBody = z.infer<typeof formSpec.post.body>;

test('formData request', async () => {
  await Promise.all(
    [
      {
        string: 'aaa',
        number: 11,
        boolean: false,
        optionalString: 'bbb',
        optionalNumber: 22,
        optionalBoolean: true,
        stringArr: ['cc', 'dd'],
        numberArr: [33, 44],
        booleanArr: [true, false],
        optionalStringArr: ['ee', 'ff'],
        optionalNumberArr: [55, 66],
        optionalBooleanArr: [false, true],
        file: new File(['test'], 'sample.txt'),
        optionalFile: new File(['foo'], 'baz.txt'),
        fileArr: [new File(['aaa'], 'aaa.txt'), new File(['bbb'], 'bbb.txt')],
        optionalFileArr: [new File(['ccc'], 'ccc.txt'), new File(['ddd'], 'ddd.txt')],
      } satisfies FormBody,
      {
        string: 'aaa',
        number: 11,
        boolean: false,
        stringArr: [],
        numberArr: [33, 44],
        booleanArr: [true, false],
        file: new File(['test'], 'sample.txt'),
        fileArr: [],
      } satisfies FormBody,
    ].map(async (val) => {
      const formData = new FormData();

      Object.entries(val).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) =>
            item instanceof File
              ? formData.append(key, item, item.name)
              : formData.append(key, String(item)),
          );
        } else if (value instanceof File) {
          formData.set(key, value, value.name);
        } else {
          formData.set(key, String(value));
        }
      });

      const res = await formReqRoute.POST(
        new Request('http://example.com/', { method: 'POST', body: formData }),
      );

      await expect(res.json()).resolves.toEqual({
        ...val,
        file: val.file.name,
        fileArr: val.fileArr.map((f) => f.name),
        optionalFile: val.optionalFile?.name,
        optionalFileArr: val.optionalFileArr?.map((f) => f.name),
      });
    }),
  );

  await Promise.all(
    [
      {
        string: 'aaa',
        number: 11,
        boolean: false,
        stringArr: [],
        numberArr: ['no number'],
        booleanArr: [true, false],
        file: new File(['test'], 'sample.txt'),
        fileArr: [new File(['aaa'], 'aaa.txt')],
      },
      {
        string: 'aaa',
        number: 11,
        boolean: false,
        stringArr: [],
        numberArr: [33, 44],
        booleanArr: [true, false],
        file: 123,
      },
      {
        string: 'aaa',
        number: 11,
        boolean: false,
        stringArr: [],
        numberArr: [33, 44],
        booleanArr: ['no boolean'],
        file: new File(['test'], 'sample.txt'),
        fileArr: [],
      },
      {
        string: 'aaa',
        number: 11,
        boolean: false,
        stringArr: [],
        numberArr: [33, 44],
        booleanArr: [true, false],
        file: new File(['test'], 'sample.txt'),
        fileArr: ['no file'],
      },
    ].map(async (val) => {
      const formData = new FormData();

      Object.entries(val).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) =>
            item instanceof File
              ? formData.append(key, item, item.name)
              : formData.append(key, String(item)),
          );
        } else if (value instanceof File) {
          formData.set(key, value, value.name);
        } else {
          formData.set(key, String(value));
        }
      });

      const res = await formReqRoute.POST(
        new Request('http://example.com/', { method: 'POST', body: formData }),
      );

      expect(res.status).toBe(422);
    }),
  );
});

type UrlencodedBody = z.infer<typeof formSpec.put.body>;

test('urlencoded request', async () => {
  await Promise.all(
    [
      {
        string: 'aaa',
        number: 11,
        boolean: false,
        optionalString: 'bbb',
        optionalNumber: 22,
        optionalBoolean: true,
        stringArr: ['cc', 'dd'],
        numberArr: [33, 44],
        booleanArr: [true, false],
        optionalStringArr: ['ee', 'ff'],
        optionalNumberArr: [55, 66],
        optionalBooleanArr: [false, true],
      } satisfies UrlencodedBody,
      {
        string: 'aaa',
        number: 11,
        boolean: false,
        stringArr: [],
        numberArr: [33, 44],
        booleanArr: [true, false],
      } satisfies UrlencodedBody,
    ].map(async (val) => {
      const searchParams = new URLSearchParams();

      Object.entries(val).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, String(item)));
        } else {
          searchParams.set(key, String(value));
        }
      });

      const res = await formReqRoute.PUT(
        new Request('http://example.com/', {
          method: 'PUT',
          body: searchParams.toString(),
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
        }),
      );

      await expect(res.json()).resolves.toEqual(val);
    }),
  );

  await Promise.all(
    [
      {
        string: 'aaa',
        number: 11,
        boolean: false,
        stringArr: [],
        numberArr: ['no number'],
        booleanArr: [true, false],
      },
      {
        string: 'aaa',
        number: 11,
        boolean: false,
        stringArr: [],
        numberArr: [33, 44],
        booleanArr: ['no boolean'],
      },
    ].map(async (val) => {
      const searchParams = new URLSearchParams();

      Object.entries(val).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, String(item)));
        } else {
          searchParams.set(key, String(value));
        }
      });

      const res = await formReqRoute.PUT(
        new Request('http://example.com/', {
          method: 'PUT',
          body: searchParams.toString(),
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
        }),
      );

      expect(res.status).toBe(422);
    }),
  );
});

test('response cookie handler options override defaults and optional deletion is explicit', async () => {
  const { POST } = createCookieRoute({
    async get() {
      return { status: 200, body: {}, cookies: { legacy: { command: 'delete' } } };
    },
    async post() {
      return {
        status: 200,
        headers: { 'x-cookie-test': 'set' },
        cookies: {
          val: { command: 'set', value: 'valid', options: { httpOnly: true } },
          count: {
            command: 'set',
            value: 10,
            options: { path: '/dynamic', maxAge: 120, secure: false },
          },
          enabled: { command: 'set', value: undefined },
          legacy: { command: 'delete', options: { path: '/dynamic', maxAge: 0 } },
          optionalLegacy: { command: 'delete', options: { path: '/dynamic' } },
        },
      };
    },
  });
  const request = new Request('http://localhost/', {
    method: 'POST',
    body: JSON.stringify({ val: 'input' }),
  });
  const response = await POST(request);
  expect(response.status).toBe(200);
  expect(response.cookies.get('val')).toMatchObject({ value: 'valid', httpOnly: true });
  expect(response.cookies.get('count')).toMatchObject({
    value: '10',
    path: '/dynamic',
    maxAge: 120,
    secure: false,
    httpOnly: true,
    domain: 'example.com',
  });
  expect(response.cookies.has('enabled')).toBe(false);
  expect(response.cookies.get('legacy')).toMatchObject({
    path: '/dynamic',
    maxAge: 0,
    domain: 'example.com',
    expires: new Date(0),
  });
  expect(response.cookies.get('optionalLegacy')).toMatchObject({
    path: '/dynamic',
    value: '',
    expires: new Date(0),
  });
  const optionalRoute = createCookieRoute({
    async get() {
      return { status: 200, body: {}, cookies: { legacy: { command: 'delete' } } };
    },
    async post() {
      return { status: 201 };
    },
  });
  const optional = await optionalRoute.POST(
    new Request('http://localhost/', { method: 'POST', body: JSON.stringify({ val: 'input' }) }),
  );
  expect(optional.status).toBe(201);
  expect(optional.headers.getSetCookie()).toEqual([]);
});
