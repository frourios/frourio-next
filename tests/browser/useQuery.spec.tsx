import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { $fc, fc } from '../../projects/basic/app/frourio.client';

const mockData = { bb: 'test-bb' };

const apiClient = $fc({ baseURL: 'http://localhost' });
const lowLevelApiClient = fc({ baseURL: 'http://localhost' });

const handlers = [
  http.get('http://localhost/', ({ request }) => {
    const url = new URL(request.url);
    const aa = url.searchParams.get('aa');

    if (aa === 'test-aa-error') {
      return new HttpResponse(null, { status: 500 });
    }
    if (aa) {
      return HttpResponse.json(mockData);
    }
    return new HttpResponse('Missing query parameter: aa', { status: 400 });
  }),
  http.get('http://localhost/api/key-collision-test', ({ request }) => {
    const url = new URL(request.url);
    const common = url.searchParams.get('common');
    if (common) {
      return HttpResponse.json({ data: `key-collision-test: ${common}` });
    }
    return new HttpResponse('Missing query parameter: common', { status: 400 });
  }),
  http.get('http://localhost/api/key-collision-test-another', ({ request }) => {
    const url = new URL(request.url);
    const common = url.searchParams.get('common');
    if (common) {
      return HttpResponse.json({ data: `key-collision-test-another: ${common}` });
    }
    return new HttpResponse('Missing query parameter: common', { status: 400 });
  }),
];

const server = setupServer(...handlers);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useQuery with $fc.$build', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => server.close());

  test('should fetch data using $fc.$build arguments', async () => {
    const query = { aa: 'test-aa' };
    const [queryKey, queryFn] = apiClient.$build({ headers: {}, query });
    const wrapper = createWrapper();

    const { result } = renderHook(() => useQuery({ queryKey: [queryKey], queryFn }), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  test('should not fetch data when build args are null', async () => {
    const [queryKey, queryFn] = apiClient.$build(null);
    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useQuery({ queryKey: [queryKey], queryFn, enabled: !!queryKey }),
      { wrapper },
    );

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.status).toBe('pending');
  });

  test('should handle fetch error', async () => {
    const query = { aa: 'test-aa-error' };
    const [queryKey, queryFn] = apiClient.$build({ headers: {}, query });
    const wrapper = createWrapper();

    const { result } = renderHook(() => useQuery({ queryKey: [queryKey], queryFn }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe('useQuery with apiClient.$build (fc.$build)', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => server.close());

  test('should fetch data using apiClient.$build arguments', async () => {
    const query = { aa: 'test-aa-apiClient' };
    const [queryKey, queryFn] = apiClient.$build({ headers: {}, query });
    const wrapper = createWrapper();

    const { result } = renderHook(() => useQuery({ queryKey: [queryKey], queryFn }), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  test('should not fetch data when build args are null', async () => {
    const [queryKey, queryFn] = apiClient.$build(null);
    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useQuery({ queryKey: [queryKey], queryFn, enabled: !!queryKey }),
      { wrapper },
    );

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.status).toBe('pending');
  });
});

describe('useQuery with $fc.$build key collision', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => server.close());

  test('should generate the same queryKey for different endpoints with same query', () => {
    const commonQuery = { common: 'value1' };

    const [queryKeyTest] = apiClient['api/key-collision-test'].$build({ query: commonQuery });
    const [queryKeyAnother] = apiClient['api/key-collision-test-another'].$build({
      query: commonQuery,
    });

    expect(queryKeyTest).not.toEqual(queryKeyAnother);
    expect(queryKeyTest?.query).toEqual(commonQuery);
    expect(queryKeyAnother?.query).toEqual(commonQuery);
  });

  test('should fetch data correctly but cause cache collision due to same queryKey', async () => {
    const commonQuery = { common: 'value2' };
    const wrapper = createWrapper();

    const [queryKeyTest, queryFnTest] = apiClient['api/key-collision-test'].$build({
      query: commonQuery,
    });
    const [queryKeyAnother, queryFnAnother] = apiClient['api/key-collision-test-another'].$build({
      query: commonQuery,
    });

    const { result: resultTest } = renderHook(
      () => useQuery({ queryKey: [queryKeyTest], queryFn: queryFnTest }),
      { wrapper },
    );
    const { result: resultAnother } = renderHook(
      () => useQuery({ queryKey: [queryKeyAnother], queryFn: queryFnAnother }),
      { wrapper },
    );

    await waitFor(() => {
      expect(resultTest.current.isLoading).toBe(false);
      expect(resultAnother.current.isLoading).toBe(false);
    });

    expect(resultTest.current.data).toEqual({ data: 'key-collision-test: value2' });
    expect(resultAnother.current.data).toEqual({ data: 'key-collision-test-another: value2' });
  });
});

describe('useQuery with apiClient vs lowLevelApiClient', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => server.close());

  test('should fetch different data for the same endpoint with different clients', async () => {
    const commonQuery = { common: 'value3' };
    const wrapper = createWrapper();

    const [queryKeyApiClient, queryFnApiClient] = apiClient['api/key-collision-test'].$build({
      query: commonQuery,
    });

    const [queryKeyLowLevel, queryFnLowLevel] = lowLevelApiClient['api/key-collision-test'].$build({
      query: commonQuery,
    });

    const { result: resultApiClient } = renderHook(
      () => useQuery({ queryKey: [queryKeyApiClient], queryFn: queryFnApiClient }),
      { wrapper },
    );
    const { result: resultLowLevel } = renderHook(
      () => useQuery({ queryKey: [queryKeyLowLevel], queryFn: queryFnLowLevel }),
      { wrapper },
    );

    await waitFor(() => {
      expect(resultApiClient.current.isSuccess).toBe(true);
      expect(resultLowLevel.current.isSuccess).toBe(true);
    });

    expect(resultApiClient.current.data).toEqual({ data: 'key-collision-test: value3' });
    expect(resultLowLevel.current.data?.data?.body).toEqual({ data: 'key-collision-test: value3' });

    expect(resultApiClient.current.data).not.toBe(resultLowLevel.current.data);
    expect(queryKeyApiClient).not.toEqual(queryKeyLowLevel);
  });
});
