import type { FrourioSpec } from '@frourio/next';
import z from 'zod';

export const frourioSpec = {
  get: {
    query: z.object({ arrKey1: z.array(z.number()), arrKey2: z.array(z.string()) }),
    res: { 200: { body: z.object({ page: z.number() }) } },
  },
} satisfies FrourioSpec;
