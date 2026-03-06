import { NextRequest, NextResponse } from 'next/server';
import type { z } from 'zod';
import { frourioSpec } from './frourio';
import type { middleware } from './route';

type RouteChecker = [typeof middleware];

type SpecType = typeof frourioSpec;

export const contextSchema = frourioSpec.middleware.context;

export type ContextType = z.infer<typeof contextSchema>;

type Middleware = (
  args: {
    req: NextRequest,
    next: (ctx: z.infer<typeof frourioSpec.middleware.context>) => Promise<NextResponse>,
  },
) => Promise<NextResponse>;

type Controller = {
  middleware: Middleware;
};

type MethodHandler = (req: NextRequest | Request) => Promise<NextResponse>;

type ResHandler = {
  middleware: (
    next: (args: { req: NextRequest }, ctx: ContextType) => Promise<NextResponse>,
  ) => (req: NextRequest, option?: {}) => Promise<NextResponse>;
};

export const createRoute = (controller: Controller): ResHandler => {
  const middleware = (next: (
    args: { req: NextRequest },
    ctx: ContextType,
  ) => Promise<NextResponse>): MethodHandler => async (originalReq) => {
    const req = originalReq instanceof NextRequest ? originalReq : new NextRequest(originalReq);
    return await controller.middleware(
      {
        req,
        next: async ( context) => {
      const ctx = frourioSpec.middleware.context.safeParse(context);

      if (ctx.error) return createReqErr(ctx.error);

      return await next({ req }, { ...ctx.data })
      },
      },
    )
    
  };

  return {
    middleware,

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
