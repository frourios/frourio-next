import { createMiddleware } from './frourio.middleware';

export const middleware = createMiddleware(async ({ next }) => {
  return next({ user: { name: 'aaa' } });
});
