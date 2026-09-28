import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';

export const frourioSpec = {
  post: {
    format: 'formData',
    body: z.object({
      string: z.string(),
      number: z.number(),
      boolean: z.boolean(),
      optionalString: z.string().optional(),
      optionalNumber: z.number().optional(),
      optionalBoolean: z.boolean().optional(),
      stringArr: z.array(z.string()),
      numberArr: z.array(z.number()),
      booleanArr: z.array(z.boolean()),
      optionalStringArr: z.array(z.string()).optional(),
      optionalNumberArr: z.array(z.number()).optional(),
      optionalBooleanArr: z.array(z.boolean()).optional(),
      file: z.file(),
      optionalFile: z.file().optional(),
      fileArr: z.array(z.file()),
      optionalFileArr: z.array(z.file()).optional(),
    }),
    res: {
      200: {
        body: z.object({
          string: z.string(),
          number: z.number(),
          boolean: z.boolean(),
          optionalString: z.string().optional(),
          optionalNumber: z.number().optional(),
          optionalBoolean: z.boolean().optional(),
          stringArr: z.array(z.string()),
          numberArr: z.array(z.number()),
          booleanArr: z.array(z.boolean()),
          optionalStringArr: z.array(z.string()).optional(),
          optionalNumberArr: z.array(z.number()).optional(),
          optionalBooleanArr: z.array(z.boolean()).optional(),
          file: z.file(),
          optionalFile: z.file().optional(),
          fileArr: z.array(z.file()),
          optionalFileArr: z.array(z.file()).optional(),
        }),
      },
    },
  },
} satisfies FrourioSpec;
