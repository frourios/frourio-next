# testing

Skill for writing tests for frourio-next API routes using MSW (Mock Service Worker) and Vitest.

## Usage

```
/testing [endpoint path] [test scenarios...]
```

Examples:

- `/testing app/api/users GET POST`
- `/testing app/api/users/[id] PUT DELETE error-cases`

## Overview

frourio-next auto-generates `setupMswHandlers.ts` which imports all `route.ts` files and creates MSW handlers that call the **actual route implementations**. Tests use the type-safe client (`$fc`/`fc`) against these handlers, making them integration tests that exercise real server logic without a running Next.js server.

## Prerequisites

### Install dependencies

```bash
npm install -D vitest msw happy-dom @testing-library/react @testing-library/dom
```

### Generate MSW handlers

```bash
npx frourio-next-msw --output=./tests/setupMswHandlers.ts
```

For watch mode, add to `package.json`:

```json
{
  "scripts": {
    "dev:msw": "frourio-next-msw --output=./tests/setupMswHandlers.ts --watch"
  }
}
```

### Configure Vitest

```typescript
// vite.config.ts (or vitest.config.ts)
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          environment: 'happy-dom',
          include: ['tests/browser/*.spec.*'],
          setupFiles: ['./tests/browser/setup.ts'],
        },
      },
    ],
  },
});
```

### Create setup file

```typescript
// tests/browser/setup.ts
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll } from 'vitest';
import { patchFilePrototype } from '../setupMswHandlers';

beforeAll(patchFilePrototype); // Polyfills File API for happy-dom
afterEach(cleanup);
```

## Writing tests

### 1. Set up MSW server with auto-generated handlers

Use the auto-generated `setupMswHandlers` which calls the real `route.ts` implementations:

```typescript
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { $fc, fc } from '../../app/frourio.client';
import { setupMswHandlers } from '../setupMswHandlers';

const baseURL = 'http://localhost';
const server = setupServer(...setupMswHandlers({ baseURL }));

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 2. Create client instances

```typescript
// High-level client: throws on errors, returns body directly
const apiClient = $fc({ baseURL });

// Low-level client: never throws, returns full result object
const lowLevelClient = fc({ baseURL, init: { credentials: 'include' } });
```

### 3. Test with $fc (throwing client)

Use `$fc` for happy-path tests and `rejects.toThrow` for error cases.

```typescript
describe('$fc (High-Level Client)', () => {
  test('GET - Success', async () => {
    const users = await apiClient['api/users'].$get({ query: {} });
    expect(users).toHaveLength(2);
    expect(users[0]).toEqual({ id: 1, name: 'Alice' });
  });

  test('GET - With query', async () => {
    const users = await apiClient['api/users'].$get({ query: { search: 'ali' } });
    expect(users).toHaveLength(1);
    expect(users[0].name).toBe('Alice');
  });

  test('GET - API Error (400)', async () => {
    await expect(apiClient['api/users'].$get({ query: { search: 'error' } })).rejects.toThrow(
      /HTTP Error: 400/,
    );
  });

  test('GET - Response Validation Error', async () => {
    await expect(
      apiClient['api/users'].$get({ query: { search: 'invalid-response' } }),
    ).rejects.toThrow(ZodError);
  });

  test('POST - Success', async () => {
    const user = await apiClient['api/users'].$post({ body: { name: 'Charlie' } });
    expect(user.name).toBe('Charlie');
  });
});
```

### 4. Test with fc (safe client)

Use `fc` for comprehensive testing including error responses and validation.

```typescript
import { ZodError } from 'zod';

