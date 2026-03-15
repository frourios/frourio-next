import { createRoute } from './frourio.server';

export const { GET } = createRoute({
  get: async () => ({
    status: 200 as const,
    body: { health: true },
  }),
});
