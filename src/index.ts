import type { NextResponse } from 'next/server.js';
import type { z } from 'zod';

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type CookieOptions<Command extends 'set' | 'delete'> = Omit<
  Extract<Parameters<NextResponse['cookies'][Command]>, [options: object]>[0],
  'name' | 'value'
>;

type RedirectStatus = 301 | 302 | 303 | 307 | 308;

type FrourioResponse = {
  [Status in `${2 | 3 | 4 | 5}${Digit}${Digit}`]?: {
    headers?: z.ZodType;
    body?: Status extends '304' ? never : z.ZodType;
    dest?: Status extends `${RedirectStatus}` ? FrourioDestination : never;
    cookies?: Record<
      string,
      | { command: 'set'; value: z.ZodType; options?: CookieOptions<'set'> }
      | { command: 'delete'; options?: CookieOptions<'delete'> }
    >;
  };
};

type FrourioDestination = {
  [Status in keyof FrourioResponse]?: Omit<NonNullable<FrourioResponse[Status]>, 'dest'>;
};

type MethodProps = {
  headers?: z.ZodType;
  cookies?: z.ZodType;
  query?: z.ZodType;
  res?: FrourioResponse;
};

export type FrourioSpec = {
  param?: z.ZodType;
  middleware?:
    | true
    | { context?: z.ZodType; cookies?: z.ZodType; headers?: z.ZodType; query?: z.ZodType };
} & {
  [method in 'get' | 'head']?: MethodProps;
} & {
  options?: Omit<MethodProps, 'res'> & { res?: Omit<FrourioResponse, '304'> };
} & {
  [method in 'post' | 'put' | 'patch' | 'delete']?: Omit<MethodProps, 'res'> & {
    res?: Omit<FrourioResponse, '304'>;
    format?: 'formData' | 'urlencoded';
    body?: z.ZodType;
  };
};

export type FrourioClientOption = {
  baseURL?: string;
  init?: RequestInit;
  fetch?: typeof fetch;
};
