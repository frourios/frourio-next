import path from 'path';
import { MIDDLEWARE_FILE, MIDDLEWARE_SERVER_FILE, PARAMS_FILE, SERVER_FILE } from './constants';
import type { DirSpec, MethodInfo, MiddlewareDict } from './generate';
import type { ParamsInfo } from './paramsUtil';
import { paramsToText, pathToParams } from './paramsUtil';

export const generateServerTexts = (
  specs: DirSpec[],
  frourioDirs: string[],
  middlewareDict: MiddlewareDict,
): { filePath: string; text: string }[] => {
  return specs.flatMap(({ dirPath, spec }) => {
    const ancestorMiddleware = frourioDirs.findLast(
      (dir) => dir !== dirPath && dirPath.includes(dir) && middlewareDict[dir],
    );
    const ancestorMiddlewareCtx = frourioDirs.findLast(
      (dir) => dir !== dirPath && dirPath.includes(dir) && middlewareDict[dir]?.hasCtx,
    );
    const params = pathToParams(frourioDirs, dirPath, spec.param);
    const middleware = {
      ancestor: ancestorMiddleware ? path.posix.relative(dirPath, ancestorMiddleware) : undefined,
      ancestorCtx: ancestorMiddlewareCtx
        ? path.posix.relative(dirPath, ancestorMiddlewareCtx)
        : undefined,
      current: middlewareDict[dirPath],
    };

    const results: { filePath: string; text: string }[] = [];

    if (params?.current || (params && !params.current && params.middleNames.length > 0)) {
      results.push({
        filePath: path.posix.join(dirPath, PARAMS_FILE),
        text: generateParamsFile(params),
      });
    }

    if (spec.methods.length > 0) {
      results.push({
        filePath: path.posix.join(dirPath, SERVER_FILE),
        text: generateServer(params, middleware, spec.methods),
      });
    }

    if (middleware.current) {
      results.push({
        filePath: path.posix.join(dirPath, MIDDLEWARE_SERVER_FILE),
        text: generateMiddlewareServer(params, middleware),
      });
    }

    return results;
  });
};

const ancestorImportPath = (ancestor: string, ancestorHasMiddleware: boolean): string => {
  const serverImportPath = SERVER_FILE.replace('.ts', '');
  const middlewareServerImportPath = MIDDLEWARE_SERVER_FILE.replace('.ts', '');
  return `${ancestor}/${ancestorHasMiddleware ? middlewareServerImportPath : serverImportPath}`;
};

const generateParamsFile = (params: ParamsInfo): string => {
  const imports: string[] = [
    "import { z } from 'zod'",
    params.ancestorFrourio
      ? `import { paramsSchema as ancestorParamsSchema } from '${params.ancestorFrourio}'`
      : undefined,
    params.current?.param ? "import { frourioSpec } from './frourio'" : undefined,
  ].filter((txt): txt is string => txt !== undefined);

  const chunks: string[] = [
    params.current
      ? `${
          params.current.param?.typeName !== 'number'
            ? ''
            : params.current.param.isArray
              ? paramToNumArrText
              : paramToNumText
        }export const paramsSchema = ${paramsToText(params)}`
      : `export const paramsSchema = ${paramsToText(params)}`,
    `export type ParamsType = z.infer<typeof paramsSchema>`,
    `export type NextParams<T extends Record<string, unknown>> = {
  [Key in keyof T]: (NonNullable<T[Key]> extends unknown[] ? string[] : string) | T[Key];
}`,
  ];

  return `${imports.join(';\n')};\n\n${chunks.join(';\n\n')};\n`;
};

const originalReqChunk =
  "const req = 'nextUrl' in originalReq ? originalReq : new NextRequest(originalReq);";

