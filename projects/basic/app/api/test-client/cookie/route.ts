import { createRoute } from './frourio.server';

export const { GET, POST } = createRoute({
  async get({ cookies }) {
    return { status: 200, body: cookies, cookies: { legacy: { command: 'delete' } } };
  },
  async post({ body }) {
    return {
      status: 200,
      headers: { 'x-cookie-test': 'set' },
      cookies: { val: { command: 'set', value: body.val }, legacy: { command: 'delete' } },
    };
  },
});
