import { createRoute } from './frourio.server';

export const { GET } = createRoute({
  get: async (_, ctx) => ({
    status: 200 as const,
    body: { name: ctx.user.name },
  }),
});
