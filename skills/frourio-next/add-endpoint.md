# add-endpoint

Skill to add a frourio-next API endpoint at a user-specified Next.js App Router path.

## Usage

```
/add-endpoint [path] [HTTP methods...]
```

Examples:

- `/add-endpoint app/api/users GET POST`
- `/add-endpoint app/api/users/[id] GET PUT DELETE`
- `/add-endpoint app/api/posts/[...slug] GET`

## Steps

### 1. Gather information from the user

If the path or methods are not specified, use AskUserQuestion to confirm:

- **API path**: Directory path within App Router (e.g., `app/api/users/[id]`)
- **HTTP methods**: Select from GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS (multiple allowed)
- **Request spec**: query, headers, body, format needed for each method
- **Response spec**: Status codes and response body/headers

### 2. Create frourio.ts

Follow the pattern below to create `frourio.ts`.

```typescript
import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';

export const frourioSpec = {
  // If path parameters exist ([id], [...slug], etc.)
  // param: z.object({ id: z.string().uuid() }),  // as needed

  get: {
    query: z.object({
      /* query parameters */
    }),
    res: {
      200: {
        body: z.object({
          /* response body */
        }),
      },
    },
  },

  post: {
    body: z.object({
      /* request body */
    }),
    res: {
      201: {
        body: z.object({
          /* response body */
        }),
      },
      400: { body: z.object({ message: z.string() }) },
    },
  },
} satisfies FrourioSpec;
```

#### FrourioSpec type definition

```typescript
type FrourioSpec = {
  param?: z.ZodTypeAny; // Path parameter validation
  middleware?: true | { context: z.ZodTypeAny }; // Middleware definition
} & {
  // Methods without body
  [method in 'get' | 'head' | 'options']?: {
    headers?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    res?: {
      [status: `${2 | 4 | 5}${Digit}${Digit}`]: {
        headers?: z.ZodTypeAny;
        body?: z.ZodTypeAny;
      };
    };
  };
} & {
  // Methods with body
  [method in 'post' | 'put' | 'patch' | 'delete']?: {
    headers?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    format?: 'formData' | 'urlencoded'; // Defaults to JSON
    body?: z.ZodTypeAny;
    res?: {
      [status: `${2 | 4 | 5}${Digit}${Digit}`]: {
        headers?: z.ZodTypeAny;
        body?: z.ZodTypeAny;
      };
    };
  };
};
```

#### Path parameter types

| Directory name | Meaning            | param type                               |
| -------------- | ------------------ | ---------------------------------------- |
| `[id]`         | Required parameter | `z.string()` / `z.coerce.number()` etc.  |
| `[...slug]`    | Required catch-all | `z.tuple([z.string()]).rest(z.string())` |
| `[[...slug]]`  | Optional catch-all | Auto-generated (no need to specify)      |

#### Using format

- `format: 'formData'`: For file uploads, etc. Allows `z.instanceof(File)`
- `format: 'urlencoded'`: For form submissions
- Omitted: Processed as `application/json`

#### Response headers

```typescript
res: {
  201: {
    headers: z.object({ 'Set-Cookie': z.string() }),
    body: z.object({ id: z.number() }),
  },
}
```

#### Body-less responses

```typescript
res: {
  204: {},       // No body or headers
  404: {},       // Status code only
}
```

### 3. Run code generation

```bash
npx frourio-next
```

This auto-generates the following files:

- `frourio.server.ts` — `createRoute()` helper
- `frourio.client.ts` — Type-safe client `fc()` / `$fc()`
- `frourio.params.ts` — Only when path parameters exist

### 4. Create route.ts

Import `createRoute` from the auto-generated `frourio.server.ts` and implement the handlers.

```typescript
import { createRoute } from './frourio.server';

export const { GET, POST } = createRoute({
  get: async ({ query }) => {
    // Business logic
    return {
      status: 200,
      body: {
        /* ... */
      },
    };
  },
  post: async ({ body }) => {
    // Business logic
    return {
      status: 201,
      body: {
        /* ... */
      },
    };
  },
});
```

#### Controller arguments

Each method handler receives the following properties:

- `params` — Path parameters (only when `param` is defined)
- `query` — Query parameters (only when `query` is defined)
- `headers` — Request headers (only when `headers` is defined)
- `body` — Request body (only when `body` is defined, for POST/PUT/PATCH/DELETE)

When middleware exists, `ctx` is passed as the second argument.

#### Returning responses

The returned object requires `status`. If the status has `body` or `headers` defined, those are also required:

```typescript
// body + headers
return { status: 201, body: { id: 1 }, headers: { 'Set-Cookie': 'token=abc' } };

// body only
return { status: 200, body: { data: items } };

// status code only
return { status: 204 };
```

### 5. Verify

```bash
npx tsc --noEmit
```

Confirm there are no type errors.

## Notes

- `frourio.server.ts`, `frourio.client.ts`, `frourio.middleware.ts`, `frourio.params.ts` are auto-generated files. Do not edit manually
- `frourio.ts` and `route.ts` are files written by the developer
- Use the `/add-middleware` skill if middleware is needed
- `(group)` directories (Route Groups) do not affect the path
