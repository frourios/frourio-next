import { createRoute } from './frourio.server';

export const { GET } = createRoute({
  get: async ({ params }, { user }) => {
    return { status: 200, body: { param: params.a, name: user.name } };
  },
});
