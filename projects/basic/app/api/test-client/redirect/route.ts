import { createRoute } from './frourio.server';

export const controller = {
  get: async () => ({
    status: 301,
    headers: { location: '/users' },
    cookies: { session: { command: 'set', value: 'token' } },
  }),
  post: async () => ({ status: 307, headers: { location: '/users' }, body: 'Moved' }),
  put: async () => ({ status: 302, headers: { location: 'https://example.com' } }),
  patch: async () => ({ status: 308 }),
  delete: async () => ({ status: 303 }),
  options: async () => ({ status: 300, body: ['a', 'b'] }),
} satisfies Parameters<typeof createRoute>[0];

export const { GET, POST, PUT, PATCH, DELETE, OPTIONS } = createRoute(controller);
