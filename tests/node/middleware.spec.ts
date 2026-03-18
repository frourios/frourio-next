import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';
import { describe, expect, test, vi } from 'vitest';
import * as adminMwRoute from '../../projects/basic/app/api/mw/admin/route';
import * as usersMwRoute from '../../projects/basic/app/api/mw/admin/users/route';
import * as publicRoute from '../../projects/basic/app/api/mw/public/route';
import * as rootMwRoute from '../../projects/basic/app/api/mw/route';

vi.spyOn(console, 'log').mockImplementation(() => {});

const baseUrl = 'http://localhost:3000';

describe('Root Middleware (/api/mw)', () => {
  test('GET /api/mw - No headers', async () => {
    const req = new Request(`${baseUrl}/api/mw`);
    const res = await rootMwRoute.GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.userId).toBeUndefined();
    expect(body.traceId).toBeDefined();
  });

  test('GET /api/mw - User Authorization header', async () => {
    const userId = 'user-123';
    const traceId = randomUUID();
    const req = new NextRequest(`${baseUrl}/api/mw`, {
      headers: { Authorization: `Bearer ${userId}`, 'X-Trace-Id': traceId },
    });
    const res = await rootMwRoute.GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.userId).toBe(userId);
    expect(body.traceId).toBe(traceId);
  });

  test('GET /api/mw - Admin Authorization header', async () => {
    const userId = 'user-admin';
    const traceId = randomUUID();
    const req = new Request(`${baseUrl}/api/mw`, {
      headers: { Authorization: `Bearer ${userId}`, 'X-Trace-Id': traceId },
    });
    const res = await rootMwRoute.GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.userId).toBe(userId);
    expect(body.traceId).toBe(traceId);
  });
});

describe('Nested Middleware (/api/mw/admin)', () => {
  const adminUserId = 'user-admin';
  const normalUserId = 'user-regular';
  const traceId = randomUUID();

  test('GET /api/mw/admin - Admin User', async () => {
    const req = new NextRequest(`${baseUrl}/api/mw/admin`, {
      headers: { Authorization: `Bearer ${adminUserId}`, 'X-Trace-Id': traceId },
    });
    const res = await adminMwRoute.GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.userId).toBe(adminUserId);
    expect(body.traceId).toBe(traceId);
    expect(body.isAdmin).toBe(true);
    expect(body.permissions).toEqual(['read', 'write', 'delete']);
  });

  test('POST /api/mw/admin - Admin User', async () => {
    const postData = { data: 'admin data' };
    const req = new Request(`${baseUrl}/api/mw/admin`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminUserId}`,
        'X-Trace-Id': traceId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    const res = await adminMwRoute.POST(req);

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.received).toBe(postData.data);
    expect(body.context.userId).toBe(adminUserId);
    expect(body.context.isAdmin).toBe(true);
  });

  test('GET /api/mw/admin - Normal User', async () => {
    const req = new Request(`${baseUrl}/api/mw/admin`, {
      headers: { Authorization: `Bearer ${normalUserId}`, 'X-Trace-Id': traceId },
    });
    const res = await adminMwRoute.GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.userId).toBe(normalUserId);
    expect(body.traceId).toBe(traceId);
    expect(body.isAdmin).toBe(false);
    expect(body.permissions).toEqual(['read']);
  });

  test('POST /api/mw/admin - Normal User (Forbidden)', async () => {
    const postData = { data: 'user data' };
    const req = new Request(`${baseUrl}/api/mw/admin`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${normalUserId}`,
        'X-Trace-Id': traceId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    const res = await adminMwRoute.POST(req);

    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toEqual({ message: 'Forbidden: Admin access required' });
  });

  test('POST /api/mw/admin - No Auth (Forbidden)', async () => {
    const postData = { data: 'no auth data' };
    const req = new Request(`${baseUrl}/api/mw/admin`, {
      method: 'POST',
      headers: { 'X-Trace-Id': traceId, 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    const res = await adminMwRoute.POST(req);

    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toEqual({ message: 'Forbidden: Admin access required' });
  });
});

describe('Middleware Inheritance (/api/mw/admin/users)', () => {
  const adminUserId = 'user-admin';
  const normalUserId = 'user-regular';
  const traceId = randomUUID();

  test('GET /api/mw/admin/users - Admin User', async () => {
    const req = new Request(`${baseUrl}/api/mw/admin/users?role=admin`, {
      headers: { Authorization: `Bearer ${adminUserId}`, 'X-Trace-Id': traceId },
    });
    const res = await usersMwRoute.GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.context.userId).toBe(adminUserId);
    expect(body.context.traceId).toBe(traceId);
    expect(body.context.isAdmin).toBe(true);
    expect(body.context.permissions).toEqual(['read', 'write', 'delete']);
    expect(body.users).toEqual(['admin1']);
  });

  test('GET /api/mw/admin/users - Normal User (Forbidden by parent middleware)', async () => {
    const req = new Request(`${baseUrl}/api/mw/admin/users`, {
      headers: { Authorization: `Bearer ${normalUserId}`, 'X-Trace-Id': traceId },
    });
    const res = await usersMwRoute.GET(req);

    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toEqual({ message: 'Forbidden: Admin access required' });
  });

  test('GET /api/mw/admin/users - No Auth (Forbidden by parent middleware)', async () => {
    const req = new Request(`${baseUrl}/api/mw/admin/users`, {
      headers: { 'X-Trace-Id': traceId },
    });
    const res = await usersMwRoute.GET(req);

    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toEqual({ message: 'Forbidden: Admin access required' });
  });
});

describe('No Middleware (/api/mw/public)', () => {
  test('GET /api/mw/public - No headers', async () => {
    const req = new Request(`${baseUrl}/api/mw/public`);
    const res = await publicRoute.GET(req);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ message: 'This is a public endpoint.' });
  });

  test('GET /api/mw/public - With Authorization header (should be ignored)', async () => {
    const req = new Request(`${baseUrl}/api/mw/public`, {
      headers: { Authorization: 'Bearer some-token' },
    });
    const res = await publicRoute.GET(req);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ message: 'This is a public endpoint.' });
  });
});
