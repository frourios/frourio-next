import { NextRequest, NextResponse } from 'next/server';
import type { z } from 'zod';
import { middleware } from './route.middleware';
import type { ContextType } from './frourio.middleware';
import { frourioSpec } from './frourio';

type SpecType = typeof frourioSpec;

type Controller = {
};

type MethodHandler = (req: NextRequest | Request) => Promise<NextResponse>;

type ResHandler = {
};

export const createRoute = (controller: Controller): ResHandler => {
  const runMiddleware = middleware;

  return {

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
