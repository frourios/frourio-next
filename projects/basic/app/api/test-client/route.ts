import { createRoute } from './frourio.server';

export const { GET, POST, PATCH, DELETE } = createRoute({
  get: async () => {
    throw new Error('Handler not implemented');
  },
  post: async () => {
    throw new Error('Handler not implemented');
  },
  patch: async () => {
    throw new Error('Handler not implemented');
  },
  delete: async () => {
    throw new Error('Handler not implemented');
  },
});
