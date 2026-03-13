import { createRoute } from './frourio.server';

export const { GET, POST } = createRoute({
  get: async () => {
    return new Response();
  },
  post: async () => {
    return new Response();
  },
});
