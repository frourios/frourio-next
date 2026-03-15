import { NextRequest, NextResponse } from 'next/server';
import type { z } from 'zod';
import { middleware as ancestorMiddleware } from '../route.middleware';
import { contextSchema as ancestorContextSchema, type ContextType as AncestorContextType } from '../frourio.middleware';

export const contextSchema = ancestorContextSchema;

export type ContextType = z.infer<typeof contextSchema>;

type MiddlewareFn = (
  args: {
    req: NextRequest,
    next: () => Promise<NextResponse>,
  },
  ctx: AncestorContextType,
) => Promise<NextResponse>;

type MiddlewareHandler = (
  next: (args: { req: NextRequest }, ctx: ContextType) => Promise<NextResponse>,
) => (req: NextRequest | Request, option?: Record<string, unknown>) => Promise<NextResponse>;

export const createMiddleware = (middlewareFn: MiddlewareFn): MiddlewareHandler => {
  return (
    next: (args: { req: NextRequest }, ctx: ContextType) => Promise<NextResponse>,
  ) => async (originalReq: NextRequest | Request, _option?: Record<string, unknown>) => {
    const req = originalReq instanceof NextRequest ? originalReq : new NextRequest(originalReq);
    return ancestorMiddleware(async (_, ancestorContext) => {
      const ancestorCtx = ancestorContextSchema.safeParse(ancestorContext);

      if (ancestorCtx.error) return createReqErr(ancestorCtx.error);

    return await middlewareFn(
      {
        req,
        next: async () => {


      return await next({ req }, { ...ancestorCtx.data, })
      },
      },
      ancestorCtx.data,
    )
    })(req)
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
