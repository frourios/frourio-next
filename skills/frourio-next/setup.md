# setup

Skill to integrate frourio-next into an existing Next.js project.

## Usage

```
/setup
```

## Steps

### 1. Install packages

```bash
npm install @frourio/next zod
```

### 2. Configure package.json scripts

```json
{
  "scripts": {
    "dev": "run-p dev:*",
    "dev:next": "next dev",
    "dev:frourio": "frourio-next --watch",
    "build": "frourio-next && next build"
  }
}
```

If using `run-p`, `npm-run-all` is required:

```bash
npm install -D npm-run-all2
```

### 3. If OpenAPI generation is needed (optional)

```bash
npm install -D openapi-types
```

```json
{
  "scripts": {
    "dev:openapi": "frourio-next-openapi --output=./public/openapi.json --watch"
  }
}
```

### 4. If MSW test handler generation is needed (optional)

```bash
npm install -D msw
```

Create `frourio-next.config.ts` at the project root:

```typescript
export default {
  msw: {
    output: './tests/setupMswHandlers.ts',
  },
};
```

Or in `package.json`:

```json
{
  "scripts": {
    "dev:msw": "frourio-next-msw --output=./tests/setupMswHandlers.ts --watch"
  }
}
```

### 5. Create the first endpoint

Create a `frourio.ts` file inside the App Router `app/` directory.
See the `/add-endpoint` skill for details.

```
app/api/hello/frourio.ts   ← Define API spec
```

### 6. Run code generation

```bash
npx frourio-next
```

The following files are auto-generated:

- `app/api/hello/frourio.server.ts`
- `app/api/hello/frourio.client.ts`

### 7. Implement route.ts

```typescript
import { createRoute } from './frourio.server';

export const { GET } = createRoute({
  get: async () => {
    return { status: 200, body: { message: 'Hello!' } };
  },
});
```

### 8. Use the client from the frontend

```typescript
import { fc } from './app/api/hello/frourio.client';

const client = fc({ baseURL: 'http://localhost:3000' });
const result = await client.$get();

if (result.status === 200) {
  console.log(result.body.message); // Type-safe
}
```

#### Client options

```typescript
fc({
  baseURL: 'http://localhost:3000', // API base URL
  init: { credentials: 'include' }, // Default fetch options
  fetch: customFetch, // Custom fetch implementation
});
```

#### Two client variants

- `fc()` — Safe client: Does not throw on errors, branch by status
- `$fc()` — Throwing client: Throws on non-2xx responses

### 9. Start the dev server

```bash
npm run dev
```

`frourio-next --watch` watches for file changes and automatically regenerates whenever `frourio.ts` is modified.

## CLI commands

| Command                              | Description                    |
| ------------------------------------ | ------------------------------ |
| `frourio-next`                       | Generate server/client code    |
| `frourio-next --watch`               | Generate in watch mode         |
| `frourio-next-openapi --output=PATH` | Generate OpenAPI 3.1 spec      |
| `frourio-next-openapi --watch`       | Generate OpenAPI in watch mode |
| `frourio-next-msw --output=PATH`     | Generate MSW handlers          |

## Example directory structure

```
app/
├── api/
│   ├── users/
│   │   ├── frourio.ts              ← API spec definition (written by developer)
│   │   ├── frourio.server.ts       ← Auto-generated (do not edit)
│   │   ├── frourio.client.ts       ← Auto-generated (do not edit)
│   │   ├── route.ts                ← Handler implementation (written by developer)
│   │   └── [userId]/
│   │       ├── frourio.ts
│   │       ├── frourio.server.ts
│   │       ├── frourio.client.ts
│   │       ├── frourio.params.ts   ← Auto-generated (when path params exist)
│   │       └── route.ts
│   └── auth/
│       ├── frourio.ts              ← Has middleware definition
│       ├── frourio.server.ts
│       ├── frourio.client.ts
│       ├── frourio.middleware.ts   ← Auto-generated (when middleware exists)
│       └── route.middleware.ts     ← Middleware implementation (written by developer)
```

## Add to .gitignore

Auto-generated files should be gitignored:

```gitignore
# frourio-next generated files
**/frourio.server.ts
**/frourio.client.ts
**/frourio.middleware.ts
**/frourio.params.ts
```

## Notes

- Next.js App Router (`app/` directory) is required
- TypeScript + Zod are required
- `src/app/` structure is also supported (auto-detected)
- `basePath` is automatically reflected if configured
