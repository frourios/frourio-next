import { createRoute } from './frourio.server';

export const { GET, POST } = createRoute({
  async get(args) {
    return { status: 200, body: args };
  },
  async post() {
    return { status: 200 };
  },
});
