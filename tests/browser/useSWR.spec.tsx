import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import useSWR, { SWRConfig } from 'swr';
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
  http.get('http://localhost/api/test-client', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    if (q === 'common') {
      return HttpResponse.json({ data: 'test-client-root' });
    }
    return new HttpResponse('Missing query parameter: q', { status: 400 });
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

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
);

describe('useSWR with $fc.$build', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('should fetch data using $fc.$build arguments', async () => {
    const query = { aa: 'test-aa' };
    const buildArgs = apiClient.$build({ headers: {}, query });
    const { result } = renderHook(() => useSWR(...buildArgs), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeUndefined();
  });

  test('should not fetch data when build args are null', async () => {
    const buildArgs = apiClient.$build(null);
    const { result } = renderHook(() => useSWR(...buildArgs), { wrapper });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isValidating).toBe(false);
  });

  test('should handle fetch error', async () => {
    const query = { aa: 'test-aa-error' };
    const buildArgs = apiClient.$build({ headers: {}, query });
    const { result } = renderHook(() => useSWR(...buildArgs), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
  });

  test('should fetch data using global fetcher from SWRConfig', async () => {
    const query = { aa: 'test-aa-global' };
    const [key] = apiClient.$build({ headers: {}, query });
    const globalWrapper = ({ children }: { children: React.ReactNode }) => (
      <SWRConfig value={{ provider: () => new Map(), fetcher: apiClient.$get }}>
        {children}
      </SWRConfig>
    );

    const { result } = renderHook(() => useSWR(key), { wrapper: globalWrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeUndefined();
  });
});

describe('useSWR with apiClient.$build (fc.$build)', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('should fetch data using apiClient.$build arguments', async () => {
    const query = { aa: 'test-aa-apiClient' };
    const buildArgs = apiClient.$build({ headers: {}, query });
    const { result } = renderHook(() => useSWR(...buildArgs), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeUndefined();
  });

  test('should not fetch data when build args are null', async () => {
    const buildArgs = apiClient.$build(null);
    const { result } = renderHook(() => useSWR(...buildArgs), { wrapper });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isValidating).toBe(false);
  });

  test('should handle fetch error with apiClient', async () => {
    const query = { aa: 'test-aa-error' };
    const buildArgs = apiClient.$build({ headers: {}, query });
    const { result } = renderHook(() => useSWR(...buildArgs), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
  });

  test('should fetch data using global fetcher with apiClient', async () => {
    const query = { aa: 'test-aa-apiClient-global' };
    const [key] = apiClient.$build({ headers: {}, query });

    const globalWrapper = ({ children }: { children: React.ReactNode }) => (
      <SWRConfig value={{ provider: () => new Map(), fetcher: apiClient.$get }}>
        {children}
      </SWRConfig>
    );

    const { result } = renderHook(() => useSWR(key), { wrapper: globalWrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeUndefined();
  });
});

describe('useSWR with $fc.$build key collision', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('should generate the same key for different endpoints with same query and headers', () => {
    const commonQuery = { common: 'value1' };

    const buildArgsTest = apiClient['api/key-collision-test'].$build({
      query: commonQuery,
    });
    const buildArgsAnother = apiClient['api/key-collision-test-another'].$build({
      query: commonQuery,
    });

    expect(buildArgsTest[0]).not.toEqual(buildArgsAnother[0]);
    expect(buildArgsTest[0]?.query).toEqual(commonQuery);
    expect(buildArgsAnother[0]?.query).toEqual(commonQuery);
  });

  test('should fetch data correctly', async () => {
    const commonQuery = { common: 'value2' };

    const buildArgsTest = apiClient['api/key-collision-test'].$build({
      query: commonQuery,
    });
    const buildArgsAnother = apiClient['api/key-collision-test-another'].$build({
      query: commonQuery,
    });

    const { result } = renderHook(
      () => {
        const resultTest = useSWR(...buildArgsTest);
        const resultAnother = useSWR(...buildArgsAnother);

        return { resultTest, resultAnother };
      },
      { wrapper },
    );

    await waitFor(() => expect(result.current.resultAnother.isLoading).toBe(false));

    expect(result.current.resultTest.data).toEqual({ data: 'key-collision-test: value2' });
    expect(result.current.resultAnother.data).toEqual({
      data: 'key-collision-test-another: value2',
    });
  });

  describe('useSWR with apiClient vs lowLevelApiClient', () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test('should fetch different data for the same endpoint with different clients', async () => {
      const commonQuery = { common: 'value3' };

      const buildArgsApiClient = apiClient['api/key-collision-test'].$build({
        query: commonQuery,
      });

      const buildArgsLowLevel = lowLevelApiClient['api/key-collision-test'].$build({
        query: commonQuery,
      });

      const { result } = renderHook(
        () => {
          const resultApiClient = useSWR(...buildArgsApiClient);
          const resultLowLevel = useSWR(...buildArgsLowLevel);

          return { resultApiClient, resultLowLevel };
        },
        { wrapper },
      );

      await waitFor(() => expect(result.current.resultLowLevel.isLoading).toBe(false));

      expect(result.current.resultApiClient.data).toEqual({ data: 'key-collision-test: value3' });
      expect(result.current.resultLowLevel.data?.data?.body).toEqual({
        data: 'key-collision-test: value3',
      });

      expect(result.current.resultApiClient.data).not.toBe(result.current.resultLowLevel.data);
      expect(buildArgsApiClient[0]).not.toEqual(buildArgsLowLevel[0]);
    });
  });
});
