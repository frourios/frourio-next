import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';

const symbolBrand = Symbol();

export type SymbolId = string & { [symbolBrand]: unknown };

export type ZodId = number & z.$brand<'ZodId'>;

export type MaybeId = ZodId | (number & z.$brand<'maybe'>);

const query = z.object({
  requiredNum: z.number(),
  optionalNum: z.number().optional(),
  optionalNumArr: z.array(z.number()).optional(),
  emptyNum: z.number().optional(),
  requiredNumArr: z.array(z.number()),
  id: z.string().regex(/^\d+$/),
  strArray: z.array(z.string()),
  optionalStrArray: z.array(z.string()).optional(),
  disable: z.enum(['true', 'false']),
  bool: z.boolean(),
  optionalBool: z.boolean().optional(),
  boolArray: z.array(z.boolean()),
  optionalBoolArray: z.array(z.boolean()).optional(),
  symbolIds: z.custom<SymbolId[]>((val) => z.array(z.string()).safeParse(val).success),
  optionalZodIds: z.custom<ZodId[]>((val) => z.array(z.number()).safeParse(val).success).optional(),
  maybeIds: z.custom<MaybeId[]>((val) => z.array(z.number()).safeParse(val).success),
});

export const frourioSpec = {
  get: {
    query,
    res: { 200: { body: z.object({ pid: z.string(), query }) } },
  },
} satisfies FrourioSpec;
