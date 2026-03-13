import { NextRequest, NextResponse } from 'next/server';
import type { z } from 'zod';
import { frourioSpec } from './frourio';
import type { POST, PUT } from './route';

type RouteChecker = [typeof POST, typeof PUT];

type SpecType = typeof frourioSpec;

type Controller = {
  post: (
    req: {
      body: z.infer<SpecType['post']['body']>;
    },
  ) => Promise<
    | {
        status: 200;
        body: z.infer<SpecType['post']['res'][200]['body']>;
      }
  >;
  put: (
    req: {
      body: z.infer<SpecType['put']['body']>;
    },
  ) => Promise<
    | {
        status: 200;
        body: z.infer<SpecType['put']['res'][200]['body']>;
      }
  >;
};

type MethodHandler = (req: NextRequest | Request) => Promise<NextResponse>;

type ResHandler = {
  POST: MethodHandler
  PUT: MethodHandler
};

export const createRoute = (controller: Controller): ResHandler => {
  return {
    POST: async (req) => {
      const formData = await req.formData();
      const body = frourioSpec.post.body.safeParse(
        Object.fromEntries(
          [
            ['string', formData.get('string') ?? undefined],
            ['number', formDataToNum(formData.get('number') ?? undefined)],
            ['boolean', formDataToBool(formData.get('boolean') ?? undefined)],
            ['stringArr', formData.getAll('stringArr')],
            ['numberArr', formDataToNumArr(formData.getAll('numberArr'))],
            ['booleanArr', formDataToBoolArr(formData.getAll('booleanArr'))],
            ['file', await formDataToFile(formData.get('file') ?? undefined)],
            ['fileArr', await formDataToFileArr(formData.getAll('fileArr'))],
            ['optionalString', formData.get('optionalString') ?? undefined],
            ['optionalNumber', formDataToNum(formData.get('optionalNumber') ?? undefined)],
            ['optionalBoolean', formDataToBool(formData.get('optionalBoolean') ?? undefined)],
            ['optionalStringArr', formData.getAll('optionalStringArr').length > 0 ? formData.getAll('optionalStringArr') : undefined],
            ['optionalNumberArr', formData.getAll('optionalNumberArr').length > 0 ? formDataToNumArr(formData.getAll('optionalNumberArr')) : undefined],
            ['optionalBooleanArr', formData.getAll('optionalBooleanArr').length > 0 ? formDataToBoolArr(formData.getAll('optionalBooleanArr')) : undefined],
            ['optionalFile', await formDataToFile(formData.get('optionalFile') ?? undefined)],
            ['optionalFileArr', formData.getAll('optionalFileArr').length > 0 ? await formDataToFileArr(formData.getAll('optionalFileArr')) : undefined],
          ].filter(entry => entry[1] !== undefined),
        ),
      );

      if (body.error) return createReqErr(body.error);

      const res = await controller.post({ body: body.data });

      switch (res.status) {
        case 200: {
          const body = frourioSpec.post.res[200].body.safeParse(res.body);

          if (body.error) return createResErr();

          return createResponse(body.data, { status: 200 });
        }
        default:
          throw new Error(res.status satisfies never);
      }
    },
    PUT: async (req) => {
      const urlSearchParams = new URLSearchParams(await req.text());
      const body = frourioSpec.put.body.safeParse(
        Object.fromEntries(
          [
            ['string', urlSearchParams.get('string') ?? undefined],
            ['number', urlencodedToNum(urlSearchParams.get('number') ?? undefined)],
            ['boolean', urlencodedToBool(urlSearchParams.get('boolean') ?? undefined)],
            ['stringArr', urlSearchParams.getAll('stringArr')],
            ['numberArr', urlencodedToNumArr(urlSearchParams.getAll('numberArr'))],
            ['booleanArr', urlencodedToBoolArr(urlSearchParams.getAll('booleanArr'))],
            ['optionalString', urlSearchParams.get('optionalString') ?? undefined],
            ['optionalNumber', urlencodedToNum(urlSearchParams.get('optionalNumber') ?? undefined)],
            ['optionalBoolean', urlencodedToBool(urlSearchParams.get('optionalBoolean') ?? undefined)],
            ['optionalStringArr', urlSearchParams.getAll('optionalStringArr').length > 0 ? urlSearchParams.getAll('optionalStringArr') : undefined],
            ['optionalNumberArr', urlSearchParams.getAll('optionalNumberArr').length > 0 ? urlencodedToNumArr(urlSearchParams.getAll('optionalNumberArr')) : undefined],
            ['optionalBooleanArr', urlSearchParams.getAll('optionalBooleanArr').length > 0 ? urlencodedToBoolArr(urlSearchParams.getAll('optionalBooleanArr')) : undefined],
          ].filter(entry => entry[1] !== undefined),
        ),
      );

      if (body.error) return createReqErr(body.error);

      const res = await controller.put({ body: body.data });

      switch (res.status) {
        case 200: {
          const body = frourioSpec.put.res[200].body.safeParse(res.body);

          if (body.error) return createResErr();

          return createResponse(body.data, { status: 200 });
        }
        default:
          throw new Error(res.status satisfies never);
      }
    },
  };
};

const createResponse = (body: unknown, init: ResponseInit): NextResponse => {
  if (
    ArrayBuffer.isView(body) ||
    body === undefined ||
    body === null ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    body instanceof FormData ||
    body instanceof ReadableStream ||
    body instanceof URLSearchParams ||
    typeof body === 'string'
  ) {
    return new NextResponse(body as string, init);
  }

  return NextResponse.json(body, init);
};

type FrourioError =
  | { status: 422; error: string; issues: { path: (string | number)[]; message: string }[] }
  | { status: 500; error: string; issues?: undefined };

const createReqErr = (err: z.ZodError) =>
  NextResponse.json<FrourioError>(
    {
      status: 422,
      error: 'Unprocessable Entity',
      issues: err.issues.map((issue) => ({ path: issue.path.filter(p => typeof p !== 'symbol'), message: issue.message })),
    },
    { status: 422 },
  );

const createResErr = () =>
  NextResponse.json<FrourioError>(
    { status: 500, error: 'Internal Server Error' },
    { status: 500 },
  );

const formDataToNum = (val: FormDataEntryValue | undefined) => {
  const num = Number(val);

  return isNaN(num) ? val : num;
};

const formDataToNumArr = (val: FormDataEntryValue[]) => val.map(formDataToNum);

const formDataToBool = (val: FormDataEntryValue | undefined) =>
  val === 'true' ? true : val === 'false' ? false : val;

const formDataToBoolArr = (val: FormDataEntryValue[]) => val.map(formDataToBool);

const formDataToFile = async (val: FormDataEntryValue | undefined) => {
  if (val instanceof File || typeof val === 'string' || val === undefined) return val;

  const buffer = await (val as File).arrayBuffer();

  return new File([buffer], (val as File).name, val); // for jsdom
};

const formDataToFileArr = (vals: FormDataEntryValue[]) => Promise.all(vals.map(formDataToFile));

const urlencodedToNum = (val: string | undefined) => {
  const num = Number(val);

  return isNaN(num) ? val : num;
};

const urlencodedToNumArr = (val: string[]) => val.map(urlencodedToNum);

const urlencodedToBool = (val: string | undefined) =>
  val === 'true' ? true : val === 'false' ? false : val;

const urlencodedToBoolArr = (val: string[]) => val.map(urlencodedToBool);
