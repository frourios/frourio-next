import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';

export const frourioSpec = {
  middleware: {
    context: z.object({ val: z.string().optional() }),
  },
  get: {
    res: {
      200: { body: z.object({ val: z.string().optional() }) },
    },
  },
  post: {
    body: z.object({ val: z.string() }),
    res: { 200: {} },
  },
} satisfies FrourioSpec;
