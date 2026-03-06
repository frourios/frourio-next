import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { frourioSpec } from './frourio';
import type { GET, middleware } from './route';

type RouteChecker = [typeof GET, typeof middleware];

const paramToNum = <T extends z.ZodTypeAny>(schema: T) => z.preprocess(Number, schema);

export const paramsSchema = z.object({ 'a': paramToNum(frourioSpec.param) });

type ParamsType = z.infer<typeof paramsSchema>;

type SpecType = typeof frourioSpec;

export const contextSchema = frourioSpec.middleware.context;

export type ContextType = z.infer<typeof contextSchema>;

type Middleware = (
  args: {
    req: NextRequest,
    params: ParamsType,
    next: (ctx: z.infer<typeof frourioSpec.middleware.context>) => Promise<NextResponse>,
  },
) => Promise<NextResponse>;

type Controller = {
  middleware: Middleware;
  get: (
    req: {
      params: ParamsType;
    },
    ctx: ContextType,
  ) => Promise<
    | {
        status: 200;
        body: z.infer<SpecType['get']['res'][200]['body']>;
      }
  >;
};

type NextParams<T extends Record<string, unknown>> = {
  [Key in keyof T]: (NonNullable<T[Key]> extends unknown[] ? string[] : string) | T[Key];
};

type MethodHandler = (req: NextRequest | Request, option: { params: Promise<NextParams<ParamsType>> }) => Promise<NextResponse>;

type ResHandler = {
  middleware: (
    next: (args: { req: NextRequest, params: ParamsType }, ctx: ContextType) => Promise<NextResponse>,
  ) => (req: NextRequest, option: { params: Promise<NextParams<ParamsType>> }) => Promise<NextResponse>;
  GET: MethodHandler
};

export const createRoute = (controller: Controller): ResHandler => {
  const middleware = (next: (
    args: { req: NextRequest, params: ParamsType },
    ctx: ContextType,
  ) => Promise<NextResponse>): MethodHandler => async (originalReq, option) => {
    const req = originalReq instanceof NextRequest ? originalReq : new NextRequest(originalReq);
    const params = paramsSchema.safeParse(await option.params);

    if (params.error) return createReqErr(params.error);

    return await controller.middleware(
      {
        req,
        params: params.data,
        next: async ( context) => {
      const ctx = frourioSpec.middleware.context.safeParse(context);

      if (ctx.error) return createReqErr(ctx.error);

      return await next({ req, params: params.data }, { ...ctx.data })
      },
      },
    )
    
  };

  return {
    middleware,
    GET: middleware(async ({ req, params }, ctx) => {
      const res = await controller.get({ params }, ctx);

      switch (res.status) {
        case 200: {
          const body = frourioSpec.get.res[200].body.safeParse(res.body);

          if (body.error) return createResErr();

          return createResponse(body.data, { status: 200 });
        }
        default:
          throw new Error(res.status satisfies never);
      }
    }),
  };
};

const createResponse = (body: unknown, init: ResponseInit): NextResponse => {
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
};

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
