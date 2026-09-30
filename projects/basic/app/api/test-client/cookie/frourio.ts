import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';

export const frourioSpec = {
  get: {
    cookies: z.object({ val: z.string().min(2).optional() }),
    res: {
      200: {
        body: z.object({ val: z.string().optional() }),
        cookies: { legacy: { command: 'delete' } },
      },
    },
  },
  post: {
    cookies: z.object({ val: z.string().min(2).optional() }),
    body: z.object({ val: z.string() }),
    res: {
      200: {
        headers: z.object({ 'x-cookie-test': z.literal('set') }),
        cookies: {
          val: { command: 'set', value: z.string().trim().min(2) },
          enabled: { command: 'set', value: z.boolean().optional() },
          count: {
            command: 'set',
            value: z.number().int().optional(),
            options: {
              path: '/api',
              domain: 'example.com',
              secure: true,
              httpOnly: true,
              sameSite: 'lax',
              partitioned: true,
              priority: 'high',
              expires: 0,
              maxAge: 3600,
            },
          },
          legacy: {
            command: 'delete',
            options: { path: '/api', domain: 'example.com', maxAge: 3600 },
          },
        },
      },
      400: {},
    },
  },
} as const satisfies FrourioSpec;
