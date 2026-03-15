import { createRoute } from './frourio.server';

export const { GET } = createRoute({
  get: async ({ params }) => ({
    status: 200 as const,
    body: params.all.join('/'),
  }),
});
