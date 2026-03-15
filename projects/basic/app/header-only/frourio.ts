import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';

export const frourioSpec = {
  get: {
    headers: z.object({ 'Content-Type': z.string() }),
  },
  post: {
    headers: z.object({ 'Content-Type': z.string() }),
  },
  delete: {
    res: {
      400: {
        headers: z.object({ 'X-Error-Code': z.string() }),
        body: z.object({ error: z.string() }),
      },
    },
  },
} satisfies FrourioSpec;
