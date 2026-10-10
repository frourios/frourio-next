import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';

const request = {
  headers: z.object({ 'X-Token': z.string().min(1), 'x-user': z.string() }).optional(),
  cookies: z.object({ session: z.string().min(1), user: z.string() }).optional(),
  query: z.object({ count: z.number(), active: z.boolean() }).optional(),
};

export const frourioSpec = {
  middleware: request,
  get: {
    ...request,
    res: {
      200: {
        body: z.object({
          headers: request.headers,
          cookies: request.cookies,
          query: request.query,
        }),
      },
    },
  },
  post: { res: { 200: {} } },
} satisfies FrourioSpec;
