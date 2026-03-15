import { createRoute } from './frourio.server';

export const { POST } = createRoute({
  post: async ({ params }) => {
    return { status: 200, body: { value: [params.a, params.b, ...params.c] } };
  },
});
