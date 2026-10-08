import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';
export const frourioSpec = {
  middleware: {
    headers: z.object({ 'x-token': z.string().min(1) }),
    cookies: z.object({ session: z.string() }),
    query: z.object({
      count: z.number(),
      active: z.boolean(),
      ids: z.array(z.number()),
      flags: z.array(z.boolean()).optional(),
      label: z.string().optional(),
    }),
  },
} satisfies FrourioSpec;
