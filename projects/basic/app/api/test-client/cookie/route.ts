import { createRoute } from './frourio.server';

export const { GET, POST } = createRoute({
  async get({ cookies }) {
    return { status: 200, body: cookies };
  },
  async post({ body }) {
    return { status: 200, headers: { 'x-cookie-test': 'set' }, cookies: { val: body.val } };
  },
});
