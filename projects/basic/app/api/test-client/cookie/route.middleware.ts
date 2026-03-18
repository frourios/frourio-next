import { parseCookie, stringifySetCookie } from 'cookie';
import { frourioSpec } from './frourio';
import { createMiddleware } from './frourio.middleware';

export const middleware = createMiddleware(async ({ req, next }) => {
  if (req.method === 'GET') {
    const cookieText = req.headers.get('cookie');

    return next({ val: cookieText ? parseCookie(cookieText).val : undefined });
  }

  const cloneReq = req.clone();
  const body = await cloneReq.json().then((json) => frourioSpec.post.body.parse(json));
  const res = await next(body);

  res.headers.set('Set-Cookie', stringifySetCookie({ name: 'val', value: body.val, path: '/' }));

  return res;
});
