import { createRoute } from './frourio.server';

export const { GET } = createRoute({
  get: async (req, context) => {
    console.log('GET Handler (/api/mw): Received context:', context);

    return { status: 200, body: context };
  },
});
