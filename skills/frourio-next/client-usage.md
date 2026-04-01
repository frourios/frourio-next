# client-usage

Skill for using the frourio-next auto-generated type-safe client (`fc` / `$fc`) in frontend code, including integration with SWR and TanStack Query.

## Usage

```
/client-usage
```

## Overview

frourio-next generates a type-safe client in `frourio.client.ts`. There are two client variants:

| Client  | Import                                   | Behavior                                                                                                         |
| ------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `$fc()` | `import { $fc } from './frourio.client'` | **High-level (throwing)**: Throws on non-2xx or validation errors. Returns the response body directly            |
| `fc()`  | `import { fc } from './frourio.client'`  | **Low-level (safe)**: Never throws. Returns a result object with `ok`, `isValid`, `data`, `failure`, `raw`, etc. |

Both accept the same options:

```typescript
import type { FrourioClientOption } from '@frourio/next';

const client = $fc({
  baseURL: 'http://localhost:3000', // API base URL
  init: { credentials: 'include' }, // Default RequestInit for all requests
  fetch: customFetch, // Custom fetch implementation
});
```

## Accessing endpoints

Endpoints are accessed via bracket notation using the route path (without `app/`):

```typescript
const client = $fc({ baseURL: 'http://localhost:3000' });

// app/api/test-client/route.ts
client['api/test-client'].$get({ query: { search: 'alice' } });

// app/api/test-client/[userId]/route.ts
client['api/test-client/[userId]'].$put({ params: { userId: 123 }, body: { name: 'Alice' } });

// app/(group1)/[pid]/route.ts — route groups are kept in the key
client['(group1)/[pid]'].$get({ params: { pid: 'abc' }, query: { ... } });
```

## $fc() — High-level (throwing) client

Returns the response body directly. Throws on any error.

### GET

```typescript
const client = $fc({ baseURL: 'http://localhost:3000' });

// Returns the 200 body directly (e.g., User[])
const users = await client['api/test-client'].$get({ query: { search: 'alice', limit: 10 } });
console.log(users[0].name); // Type-safe

// Throws on 4xx/5xx
try {
  await client['api/test-client'].$get({ query: { search: 'error' } });
} catch (e) {
  // Error: "HTTP Error: 400" or ZodError for validation failures
}
```

### POST

```typescript
const newUser = await client['api/test-client'].$post({
  body: { name: 'Charlie', isAdmin: true },
});
console.log(newUser.id); // Type-safe
```

### PUT with path params

```typescript
const updated = await client['api/test-client/[userId]'].$put({
  params: { userId: 1 },
  body: { name: 'Updated Name' },
});
```

### PATCH with FormData (file upload)

```typescript
const result = await client['api/test-client'].$patch({
  body: { userId: '123', avatar: fileObject, metadata: 'profile-pic' },
});
console.log(result.fileName);
```

### DELETE

```typescript
await client['api/test-client/[userId]'].$delete({ params: { userId: 1 } });
```

### Custom RequestInit per request

```typescript
const users = await client['api/test-client'].$get({
  query: {},
  init: { headers: { Authorization: 'Bearer token' }, signal: abortController.signal },
});
```

## fc() — Low-level (safe) client

Never throws. Returns a discriminated union with full response details.

### Result type

```typescript
type Result =
  // Success: 2xx with valid body
  | { ok: true; isValid: true; data: { status: 200; body: T }; failure?: undefined; raw: Response }
  // Success status but with defined error body (e.g., 400)
  | { ok: false; isValid: true; data?: undefined; failure: { status: 400; body: E }; raw: Response }
  // Response validation error
  | { ok: boolean; isValid: false; reason: ZodError; raw: Response }
  // Network/fetch error
  | { ok?: undefined; error: unknown; raw?: undefined }
  // Request validation error (params/query)
  | { ok?: undefined; isValid: false; reason: ZodError; raw?: undefined };
```

### Usage

```typescript
const client = fc({ baseURL: 'http://localhost:3000' });

const result = await client['api/test-client'].$get({ query: {} });

if (result.isValid && result.data) {
  // Success path
  console.log(result.data.status); // 200
  console.log(result.data.body); // User[] — type-safe
} else if (result.isValid && result.failure) {
  // Known error status (e.g., 400)
  if (result.failure.status === 400) {
    console.log(result.failure.body.message);
  }
} else if (result.isValid === false) {
  // Zod validation error
  console.log(result.reason); // ZodError
} else {
  // Network error
  console.log(result.error);
}

// Raw Response is always available for successful HTTP calls
if (result.raw) {
  console.log(result.raw.status, result.raw.headers);
}
```

