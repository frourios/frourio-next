import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';

export const frourioSpec = {
  middleware: true,
  get: {
    res: { 200: { body: z.object({ name: z.string() }) } },
  },
} satisfies FrourioSpec;
