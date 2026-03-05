import assert from 'assert';
import { execSync } from 'child_process';
import fs, { existsSync } from 'fs';
import { unlink } from 'fs/promises';
import { NextRequest } from 'next/server';
import path from 'path';
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
import * as baseRoute from '../../projects/basic/app/route';
import type { frourioSpec as formSpec } from '../../projects/src-dir/src/app/api/frourio';
import * as formReqRoute from '../../projects/src-dir/src/app/api/route';
import { CLIENT_FILE, SERVER_FILE } from '../../src/constants';
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
    .map((d) => path.posix.resolve('./projects', d.name));

  await Promise.all(
    projectDirs.map(async (dir) => {
      const openapiConfig = await getOpenapiConfig({ output: undefined, root: undefined, dir });

      assert(openapiConfig.appDir);

      const frourioDirs = listFrourioDirs(openapiConfig.appDir);

      await Promise.all([
        ...frourioDirs.map((dir) => unlink(path.join(dir, SERVER_FILE))),
        ...frourioDirs.map(
          (dir) => existsSync(path.join(dir, CLIENT_FILE)) && unlink(path.join(dir, CLIENT_FILE)),
        ),
      ]);
      await generate(openapiConfig);
      await getMswConfig({ output: undefined, dir }).then(generateMsw);

      generateOpenapi(openapiConfig);
    }),
  );

  const out = execSync('git status projects', { encoding: 'utf8' });

  expect(out).toMatch('nothing to commit, working tree clean');
}, 35000);

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
