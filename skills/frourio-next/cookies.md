# Cookies

Use method-level `cookies` or `middleware.cookies` to validate incoming cookies and `res[status].cookies` to declare response cookies commands. Read [add-endpoint.md](add-endpoint.md) for the endpoint creation workflow.

## Define the cookie behavior in frourio.ts

```typescript
import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';

const themeSchema = z.enum(['light', 'dark']);

export const frourioSpec = {
  get: {
    cookies: z.object({ theme: themeSchema.optional() }),
    res: { 200: { body: z.object({ theme: themeSchema }) } },
  },
  post: {
    body: z.object({ theme: themeSchema }),
    res: {
      200: {
        cookies: {
          theme: {
            command: 'set',
            value: themeSchema,
            options: { path: '/', sameSite: 'lax', maxAge: 3600 } as const,
          },
          oldTheme: { command: 'delete', options: { path: '/' } },
        },
      },
    },
  },
  delete: {
    res: {
      204: { cookies: { theme: { command: 'delete', options: { path: '/' } } } },
    },
  },
} satisfies FrourioSpec;
```

Cookie names are the keys of the response `cookies` object. `value` is a Zod schema for `command: 'set'`; `command: 'delete'` has no value schema. Options follow Next.js `ResponseCookie` options, excluding `name` and `value`, and can include `path`, `domain`, `httpOnly`, `secure`, `sameSite`, `maxAge`, `expires`, `partitioned`, and `priority`. `expires` is available only for `set`, matching the options accepted by Next.js `delete()`. Match Path and Domain when deleting a cookie that was set with those attributes. Deletion delegates to Next.js `response.cookies.delete()` with the declared options. Frourio preserves `maxAge` when specified and adds no `Max-Age` attribute when it is omitted. Next.js sets `expires` to the Unix epoch for deletion, then recalculates it from `maxAge` if that value is nonzero. A positive `maxAge` therefore retains an empty-valued cookie until it expires.

Request cookies are decoded strings passed to Zod, just like request headers. Use `z.coerce.number()` or `z.stringbool()` when a request cookie should become a number or boolean. For example, `z.coerce.number().int().optional()` allows a missing numeric cookie. `z.coerce.boolean()` treats the string `'false'` as true; use `z.stringbool()` for textual booleans. Invalid cookies, including missing required cookies, return 422 before the controller runs.

For shared validation across a route hierarchy, declare `middleware: { cookies: z.object(...) }` and read validated `cookies` in the `createMiddleware` callback. `context` is optional. Invalid middleware cookies return 422 before that callback runs. Read [add-middleware.md](add-middleware.md) for the definition and implementation workflow.

## Generate and implement the route

Run `npx frourio-next` after updating the spec. Implement `route.ts` using the generated `createRoute`:

```typescript
import { createRoute } from './frourio.server';

export const { GET, POST, DELETE } = createRoute({
  async get({ cookies }) {
    return { status: 200, body: { theme: cookies.theme ?? 'light' } };
  },
  async post({ body }) {
    return {
      status: 200,
      cookies: { theme: { command: 'set', value: body.theme }, oldTheme: { command: 'delete' } },
    };
  },
  async delete() {
    return { status: 204, cookies: { theme: { command: 'delete' } } };
  },
});
```

Return `{ command: 'set', value, options? }` or `{ command: 'delete', options? }` for each declared cookie. Cookie names, commands, and value types must match the spec. Cookies are required by default, including deletions; declare `required: false` in the spec for a cookie that may be omitted. Only literal `false` is accepted. If all cookies are optional, the entire `cookies` return property may be omitted. An omitted optional cookie performs no operation.

Spec options are defaults. Effective options are `{ ...specOptions, ...handlerOptions }`; runtime handler options use the Next.js argument types for their command, so default literal values do not restrict overrides. Delete options exclude `expires`, just as Next.js does. Mandatory cookie omissions, incorrect commands, and invalid values return 500 before any declared cookie is applied.

An optional Zod value allows `value: undefined` inside a set command and is separate from `required: false`. Values parsing to `undefined` send no cookie. Numbers and booleans serialize as strings and Zod transformations apply before serialization.

## Clients and OpenAPI

The generated client has no `cookies` request argument or parsed response cookies property. Browser clients send and receive cookies through Fetch, using `init: { credentials: 'include' }` when needed. Browsers do not expose `Set-Cookie` to JavaScript, and `httpOnly` cookies cannot be read through `document.cookie`. For Node.js tests, call the route handler directly and inspect `res.cookies` or `res.headers.getSetCookie()`. Read [testing.md](testing.md) for test patterns.

For method-level schemas, OpenAPI emits request cookies as `in: cookie` parameters and response cookies as a `Set-Cookie` header with an array of example header values. Each array entry represents a separate header. Examples use the spec's inferred types: literal and enum values are preserved, while broad types and computed dates use representative values. Use `as const` on options when examples should retain literal strings and numbers. Regenerate with `npx frourio-next-openapi` after changing the spec.

OpenAPI responses include `x-frourio-cookies`, an extension mapping cookie names to `command` and `required`. This is specification metadata only, never a response header. Set-Cookie examples use spec defaults and representative values; dynamic handler option overrides are not encoded in the document.
