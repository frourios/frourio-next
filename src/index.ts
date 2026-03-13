import type { z } from 'zod';

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type FrourioResponse = {
  [Status in `${2 | 4 | 5}${Digit}${Digit}`]?: {
    headers?: z.ZodTypeAny;
    body?: z.ZodTypeAny;
  };
};

export type FrourioSpec = {
  param?: z.ZodTypeAny;
  middleware?: true | { context: z.ZodTypeAny };
} & {
  [method in 'get' | 'head' | 'options']?: {
    headers?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    res?: FrourioResponse;
  };
} & {
  [method in 'post' | 'put' | 'patch' | 'delete']?: {
    headers?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    format?: 'formData' | 'urlencoded';
    body?: z.ZodTypeAny;
    res?: FrourioResponse;
  };
};

export type FrourioClientOption = {
  baseURL?: string;
  init?: RequestInit;
  fetch?: typeof fetch;
};
