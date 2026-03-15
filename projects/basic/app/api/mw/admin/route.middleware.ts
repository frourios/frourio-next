import { NextResponse } from 'next/server';
import { createMiddleware } from './frourio.middleware';

export const middleware = createMiddleware(async ({ req, next }, parentContext) => {
  console.log('Admin Middleware (/api/mw/admin): Received parent context:', parentContext);

  const isAdmin = parentContext.userId === 'user-admin';
  const permissions = isAdmin ? ['read', 'write', 'delete'] : ['read'];

  const url = new URL(req.url);
  const isAdminRoute = url.pathname === '/api/mw/admin';

  if (!isAdmin) {
    if (isAdminRoute && req.method === 'GET') {
      console.log('Admin Middleware: Allowing non-admin GET to /api/mw/admin');
    } else {
      console.log(
        `Admin Middleware: Forbidden access for non-admin user to ${req.method} ${url.pathname}`,
      );
      return new NextResponse(JSON.stringify({ message: 'Forbidden: Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return next({ isAdmin, permissions });
});
