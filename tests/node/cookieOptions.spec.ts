import type { NextResponse } from 'next/server.js';
import { expectTypeOf, test } from 'vitest';
import type { FrourioSpec } from '../../src';

type Cookies = NonNullable<NonNullable<NonNullable<FrourioSpec['post']>['res']>[200]>['cookies'];
type Cookie = NonNullable<Cookies>[string];
type SetOptions = NonNullable<Extract<Cookie, { command: 'set' }>['options']>;
type DeleteOptions = NonNullable<Extract<Cookie, { command: 'delete' }>['options']>;
type NextSetCookie = Extract<Parameters<NextResponse['cookies']['set']>, [options: object]>[0];
type NextDeleteCookie = Extract<
  Parameters<NextResponse['cookies']['delete']>,
  [options: object]
>[0];

test('response cookie options match Next.js set and delete arguments', () => {
  expectTypeOf<SetOptions>().toEqualTypeOf<Omit<NextSetCookie, 'name' | 'value'>>();
  expectTypeOf<DeleteOptions>().toEqualTypeOf<Omit<NextDeleteCookie, 'name'>>();
  expectTypeOf<{ expires: Date; maxAge: number }>().toExtend<SetOptions>();
  expectTypeOf<{ maxAge: number }>().toExtend<DeleteOptions>();
  expectTypeOf<'expires'>().toExtend<keyof SetOptions>();
  expectTypeOf<'expires'>().not.toExtend<keyof DeleteOptions>();
});