const generateMiddlewareServer = (
  params: ParamsInfo | undefined,
  middleware: {
    ancestor: string | undefined;
    ancestorCtx: string | undefined;
    current: { hasCtx: boolean } | undefined;
  },
): string => {
  const middlewareImportPath = MIDDLEWARE_FILE.replace('.ts', '');
  const paramsImportPath = PARAMS_FILE.replace('.ts', '');
  const ancestorHasMiddleware = middleware.ancestor !== undefined;
  const paramsFromLocal = params?.current;
  const paramsFromAncestor = params && !params.current;
  const hasLocalParamsFile = !!(
    paramsFromLocal ||
    (paramsFromAncestor && params.middleNames.length > 0)
  );
  const imports: string[] = [
    "import { NextRequest, NextResponse } from 'next/server'",
    (params || middleware.current?.hasCtx || middleware.ancestorCtx) &&
      "import type { z } from 'zod'",
    hasLocalParamsFile &&
      `import { paramsSchema, type ParamsType, type NextParams } from './${paramsImportPath}'`,
    paramsFromAncestor &&
      params.middleNames.length === 0 &&
      params.ancestorFrourio &&
      `import { paramsSchema } from '${params.ancestorFrourio}'`,
    paramsFromAncestor &&
      params.middleNames.length === 0 &&
      params.ancestorFrourio &&
      `import type { ParamsType, NextParams } from '${params.ancestorFrourio}'`,
    middleware.ancestor &&
      `import { middleware as ancestorMiddleware } from '${middleware.ancestor}/${middlewareImportPath}'`,
    middleware.ancestorCtx &&
      `import { contextSchema as ancestorContextSchema${middleware.current ? ', type ContextType as AncestorContextType' : ''} } from '${ancestorImportPath(middleware.ancestorCtx, ancestorHasMiddleware)}'`,
    middleware.current?.hasCtx && "import { frourioSpec } from './frourio'",
  ].filter((txt) => txt !== undefined && txt !== false);

  const needsReqErr = !!params || !!middleware.ancestorCtx || !!middleware.current?.hasCtx;
  const chunks: (string | undefined)[] = [
    middleware.current?.hasCtx
      ? `export const contextSchema = frourioSpec.middleware.context${middleware.ancestorCtx ? '.and(ancestorContextSchema)' : ''};\n\nexport type ContextType = z.infer<typeof contextSchema>`
      : middleware.ancestorCtx
        ? 'export const contextSchema = ancestorContextSchema;\n\nexport type ContextType = z.infer<typeof contextSchema>'
        : undefined,
    `type MiddlewareFn = (
  args: {
    req: NextRequest,${params ? '\n    params: ParamsType,' : ''}
    next: (${middleware.current?.hasCtx ? 'ctx: z.infer<typeof frourioSpec.middleware.context>' : ''}) => Promise<NextResponse>,
  },${middleware.ancestorCtx ? '\n  ctx: AncestorContextType,' : ''}
) => Promise<NextResponse>`,
    `type MiddlewareHandler = (
  next: (args: { req: NextRequest${params ? ', params: ParamsType' : ''} }${middleware.ancestorCtx || middleware.current?.hasCtx ? ', ctx: ContextType' : ''}) => Promise<NextResponse>,
) => (req: NextRequest | Request, option${params ? ': { params: Promise<NextParams<ParamsType>> }' : '?: Record<string, unknown>'}) => Promise<NextResponse>`,
    `export const createMiddleware = (middlewareFn: MiddlewareFn): MiddlewareHandler => {
  return (
    next: (args: { req: NextRequest${params ? ', params: ParamsType' : ''} }${middleware.ancestorCtx || middleware.current?.hasCtx ? ', ctx: ContextType' : ''}) => Promise<NextResponse>,
  ) => async (originalReq: NextRequest | Request${params ? ', option: { params: Promise<NextParams<ParamsType>> }' : ', _option?: Record<string, unknown>'}) => {
    ${originalReqChunk}${
      params
        ? `\n    const params = paramsSchema.safeParse(await option.params);

    if (params.error) return createReqErr(params.error);\n`
        : ''
    }${
      middleware.ancestor
        ? `\n    return ancestorMiddleware(async (${middleware.ancestorCtx ? '_, ancestorContext' : ''}) => {${
            middleware.ancestorCtx
              ? `\n      const ancestorCtx = ancestorContextSchema.safeParse(ancestorContext);

      if (ancestorCtx.error) return createReqErr(ancestorCtx.error);\n`
              : ''
          }`
        : ''
    }
    return await middlewareFn(
      {
        req,${params ? '\n        params: params.data,' : ''}
        next: async (${middleware.current?.hasCtx ? ' context' : ''}) => {
${
  middleware.current?.hasCtx
    ? `      const ctx = frourioSpec.middleware.context.safeParse(context);

      if (ctx.error) return createReqErr(ctx.error);`
    : ''
}

      return await next({ req${params ? ', params: params.data' : ''} }${
        middleware.ancestorCtx || middleware.current?.hasCtx
          ? `, { ${middleware.ancestorCtx ? '...ancestorCtx.data,' : ''}${
              middleware.current?.hasCtx ? '...ctx.data' : ''
            } }`
          : ''
      })
      },
      },${middleware.ancestorCtx ? '\n      ancestorCtx.data,' : ''}
    )
    ${middleware.ancestor ? `})(req${params?.ancestorFrourio ? ', option' : ''})` : ''}
  };
}`,
  ].filter((txt) => txt !== undefined);

  return `${imports.join(';\n')};

${chunks.join(';\n\n')};
${
  needsReqErr
    ? `
type FrourioError =
  | { status: 422; error: string; issues: { path: (string | number)[]; message: string }[] }
  | { status: 500; error: string; issues?: undefined };

const createReqErr = (err: z.ZodError) =>
  NextResponse.json<FrourioError>(
    {
      status: 422,
      error: 'Unprocessable Entity',
      issues: err.issues.map((issue) => ({ path: issue.path.filter(p => typeof p !== 'symbol'), message: issue.message })),
    },
    { status: 422 },
  );
`
    : ''
}`;
};

