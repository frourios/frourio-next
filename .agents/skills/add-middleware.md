# add-middleware

Skill to add frourio-next middleware. Apply cross-cutting concerns such as authentication, authorization, and logging to route hierarchies.

## Usage

```
/add-middleware [path]
```

Examples:

- `/add-middleware app/api/auth` — Add authentication middleware
- `/add-middleware app/api/admin` — Add admin authorization middleware

## How middleware works

Middleware is automatically chained according to the directory hierarchy:

```
app/api/frourio.ts           ← middleware definition (root)
app/api/route.middleware.ts   ← middleware implementation
app/api/admin/frourio.ts      ← middleware definition (child, receives parent context)
app/api/admin/route.middleware.ts
app/api/admin/users/route.ts  ← receives middleware context
```

Child routes automatically pass through ancestor middleware.

## Steps

### 1. Add middleware to frourio.ts

#### Middleware with context

When passing data to child routes (e.g., auth info):

```typescript
import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';

export const AuthContextSchema = z.object({
  userId: z.string().optional(),
  traceId: z.string(),
});

export const frourioSpec = {
  middleware: {
    context: AuthContextSchema,
  },
  // Add GET, etc. here if the same directory also has methods
} satisfies FrourioSpec;
```

#### Middleware without context

When no data needs to be passed (e.g., logging):

```typescript
export const frourioSpec = {
  middleware: true,
  // ...
} satisfies FrourioSpec;
```

### 2. Run code generation

```bash
npx frourio-next
```

`frourio.middleware.ts` is auto-generated, exporting the `createMiddleware` function.

### 3. Create route.middleware.ts

Implement middleware using the auto-generated `createMiddleware`.

#### With context

```typescript
import { createMiddleware } from './frourio.middleware';

export const middleware = createMiddleware(async ({ req, next }) => {
  const authorization = req.headers.get('Authorization');
  const userId = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;

  // Pass the context object to next()
  // The type must match the context schema in frourio.ts
  return next({ userId, traceId: crypto.randomUUID() });
});
```

#### Child middleware (receives parent context)

```typescript
import { NextResponse } from 'next/server';
import { createMiddleware } from './frourio.middleware';

// Parent middleware context is passed as the second argument
export const middleware = createMiddleware(async ({ req, next }, parentCtx) => {
  if (!parentCtx.userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const isAdmin = parentCtx.userId === 'admin';

  // Pass own context to next()
  return next({ isAdmin, permissions: isAdmin ? ['read', 'write'] : ['read'] });
});
```

#### Without context

```typescript
import { createMiddleware } from './frourio.middleware';

export const middleware = createMiddleware(async ({ req, next }) => {
  console.log(`${req.method} ${req.url}`);

  // Call next() without arguments
  return next();
});
```

### 4. Use context in route.ts

In `route.ts` under a middleware directory, the controller receives context as the second argument:

```typescript
import { createRoute } from './frourio.server';

export const { GET } = createRoute({
  get: async ({ query }, ctx) => {
    // ctx contains merged context from all ancestor middleware
    console.log(ctx.userId, ctx.isAdmin);
    return { status: 200, body: { data: [] } };
  },
});
```

### 5. Verify

```bash
npx tsc --noEmit
```

## Middleware arguments

The `createMiddleware` callback receives the following:

| Argument    | Type                              | Description                                           |
| ----------- | --------------------------------- | ----------------------------------------------------- |
| `args.req`  | `NextRequest \| Request`          | The request object                                    |
| `args.next` | `(ctx?) => Promise<NextResponse>` | Function to call the next handler. Pass context to it |
| 2nd arg     | Parent middleware's `ContextType` | Only present when parent middleware exists            |

## Returning responses from middleware

Return a `NextResponse` directly without calling `next()` to abort the request:

```typescript
import { NextResponse } from 'next/server';

export const middleware = createMiddleware(async ({ req, next }) => {
  if (!req.headers.get('Authorization')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  return next({
    /* ... */
  });
});
```

## Notes

- `frourio.middleware.ts` is an auto-generated file. Do not edit manually
- `frourio.ts` and `route.middleware.ts` are files written by the developer
- Context types are defined with Zod schemas
- Child middleware context is automatically merged with parent context
- When using `middleware: true`, `next()` in `route.middleware.ts` takes no arguments
