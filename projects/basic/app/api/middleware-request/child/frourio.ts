import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';
export const frourioSpec = {
  middleware: {
    cookies: z.object({ session: z.string() }),
    context: z.object({ user: z.string() }),
  },
} satisfies FrourioSpec;
