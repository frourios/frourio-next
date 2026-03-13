import type { FrourioClientOption } from '@frourio/next';
import { z } from 'zod';
import { frourioSpec as frourioSpec_rket09 } from './(group1)/[pid]/frourio';
import { frourioSpec as frourioSpec_1c6qmxu } from './(group1)/[pid]/foo/frourio';
import { frourioSpec as frourioSpec_er79ce } from './(group1)/blog/[...slug]/frourio';
import { frourioSpec as frourioSpec_14jcy50 } from './(group1)/blog/hoge/[[...fuga]]/frourio';
import { frourioSpec as frourioSpec_13e9lnf } from './(group2)/x/[y]/frourio';
import { frourioSpec as frourioSpec_knqmrp } from './[a]/frourio';
import { frourioSpec as frourioSpec_2ijh4e } from './[a]/[b]/[...c]/frourio';
import { frourioSpec as frourioSpec_1yzfjrp } from './[a]/[b]/d/frourio';
import { frourioSpec as frourioSpec_1f8i0zm } from './api/key-collision-test/frourio';
import { frourioSpec as frourioSpec_195l5vw } from './api/key-collision-test-another/frourio';
import { frourioSpec as frourioSpec_sqrir7 } from './api/mw/frourio';
import { frourioSpec as frourioSpec_n3it2j } from './api/mw/admin/frourio';
import { frourioSpec as frourioSpec_gye2fo } from './api/mw/admin/users/frourio';
import { frourioSpec as frourioSpec_76vmqd } from './api/mw/public/frourio';
import { frourioSpec as frourioSpec_17yqnk1 } from './api/test-client/frourio';
import { frourioSpec as frourioSpec_1rqfh40 } from './api/test-client/[userId]/frourio';
import { frourioSpec as frourioSpec_1tp1ur6 } from './api/test-client/stream/frourio';
import { frourioSpec as frourioSpec_fkgw0p } from './xxx/[id]/zzz/frourio';
import { frourioSpec as frourioSpec_8uo3t8 } from './xxx/[id]/frourio';
import { frourioSpec as frourioSpec_ztntfp } from './frourio'

export const fc = (option?: FrourioClientOption) => ({
  '(group1)/[pid]': {
    $url: $url_rket09(option),
    $build(req: Parameters<ReturnType<typeof methods_rket09>['$get']>[0] | null): [
      key: { lowLevel: true; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_rket09>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<NonNullable<Awaited<ReturnType<ReturnType<typeof methods_rket09>['$get']>>>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: true, baseURL: option?.baseURL, dir: '/(group1)/[pid]', ...rest }, () => methods_rket09(option).$get(req)];
    },
    ...methods_rket09(option),
  },
  '(group1)/[pid]/foo': {
    $url: $url_1c6qmxu(option),
    $build(req: Parameters<ReturnType<typeof methods_1c6qmxu>['$get']>[0] | null): [
      key: { lowLevel: true; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_1c6qmxu>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<NonNullable<Awaited<ReturnType<ReturnType<typeof methods_1c6qmxu>['$get']>>>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: true, baseURL: option?.baseURL, dir: '/(group1)/[pid]/foo', ...rest }, () => methods_1c6qmxu(option).$get(req)];
    },
    ...methods_1c6qmxu(option),
  },
  '(group1)/blog/[...slug]': {
    $url: $url_er79ce(option),
    $build(req: Parameters<ReturnType<typeof methods_er79ce>['$get']>[0] | null): [
      key: { lowLevel: true; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_er79ce>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<NonNullable<Awaited<ReturnType<ReturnType<typeof methods_er79ce>['$get']>>>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: true, baseURL: option?.baseURL, dir: '/(group1)/blog/[...slug]', ...rest }, () => methods_er79ce(option).$get(req)];
    },
    ...methods_er79ce(option),
  },
  '(group1)/blog/hoge/[[...fuga]]': {
    $url: $url_14jcy50(option),
    $build(req: Parameters<ReturnType<typeof methods_14jcy50>['$get']>[0] | null): [
      key: { lowLevel: true; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_14jcy50>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<NonNullable<Awaited<ReturnType<ReturnType<typeof methods_14jcy50>['$get']>>>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: true, baseURL: option?.baseURL, dir: '/(group1)/blog/hoge/[[...fuga]]', ...rest }, () => methods_14jcy50(option).$get(req)];
    },
    ...methods_14jcy50(option),
  },
  '(group2)/x/[y]': {
    $url: $url_13e9lnf(option),
    $build(req: Parameters<ReturnType<typeof methods_13e9lnf>['$get']>[0] | null): [
      key: { lowLevel: true; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_13e9lnf>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<NonNullable<Awaited<ReturnType<ReturnType<typeof methods_13e9lnf>['$get']>>>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: true, baseURL: option?.baseURL, dir: '/(group2)/x/[y]', ...rest }, () => methods_13e9lnf(option).$get(req)];
    },
    ...methods_13e9lnf(option),
  },
  '[a]': {
    $url: $url_knqmrp(option),
    $build(req: Parameters<ReturnType<typeof methods_knqmrp>['$get']>[0] | null): [
      key: { lowLevel: true; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_knqmrp>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<NonNullable<Awaited<ReturnType<ReturnType<typeof methods_knqmrp>['$get']>>>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: true, baseURL: option?.baseURL, dir: '/[a]', ...rest }, () => methods_knqmrp(option).$get(req)];
    },
    ...methods_knqmrp(option),
  },
  '[a]/[b]/[...c]': {
    $url: $url_2ijh4e(option),
    ...methods_2ijh4e(option),
  },
  '[a]/[b]/d': {
    $url: $url_1yzfjrp(option),
    $build(req: Parameters<ReturnType<typeof methods_1yzfjrp>['$get']>[0] | null): [
      key: { lowLevel: true; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_1yzfjrp>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<NonNullable<Awaited<ReturnType<ReturnType<typeof methods_1yzfjrp>['$get']>>>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: true, baseURL: option?.baseURL, dir: '/[a]/[b]/d', ...rest }, () => methods_1yzfjrp(option).$get(req)];
    },
    ...methods_1yzfjrp(option),
  },
  'api/key-collision-test': {
    $url: $url_1f8i0zm(option),
    $build(req: Parameters<ReturnType<typeof methods_1f8i0zm>['$get']>[0] | null): [
      key: { lowLevel: true; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_1f8i0zm>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<NonNullable<Awaited<ReturnType<ReturnType<typeof methods_1f8i0zm>['$get']>>>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: true, baseURL: option?.baseURL, dir: '/api/key-collision-test', ...rest }, () => methods_1f8i0zm(option).$get(req)];
    },
    ...methods_1f8i0zm(option),
  },
  'api/key-collision-test-another': {
    $url: $url_195l5vw(option),
    $build(req: Parameters<ReturnType<typeof methods_195l5vw>['$get']>[0] | null): [
      key: { lowLevel: true; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_195l5vw>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<NonNullable<Awaited<ReturnType<ReturnType<typeof methods_195l5vw>['$get']>>>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: true, baseURL: option?.baseURL, dir: '/api/key-collision-test-another', ...rest }, () => methods_195l5vw(option).$get(req)];
    },
    ...methods_195l5vw(option),
  },
  'api/mw': {
    $url: $url_sqrir7(option),
    $build(req?: { init?: RequestInit }): [
      key: { lowLevel: true; baseURL: FrourioClientOption['baseURL']; dir: string },
      fetcher: () => Promise<NonNullable<Awaited<ReturnType<ReturnType<typeof methods_sqrir7>['$get']>>>>,
    ] {
      return [{ lowLevel: true, baseURL: option?.baseURL, dir: '/api/mw' }, () => methods_sqrir7(option).$get(req)];
    },
    ...methods_sqrir7(option),
  },
  'api/mw/admin': {
    $url: $url_n3it2j(option),
    $build(req?: { init?: RequestInit }): [
      key: { lowLevel: true; baseURL: FrourioClientOption['baseURL']; dir: string },
      fetcher: () => Promise<NonNullable<Awaited<ReturnType<ReturnType<typeof methods_n3it2j>['$get']>>>>,
    ] {
      return [{ lowLevel: true, baseURL: option?.baseURL, dir: '/api/mw/admin' }, () => methods_n3it2j(option).$get(req)];
    },
    ...methods_n3it2j(option),
  },
  'api/mw/admin/users': {
    $url: $url_gye2fo(option),
    $build(req?: Parameters<ReturnType<typeof methods_gye2fo>['$get']>[0] | null): [
      key: { lowLevel: true; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_gye2fo>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<NonNullable<Awaited<ReturnType<ReturnType<typeof methods_gye2fo>['$get']>>>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req ?? {};

      return [{ lowLevel: true, baseURL: option?.baseURL, dir: '/api/mw/admin/users', ...rest }, () => methods_gye2fo(option).$get(req)];
    },
    ...methods_gye2fo(option),
  },
  'api/mw/public': {
    $url: $url_76vmqd(option),
    $build(req?: { init?: RequestInit }): [
      key: { lowLevel: true; baseURL: FrourioClientOption['baseURL']; dir: string },
      fetcher: () => Promise<NonNullable<Awaited<ReturnType<ReturnType<typeof methods_76vmqd>['$get']>>>>,
    ] {
      return [{ lowLevel: true, baseURL: option?.baseURL, dir: '/api/mw/public' }, () => methods_76vmqd(option).$get(req)];
    },
    ...methods_76vmqd(option),
  },
  'api/test-client': {
    $url: $url_17yqnk1(option),
    $build(req: Parameters<ReturnType<typeof methods_17yqnk1>['$get']>[0] | null): [
      key: { lowLevel: true; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_17yqnk1>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<NonNullable<Awaited<ReturnType<ReturnType<typeof methods_17yqnk1>['$get']>>>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: true, baseURL: option?.baseURL, dir: '/api/test-client', ...rest }, () => methods_17yqnk1(option).$get(req)];
    },
    ...methods_17yqnk1(option),
  },
  'api/test-client/[userId]': {
    $url: $url_1rqfh40(option),
    ...methods_1rqfh40(option),
  },
  'api/test-client/stream': {
    $url: $url_1tp1ur6(option),
    ...methods_1tp1ur6(option),
  },
  'xxx/[id]/zzz': {
    $url: $url_fkgw0p(option),
    $build(req: Parameters<ReturnType<typeof methods_fkgw0p>['$get']>[0] | null): [
      key: { lowLevel: true; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_fkgw0p>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<NonNullable<Awaited<ReturnType<ReturnType<typeof methods_fkgw0p>['$get']>>>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: true, baseURL: option?.baseURL, dir: '/xxx/[id]/zzz', ...rest }, () => methods_fkgw0p(option).$get(req)];
    },
    ...methods_fkgw0p(option),
  },
  $url: $url_ztntfp(option),
  $build(req: Parameters<ReturnType<typeof methods_ztntfp>['$get']>[0] | null): [
    key: { lowLevel: true; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_ztntfp>['$get']>[0], 'init'> | null,
    fetcher: () => Promise<NonNullable<Awaited<ReturnType<ReturnType<typeof methods_ztntfp>['$get']>>>>,
  ] {
    if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

    const { init, ...rest } = req;

    return [{ lowLevel: true, baseURL: option?.baseURL, dir: '/', ...rest }, () => methods_ztntfp(option).$get(req)];
  },
  ...methods_ztntfp(option),
});

