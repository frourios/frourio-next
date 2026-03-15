import { randomUUID } from 'crypto';
import { createMiddleware } from './frourio.middleware';

export const middleware = createMiddleware(async ({ req, next }) => {
  const authorization = req.headers.get('Authorization');
  const traceId = req.headers.get('X-Trace-Id') ?? randomUUID();
  const userId = authorization?.startsWith('Bearer user-')
    ? authorization.split(' ')[1]
    : undefined;

  console.log(`Root Middleware (/api/mw): userId=${userId}, traceId=${traceId}`);

  return next({ userId, traceId });
});
