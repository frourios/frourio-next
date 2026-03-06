import { http, type RequestHandler } from 'msw';
import * as route_ztntfp from '../app/route';
import * as route_rket09 from '../app/(group1)/[pid]/route';
import * as route_1c6qmxu from '../app/(group1)/[pid]/foo/route';
import * as route_er79ce from '../app/(group1)/blog/[...slug]/route';
import * as route_14jcy50 from '../app/(group1)/blog/hoge/[[...fuga]]/route';
import * as route_13e9lnf from '../app/(group2)/x/[y]/route';
import * as route_knqmrp from '../app/[a]/route';
import * as route_2ijh4e from '../app/[a]/[b]/[...c]/route';
import * as route_1yzfjrp from '../app/[a]/[b]/d/route';
import * as route_1f8i0zm from '../app/api/key-collision-test/route';
import * as route_195l5vw from '../app/api/key-collision-test-another/route';
import * as route_sqrir7 from '../app/api/mw/route';
import * as route_n3it2j from '../app/api/mw/admin/route';
import * as route_gye2fo from '../app/api/mw/admin/users/route';
import * as route_76vmqd from '../app/api/mw/public/route';
import * as route_17yqnk1 from '../app/api/test-client/route';
import * as route_1rqfh40 from '../app/api/test-client/[userId]/route';
import * as route_1tp1ur6 from '../app/api/test-client/stream/route';
import * as route_fkgw0p from '../app/xxx/[id]/zzz/route';