describe('fc (Low-Level Client)', () => {
  test('GET - Success', async () => {
    const result = await lowLevelClient['api/users'].$get({ query: {} });
    expect(result.ok).toBe(true);
    expect(result.isValid).toBe(true);
    expect(result.data!.status).toBe(200);
    expect(result.data!.body).toHaveLength(2);
    expect(result.failure).toBeUndefined();
    expect(result.raw).toBeInstanceOf(Response);
  });

  test('GET - API Error (400)', async () => {
    const result = await lowLevelClient['api/users'].$get({ query: { search: 'error' } });
    expect(result.ok).toBe(false);
    expect(result.isValid).toBe(true);
    expect(result.failure!.status).toBe(400);
    expect(result.failure!.body).toEqual({ message: 'Bad request' });
    expect(result.data).toBeUndefined();
  });

  test('GET - Response Validation Error', async () => {
    const result = await lowLevelClient['api/users'].$get({
      query: { search: 'invalid-response' },
    });
    expect(result.ok).toBe(true); // HTTP was 200
    expect(result.isValid).toBe(false); // Zod validation failed
    expect(result.reason).toBeInstanceOf(ZodError);
    expect(result.data).toBeUndefined();
  });

  test('POST - Request Body Validation Error', async () => {
    // Request body doesn't match the Zod schema — caught before fetch
    const result = await lowLevelClient['api/users'].$post({
      body: { invalid: true } as any,
    });
    expect(result.ok).toBeUndefined(); // No HTTP request made
    expect(result.isValid).toBe(false);
    expect(result.reason).toBeInstanceOf(ZodError);
    expect(result.raw).toBeUndefined();
  });

  test('PUT - With path params', async () => {
    const result = await lowLevelClient['api/users/[userId]'].$put({
      params: { userId: 1 },
      body: { name: 'Updated' },
    });
    expect(result.ok).toBe(true);
    expect(result.data!.body.name).toBe('Updated');
  });

  test('DELETE - 204 No Content', async () => {
    const result = await lowLevelClient['api/users/[userId]'].$delete({
      params: { userId: 1 },
    });
    expect(result.ok).toBe(true);
    expect(result.data!.status).toBe(204);
    expect(result.data!.body).toBeUndefined();
  });

  test('DELETE - Not Found (404)', async () => {
    const result = await lowLevelClient['api/users/[userId]'].$delete({
      params: { userId: 999 },
    });
    expect(result.ok).toBe(false);
    expect(result.failure!.status).toBe(404);
  });
});
```

## Advanced patterns

### File upload (FormData)

```typescript
test('PATCH - File upload', async () => {
  const blob = new Blob(['content'], { type: 'image/jpeg' });

  const result = await lowLevelClient['api/users'].$patch({
    body: { userId: 'user-1', avatar: new File([blob], 'photo.jpg') },
  });
  expect(result.ok).toBe(true);
  expect(result.data!.body.fileName).toBe('photo.jpg');
});
```

### URL-encoded form

```typescript
test('DELETE - urlencoded body', async () => {
  const result = await lowLevelClient['api/users'].$delete({
    body: { reason: 'cleanup', confirm: true },
  });
  expect(result.ok).toBe(true);
  expect(result.data!.body.message).toContain('cleanup');
});
```

### Cookie testing

```typescript
test('Cookie round-trip', async () => {
  // 1. Verify no cookie initially
  const res1 = await lowLevelClient['api/auth/cookie'].$get();
  expect(res1.data?.body.val).toBeUndefined();

  // 2. POST to set cookie
  const res2 = await lowLevelClient['api/auth/cookie'].$post({ body: { val: 'abc' } });
  const cookieText = res2.raw?.headers.get('Set-Cookie') ?? '';
  expect(cookieText).toBe('val=abc; Path=/');

  // 3. Set cookie in browser
  document.cookie = cookieText;

  // 4. GET with cookie
  const res3 = await lowLevelClient['api/auth/cookie'].$get({
    init: { headers: { cookie: cookieText } },
  });
  expect(res3.data?.body.val).toBe('abc');
});

// Clean up cookies in afterEach
afterEach(() => {
  document.cookie.split(';').forEach((cookie) => {
    document.cookie = `${cookie.split('=')[0]!.trim()}=; Max-Age=0; path=/`;
  });
});
```

### Streaming response

```typescript
test('Streaming response', async () => {
  const result = await lowLevelClient['api/stream'].$post({
    body: { prompt: 'Test' },
  });
  expect(result.ok).toBe(true);

  const reader = result.data!.body!.getReader();
  let content = '';
  let chunk;

  while (!(chunk = await reader.read()).done) {
    content += new TextDecoder().decode(chunk.value);
  }

  expect(content).toContain('Streaming response');
});
```

### Override handlers per test

Use `server.use()` to temporarily add or override specific handlers. `server.resetHandlers()` in `afterEach` reverts to the auto-generated handlers.

```typescript
import { http, HttpResponse } from 'msw';

