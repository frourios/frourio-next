import type { z } from 'zod';

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type FrourioResponse = {
  [Status in `${2 | 4 | 5}${Digit}${Digit}`]?: {
    headers?: z.ZodType;
    body?: z.ZodType;
  };
};

export type FrourioSpec = {
  param?: z.ZodType;
  middleware?: true | { context: z.ZodType };
} & {
  [method in 'get' | 'head' | 'options']?: {
    headers?: z.ZodType;
    query?: z.ZodType;
    res?: FrourioResponse;
  };
} & {
  [method in 'post' | 'put' | 'patch' | 'delete']?: {
    headers?: z.ZodType;
    query?: z.ZodType;
    format?: 'formData' | 'urlencoded';
    body?: z.ZodType;
    res?: FrourioResponse;
  };
};

export type FrourioClientOption = {
  baseURL?: string;
  init?: RequestInit;
  fetch?: typeof fetch;
};
