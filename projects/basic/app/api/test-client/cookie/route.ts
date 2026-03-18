import { createRoute } from './frourio.server';

export const { GET, POST } = createRoute({
  async get(_, ctx) {
    return { status: 200, body: ctx };
  },
  async post() {
    return { status: 200 };
  },
});
