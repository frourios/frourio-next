import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { middleware as ancestorMiddleware } from '../../route';
import { frourioSpec } from './frourio';
import type { GET, middleware } from './route';

type RouteChecker = [typeof GET, typeof middleware];

export const paramsSchema = z.object({ 'y': z.string() });

type ParamsType = z.infer<typeof paramsSchema>;

type SpecType = typeof frourioSpec;

type Middleware = (
  args: {
    req: NextRequest,
    params: ParamsType,
    next: () => Promise<NextResponse>,
  },
) => Promise<NextResponse>;

type Controller = {
  middleware: Middleware;
  get: (
    req: {
      params: ParamsType;
      query: z.infer<SpecType['get']['query']>;
    },
  ) => Promise<NextResponse | Response>;
};

type NextParams<T extends Record<string, unknown>> = {
  [Key in keyof T]: (NonNullable<T[Key]> extends unknown[] ? string[] : string) | T[Key];
};

type MethodHandler = (req: NextRequest | Request, option: { params: Promise<NextParams<ParamsType>> }) => Promise<NextResponse>;

type ResHandler = {
  middleware: (
    next: (args: { req: NextRequest, params: ParamsType }) => Promise<NextResponse>,
  ) => (req: NextRequest, option: { params: Promise<NextParams<ParamsType>> }) => Promise<NextResponse>;
  GET: MethodHandler
};

export const createRoute = (controller: Controller): ResHandler => {
  const middleware = (next: (
    args: { req: NextRequest, params: ParamsType },
  ) => Promise<NextResponse>): MethodHandler => async (originalReq, option) => {
    const req = originalReq instanceof NextRequest ? originalReq : new NextRequest(originalReq);
    const params = paramsSchema.safeParse(await option.params);

    if (params.error) return createReqErr(params.error);

    return ancestorMiddleware(async () => {
    return await controller.middleware(
      {
        req,
        params: params.data,
        next: async () => {


      return await next({ req, params: params.data })
      },
      },
    )
    })(req)
  };

  return {
    middleware,
    GET: middleware(async ({ req, params }) => {
      const query = frourioSpec.get.query.safeParse({
        'message': req.nextUrl.searchParams.get('message') ?? undefined,
      });

      if (query.error) return createReqErr(query.error);

      const res = await controller.get({ query: query.data, params });

      return res instanceof NextResponse ? res : new NextResponse(res.body, res);
    }),
  };
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
