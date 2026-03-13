import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';

export const frourioSpec = {
  get: {
    headers: z.object({ 'Content-Type': z.string() }),
  },
  post: {
    headers: z.object({ 'Content-Type': z.string() }),
  },
} satisfies FrourioSpec;
