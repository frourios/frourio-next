import { createRoute } from './frourio.server';

export const { GET, POST, DELETE } = createRoute({
  get: async () => {
    return new Response();
  },
  post: async () => {
    return new Response();
  },
  delete: async () => {
    return {
      status: 400 as const,
      headers: { 'X-Error-Code': 'ERR001' },
      body: { error: 'bad request' },
    };
  },
});
