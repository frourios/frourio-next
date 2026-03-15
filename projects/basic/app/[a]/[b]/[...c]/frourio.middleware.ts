import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { paramsSchema as ancestorParamsSchema } from '../../frourio.server';
import { middleware as ancestorMiddleware } from '../../route.middleware';
import { contextSchema as ancestorContextSchema, type ContextType as AncestorContextType } from '../../frourio.middleware';
import { frourioSpec } from './frourio';

export const paramsSchema = z.object({ 'c': z.tuple([z.string()]).rest(z.string()) }).and(ancestorParamsSchema).and(z.object({ 'b': z.string() }));

export type ParamsType = z.infer<typeof paramsSchema>;

export const contextSchema = frourioSpec.middleware.context.and(ancestorContextSchema);

export type ContextType = z.infer<typeof contextSchema>;

type MiddlewareFn = (
  args: {
    req: NextRequest,
    params: ParamsType,
    next: (ctx: z.infer<typeof frourioSpec.middleware.context>) => Promise<NextResponse>,
  },
  ctx: AncestorContextType,
) => Promise<NextResponse>;

export type NextParams<T extends Record<string, unknown>> = {
  [Key in keyof T]: (NonNullable<T[Key]> extends unknown[] ? string[] : string) | T[Key];
};

type MiddlewareHandler = (
  next: (args: { req: NextRequest, params: ParamsType }, ctx: ContextType) => Promise<NextResponse>,
) => (req: NextRequest | Request, option: { params: Promise<NextParams<ParamsType>> }) => Promise<NextResponse>;

export const createMiddleware = (middlewareFn: MiddlewareFn): MiddlewareHandler => {
  return (
    next: (args: { req: NextRequest, params: ParamsType }, ctx: ContextType) => Promise<NextResponse>,
  ) => async (originalReq: NextRequest | Request, option: { params: Promise<NextParams<ParamsType>> }) => {
    const req = originalReq instanceof NextRequest ? originalReq : new NextRequest(originalReq);
    const params = paramsSchema.safeParse(await option.params);

    if (params.error) return createReqErr(params.error);

    return ancestorMiddleware(async (_, ancestorContext) => {
      const ancestorCtx = ancestorContextSchema.safeParse(ancestorContext);

      if (ancestorCtx.error) return createReqErr(ancestorCtx.error);

    return await middlewareFn(
      {
        req,
        params: params.data,
        next: async ( context) => {
      const ctx = frourioSpec.middleware.context.safeParse(context);

      if (ctx.error) return createReqErr(ctx.error);

      return await next({ req, params: params.data }, { ...ancestorCtx.data,...ctx.data })
      },
      },
      ancestorCtx.data,
    )
    })(req, option)
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
