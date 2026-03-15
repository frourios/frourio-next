import { createRoute } from './frourio.server';

export const { GET, POST } = createRoute({
  get: async (req, context) => {
    console.log('GET Handler (/api/mw/admin): Received full context:', context);

    return { status: 200, body: context };
  },
  post: async ({ body }, context) => {
    console.log('POST Handler (/api/mw/admin): Received full context:', context);
    console.log('POST Handler (/api/mw/admin): Received body:', body);

    return { status: 201, body: { received: body.data, context } };
  },
});