test('Override a specific endpoint', async () => {
  server.use(
    http.get(`${baseURL}/api/users`, () => {
      return HttpResponse.json([{ id: 99, name: 'Overridden' }]);
    }),
  );

  const users = await apiClient['api/users'].$get({ query: {} });
  expect(users).toEqual([{ id: 99, name: 'Overridden' }]);
  // After this test, afterEach -> server.resetHandlers() restores the real route handler
});
```

### Custom fetch function

```typescript
test('Custom fetch function', async () => {
  const customClient = fc({
    baseURL,
    fetch: async (input, init) => {
      const headers = new Headers(init?.headers);
      headers.set('Authorization', 'Bearer test-token');
      return fetch(input, { ...init, headers });
    },
  });

  const result = await customClient['api/users'].$get({ query: {} });
  expect(result.ok).toBe(true);
});
```

## How setupMswHandlers works

The auto-generated `setupMswHandlers.ts`:

1. Imports all `route.ts` files in your app directory
2. Creates MSW `http.*` handlers that map URL patterns to the actual route exports (`GET`, `POST`, etc.)
3. Handles path parameters by converting Next.js dynamic segments (`[id]`, `[...slug]`) to MSW URL patterns (`:id`, `*`)
4. Passes parsed path parameters as `{ params: Promise.resolve({ ... }) }` to the route handler
5. Applies `patchDuplicateCookie` to normalize cookie headers

Since handlers call real `route.ts` implementations, your tests exercise the full server logic: Zod validation, middleware chain, business logic, and response serialization.

## fc result type reference

```typescript
type Result =
  // Success: 2xx with valid body
  | {
      ok: true;
      isValid: true;
      data: { status: number; body: T };
      failure?: undefined;
      raw: Response;
    }
  // Known error status (e.g., 400, 404)
  | {
      ok: false;
      isValid: true;
      data?: undefined;
      failure: { status: number; body: E };
      raw: Response;
    }
  // Response validation error (Zod)
  | { ok: boolean; isValid: false; reason: ZodError; raw: Response }
  // Network/fetch error
  | { ok?: undefined; error: unknown; raw?: undefined }
  // Request validation error (params/query/body validation failed before fetch)
  | { ok?: undefined; isValid: false; reason: ZodError; raw?: undefined };
```

## What to test

| Scenario                  | Client | Key assertions                                          |
| ------------------------- | ------ | ------------------------------------------------------- |
| Happy path                | `$fc`  | Return value matches expected data                      |
| API error (4xx/5xx)       | `$fc`  | `rejects.toThrow(/HTTP Error: NNN/)`                    |
| Response validation error | `$fc`  | `rejects.toThrow(ZodError)`                             |
| Happy path (detailed)     | `fc`   | `ok: true`, `isValid: true`, `data.status`, `data.body` |
| API error (detailed)      | `fc`   | `ok: false`, `failure.status`, `failure.body`           |
| Response validation error | `fc`   | `isValid: false`, `reason` is `ZodError`                |
| Request validation error  | `fc`   | `ok: undefined`, `isValid: false`, `raw: undefined`     |
| File upload               | `fc`   | FormData with `File` object, check response             |
| Cookie round-trip         | `fc`   | Set-Cookie header, document.cookie, re-send             |
| Streaming                 | `fc`   | Read chunks via `getReader()`                           |

## Notes

- `happy-dom` is used as the browser environment for Vitest
- `patchFilePrototype` must be called in `beforeAll` to polyfill `File.arrayBuffer()`, `File.bytes()`, etc. for happy-dom
- Use `$fc` for concise happy-path and error-throwing tests
- Use `fc` for comprehensive result inspection (status, headers, validation)
- MSW handlers run in Node.js via `setupServer` (not browser service worker)
- `server.resetHandlers()` in `afterEach` reverts any `server.use()` overrides back to auto-generated handlers
- Auto-generated `frourio.server.ts`, `frourio.client.ts`, `setupMswHandlers.ts` must not be edited manually
