import { NextResponse } from 'next/server';
import { createMiddleware } from './frourio.middleware';

export const middleware = createMiddleware(async ({ next }, parentContext) => {
  console.log('Users Middleware (/api/mw/admin/users): Received parent context:', parentContext);

  if (!parentContext.isAdmin) {
    console.log('Users Middleware: Forbidden access for non-admin user.');

    return new NextResponse(
      JSON.stringify({ message: 'Forbidden: Admin access required for users endpoint' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return next();
});
