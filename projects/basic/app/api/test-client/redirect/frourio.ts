import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';
export const frourioSpec = {
  get: {
    res: {
      200: { body: z.object({ direct: z.literal(true) }) },
      301: {
        headers: z.object({ location: z.string() }),
        cookies: { session: { command: 'set', value: z.string() } },
        dest: {
          200: {
            headers: z.object({ 'x-result': z.literal('ok') }),
            body: z.object({ user: z.string() }),
          },
          403: { body: z.object({ forbidden: z.literal(true) }) },
        },
      },
      304: { headers: z.object({ etag: z.string() }) },
    },
  },
  post: {
    res: {
      307: {
        headers: z.object({ location: z.string() }),
        body: z.string(),
        dest: { 201: { body: z.number() } },
      },
    },
  },
  put: { res: { 200: { body: z.string() }, 302: { headers: z.object({ location: z.string() }) } } },
  patch: { res: { 308: { dest: { 204: {} } } } },
  delete: { res: { 303: { dest: { 403: { body: z.boolean() } } } } },
  options: { res: { 300: { body: z.array(z.string()) } } },
} satisfies FrourioSpec;
