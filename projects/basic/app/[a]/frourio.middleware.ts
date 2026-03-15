import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { frourioSpec } from './frourio';

const paramToNum = <T extends z.ZodTypeAny>(schema: T) => z.preprocess(Number, schema);

export const paramsSchema = z.object({ 'a': paramToNum(frourioSpec.param) });

export type ParamsType = z.infer<typeof paramsSchema>;

export const contextSchema = frourioSpec.middleware.context;

export type ContextType = z.infer<typeof contextSchema>;

type MiddlewareFn = (
  args: {
    req: NextRequest,
    params: ParamsType,
    next: (ctx: z.infer<typeof frourioSpec.middleware.context>) => Promise<NextResponse>,
  },
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

    return await middlewareFn(
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