export function setupMswHandlers(option?: { baseURL: string }): RequestHandler[] {
  const baseURL = option?.baseURL.replace(/\/$/, '') ?? '';

  return [
    http.get(`${baseURL}`, ({ request }) => {
      return route_ztntfp.GET(request);
    }),
    http.post(`${baseURL}`, ({ request }) => {
      return route_ztntfp.POST(request);
    }),
    http.get(`${baseURL}/:pid`, ({ request }) => {
      const pathChunks = request.url.replace(baseURL || /https?:\/\/[^/]+/, '').split('/');
      const params = { 'pid': `${pathChunks[1]}` };

      return route_rket09.GET(request, { params: Promise.resolve(params) });
    }),
    http.get(`${baseURL}/:pid/foo`, ({ request }) => {
      const pathChunks = request.url.replace(baseURL || /https?:\/\/[^/]+/, '').split('/');
      const params = { 'pid': `${pathChunks[1]}` };

      return route_1c6qmxu.GET(request, { params: Promise.resolve(params) });
    }),
    http.get(`${baseURL}/blog/*`, ({ request }) => {
      const pathChunks = request.url.replace(baseURL || /https?:\/\/[^/]+/, '').split('/');
      const params = { 'slug': pathChunks.slice(2) };

      return route_er79ce.GET(request, { params: Promise.resolve(params) });
    }),
    http.get(`${baseURL}/blog/hoge/*`, ({ request }) => {
      const pathChunks = request.url.replace(baseURL || /https?:\/\/[^/]+/, '').split('/');
      const params = { 'fuga': pathChunks.slice(3) };

      return route_14jcy50.GET(request, { params: Promise.resolve(params) });
    }),
    http.get(`${baseURL}/x/:y`, ({ request }) => {
      const pathChunks = request.url.replace(baseURL || /https?:\/\/[^/]+/, '').split('/');
      const params = { 'y': `${pathChunks[2]}` };

      return route_13e9lnf.GET(request, { params: Promise.resolve(params) });
    }),
    http.get(`${baseURL}/:a`, ({ request }) => {
      const pathChunks = request.url.replace(baseURL || /https?:\/\/[^/]+/, '').split('/');
      const params = { 'a': `${pathChunks[1]}` };

      return route_knqmrp.GET(request, { params: Promise.resolve(params) });
    }),
    http.post(`${baseURL}/:a/:b/*`, ({ request }) => {
      const pathChunks = request.url.replace(baseURL || /https?:\/\/[^/]+/, '').split('/');
      const params = { 'a': `${pathChunks[1]}`, 'b': `${pathChunks[2]}`, 'c': pathChunks.slice(3) };

      return route_2ijh4e.POST(request, { params: Promise.resolve(params) });
    }),
    http.get(`${baseURL}/:a/:b/d`, ({ request }) => {
      const pathChunks = request.url.replace(baseURL || /https?:\/\/[^/]+/, '').split('/');
      const params = { 'a': `${pathChunks[1]}`, 'b': `${pathChunks[2]}` };

      return route_1yzfjrp.GET(request, { params: Promise.resolve(params) });
    }),
    http.get(`${baseURL}/api/key-collision-test`, ({ request }) => {
      return route_1f8i0zm.GET(request);
    }),
    http.get(`${baseURL}/api/key-collision-test-another`, ({ request }) => {
      return route_195l5vw.GET(request);
    }),
    http.get(`${baseURL}/api/mw`, ({ request }) => {
      return route_sqrir7.GET(request);
    }),
    http.get(`${baseURL}/api/mw/admin`, ({ request }) => {
      return route_n3it2j.GET(request);
    }),
    http.post(`${baseURL}/api/mw/admin`, ({ request }) => {
      return route_n3it2j.POST(request);
    }),
    http.get(`${baseURL}/api/mw/admin/users`, ({ request }) => {
      return route_gye2fo.GET(request);
    }),
    http.get(`${baseURL}/api/mw/public`, ({ request }) => {
      return route_76vmqd.GET(request);
    }),
    http.get(`${baseURL}/api/test-client`, ({ request }) => {
      return route_17yqnk1.GET(request);
    }),
    http.post(`${baseURL}/api/test-client`, ({ request }) => {
      return route_17yqnk1.POST(request);
    }),
    http.patch(`${baseURL}/api/test-client`, ({ request }) => {
      return route_17yqnk1.PATCH(request);
    }),
    http.put(`${baseURL}/api/test-client/:userId`, ({ request }) => {
      const pathChunks = request.url.replace(baseURL || /https?:\/\/[^/]+/, '').split('/');
      const params = { 'userId': `${pathChunks[3]}` };

      return route_1rqfh40.PUT(request, { params: Promise.resolve(params) });
    }),
    http.delete(`${baseURL}/api/test-client/:userId`, ({ request }) => {
      const pathChunks = request.url.replace(baseURL || /https?:\/\/[^/]+/, '').split('/');
      const params = { 'userId': `${pathChunks[3]}` };

      return route_1rqfh40.DELETE(request, { params: Promise.resolve(params) });
    }),
    http.post(`${baseURL}/api/test-client/stream`, ({ request }) => {
      return route_1tp1ur6.POST(request);
    }),
    http.get(`${baseURL}/xxx/:id/zzz`, ({ request }) => {
      const pathChunks = request.url.replace(baseURL || /https?:\/\/[^/]+/, '').split('/');
      const params = { 'id': `${pathChunks[2]}` };

      return route_fkgw0p.GET(request, { params: Promise.resolve(params) });
    }),
  ];
}

export function patchFilePrototype(): void {
  File.prototype.arrayBuffer ??= function (): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (): void => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(this);
    });
  };

  File.prototype.bytes ??= function (): Promise<Uint8Array<ArrayBuffer>> {
    return new Promise<Uint8Array<ArrayBuffer>>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (): void => resolve(new Uint8Array(reader.result as ArrayBuffer));
      reader.onerror = reject;
      reader.readAsArrayBuffer(this);
    });
  };

  File.prototype.stream ??= function (): ReadableStream<Uint8Array<ArrayBuffer>> {
    return new ReadableStream({
      start: (controller): void => {
        const reader = new FileReader();

        reader.onload = (): void => {
          const arrayBuffer = reader.result as ArrayBuffer;
          controller.enqueue(new Uint8Array(arrayBuffer));
          controller.close();
        };
        reader.onerror = (): void => {
          controller.error(reader.error);
        };
        reader.readAsArrayBuffer(this);
      },
    });
  };

  File.prototype.text ??= function (): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (): void => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(this);
    });
  };
}
