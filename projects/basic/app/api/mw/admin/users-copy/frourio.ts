import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';

export const frourioSpec = {
  middleware: true,
  get: {
    query: z.object({ role: z.string().optional() }).optional(),
    res: {
      200: { body: z.object({ context: z.any(), users: z.array(z.string()) }) },
      403: { body: z.object({ message: z.string() }) },
    },
  },
} satisfies FrourioSpec;
