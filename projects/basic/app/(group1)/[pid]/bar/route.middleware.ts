import { createMiddleware } from './frourio.middleware';

export const middleware = createMiddleware(async ({ req, params, next }) => {
  return next();
});
