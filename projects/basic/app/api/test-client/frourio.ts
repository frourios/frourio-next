import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  isAdmin: z.boolean().optional(),
});

const ErrorSchema = z.object({ message: z.string() });

export const frourioSpec = {
  get: {
    query: z.object({ search: z.string().optional(), limit: z.coerce.number().int().optional() }),
    res: {
      200: { body: z.array(UserSchema) },
      400: { body: ErrorSchema },
    },
  },

  post: {
    body: UserSchema.omit({ id: true }),
    res: {
      201: { body: UserSchema },
      400: { body: ErrorSchema },
      422: { body: z.object({ error: z.string(), issues: z.any() }) },
    },
  },

  patch: {
    format: 'formData',
    body: z.object({
      userId: z.string(),
      avatar: z.instanceof(File),
      metadata: z.string().optional(),
    }),
    res: {
      200: { body: z.object({ message: z.string(), fileName: z.string(), size: z.number() }) },
      400: { body: ErrorSchema },
    },
  },

  delete: {
    format: 'urlencoded',
    body: z.object({
      reason: z.string(),
      confirm: z.boolean(),
    }),
    res: {
      200: { body: z.object({ message: z.string() }) },
      400: { body: ErrorSchema },
    },
  },
} satisfies FrourioSpec;

export type User = z.infer<typeof UserSchema>;
