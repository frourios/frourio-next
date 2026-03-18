import { http, HttpResponse, passthrough } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import type { z } from 'zod';
import { ZodError } from 'zod';
import * as cookieRoot from '../../projects/basic/app/api/test-client/cookie/route';
import type {
  frourioSpec as testClientSpec,
  User,
} from '../../projects/basic/app/api/test-client/frourio';
import { $fc as base$Fc, fc as baseFc } from '../../projects/basic/app/frourio.client';

const usersDb = new Map<number, User>([
  [1, { id: 1, name: 'Alice', isAdmin: true }],
  [2, { id: 2, name: 'Bob', isAdmin: false }],
]);

const handlers = [
  http.get('http://localhost/api/test-client', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const limit = url.searchParams.get('limit');

    if (search === 'error') {
      return HttpResponse.json({ message: 'Invalid search query' }, { status: 400 });
    }
    if (search === 'invalid-response') {
      return HttpResponse.json([{ id: 'not-a-number', name: 'Alice' }]);
    }

    const users: User[] = [
      { id: 1, name: 'Alice', isAdmin: true },
      { id: 2, name: 'Bob' },
    ];

    const filteredUsers = search
      ? users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
      : users;

    const limitedUsers = limit ? filteredUsers.slice(0, parseInt(limit, 10)) : filteredUsers;

    return HttpResponse.json(limitedUsers);
  }),

  http.post('http://localhost/api/test-client', async ({ request }) => {
    try {
      const body = (await request.json()) as Record<string, unknown>;

      if (typeof body !== 'object' || body === null || typeof body.name !== 'string') {
        return HttpResponse.json({ message: 'Invalid request structure' }, { status: 400 });
      }

      if (body.name === '') {
        return HttpResponse.json(
          {
            error: 'Unprocessable Entity',
            issues: [{ path: ['name'], message: 'Name cannot be empty' }],
          },
          { status: 422 },
        );
      }
      if (body.name === 'error') {
        return HttpResponse.json(
          { message: 'Cannot create user with name error' },
          { status: 400 },
        );
      }

      const newUser: User = {
        id: Math.floor(Math.random() * 1000) + 3,
        name: body.name,
        isAdmin: (body.isAdmin as boolean | undefined) ?? false,
      };
      return HttpResponse.json(newUser, { status: 201 });
    } catch (_) {
      return HttpResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
  }),

  http.put('http://localhost/api/test-client/:userId', async ({ request, params }) => {
    const userId = parseInt(params.userId as string, 10);
    if (isNaN(userId)) {
      return HttpResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const existingUser = usersDb.get(userId);
    if (!existingUser) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    try {
      const body = (await request.json()) as Partial<Pick<User, 'name' | 'isAdmin'>>;
      const updatedUser = { ...existingUser, ...body };
      usersDb.set(userId, updatedUser);
      return HttpResponse.json(updatedUser);
    } catch (_) {
      return HttpResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
  }),

  http.delete('http://localhost/api/test-client/:userId', ({ params }) => {
    const userId = parseInt(params.userId as string, 10);
    if (isNaN(userId)) {
      return HttpResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    if (!usersDb.has(userId)) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    usersDb.delete(userId);
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch('http://localhost/api/test-client', async ({ request }) => {
    try {
      const formData = await request.formData();
      const userId = formData.get('userId');
      const avatar = formData.get('avatar');

      if (typeof userId !== 'string' || !userId) {
        return HttpResponse.json({ message: 'Missing userId' }, { status: 400 });
      }

      if (!avatar || typeof avatar === 'string') {
        return HttpResponse.json({ message: 'Missing or invalid avatar file' }, { status: 400 });
      }

      return HttpResponse.json({
        message: `Avatar for user ${userId} uploaded successfully.`,
        fileName: avatar.name,
        size: avatar.size,
      });
    } catch (_) {
      return HttpResponse.json({ message: 'Invalid FormData' }, { status: 400 });
    }
  }),

  http.delete('http://localhost/api/test-client', async ({ request }) => {
    try {
      const text = await request.text();
      const params = new URLSearchParams(text);
      const reason = params.get('reason');
      const confirm = params.get('confirm');

      if (!reason) {
        return HttpResponse.json({ message: 'Missing reason' }, { status: 400 });
      }

      if (confirm !== 'true') {
        return HttpResponse.json({ message: 'Must confirm deletion' }, { status: 400 });
      }

      return HttpResponse.json({ message: `Deleted with reason: ${reason}` });
    } catch (_) {
      return HttpResponse.json({ message: 'Invalid request' }, { status: 400 });
    }
  }),

  http.get('http://localhost/api/test-client/cookie', ({ request }) => {
    request.headers.set('cookie', document.cookie);

    return cookieRoot.GET(request);
  }),

  http.post('http://localhost/api/test-client/cookie', ({ request }) => {
    return cookieRoot.POST(request);
  }),

  http.post('http://localhost/api/test-client/stream', async ({ request }) => {
    try {
      const body = (await request.json()) as { prompt?: string };
      if (!body.prompt) {
        return new Response('Prompt is required', { status: 400 });
      }

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(`Streaming response for prompt: "${body.prompt}"\n`));
          await new Promise((resolve) => setTimeout(resolve, 50));
          controller.enqueue(encoder.encode('Chunk 1\n'));
          await new Promise((resolve) => setTimeout(resolve, 50));
          controller.enqueue(encoder.encode('Chunk 2\n'));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    } catch (_) {
      return new Response('Invalid JSON body', { status: 400 });
    }
  }),

  http.all('*', ({ request }) => {
    console.warn(`[MSW] Unhandled request: ${request.method} ${request.url}`);
    return passthrough();
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();

  document.cookie.split(';').forEach((cookie) => {
    document.cookie = `${cookie.split('=')[0]!.trim()}=; Max-Age=0; path=/`;
  });
});
afterAll(() => server.close());

const baseURL = 'http://localhost';

const apiClient = base$Fc({ baseURL });

const lowLevelApiClient = baseFc({ baseURL, init: { credentials: 'include' } });

describe('$fc (High-Level Client)', () => {
  test('GET /api/test-client - Success', async () => {
    const users = await apiClient['api/test-client'].$get({ query: {} });
    expect(users).toHaveLength(2);
    expect(users[0]).toEqual({ id: 1, name: 'Alice', isAdmin: true });
    expect(users[1]).toEqual({ id: 2, name: 'Bob' });
  });
  test('GET /api/test-client - Success with query parameters', async () => {
    const users = await apiClient['api/test-client'].$get({ query: { search: 'ali', limit: 1 } });
    expect(users).toHaveLength(1);
    expect(users[0]).toEqual({ id: 1, name: 'Alice', isAdmin: true });
  });
  test('GET /api/test-client - API Error (400)', async () => {
    await expect(
      apiClient['api/test-client'].$get({ query: { search: 'error' } }),
    ).rejects.toThrowError(/HTTP Error: 400/);
  });
  test('GET /api/test-client - Response Validation Error', async () => {
    await expect(
      apiClient['api/test-client'].$get({ query: { search: 'invalid-response' } }),
    ).rejects.toThrowError(ZodError);
  });

  test('POST /api/test-client - Success', async () => {
    const newUser = await apiClient['api/test-client'].$post({ body: { name: 'Charlie' } });
    expect(newUser.id).toBeGreaterThan(2);
    expect(newUser.name).toBe('Charlie');
    expect(newUser.isAdmin).toBe(false);
  });
  test('POST /api/test-client - Success with optional field', async () => {
    const newUser = await apiClient['api/test-client'].$post({
      body: { name: 'David', isAdmin: true },
    });
    expect(newUser.id).toBeGreaterThan(2);
    expect(newUser.name).toBe('David');
    expect(newUser.isAdmin).toBe(true);
  });
  test('POST /api/test-client - API Error (400)', async () => {
    await expect(
      apiClient['api/test-client'].$post({ body: { name: 'error' } }),
    ).rejects.toThrowError(/HTTP Error: 400/);
  });
  test('POST /api/test-client - Validation Error (422)', async () => {
    await expect(apiClient['api/test-client'].$post({ body: { name: '' } })).rejects.toThrowError(
      /HTTP Error: 422/,
    );
  });
});

describe('fc (Low-Level Client)', () => {
  test('should use custom fetch function when provided', async () => {
    let customFetchCalled = false;
    const customFetch: typeof fetch = async (input, init) => {
      customFetchCalled = true;
      const headers = new Headers(init?.headers);
      headers.set('X-Custom-Fetch', 'true');
      return fetch(input, { ...init, headers });
    };

    server.use(
      http.get('http://localhost/api/test-client', ({ request }) => {
        if (request.headers.get('X-Custom-Fetch') === 'true') {
          return HttpResponse.json([{ id: 99, name: 'CustomFetchUser' }]);
        }

        return passthrough();
      }),
    );

    const clientWithCustomFetch = baseFc({ baseURL, fetch: customFetch });
    const result = await clientWithCustomFetch['api/test-client'].$get({ query: {} });

    expect(customFetchCalled).toBe(true);
    expect(result.ok).toBe(true);
    expect(result.isValid).toBe(true);
    expect(result.data?.status).toBe(200);
    expect(result.data?.body).toEqual([{ id: 99, name: 'CustomFetchUser' }]);
  });

  test('GET /api/test-client - Success', async () => {
    const result = await lowLevelApiClient['api/test-client'].$get({ query: {} });
    expect(result.ok).toBe(true);
    expect(result.isValid).toBe(true);
    expect(result.data!.status).toBe(200);
    expect(Array.isArray(result.data!.body)).toBe(true);
    const body = result.data!.body;
    expect(body).toHaveLength(2);
    expect(body[0]).toEqual({ id: 1, name: 'Alice', isAdmin: true });
    expect(body[1]).toEqual({ id: 2, name: 'Bob' });
    expect(result.failure).toBeUndefined();
    expect(result.reason).toBeUndefined();
    expect(result.raw).toBeInstanceOf(Response);
  });
  test('GET /api/test-client - Success with query parameters', async () => {
    const result = await lowLevelApiClient['api/test-client'].$get({
      query: { search: 'ali', limit: 1 },
    });
    expect(result.ok).toBe(true);
    expect(result.isValid).toBe(true);
    expect(result.data!.status).toBe(200);
    expect(Array.isArray(result.data!.body)).toBe(true);
    const body = result.data!.body;
    expect(body).toHaveLength(1);
    expect(body[0]).toEqual({ id: 1, name: 'Alice', isAdmin: true });
    expect(result.failure).toBeUndefined();
    expect(result.reason).toBeUndefined();
    expect(result.raw).toBeInstanceOf(Response);
  });
  test('GET /api/test-client - API Error (400)', async () => {
    const result = await lowLevelApiClient['api/test-client'].$get({
      query: { search: 'error' },
    });
    expect(result.ok).toBe(false);
    expect(result.isValid).toBe(true);
    expect(result.failure!.status).toBe(400);

    if (result.failure?.status === 400) {
      expect(result.failure.body).toEqual({ message: 'Invalid search query' });
    } else {
      throw new Error('Expected failure status 400');
    }

    expect(result.data).toBeUndefined();
    expect(result.reason).toBeUndefined();
    expect(result.raw).toBeInstanceOf(Response);
    expect(result.raw!.status).toBe(400);
  });
  test('GET /api/test-client - Response Validation Error', async () => {
    const result = await lowLevelApiClient['api/test-client'].$get({
      query: { search: 'invalid-response' },
    });
    expect(result.ok).toBe(true);
    expect(result.isValid).toBe(false);
    expect(result.reason!).toBeInstanceOf(ZodError);
    expect(result.data).toBeUndefined();
    expect(result.failure).toBeUndefined();
    expect(result.raw).toBeInstanceOf(Response);
  });

  test('POST /api/test-client - Success', async () => {
    const result = await lowLevelApiClient['api/test-client'].$post({
      body: { name: 'Charlie' },
    });
    expect(result.ok).toBe(true);
    expect(result.isValid).toBe(true);
    expect(result.data!.status).toBe(201);
    expect(result.data!.body.id).toBeGreaterThan(2);
    expect(result.data!.body.name).toBe('Charlie');
    expect(result.data!.body.isAdmin).toBe(false);
    expect(result.failure).toBeUndefined();
    expect(result.reason).toBeUndefined();
    expect(result.raw).toBeInstanceOf(Response);
  });
  test('POST /api/test-client - Success with optional field', async () => {
    const result = await lowLevelApiClient['api/test-client'].$post({
      body: { name: 'David', isAdmin: true },
    });
    expect(result.ok).toBe(true);
    expect(result.isValid).toBe(true);
    expect(result.data!.status).toBe(201);
    expect(result.data!.body.id).toBeGreaterThan(2);
    expect(result.data!.body.name).toBe('David');
    expect(result.data!.body.isAdmin).toBe(true);
    expect(result.failure).toBeUndefined();
    expect(result.reason).toBeUndefined();
    expect(result.raw).toBeInstanceOf(Response);
  });
  test('POST /api/test-client - API Error (400)', async () => {
    const result = await lowLevelApiClient['api/test-client'].$post({ body: { name: 'error' } });
    expect(result.ok).toBe(false);
    expect(result.isValid).toBe(true);
    expect(result.failure!.status).toBe(400);
    if (result.failure?.status === 400) {
      expect(result.failure.body).toEqual({ message: 'Cannot create user with name error' });
    } else {
      throw new Error('Expected failure status 400');
    }
    expect(result.data).toBeUndefined();
    expect(result.reason).toBeUndefined();
    expect(result.raw).toBeInstanceOf(Response);
    expect(result.raw!.status).toBe(400);
  });
  test('POST /api/test-client - Validation Error (422)', async () => {
    const result = await lowLevelApiClient['api/test-client'].$post({ body: { name: '' } });
    expect(result.ok).toBe(false);
    expect(result.isValid).toBe(true);
    expect(result.failure!.status).toBe(422);
    if (result.failure?.status === 422) {
      expect(result.failure.body.error).toBe('Unprocessable Entity');
      expect(result.failure.body.issues).toBeDefined();
    } else {
      throw new Error('Expected failure status 422');
    }
    expect(result.data).toBeUndefined();
    expect(result.reason).toBeUndefined();
    expect(result.raw).toBeInstanceOf(Response);
    expect(result.raw!.status).toBe(422);
  });
  test('POST /api/test-client - Request Body Validation Error', async () => {
    const result = await lowLevelApiClient['api/test-client'].$post({
      body: { invalid: true } as unknown as z.infer<typeof testClientSpec.post.body>,
    });
    expect(result.ok).toBeUndefined();
    expect(result.isValid).toBe(false);
    expect(result.reason!).toBeInstanceOf(ZodError);
    expect(result.reason!.issues[0].path).toEqual(['name']);
    expect(result.data).toBeUndefined();
    expect(result.failure).toBeUndefined();
    expect(result.raw).toBeUndefined();
  });

  test('PUT /api/test-client/:userId - Success', async () => {
    const result = await lowLevelApiClient['api/test-client/[userId]'].$put({
      params: { userId: 1 },
      body: { isAdmin: false },
    });
    expect(result.ok).toBe(true);
    expect(result.isValid).toBe(true);
    expect(result.data!.status).toBe(200);
    expect(result.data!.body.id).toBe(1);
    expect(result.data!.body.name).toBe('Alice');
    expect(result.data!.body.isAdmin).toBe(false);
    expect(result.raw).toBeInstanceOf(Response);
  });
  test('PUT /api/test-client/:userId - Not Found (404)', async () => {
    const result = await lowLevelApiClient['api/test-client/[userId]'].$put({
      params: { userId: 3 },
      body: { name: 'Nobody' },
    });
    expect(result.ok).toBe(false);
    expect(result.isValid).toBe(true);
    expect(result.failure!.status).toBe(404);
    expect(result.failure!.body).toEqual({ message: 'User not found' });
    expect(result.raw).toBeInstanceOf(Response);
    expect(result.raw!.status).toBe(404);
  });

  test('DELETE /api/test-client/:userId - Success (204)', async () => {
    const result = await lowLevelApiClient['api/test-client/[userId]'].$delete({
      params: { userId: 1 },
    });
    expect(result.ok).toBe(true);
    expect(result.isValid).toBe(true);
    expect(result.data!.status).toBe(204);
    expect(result.data!.body).toBeUndefined();
    expect(result.raw).toBeInstanceOf(Response);
    expect(result.raw!.status).toBe(204);
  });
  test('DELETE /api/test-client/:userId - Not Found (404)', async () => {
    const result = await lowLevelApiClient['api/test-client/[userId]'].$delete({
      params: { userId: 3 },
    });
    expect(result.ok).toBe(false);
    expect(result.isValid).toBe(true);
    expect(result.failure!.status).toBe(404);
    expect(result.failure!.body).toEqual({ message: 'User not found' });
    expect(result.raw).toBeInstanceOf(Response);
    expect(result.raw!.status).toBe(404);
  });

  test('PATCH /api/test-client - Success', async () => {
    const blob = new Blob(['more content'], { type: 'image/jpeg' });

    const result = await lowLevelApiClient['api/test-client'].$patch({
      body: { userId: 'user-789', avatar: new File([blob], 'photo.jpg') },
    });
    expect(result.ok).toBe(true);
    expect(result.isValid).toBe(true);
    expect(result.data!.status).toBe(200);
    expect(result.data!.body.message).toContain('user-789');
    expect(result.data!.body.fileName).toBe('photo.jpg');
    expect(result.data!.body.size).toBe(blob.size);
  });
  test('PATCH /api/test-client - Missing file', async () => {
    const result = await lowLevelApiClient['api/test-client'].$patch({
      body: { userId: 'user-789' } as z.infer<typeof testClientSpec.patch.body>,
    });
    expect(result.ok).toBeUndefined();
    expect(result.isValid).toBe(false);
    expect(result.reason).toBeInstanceOf(ZodError);
  });
  test('PATCH /api/test-client - Request Body Validation Error', async () => {
    const result = await lowLevelApiClient['api/test-client'].$patch({
      body: {} as unknown as z.infer<typeof testClientSpec.patch.body>,
    });
    expect(result.ok).toBeUndefined();
    expect(result.isValid).toBe(false);
    expect(result.reason!).toBeInstanceOf(ZodError);
    expect(['userId', 'avatar']).toContain(result.reason!.issues[0].path[0]);
    expect(result.raw).toBeUndefined();
  });

  test('DELETE /api/test-client - urlencoded Success', async () => {
    const result = await lowLevelApiClient['api/test-client'].$delete({
      body: { reason: 'cleanup', confirm: true },
    });
    expect(result.ok).toBe(true);
    expect(result.isValid).toBe(true);
    expect(result.data!.status).toBe(200);
    expect(result.data!.body.message).toContain('cleanup');
  });

  test('DELETE /api/test-client - urlencoded Error', async () => {
    const result = await lowLevelApiClient['api/test-client'].$delete({
      body: { reason: 'test', confirm: false },
    });
    expect(result.ok).toBe(false);
    expect(result.isValid).toBe(true);
    expect(result.failure!.status).toBe(400);
  });

  test('DELETE /api/test-client - urlencoded Validation Error', async () => {
    const result = await lowLevelApiClient['api/test-client'].$delete({
      body: {} as z.infer<typeof testClientSpec.delete.body>,
    });
    expect(result.ok).toBeUndefined();
    expect(result.isValid).toBe(false);
    expect(result.reason!).toBeInstanceOf(ZodError);
  });

  test('POST /api/test-client/cookie', async () => {
    const res1 = await lowLevelApiClient['api/test-client/cookie'].$get();

    expect(res1.data?.body.val).toBeUndefined();

    const testVal = 'abc';
    const res2 = await lowLevelApiClient['api/test-client/cookie'].$post({
      body: { val: testVal },
    });
    const cookieText = res2.raw?.headers.get('Set-Cookie') ?? '';

    expect(cookieText).toBe(`val=${testVal}; Path=/`);

    document.cookie = cookieText;

    const res3 = await lowLevelApiClient['api/test-client/cookie'].$get({
      init: { headers: { cookie: cookieText } },
    });

    expect(res3.data?.body.val).toBe(testVal);
  });

  test('POST /api/test-client/stream - Success', async () => {
    const result = await lowLevelApiClient['api/test-client/stream'].$post({
      body: { prompt: 'Test' },
    });
    expect(result.ok).toBe(true);
    expect(result.isValid).toBe(true);
    expect(result.data).toBeInstanceOf(Response);
    expect(result.data!.status).toBe(200);
    expect(result.data!.headers.get('content-type')).toContain('text/plain');
    expect(result.failure).toBeUndefined();
    expect(result.reason).toBeUndefined();
    expect(result.raw).toBeInstanceOf(Response);

    const reader = result.data!.body!.getReader();
    let streamedContent = '';
    let chunk;

    while (!(chunk = await reader.read()).done) {
      streamedContent += new TextDecoder().decode(chunk.value);
    }

    expect(streamedContent).toContain('Streaming response for prompt: "Test"');
  });
  test('POST /api/test-client/stream - API Error (400)', async () => {
    const result = await lowLevelApiClient['api/test-client/stream'].$post({
      body: { prompt: '' },
    });
    expect(result.ok).toBe(false);
    expect(result.isValid).toBe(true);
    expect(result.data).toBeUndefined();
    expect(result.failure).toBeInstanceOf(Response);
    expect(result.failure!.status).toBe(400);
    await expect(result.failure!.text()).resolves.toBe('Prompt is required');
    expect(result.reason).toBeUndefined();
    expect(result.error).toBeUndefined();
    expect(result.raw).toBeInstanceOf(Response);
  });
});