export const $fc = (option?: FrourioClientOption) => ({
  '(group1)/[pid]': {
    $url: {
      get(req: Parameters<ReturnType<typeof $url_rket09>['get']>[0]): string {
        const result = $url_rket09(option).get(req);

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    $build(req: Parameters<ReturnType<typeof methods_rket09>['$get']>[0] | null): [
      key: { lowLevel: false; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_rket09>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<z.infer<typeof frourioSpec_rket09.get.res[200]['body']>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: false, baseURL: option?.baseURL, dir: '/(group1)/[pid]', ...rest }, () => $fc(option)['(group1)/[pid]'].$get(req)];
    },
    async $get(req: Parameters<ReturnType<typeof methods_rket09>['$get']>[0]): Promise<z.infer<typeof frourioSpec_rket09.get.res[200]['body']>> {
      const result = await methods_rket09(option).$get(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      return result.data.body;
    },
  },
  '(group1)/[pid]/foo': {
    $url: {
      get(req: Parameters<ReturnType<typeof $url_1c6qmxu>['get']>[0]): string {
        const result = $url_1c6qmxu(option).get(req);

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    $build(req: Parameters<ReturnType<typeof methods_1c6qmxu>['$get']>[0] | null): [
      key: { lowLevel: false; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_1c6qmxu>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<z.infer<typeof frourioSpec_1c6qmxu.get.res[200]['body']>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: false, baseURL: option?.baseURL, dir: '/(group1)/[pid]/foo', ...rest }, () => $fc(option)['(group1)/[pid]/foo'].$get(req)];
    },
    async $get(req: Parameters<ReturnType<typeof methods_1c6qmxu>['$get']>[0]): Promise<z.infer<typeof frourioSpec_1c6qmxu.get.res[200]['body']>> {
      const result = await methods_1c6qmxu(option).$get(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      return result.data.body;
    },
  },
  '(group1)/blog/[...slug]': {
    $url: {
      get(req: Parameters<ReturnType<typeof $url_er79ce>['get']>[0]): string {
        const result = $url_er79ce(option).get(req);

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    $build(req: Parameters<ReturnType<typeof methods_er79ce>['$get']>[0] | null): [
      key: { lowLevel: false; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_er79ce>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<z.infer<typeof frourioSpec_er79ce.get.res[200]['body']>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: false, baseURL: option?.baseURL, dir: '/(group1)/blog/[...slug]', ...rest }, () => $fc(option)['(group1)/blog/[...slug]'].$get(req)];
    },
    async $get(req: Parameters<ReturnType<typeof methods_er79ce>['$get']>[0]): Promise<z.infer<typeof frourioSpec_er79ce.get.res[200]['body']>> {
      const result = await methods_er79ce(option).$get(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      return result.data.body;
    },
  },
  '(group1)/blog/hoge/[[...fuga]]': {
    $url: {
      get(req: Parameters<ReturnType<typeof $url_14jcy50>['get']>[0]): string {
        const result = $url_14jcy50(option).get(req);

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    $build(req: Parameters<ReturnType<typeof methods_14jcy50>['$get']>[0] | null): [
      key: { lowLevel: false; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_14jcy50>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<z.infer<typeof frourioSpec_14jcy50.get.res[200]['body']>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: false, baseURL: option?.baseURL, dir: '/(group1)/blog/hoge/[[...fuga]]', ...rest }, () => $fc(option)['(group1)/blog/hoge/[[...fuga]]'].$get(req)];
    },
    async $get(req: Parameters<ReturnType<typeof methods_14jcy50>['$get']>[0]): Promise<z.infer<typeof frourioSpec_14jcy50.get.res[200]['body']>> {
      const result = await methods_14jcy50(option).$get(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      return result.data.body;
    },
  },
  '(group2)/x/[y]': {
    $url: {
      get(req: Parameters<ReturnType<typeof $url_13e9lnf>['get']>[0]): string {
        const result = $url_13e9lnf(option).get(req);

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    $build(req: Parameters<ReturnType<typeof methods_13e9lnf>['$get']>[0] | null): [
      key: { lowLevel: false; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_13e9lnf>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<Response>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: false, baseURL: option?.baseURL, dir: '/(group2)/x/[y]', ...rest }, () => $fc(option)['(group2)/x/[y]'].$get(req)];
    },
    async $get(req: Parameters<ReturnType<typeof methods_13e9lnf>['$get']>[0]): Promise<Response> {
      const result = await methods_13e9lnf(option).$get(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      if (!result.ok) throw new Error(`HTTP Error: ${result.failure.status}`);

      return result.data;
    },
  },
  '[a]': {
    $url: {
      get(req: Parameters<ReturnType<typeof $url_knqmrp>['get']>[0]): string {
        const result = $url_knqmrp(option).get(req);

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    $build(req: Parameters<ReturnType<typeof methods_knqmrp>['$get']>[0] | null): [
      key: { lowLevel: false; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_knqmrp>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<z.infer<typeof frourioSpec_knqmrp.get.res[200]['body']>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: false, baseURL: option?.baseURL, dir: '/[a]', ...rest }, () => $fc(option)['[a]'].$get(req)];
    },
    async $get(req: Parameters<ReturnType<typeof methods_knqmrp>['$get']>[0]): Promise<z.infer<typeof frourioSpec_knqmrp.get.res[200]['body']>> {
      const result = await methods_knqmrp(option).$get(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      return result.data.body;
    },
  },
  '[a]/[b]/[...c]': {
    $url: {
      post(req: Parameters<ReturnType<typeof $url_2ijh4e>['post']>[0]): string {
        const result = $url_2ijh4e(option).post(req);

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    async $post(req: Parameters<ReturnType<typeof methods_2ijh4e>['$post']>[0]): Promise<z.infer<typeof frourioSpec_2ijh4e.post.res[200]['body']>> {
      const result = await methods_2ijh4e(option).$post(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      return result.data.body;
    },
  },
  '[a]/[b]/d': {
    $url: {
      get(req: Parameters<ReturnType<typeof $url_1yzfjrp>['get']>[0]): string {
        const result = $url_1yzfjrp(option).get(req);

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    $build(req: Parameters<ReturnType<typeof methods_1yzfjrp>['$get']>[0] | null): [
      key: { lowLevel: false; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_1yzfjrp>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<z.infer<typeof frourioSpec_1yzfjrp.get.res[200]['body']>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: false, baseURL: option?.baseURL, dir: '/[a]/[b]/d', ...rest }, () => $fc(option)['[a]/[b]/d'].$get(req)];
    },
    async $get(req: Parameters<ReturnType<typeof methods_1yzfjrp>['$get']>[0]): Promise<z.infer<typeof frourioSpec_1yzfjrp.get.res[200]['body']>> {
      const result = await methods_1yzfjrp(option).$get(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      return result.data.body;
    },
  },
  'api/key-collision-test': {
    $url: {
      get(req: Parameters<ReturnType<typeof $url_1f8i0zm>['get']>[0]): string {
        const result = $url_1f8i0zm(option).get(req);

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    $build(req: Parameters<ReturnType<typeof methods_1f8i0zm>['$get']>[0] | null): [
      key: { lowLevel: false; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_1f8i0zm>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<z.infer<typeof frourioSpec_1f8i0zm.get.res[200]['body']>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: false, baseURL: option?.baseURL, dir: '/api/key-collision-test', ...rest }, () => $fc(option)['api/key-collision-test'].$get(req)];
    },
    async $get(req: Parameters<ReturnType<typeof methods_1f8i0zm>['$get']>[0]): Promise<z.infer<typeof frourioSpec_1f8i0zm.get.res[200]['body']>> {
      const result = await methods_1f8i0zm(option).$get(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      return result.data.body;
    },
  },
  'api/key-collision-test-another': {
    $url: {
      get(req: Parameters<ReturnType<typeof $url_195l5vw>['get']>[0]): string {
        const result = $url_195l5vw(option).get(req);

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    $build(req: Parameters<ReturnType<typeof methods_195l5vw>['$get']>[0] | null): [
      key: { lowLevel: false; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_195l5vw>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<z.infer<typeof frourioSpec_195l5vw.get.res[200]['body']>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: false, baseURL: option?.baseURL, dir: '/api/key-collision-test-another', ...rest }, () => $fc(option)['api/key-collision-test-another'].$get(req)];
    },
    async $get(req: Parameters<ReturnType<typeof methods_195l5vw>['$get']>[0]): Promise<z.infer<typeof frourioSpec_195l5vw.get.res[200]['body']>> {
      const result = await methods_195l5vw(option).$get(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      return result.data.body;
    },
  },
  'api/mw': {
    $url: {
      get(): string {
        const result = $url_sqrir7(option).get();

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    $build(req?: { init?: RequestInit }): [
      key: { lowLevel: false; baseURL: FrourioClientOption['baseURL']; dir: string },
      fetcher: () => Promise<z.infer<typeof frourioSpec_sqrir7.get.res[200]['body']>>,
    ] {
      return [{ lowLevel: false, baseURL: option?.baseURL, dir: '/api/mw' }, () => $fc(option)['api/mw'].$get(req)];
    },
    async $get(req?: Parameters<ReturnType<typeof methods_sqrir7>['$get']>[0]): Promise<z.infer<typeof frourioSpec_sqrir7.get.res[200]['body']>> {
      const result = await methods_sqrir7(option).$get(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      return result.data.body;
    },
  },
  'api/mw/admin': {
    $url: {
      get(): string {
        const result = $url_n3it2j(option).get();

        if (!result.isValid) throw result.reason;

        return result.data;
      },
      post(): string {
        const result = $url_n3it2j(option).post();

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    $build(req?: { init?: RequestInit }): [
      key: { lowLevel: false; baseURL: FrourioClientOption['baseURL']; dir: string },
      fetcher: () => Promise<z.infer<typeof frourioSpec_n3it2j.get.res[200]['body']>>,
    ] {
      return [{ lowLevel: false, baseURL: option?.baseURL, dir: '/api/mw/admin' }, () => $fc(option)['api/mw/admin'].$get(req)];
    },
    async $get(req?: Parameters<ReturnType<typeof methods_n3it2j>['$get']>[0]): Promise<z.infer<typeof frourioSpec_n3it2j.get.res[200]['body']>> {
      const result = await methods_n3it2j(option).$get(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      if (!result.ok) throw new Error(`HTTP Error: ${result.failure.status}`);

    return result.data.body;
    },
    async $post(req: Parameters<ReturnType<typeof methods_n3it2j>['$post']>[0]): Promise<z.infer<typeof frourioSpec_n3it2j.post.res[201]['body']>> {
      const result = await methods_n3it2j(option).$post(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      if (!result.ok) throw new Error(`HTTP Error: ${result.failure.status}`);

    return result.data.body;
    },
  },
  'api/mw/admin/users': {
    $url: {
      get(req?: Parameters<ReturnType<typeof $url_gye2fo>['get']>[0]): string {
        const result = $url_gye2fo(option).get(req);

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    $build(req?: Parameters<ReturnType<typeof methods_gye2fo>['$get']>[0] | null): [
      key: { lowLevel: false; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_gye2fo>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<z.infer<typeof frourioSpec_gye2fo.get.res[200]['body']>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req ?? {};

      return [{ lowLevel: false, baseURL: option?.baseURL, dir: '/api/mw/admin/users', ...rest }, () => $fc(option)['api/mw/admin/users'].$get(req)];
    },
    async $get(req: Parameters<ReturnType<typeof methods_gye2fo>['$get']>[0]): Promise<z.infer<typeof frourioSpec_gye2fo.get.res[200]['body']>> {
      const result = await methods_gye2fo(option).$get(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      if (!result.ok) throw new Error(`HTTP Error: ${result.failure.status}`);

    return result.data.body;
    },
  },
  'api/mw/public': {
    $url: {
      get(): string {
        const result = $url_76vmqd(option).get();

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    $build(req?: { init?: RequestInit }): [
      key: { lowLevel: false; baseURL: FrourioClientOption['baseURL']; dir: string },
      fetcher: () => Promise<z.infer<typeof frourioSpec_76vmqd.get.res[200]['body']>>,
    ] {
      return [{ lowLevel: false, baseURL: option?.baseURL, dir: '/api/mw/public' }, () => $fc(option)['api/mw/public'].$get(req)];
    },
    async $get(req?: Parameters<ReturnType<typeof methods_76vmqd>['$get']>[0]): Promise<z.infer<typeof frourioSpec_76vmqd.get.res[200]['body']>> {
      const result = await methods_76vmqd(option).$get(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      return result.data.body;
    },
  },
  'api/test-client': {
    $url: {
      get(req: Parameters<ReturnType<typeof $url_17yqnk1>['get']>[0]): string {
        const result = $url_17yqnk1(option).get(req);

        if (!result.isValid) throw result.reason;

        return result.data;
      },
      post(): string {
        const result = $url_17yqnk1(option).post();

        if (!result.isValid) throw result.reason;

        return result.data;
      },
      patch(): string {
        const result = $url_17yqnk1(option).patch();

        if (!result.isValid) throw result.reason;

        return result.data;
      },
      delete(): string {
        const result = $url_17yqnk1(option).delete();

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    $build(req: Parameters<ReturnType<typeof methods_17yqnk1>['$get']>[0] | null): [
      key: { lowLevel: false; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_17yqnk1>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<z.infer<typeof frourioSpec_17yqnk1.get.res[200]['body']>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: false, baseURL: option?.baseURL, dir: '/api/test-client', ...rest }, () => $fc(option)['api/test-client'].$get(req)];
    },
    async $get(req: Parameters<ReturnType<typeof methods_17yqnk1>['$get']>[0]): Promise<z.infer<typeof frourioSpec_17yqnk1.get.res[200]['body']>> {
      const result = await methods_17yqnk1(option).$get(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      if (!result.ok) throw new Error(`HTTP Error: ${result.failure.status}`);

    return result.data.body;
    },
    async $post(req: Parameters<ReturnType<typeof methods_17yqnk1>['$post']>[0]): Promise<z.infer<typeof frourioSpec_17yqnk1.post.res[201]['body']>> {
      const result = await methods_17yqnk1(option).$post(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      if (!result.ok) throw new Error(`HTTP Error: ${result.failure.status}`);

    return result.data.body;
    },
    async $patch(req: Parameters<ReturnType<typeof methods_17yqnk1>['$patch']>[0]): Promise<z.infer<typeof frourioSpec_17yqnk1.patch.res[200]['body']>> {
      const result = await methods_17yqnk1(option).$patch(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      if (!result.ok) throw new Error(`HTTP Error: ${result.failure.status}`);

    return result.data.body;
    },
    async $delete(req: Parameters<ReturnType<typeof methods_17yqnk1>['$delete']>[0]): Promise<z.infer<typeof frourioSpec_17yqnk1.delete.res[200]['body']>> {
      const result = await methods_17yqnk1(option).$delete(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      if (!result.ok) throw new Error(`HTTP Error: ${result.failure.status}`);

    return result.data.body;
    },
  },
  'api/test-client/[userId]': {
    $url: {
      put(req: Parameters<ReturnType<typeof $url_1rqfh40>['put']>[0]): string {
        const result = $url_1rqfh40(option).put(req);

        if (!result.isValid) throw result.reason;

        return result.data;
      },
      delete(req: Parameters<ReturnType<typeof $url_1rqfh40>['delete']>[0]): string {
        const result = $url_1rqfh40(option).delete(req);

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    async $put(req: Parameters<ReturnType<typeof methods_1rqfh40>['$put']>[0]): Promise<z.infer<typeof frourioSpec_1rqfh40.put.res[200]['body']>> {
      const result = await methods_1rqfh40(option).$put(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      if (!result.ok) throw new Error(`HTTP Error: ${result.failure.status}`);

    return result.data.body;
    },
    async $delete(req: Parameters<ReturnType<typeof methods_1rqfh40>['$delete']>[0]): Promise<void> {
      const result = await methods_1rqfh40(option).$delete(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      if (!result.ok) throw new Error(`HTTP Error: ${result.failure.status}`);

    return result.data.body;
    },
  },
  'api/test-client/stream': {
    $url: {
      post(): string {
        const result = $url_1tp1ur6(option).post();

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    async $post(req: Parameters<ReturnType<typeof methods_1tp1ur6>['$post']>[0]): Promise<Response> {
      const result = await methods_1tp1ur6(option).$post(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      if (!result.ok) throw new Error(`HTTP Error: ${result.failure.status}`);

      return result.data;
    },
  },
  'xxx/[id]/zzz': {
    $url: {
      get(req: Parameters<ReturnType<typeof $url_fkgw0p>['get']>[0]): string {
        const result = $url_fkgw0p(option).get(req);

        if (!result.isValid) throw result.reason;

        return result.data;
      },
    },
    $build(req: Parameters<ReturnType<typeof methods_fkgw0p>['$get']>[0] | null): [
      key: { lowLevel: false; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_fkgw0p>['$get']>[0], 'init'> | null,
      fetcher: () => Promise<z.infer<typeof frourioSpec_fkgw0p.get.res[200]['body']>>,
    ] {
      if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

      const { init, ...rest } = req;

      return [{ lowLevel: false, baseURL: option?.baseURL, dir: '/xxx/[id]/zzz', ...rest }, () => $fc(option)['xxx/[id]/zzz'].$get(req)];
    },
    async $get(req: Parameters<ReturnType<typeof methods_fkgw0p>['$get']>[0]): Promise<z.infer<typeof frourioSpec_fkgw0p.get.res[200]['body']>> {
      const result = await methods_fkgw0p(option).$get(req);

      if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

      return result.data.body;
    },
  },
  $url: {
    get(req: Parameters<ReturnType<typeof $url_ztntfp>['get']>[0]): string {
      const result = $url_ztntfp(option).get(req);

      if (!result.isValid) throw result.reason;

      return result.data;
    },
    post(): string {
      const result = $url_ztntfp(option).post();

      if (!result.isValid) throw result.reason;

      return result.data;
    },
  },
  $build(req: Parameters<ReturnType<typeof methods_ztntfp>['$get']>[0] | null): [
    key: { lowLevel: false; baseURL: FrourioClientOption['baseURL']; dir: string } & Omit<Parameters<ReturnType<typeof methods_ztntfp>['$get']>[0], 'init'> | null,
    fetcher: () => Promise<z.infer<typeof frourioSpec_ztntfp.get.res[200]['body']>>,
  ] {
    if (req === null) return [null, () => Promise.reject(new Error('Fetcher is disabled.'))];

    const { init, ...rest } = req;

    return [{ lowLevel: false, baseURL: option?.baseURL, dir: '/', ...rest }, () => $fc(option).$get(req)];
  },
  async $get(req: Parameters<ReturnType<typeof methods_ztntfp>['$get']>[0]): Promise<z.infer<typeof frourioSpec_ztntfp.get.res[200]['body']>> {
    const result = await methods_ztntfp(option).$get(req);

    if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

    if (!result.ok) throw new Error(`HTTP Error: ${result.failure.status}`);

    return result.data.body;
  },
  async $post(req: Parameters<ReturnType<typeof methods_ztntfp>['$post']>[0]): Promise<z.infer<typeof frourioSpec_ztntfp.post.res[201]['body']>> {
    const result = await methods_ztntfp(option).$post(req);

    if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

    return result.data.body;
  },
});

export const fc_ztntfp = fc;

export const $fc_ztntfp = $fc;

const paramsSchema_rket09 = z.object({ 'pid': z.string() });

const paramsSchema_1c6qmxu = z.object({ 'pid': z.string() });

const paramsSchema_er79ce = z.object({ 'slug': frourioSpec_er79ce.param });

const paramsSchema_14jcy50 = z.object({ 'fuga': frourioSpec_14jcy50.param });

const paramsSchema_13e9lnf = z.object({ 'y': z.string() });

const paramsSchema_knqmrp = z.object({ 'a': frourioSpec_knqmrp.param });

const paramsSchema_2ijh4e = z.object({ 'a': frourioSpec_knqmrp.param, 'b': z.string(), 'c': z.tuple([z.string()]).rest(z.string()) });

const paramsSchema_1yzfjrp = z.object({ 'a': frourioSpec_knqmrp.param, 'b': z.string() });

const paramsSchema_1rqfh40 = z.object({ 'userId': frourioSpec_1rqfh40.param });

const paramsSchema_fkgw0p = z.object({ 'id': frourioSpec_8uo3t8.param });

const $url_ztntfp = (option?: FrourioClientOption) => ({
  get(req: { query: z.infer<typeof frourioSpec_ztntfp.get.query> }): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    const parsedQuery = frourioSpec_ztntfp.get.query.safeParse(req.query);

    if (!parsedQuery.success) return { isValid: false, reason: parsedQuery.error };

    const searchParams = new URLSearchParams();

    Object.entries(parsedQuery.data).forEach(([key, value]) => {
      if (value === undefined) return;

      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    });

    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/?${searchParams.toString()}` };
  },
  post(): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/` };
  },
});

const $url_rket09 = (option?: FrourioClientOption) => ({
  get(req: { params: z.infer<typeof paramsSchema_rket09>,query: z.infer<typeof frourioSpec_rket09.get.query> }): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    const parsedParams = paramsSchema_rket09.safeParse(req.params);

    if (!parsedParams.success) return { isValid: false, reason: parsedParams.error };

    const parsedQuery = frourioSpec_rket09.get.query.safeParse(req.query);

    if (!parsedQuery.success) return { isValid: false, reason: parsedQuery.error };

    const searchParams = new URLSearchParams();

    Object.entries(parsedQuery.data).forEach(([key, value]) => {
      if (value === undefined) return;

      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    });

    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/${parsedParams.data.pid}?${searchParams.toString()}` };
  },
});

const $url_1c6qmxu = (option?: FrourioClientOption) => ({
  get(req: { params: z.infer<typeof paramsSchema_1c6qmxu> }): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    const parsedParams = paramsSchema_1c6qmxu.safeParse(req.params);

    if (!parsedParams.success) return { isValid: false, reason: parsedParams.error };

    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/${parsedParams.data.pid}/foo` };
  },
});

const $url_er79ce = (option?: FrourioClientOption) => ({
  get(req: { params: z.infer<typeof paramsSchema_er79ce> }): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    const parsedParams = paramsSchema_er79ce.safeParse(req.params);

    if (!parsedParams.success) return { isValid: false, reason: parsedParams.error };

    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/blog/${parsedParams.data.slug.join('/')}` };
  },
});

const $url_14jcy50 = (option?: FrourioClientOption) => ({
  get(req: { params: z.infer<typeof paramsSchema_14jcy50> }): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    const parsedParams = paramsSchema_14jcy50.safeParse(req.params);

    if (!parsedParams.success) return { isValid: false, reason: parsedParams.error };

    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/blog/hoge${parsedParams.data.fuga !== undefined && parsedParams.data.fuga.length > 0 ? `/${parsedParams.data.fuga.join('/')}` : ''}` };
  },
});

const $url_13e9lnf = (option?: FrourioClientOption) => ({
  get(req: { params: z.infer<typeof paramsSchema_13e9lnf>,query: z.infer<typeof frourioSpec_13e9lnf.get.query> }): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    const parsedParams = paramsSchema_13e9lnf.safeParse(req.params);

    if (!parsedParams.success) return { isValid: false, reason: parsedParams.error };

    const parsedQuery = frourioSpec_13e9lnf.get.query.safeParse(req.query);

    if (!parsedQuery.success) return { isValid: false, reason: parsedQuery.error };

    const searchParams = new URLSearchParams();

    Object.entries(parsedQuery.data).forEach(([key, value]) => {
      if (value === undefined) return;

      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    });

    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/x/${parsedParams.data.y}?${searchParams.toString()}` };
  },
});

const $url_knqmrp = (option?: FrourioClientOption) => ({
  get(req: { params: z.infer<typeof paramsSchema_knqmrp> }): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    const parsedParams = paramsSchema_knqmrp.safeParse(req.params);

    if (!parsedParams.success) return { isValid: false, reason: parsedParams.error };

    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/${parsedParams.data.a}` };
  },
});

const $url_2ijh4e = (option?: FrourioClientOption) => ({
  post(req: { params: z.infer<typeof paramsSchema_2ijh4e> }): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    const parsedParams = paramsSchema_2ijh4e.safeParse(req.params);

    if (!parsedParams.success) return { isValid: false, reason: parsedParams.error };

    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/${parsedParams.data.a}/${parsedParams.data.b}/${parsedParams.data.c.join('/')}` };
  },
});

const $url_1yzfjrp = (option?: FrourioClientOption) => ({
  get(req: { params: z.infer<typeof paramsSchema_1yzfjrp> }): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    const parsedParams = paramsSchema_1yzfjrp.safeParse(req.params);

    if (!parsedParams.success) return { isValid: false, reason: parsedParams.error };

    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/${parsedParams.data.a}/${parsedParams.data.b}/d` };
  },
});

const $url_1f8i0zm = (option?: FrourioClientOption) => ({
  get(req: { query: z.infer<typeof frourioSpec_1f8i0zm.get.query> }): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    const parsedQuery = frourioSpec_1f8i0zm.get.query.safeParse(req.query);

    if (!parsedQuery.success) return { isValid: false, reason: parsedQuery.error };

    const searchParams = new URLSearchParams();

    Object.entries(parsedQuery.data).forEach(([key, value]) => {
      if (value === undefined) return;

      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    });

    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/api/key-collision-test?${searchParams.toString()}` };
  },
});

const $url_195l5vw = (option?: FrourioClientOption) => ({
  get(req: { query: z.infer<typeof frourioSpec_195l5vw.get.query> }): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    const parsedQuery = frourioSpec_195l5vw.get.query.safeParse(req.query);

    if (!parsedQuery.success) return { isValid: false, reason: parsedQuery.error };

    const searchParams = new URLSearchParams();

    Object.entries(parsedQuery.data).forEach(([key, value]) => {
      if (value === undefined) return;

      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    });

    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/api/key-collision-test-another?${searchParams.toString()}` };
  },
});

const $url_sqrir7 = (option?: FrourioClientOption) => ({
  get(): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/api/mw` };
  },
});

const $url_n3it2j = (option?: FrourioClientOption) => ({
  get(): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/api/mw/admin` };
  },
  post(): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/api/mw/admin` };
  },
});

const $url_gye2fo = (option?: FrourioClientOption) => ({
  get(req?: { query?: z.infer<typeof frourioSpec_gye2fo.get.query> }): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    const parsedQuery = frourioSpec_gye2fo.get.query.safeParse(req?.query);

    if (!parsedQuery.success) return { isValid: false, reason: parsedQuery.error };

    let searchParams: URLSearchParams | undefined = undefined;

    if (parsedQuery.data !== undefined) {
      const sp = new URLSearchParams();

      Object.entries(parsedQuery.data).forEach(([key, value]) => {
        if (value === undefined) return;

        if (Array.isArray(value)) {
          value.forEach(item => sp.append(key, item.toString()));
        } else {
          sp.append(key, value.toString());
        }
      });

      searchParams = sp;
    }

    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/api/mw/admin/users${searchParams ? `?${searchParams.toString()}`: ''}` };
  },
});

const $url_76vmqd = (option?: FrourioClientOption) => ({
  get(): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/api/mw/public` };
  },
});

const $url_17yqnk1 = (option?: FrourioClientOption) => ({
  get(req: { query: z.infer<typeof frourioSpec_17yqnk1.get.query> }): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    const parsedQuery = frourioSpec_17yqnk1.get.query.safeParse(req.query);

    if (!parsedQuery.success) return { isValid: false, reason: parsedQuery.error };

    const searchParams = new URLSearchParams();

    Object.entries(parsedQuery.data).forEach(([key, value]) => {
      if (value === undefined) return;

      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    });

    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/api/test-client?${searchParams.toString()}` };
  },
  post(): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/api/test-client` };
  },
  patch(): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/api/test-client` };
  },
  delete(): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/api/test-client` };
  },
});

const $url_1rqfh40 = (option?: FrourioClientOption) => ({
  put(req: { params: z.infer<typeof paramsSchema_1rqfh40> }): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    const parsedParams = paramsSchema_1rqfh40.safeParse(req.params);

    if (!parsedParams.success) return { isValid: false, reason: parsedParams.error };

    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/api/test-client/${parsedParams.data.userId}` };
  },
  delete(req: { params: z.infer<typeof paramsSchema_1rqfh40> }): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    const parsedParams = paramsSchema_1rqfh40.safeParse(req.params);

    if (!parsedParams.success) return { isValid: false, reason: parsedParams.error };

    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/api/test-client/${parsedParams.data.userId}` };
  },
});

const $url_1tp1ur6 = (option?: FrourioClientOption) => ({
  post(): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/api/test-client/stream` };
  },
});

const $url_fkgw0p = (option?: FrourioClientOption) => ({
  get(req: { params: z.infer<typeof paramsSchema_fkgw0p> }): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    const parsedParams = paramsSchema_fkgw0p.safeParse(req.params);

    if (!parsedParams.success) return { isValid: false, reason: parsedParams.error };

    return { isValid: true, data: `${option?.baseURL?.replace(/\/$/, '') ?? ''}/xxx/${parsedParams.data.id}/zzz` };
  },
});

const methods_ztntfp = (option?: FrourioClientOption) => ({
  async $get(req: { headers: z.infer<typeof frourioSpec_ztntfp.get.headers>, query: z.infer<typeof frourioSpec_ztntfp.get.query>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_ztntfp.get.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: false; isValid: true; data?: undefined; failure: { status: 404; headers?: undefined; body?: undefined }; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_ztntfp(option).get(req);

    if (url.reason) return url;

    const parsedHeaders = frourioSpec_ztntfp.get.headers.safeParse(req.headers);

    if (!parsedHeaders.success) return { isValid: false, reason: parsedHeaders.error };

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'GET',
        ...option?.init,
        ...req.init,
        headers: { ...option?.init?.headers, ...parsedHeaders.data as HeadersInit, ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_ztntfp.get.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      case 404: {
        return {
          ok: false,
          isValid: true,
          failure: { status: 404 },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
  async $post(req: { body: z.infer<typeof frourioSpec_ztntfp.post.body>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 201; headers: z.infer<typeof frourioSpec_ztntfp.post.res[201]['headers']>; body: z.infer<typeof frourioSpec_ztntfp.post.res[201]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_ztntfp(option).post();

    if (url.reason) return url;

    const parsedBody = frourioSpec_ztntfp.post.body.safeParse(req.body);

    if (!parsedBody.success) return { isValid: false, reason: parsedBody.error };

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'POST',
        ...option?.init,
        body: JSON.stringify(parsedBody.data),
        ...req.init,
        headers: { ...option?.init?.headers, 'content-type': 'application/json', ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 201: {
        const headers = frourioSpec_ztntfp.post.res[201].headers.safeParse(Object.fromEntries(result.res.headers.entries()));

        if (!headers.success) return { ok: true, isValid: false, raw: result.res, reason: headers.error };

        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_ztntfp.post.res[201].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 201, headers: headers.data, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});

const methods_rket09 = (option?: FrourioClientOption) => ({
  async $get(req: { params: z.infer<typeof paramsSchema_rket09>, query: z.infer<typeof frourioSpec_rket09.get.query>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_rket09.get.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_rket09(option).get(req);

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'GET',
        ...option?.init,
        ...req.init,
        headers: { ...option?.init?.headers, ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_rket09.get.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});

const methods_1c6qmxu = (option?: FrourioClientOption) => ({
  async $get(req: { params: z.infer<typeof paramsSchema_1c6qmxu>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers: z.infer<typeof frourioSpec_1c6qmxu.get.res[200]['headers']>; body: z.infer<typeof frourioSpec_1c6qmxu.get.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_1c6qmxu(option).get(req);

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'GET',
        ...option?.init,
        ...req.init,
        headers: { ...option?.init?.headers, ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const headers = frourioSpec_1c6qmxu.get.res[200].headers.safeParse(Object.fromEntries(result.res.headers.entries()));

        if (!headers.success) return { ok: true, isValid: false, raw: result.res, reason: headers.error };

        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.text().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_1c6qmxu.get.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, headers: headers.data, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});

const methods_er79ce = (option?: FrourioClientOption) => ({
  async $get(req: { params: z.infer<typeof paramsSchema_er79ce>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_er79ce.get.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_er79ce(option).get(req);

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'GET',
        ...option?.init,
        ...req.init,
        headers: { ...option?.init?.headers, ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_er79ce.get.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});

const methods_14jcy50 = (option?: FrourioClientOption) => ({
  async $get(req: { params: z.infer<typeof paramsSchema_14jcy50>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_14jcy50.get.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_14jcy50(option).get(req);

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'GET',
        ...option?.init,
        ...req.init,
        headers: { ...option?.init?.headers, ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.text().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_14jcy50.get.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});

const methods_13e9lnf = (option?: FrourioClientOption) => ({
  async $get(req: { params: z.infer<typeof paramsSchema_13e9lnf>, query: z.infer<typeof frourioSpec_13e9lnf.get.query>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: Response; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: false; isValid: true; data?: undefined; failure: Response; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_13e9lnf(option).get(req);

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'GET',
        ...option?.init,
        ...req.init,
        headers: { ...option?.init?.headers, ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    return result.res.ok ? { ok: true, isValid: true, data: result.res, raw: result.res } : { ok: false, isValid: true, failure: result.res, raw: result.res };
  },
});

const methods_knqmrp = (option?: FrourioClientOption) => ({
  async $get(req: { params: z.infer<typeof paramsSchema_knqmrp>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_knqmrp.get.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_knqmrp(option).get(req);

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'GET',
        ...option?.init,
        ...req.init,
        headers: { ...option?.init?.headers, ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_knqmrp.get.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});

const methods_2ijh4e = (option?: FrourioClientOption) => ({
  async $post(req: { params: z.infer<typeof paramsSchema_2ijh4e>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_2ijh4e.post.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_2ijh4e(option).post(req);

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'POST',
        ...option?.init,
        ...req.init,
        headers: { ...option?.init?.headers, ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_2ijh4e.post.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});

const methods_1yzfjrp = (option?: FrourioClientOption) => ({
  async $get(req: { params: z.infer<typeof paramsSchema_1yzfjrp>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_1yzfjrp.get.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_1yzfjrp(option).get(req);

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'GET',
        ...option?.init,
        ...req.init,
        headers: { ...option?.init?.headers, ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_1yzfjrp.get.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});

const methods_1f8i0zm = (option?: FrourioClientOption) => ({
  async $get(req: { query: z.infer<typeof frourioSpec_1f8i0zm.get.query>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_1f8i0zm.get.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_1f8i0zm(option).get(req);

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'GET',
        ...option?.init,
        ...req.init,
        headers: { ...option?.init?.headers, ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_1f8i0zm.get.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});

const methods_195l5vw = (option?: FrourioClientOption) => ({
  async $get(req: { query: z.infer<typeof frourioSpec_195l5vw.get.query>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_195l5vw.get.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_195l5vw(option).get(req);

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'GET',
        ...option?.init,
        ...req.init,
        headers: { ...option?.init?.headers, ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_195l5vw.get.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});

const methods_sqrir7 = (option?: FrourioClientOption) => ({
  async $get(req?: { init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_sqrir7.get.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_sqrir7(option).get();

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'GET',
        ...option?.init,
        ...req?.init,
        headers: { ...option?.init?.headers, ...req?.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_sqrir7.get.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});

const methods_n3it2j = (option?: FrourioClientOption) => ({
  async $get(req?: { init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_n3it2j.get.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: false; isValid: true; data?: undefined; failure: { status: 403; headers?: undefined; body: z.infer<typeof frourioSpec_n3it2j.get.res[403]['body']> }; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_n3it2j(option).get();

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'GET',
        ...option?.init,
        ...req?.init,
        headers: { ...option?.init?.headers, ...req?.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_n3it2j.get.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      case 403: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: false, raw: result.res, error: resBody.error };

        const body = frourioSpec_n3it2j.get.res[403].body.safeParse(resBody.data);

        if (!body.success) return { ok: false, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: false,
          isValid: true,
          failure: { status: 403, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
  async $post(req: { body: z.infer<typeof frourioSpec_n3it2j.post.body>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 201; headers?: undefined; body: z.infer<typeof frourioSpec_n3it2j.post.res[201]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: false; isValid: true; data?: undefined; failure: { status: 403; headers?: undefined; body: z.infer<typeof frourioSpec_n3it2j.post.res[403]['body']> }; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_n3it2j(option).post();

    if (url.reason) return url;

    const parsedBody = frourioSpec_n3it2j.post.body.safeParse(req.body);

    if (!parsedBody.success) return { isValid: false, reason: parsedBody.error };

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'POST',
        ...option?.init,
        body: JSON.stringify(parsedBody.data),
        ...req.init,
        headers: { ...option?.init?.headers, 'content-type': 'application/json', ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 201: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_n3it2j.post.res[201].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 201, body: body.data },
          raw: result.res,
        };
      }
      case 403: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: false, raw: result.res, error: resBody.error };

        const body = frourioSpec_n3it2j.post.res[403].body.safeParse(resBody.data);

        if (!body.success) return { ok: false, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: false,
          isValid: true,
          failure: { status: 403, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});

const methods_gye2fo = (option?: FrourioClientOption) => ({
  async $get(req?: { query?: z.infer<typeof frourioSpec_gye2fo.get.query>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_gye2fo.get.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: false; isValid: true; data?: undefined; failure: { status: 403; headers?: undefined; body: z.infer<typeof frourioSpec_gye2fo.get.res[403]['body']> }; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_gye2fo(option).get(req);

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'GET',
        ...option?.init,
        ...req?.init,
        headers: { ...option?.init?.headers, ...req?.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_gye2fo.get.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      case 403: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: false, raw: result.res, error: resBody.error };

        const body = frourioSpec_gye2fo.get.res[403].body.safeParse(resBody.data);

        if (!body.success) return { ok: false, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: false,
          isValid: true,
          failure: { status: 403, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});

const methods_76vmqd = (option?: FrourioClientOption) => ({
  async $get(req?: { init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_76vmqd.get.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_76vmqd(option).get();

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'GET',
        ...option?.init,
        ...req?.init,
        headers: { ...option?.init?.headers, ...req?.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_76vmqd.get.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});

const methods_17yqnk1 = (option?: FrourioClientOption) => ({
  async $get(req: { query: z.infer<typeof frourioSpec_17yqnk1.get.query>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_17yqnk1.get.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: false; isValid: true; data?: undefined; failure: { status: 400; headers?: undefined; body: z.infer<typeof frourioSpec_17yqnk1.get.res[400]['body']> }; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_17yqnk1(option).get(req);

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'GET',
        ...option?.init,
        ...req.init,
        headers: { ...option?.init?.headers, ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_17yqnk1.get.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      case 400: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: false, raw: result.res, error: resBody.error };

        const body = frourioSpec_17yqnk1.get.res[400].body.safeParse(resBody.data);

        if (!body.success) return { ok: false, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: false,
          isValid: true,
          failure: { status: 400, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
  async $post(req: { body: z.infer<typeof frourioSpec_17yqnk1.post.body>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 201; headers?: undefined; body: z.infer<typeof frourioSpec_17yqnk1.post.res[201]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: false; isValid: true; data?: undefined; failure: { status: 400; headers?: undefined; body: z.infer<typeof frourioSpec_17yqnk1.post.res[400]['body']> } | { status: 422; headers?: undefined; body: z.infer<typeof frourioSpec_17yqnk1.post.res[422]['body']> }; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_17yqnk1(option).post();

    if (url.reason) return url;

    const parsedBody = frourioSpec_17yqnk1.post.body.safeParse(req.body);

    if (!parsedBody.success) return { isValid: false, reason: parsedBody.error };

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'POST',
        ...option?.init,
        body: JSON.stringify(parsedBody.data),
        ...req.init,
        headers: { ...option?.init?.headers, 'content-type': 'application/json', ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 201: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_17yqnk1.post.res[201].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 201, body: body.data },
          raw: result.res,
        };
      }
      case 400: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: false, raw: result.res, error: resBody.error };

        const body = frourioSpec_17yqnk1.post.res[400].body.safeParse(resBody.data);

        if (!body.success) return { ok: false, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: false,
          isValid: true,
          failure: { status: 400, body: body.data },
          raw: result.res,
        };
      }
      case 422: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: false, raw: result.res, error: resBody.error };

        const body = frourioSpec_17yqnk1.post.res[422].body.safeParse(resBody.data);

        if (!body.success) return { ok: false, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: false,
          isValid: true,
          failure: { status: 422, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
  async $patch(req: { body: z.infer<typeof frourioSpec_17yqnk1.patch.body>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_17yqnk1.patch.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: false; isValid: true; data?: undefined; failure: { status: 400; headers?: undefined; body: z.infer<typeof frourioSpec_17yqnk1.patch.res[400]['body']> }; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_17yqnk1(option).patch();

    if (url.reason) return url;

    const parsedBody = frourioSpec_17yqnk1.patch.body.safeParse(req.body);

    if (!parsedBody.success) return { isValid: false, reason: parsedBody.error };

    const formData = new FormData();

    Object.entries(parsedBody.data).forEach(([key, value]) => {
      if (value === undefined) return;

      if (Array.isArray(value)) {
        value.forEach((item) =>
          item instanceof File
            ? formData.append(key, item, item.name)
            : formData.append(key, item.toString()),
        );
      } else if (value instanceof File) {
        formData.set(key, value, value.name);
      } else {
        formData.set(key, value.toString());
      }
    });

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'PATCH',
        ...option?.init,
        body: formData,
        ...req.init,
        headers: { ...option?.init?.headers, ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_17yqnk1.patch.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      case 400: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: false, raw: result.res, error: resBody.error };

        const body = frourioSpec_17yqnk1.patch.res[400].body.safeParse(resBody.data);

        if (!body.success) return { ok: false, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: false,
          isValid: true,
          failure: { status: 400, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
  async $delete(req: { body: z.infer<typeof frourioSpec_17yqnk1.delete.body>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_17yqnk1.delete.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: false; isValid: true; data?: undefined; failure: { status: 400; headers?: undefined; body: z.infer<typeof frourioSpec_17yqnk1.delete.res[400]['body']> }; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_17yqnk1(option).delete();

    if (url.reason) return url;

    const parsedBody = frourioSpec_17yqnk1.delete.body.safeParse(req.body);

    if (!parsedBody.success) return { isValid: false, reason: parsedBody.error };

    const urlSearchParams = new URLSearchParams();

    Object.entries(parsedBody.data).forEach(([key, value]) => {
      if (value === undefined) return;

      if (Array.isArray(value)) {
        value.forEach((item) => urlSearchParams.append(key, item.toString()));
      } else {
        urlSearchParams.set(key, value.toString());
      }
    });

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'DELETE',
        ...option?.init,
        body: urlSearchParams.toString(),
        ...req.init,
        headers: { ...option?.init?.headers, 'content-type': 'application/x-www-form-urlencoded', ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_17yqnk1.delete.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      case 400: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: false, raw: result.res, error: resBody.error };

        const body = frourioSpec_17yqnk1.delete.res[400].body.safeParse(resBody.data);

        if (!body.success) return { ok: false, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: false,
          isValid: true,
          failure: { status: 400, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});

const methods_1rqfh40 = (option?: FrourioClientOption) => ({
  async $put(req: { params: z.infer<typeof paramsSchema_1rqfh40>, body: z.infer<typeof frourioSpec_1rqfh40.put.body>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_1rqfh40.put.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: false; isValid: true; data?: undefined; failure: { status: 404; headers?: undefined; body: z.infer<typeof frourioSpec_1rqfh40.put.res[404]['body']> }; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_1rqfh40(option).put(req);

    if (url.reason) return url;

    const parsedBody = frourioSpec_1rqfh40.put.body.safeParse(req.body);

    if (!parsedBody.success) return { isValid: false, reason: parsedBody.error };

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'PUT',
        ...option?.init,
        body: JSON.stringify(parsedBody.data),
        ...req.init,
        headers: { ...option?.init?.headers, 'content-type': 'application/json', ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_1rqfh40.put.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      case 404: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: false, raw: result.res, error: resBody.error };

        const body = frourioSpec_1rqfh40.put.res[404].body.safeParse(resBody.data);

        if (!body.success) return { ok: false, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: false,
          isValid: true,
          failure: { status: 404, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
  async $delete(req: { params: z.infer<typeof paramsSchema_1rqfh40>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 204; headers?: undefined; body?: undefined }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: false; isValid: true; data?: undefined; failure: { status: 404; headers?: undefined; body: z.infer<typeof frourioSpec_1rqfh40.delete.res[404]['body']> }; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_1rqfh40(option).delete(req);

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'DELETE',
        ...option?.init,
        ...req.init,
        headers: { ...option?.init?.headers, ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 204: {
        return {
          ok: true,
          isValid: true,
          data: { status: 204 },
          raw: result.res,
        };
      }
      case 404: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: false, raw: result.res, error: resBody.error };

        const body = frourioSpec_1rqfh40.delete.res[404].body.safeParse(resBody.data);

        if (!body.success) return { ok: false, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: false,
          isValid: true,
          failure: { status: 404, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});

const methods_1tp1ur6 = (option?: FrourioClientOption) => ({
  async $post(req: { body: z.infer<typeof frourioSpec_1tp1ur6.post.body>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: Response; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: false; isValid: true; data?: undefined; failure: Response; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_1tp1ur6(option).post();

    if (url.reason) return url;

    const parsedBody = frourioSpec_1tp1ur6.post.body.safeParse(req.body);

    if (!parsedBody.success) return { isValid: false, reason: parsedBody.error };

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'POST',
        ...option?.init,
        body: JSON.stringify(parsedBody.data),
        ...req.init,
        headers: { ...option?.init?.headers, 'content-type': 'application/json', ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    return result.res.ok ? { ok: true, isValid: true, data: result.res, raw: result.res } : { ok: false, isValid: true, failure: result.res, raw: result.res };
  },
});

const methods_fkgw0p = (option?: FrourioClientOption) => ({
  async $get(req: { params: z.infer<typeof paramsSchema_fkgw0p>, init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec_fkgw0p.get.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url_fkgw0p(option).get(req);

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'GET',
        ...option?.init,
        ...req.init,
        headers: { ...option?.init?.headers, ...req.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.text().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec_fkgw0p.get.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});