const generateServer = (
  params: ParamsInfo | undefined,
  middleware: {
    ancestor: string | undefined;
    ancestorCtx: string | undefined;
    current: { hasCtx: boolean } | undefined;
  },
  methods: MethodInfo[],
): string => {
  const middlewareImportPath = MIDDLEWARE_FILE.replace('.ts', '');
  const middlewareServerImportPath = MIDDLEWARE_SERVER_FILE.replace('.ts', '');
  const paramsImportPath = PARAMS_FILE.replace('.ts', '');
  const ancestorHasMiddleware = middleware.ancestor !== undefined;
  const paramsFromLocal = params?.current;
  const paramsFromAncestor = params && !params.current;
  const hasLocalParamsFile = !!(
    paramsFromLocal ||
    (paramsFromAncestor && params.middleNames.length > 0)
  );
  const imports: string[] = [
    "import { NextRequest, NextResponse } from 'next/server'",
    "import type { z } from 'zod'",
    hasLocalParamsFile &&
      !middleware.current &&
      `import { paramsSchema } from './${paramsImportPath}'`,
    hasLocalParamsFile && `import type { ParamsType, NextParams } from './${paramsImportPath}'`,
    paramsFromAncestor &&
      params.middleNames.length === 0 &&
      !middleware.current &&
      params.ancestorFrourio &&
      `import { paramsSchema } from '${params.ancestorFrourio}'`,
    paramsFromAncestor &&
      params.middleNames.length === 0 &&
      params.ancestorFrourio &&
      `import type { ParamsType, NextParams } from '${params.ancestorFrourio}'`,
    !middleware.current &&
      middleware.ancestor &&
      `import { middleware as ancestorMiddleware } from '${middleware.ancestor}/${middlewareImportPath}'`,
    !middleware.current &&
      middleware.ancestorCtx &&
      `import { contextSchema as ancestorContextSchema } from '${ancestorImportPath(middleware.ancestorCtx, ancestorHasMiddleware)}'`,
    !middleware.current &&
      middleware.ancestorCtx &&
      `import type { ContextType } from '${ancestorImportPath(middleware.ancestorCtx, ancestorHasMiddleware)}'`,
    middleware.current && `import { middleware } from './${middlewareImportPath}'`,
    middleware.current &&
      (middleware.current.hasCtx || middleware.ancestorCtx
        ? `import type { ContextType } from './${middlewareServerImportPath}'`
        : undefined),
    "import { frourioSpec } from './frourio'",
    methods.length > 0 &&
      `import type { ${methods.map((m) => m.name.toUpperCase()).join(', ')} } from './route'`,
  ].filter((txt) => txt !== undefined && txt !== false);

  const chunks: string[] = [
    methods.length > 0 &&
      `type RouteChecker = [${methods.map((m) => `typeof ${m.name.toUpperCase()}`).join(', ')}]`,
    'type SpecType = typeof frourioSpec',
    `type Controller = {${methods
      .map(
        (m) =>
          `\n  ${m.name}: (
    req: {${params ? '\n      params: ParamsType;' : ''}${
      m.hasHeaders ? `\n      headers: z.infer<SpecType['${m.name}']['headers']>;` : ''
    }${m.query ? `\n      query: z.infer<SpecType['${m.name}']['query']>;` : ''}${
      m.body ? `\n      body: z.infer<SpecType['${m.name}']['body']>;` : ''
    }
    },${middleware.ancestorCtx || middleware.current?.hasCtx ? '\n    ctx: ContextType,' : ''}
  ) => Promise<${
    m.res
      ? `\n${m.res
          .map(
            (r) =>
              `    | {
        status: ${r.status};${
          r.hasHeaders
            ? `\n        headers: z.infer<SpecType['${m.name}']['res'][${r.status}]['headers']>;`
            : ''
        }${r.body ? `\n        body: z.infer<SpecType['${m.name}']['res'][${r.status}]['body']>;` : ''}
      }`,
          )
          .join('\n')}\n  `
      : 'NextResponse | Response'
  }>;`,
      )
      .join('')}
}`,
    `type MethodHandler = (req: NextRequest | Request${params ? ', option: { params: Promise<NextParams<ParamsType>> }' : ''}) => Promise<NextResponse>`,
    `type ResHandler = {${methods.map((m) => `\n  ${m.name.toUpperCase()}: MethodHandler`).join('')}
}`,
    `export const createRoute = (controller: Controller): ResHandler => {
${
  middleware.ancestor || middleware.current || params
    ? `  const runMiddleware = ${
        middleware.current
          ? 'middleware'
          : `(next: (
    args: { req: NextRequest${params ? ', params: ParamsType' : ''} },${middleware.ancestorCtx ? '\n    ctx: ContextType,' : ''}
  ) => Promise<NextResponse>): MethodHandler => async (originalReq${params ? ', option' : ''}) => {
    ${originalReqChunk}${
      params
        ? `\n    const params = paramsSchema.safeParse(await option.params);

    if (params.error) return createReqErr(params.error);\n`
        : ''
    }${
      middleware.ancestor
        ? `\n    return ancestorMiddleware(async (${middleware.ancestorCtx ? '_, ancestorContext' : ''}) => {${
            middleware.ancestorCtx
              ? `\n      const ancestorCtx = ancestorContextSchema.safeParse(ancestorContext);

      if (ancestorCtx.error) return createReqErr(ancestorCtx.error);\n`
              : ''
          }

      return await next({ req${params ? ', params: params.data' : ''} }${
        middleware.ancestorCtx ? `, { ...ancestorCtx.data, }` : ''
      })

    })(req${params?.ancestorFrourio ? ', option' : ''})`
        : `\n    return await next({ req${params ? ', params: params.data' : ''} })`
    }
  }`
      };

`
    : ''
}  return {
${methods
  .map((m) => {
    const requests = [
      m.hasHeaders && [
        'headers',
        `frourioSpec.${m.name}.headers.safeParse(Object.fromEntries(req.headers))`,
      ],
      m.query && [
        'query',
        `frourioSpec.${m.name}.query.safeParse({
${m.query.props
  .map((p) => {
    const fn = `req.nextUrl.searchParams.get${p.isArray ? 'All' : ''}('${p.name}')${p.isArray ? '' : ' ?? undefined'}`;
    const wrapped = `${p.typeName === 'string' ? '' : `queryTo${p.typeName === 'number' ? 'Num' : 'Bool'}${p.isArray ? 'Arr' : ''}(`}${fn}${p.typeName === 'string' ? '' : ')'}`;

    return `        '${p.name}': ${p.isArray && p.isOptional ? `${fn}.length > 0 ? ${wrapped} : undefined` : wrapped},`;
  })
  .join('\n')}
      })`,
      ],
      m.body && [
        'body',
        `frourioSpec.${m.name}.body.safeParse(${
          m.body.isFormData
            ? `
        Object.fromEntries(
          [
${m.body.data
  .map((d) => {
    const fn = `formData.get${d.isArray ? 'All' : ''}('${d.name}')${d.isArray ? '' : ' ?? undefined'}`;
    const wrapped = `${
      d.typeName === 'string'
        ? ''
        : `${d.typeName === 'File' ? 'await ' : ''}formDataTo${d.typeName === 'File' ? 'File' : d.typeName === 'number' ? 'Num' : 'Bool'}${d.isArray ? 'Arr' : ''}(`
    }${fn}${d.typeName === 'string' ? '' : ')'}`;

    return `            ['${d.name}', ${d.isArray && d.isOptional ? `${fn}.length > 0 ? ${wrapped} : undefined` : wrapped}],`;
  })
  .join('\n')}
          ].filter(entry => entry[1] !== undefined),
        ),\n      `
            : m.body.isUrlEncoded
              ? `
        Object.fromEntries(
          [
${m.body.data
  .map((d) => {
    const fn = `urlSearchParams.get${d.isArray ? 'All' : ''}('${d.name}')${d.isArray ? '' : ' ?? undefined'}`;
    const wrapped = `${
      d.typeName === 'string'
        ? ''
        : `urlencodedTo${d.typeName === 'number' ? 'Num' : 'Bool'}${d.isArray ? 'Arr' : ''}(`
    }${fn}${d.typeName === 'string' ? '' : ')'}`;

    return `            ['${d.name}', ${d.isArray && d.isOptional ? `${fn}.length > 0 ? ${wrapped} : undefined` : wrapped}],`;
  })
  .join('\n')}
          ].filter(entry => entry[1] !== undefined),
        ),\n      `
              : `await req.${m.body.type}().catch(() => undefined)`
        })`,
      ],
    ].filter((r) => !!r);

    return `    ${m.name.toUpperCase()}: ${
      params || middleware.ancestor || middleware.current
        ? `runMiddleware(async ({ req${params ? ', params' : ''} }${middleware.ancestorCtx || middleware.current?.hasCtx ? ', ctx' : ''}) => {`
        : m.query
          ? `async (originalReq) => {\n      ${originalReqChunk}`
          : 'async (req) => {'
    }${m.body?.isFormData ? '\n      const formData = await req.formData();' : m.body?.isUrlEncoded ? '\n      const urlSearchParams = new URLSearchParams(await req.text());' : ''}${requests
      .map(
        (r) =>
          `\n      const ${r[0]} = ${r[1]};\n\n      if (${r[0]}.error) return createReqErr(${r[0]}.error);\n`,
      )
      .join('')}
      const res = await controller.${m.name}({ ${[
        ...requests.map((r) => `${r[0]}: ${r[0]}.data`),
        ...(params ? ['params'] : []),
      ].join(', ')} }${middleware.ancestorCtx || middleware.current?.hasCtx ? ', ctx' : ''});

      ${
        m.res
          ? `switch (res.status) {
${m.res
  .map((r) => {
    const resTypes = [r.hasHeaders && 'headers', r.body && 'body'].filter((r) => !!r);

    return `        case ${r.status}: {${resTypes
      .map(
        (t) =>
          `\n          const ${t} = frourioSpec.${m.name}.res[${r.status}].${t}.safeParse(res.${t});\n\n          if (${t}.error) return createResErr();\n`,
      )
      .join('')}
          return ${
            r.body ? 'createResponse(body.data' : `new NextResponse(null`
          }, { status: ${r.status}${r.hasHeaders ? ', headers: headers.data' : ''} });
        }`;
  })
  .join('\n')}
        default:
          throw new Error(res${m.res.length <= 1 ? '.status' : ''} satisfies never);
      }`
          : 'return res instanceof NextResponse ? res : new NextResponse(res.body, res);'
      }
    }${params || middleware.ancestor || middleware.current ? ')' : ''},`;
  })
  .join('\n')}
  };
}`,
    methods.some((m) => m.res?.some((r) => r.body)) &&
      `const createResponse = (body: unknown, init: ResponseInit): NextResponse => {
  if (
    ArrayBuffer.isView(body) ||
    body === undefined ||
    body === null ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    body instanceof FormData ||
    body instanceof ReadableStream ||
    body instanceof URLSearchParams ||
    typeof body === 'string'
  ) {
    return new NextResponse(body as string, init);
  }

  return NextResponse.json(body, init);
}`,
  ].filter((txt) => txt !== undefined && txt !== false);

  const suffixes: string[] = [
    methods.some((m) => m.query?.props.some((q) => q.typeName === 'number')) && queryToNumText,
    methods.some((m) => m.query?.props.some((q) => q.typeName === 'number' && q.isArray)) &&
      queryToNumArrText,
    methods.some((m) => m.query?.props.some((q) => q.typeName === 'boolean')) && queryToBoolText,
    methods.some((m) => m.query?.props.some((q) => q.typeName === 'boolean' && q.isArray)) &&
      queryToBoolArrText,
    methods.some((m) => m.body?.isFormData && m.body.data?.some((b) => b.typeName === 'number')) &&
      formDataToNumText,
    methods.some(
      (m) => m.body?.isFormData && m.body.data?.some((b) => b.typeName === 'number' && b.isArray),
    ) && formDataToNumArrText,
    methods.some((m) => m.body?.isFormData && m.body.data?.some((b) => b.typeName === 'boolean')) &&
      formDataToBoolText,
    methods.some(
      (m) => m.body?.isFormData && m.body.data?.some((b) => b.typeName === 'boolean' && b.isArray),
    ) && formDataToBoolArrText,
    methods.some((m) => m.body?.isFormData && m.body.data?.some((b) => b.typeName === 'File')) &&
      formDataToFileText,
    methods.some(
      (m) => m.body?.isFormData && m.body.data?.some((b) => b.typeName === 'File' && b.isArray),
    ) && formDataToFileArrText,
    methods.some(
      (m) => m.body?.isUrlEncoded && m.body.data?.some((b) => b.typeName === 'number'),
    ) && urlencodedToNumText,
    methods.some(
      (m) => m.body?.isUrlEncoded && m.body.data?.some((b) => b.typeName === 'number' && b.isArray),
    ) && urlencodedToNumArrText,
    methods.some(
      (m) => m.body?.isUrlEncoded && m.body.data?.some((b) => b.typeName === 'boolean'),
    ) && urlencodedToBoolText,
    methods.some(
      (m) =>
        m.body?.isUrlEncoded && m.body.data?.some((b) => b.typeName === 'boolean' && b.isArray),
    ) && urlencodedToBoolArrText,
  ].filter((txt) => txt !== undefined && txt !== false);

  return `${imports.join(';\n')};

${chunks.join(';\n\n')};

type FrourioError =
  | { status: 422; error: string; issues: { path: (string | number)[]; message: string }[] }
  | { status: 500; error: string; issues?: undefined };

const createReqErr = (err: z.ZodError) =>
  NextResponse.json<FrourioError>(
    {
      status: 422,
      error: 'Unprocessable Entity',
      issues: err.issues.map((issue) => ({ path: issue.path.filter(p => typeof p !== 'symbol'), message: issue.message })),
    },
    { status: 422 },
  );

const createResErr = () =>
  NextResponse.json<FrourioError>(
    { status: 500, error: 'Internal Server Error' },
    { status: 500 },
  );
${suffixes.length > 0 ? `\n${suffixes.join(';\n\n')};\n` : ''}`;
};