## $url — URL builder

Build validated URLs without making a request:

```typescript
// $fc() variant — throws on validation error, returns string
const url = $fc({ baseURL: 'http://localhost:3000' })['(group1)/[pid]'].$url.get({
  params: { pid: 'abc' },
  query: { requiredNum: 1, ... },
});
// => "http://localhost:3000/abc?requiredNum=1&..."

// fc() variant — returns result object
const url = fc({ baseURL: 'http://localhost:3000' })['(group1)/[pid]'].$url.get({
  params: { pid: 'abc' },
  query: { requiredNum: 1, ... },
});
if (url.isValid) {
  console.log(url.data); // "http://localhost:3000/abc?requiredNum=1&..."
} else {
  console.log(url.reason); // ZodError
}
```

## $build — Integration with SWR / TanStack Query

`$build()` returns a `[key, fetcher]` tuple designed for data fetching libraries. Pass `null` to disable the query.

### With SWR

```typescript
import useSWR from 'swr';
import { $fc } from './frourio.client';

const apiClient = $fc({ baseURL: 'http://localhost:3000' });

function UserProfile({ userId }: { userId: string | null }) {
  // $build returns [key, fetcher] or [null, fetcher] when disabled
  const buildArgs = apiClient['api/users/[userId]'].$build(
    userId ? { params: { userId } } : null
  );

  // Spread directly into useSWR
  const { data, error, isLoading } = useSWR(...buildArgs);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Welcome, {data.name}!</div>;
}
```

### SWR with global fetcher

```typescript
import useSWR, { SWRConfig } from 'swr';
import { $fc } from './frourio.client';

const apiClient = $fc({ baseURL: 'http://localhost:3000' });

function App() {
  return (
    // Set the client's $get as the global fetcher
    <SWRConfig value={{ fetcher: apiClient.$get }}>
      <UserProfile userId="user-1" />
    </SWRConfig>
  );
}

function UserProfile({ userId }: { userId: string | null }) {
  // Only use the key
  const [key] = apiClient['api/users/[userId]'].$build(
    userId ? { params: { userId } } : null
  );

  const { data, error, isLoading } = useSWR(key);
  // ...
}
```

### With TanStack Query

```typescript
import { useQuery, QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { $fc } from './frourio.client';

const apiClient = $fc({ baseURL: 'http://localhost:3000' });

function UserProfile({ userId }: { userId: string | null }) {
  const [queryKey, queryFn] = apiClient['api/users/[userId]'].$build(
    userId ? { params: { userId } } : null
  );

  const { data, error, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn,
    enabled: !!queryKey,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Welcome, {data.name}!</div>;
}
```

## fc() vs $fc() with $build

Both `fc()` and `$fc()` provide `$build()`, but the return types differ:

|                 | `$fc().$build()`                      | `fc().$build()`                                              |
| --------------- | ------------------------------------- | ------------------------------------------------------------ |
| Key `lowLevel`  | `false`                               | `true`                                                       |
| Fetcher returns | Response body directly (e.g., `User`) | Full result object (e.g., `{ data: { status, body }, raw }`) |
| On error        | Fetcher throws                        | Fetcher returns error result                                 |

Keys from `$fc()` and `fc()` are deliberately different (`lowLevel: false` vs `true`) to avoid SWR/TanStack Query cache collisions between the two client types.

## Recommended client setup

Create a shared client instance:

```typescript
// lib/apiClient.ts
import { $fc, fc } from '@/app/frourio.client';

// High-level client for simple use cases
export const apiClient = $fc({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  init: { credentials: 'include' },
});

// Low-level client when you need full control
export const rawClient = fc({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  init: { credentials: 'include' },
});
```

## Notes

- The client file `frourio.client.ts` is auto-generated. Do not edit manually
- Both client variants perform **runtime Zod validation** on responses
- `init` from the client option and per-request `init` are merged (per-request takes precedence)
- Headers from both are merged: `{ ...option.init.headers, ...req.init.headers }`
- Route group directories like `(group1)` are included in endpoint keys