const paramToNumText = `const paramToNum = <T extends z.ZodTypeAny>(schema: T) => z.preprocess(Number, schema);

`;

const paramToNumArrText = `const paramToNumArr = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => Array.isArray(val) ? val.map(Number) : val, schema);

`;

const queryToNumText = `const queryToNum = (val: string | undefined) => {
  const num = Number(val);

  return isNaN(num) ? val : num;
}`;

const queryToNumArrText = 'const queryToNumArr = (val: string[]) => val.map(queryToNum)';

const queryToBoolText = `const queryToBool = (val: string | undefined) =>
  val === 'true' ? true : val === 'false' ? false : val`;

const queryToBoolArrText = 'const queryToBoolArr = (val: string[]) => val.map(queryToBool)';

const formDataToNumText = `const formDataToNum = (val: FormDataEntryValue | undefined) => {
  const num = Number(val);

  return isNaN(num) ? val : num;
}`;

const formDataToNumArrText =
  'const formDataToNumArr = (val: FormDataEntryValue[]) => val.map(formDataToNum)';

const formDataToBoolText = `const formDataToBool = (val: FormDataEntryValue | undefined) =>
  val === 'true' ? true : val === 'false' ? false : val`;

const formDataToBoolArrText =
  'const formDataToBoolArr = (val: FormDataEntryValue[]) => val.map(formDataToBool)';

const formDataToFileText = `const formDataToFile = async (val: FormDataEntryValue | undefined) => {
  if (val instanceof File || typeof val === 'string' || val === undefined) return val;

  const buffer = await (val as File).arrayBuffer();

  return new File([buffer], (val as File).name, val); // for jsdom
}`;

const formDataToFileArrText =
  'const formDataToFileArr = (vals: FormDataEntryValue[]) => Promise.all(vals.map(formDataToFile))';

const urlencodedToNumText = `const urlencodedToNum = (val: string | undefined) => {
  const num = Number(val);

  return isNaN(num) ? val : num;
}`;

const urlencodedToNumArrText =
  'const urlencodedToNumArr = (val: string[]) => val.map(urlencodedToNum)';

const urlencodedToBoolText = `const urlencodedToBool = (val: string | undefined) =>
  val === 'true' ? true : val === 'false' ? false : val`;

const urlencodedToBoolArrText =
  'const urlencodedToBoolArr = (val: string[]) => val.map(urlencodedToBool)';
