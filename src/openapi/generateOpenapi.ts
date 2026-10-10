/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import path from 'path';
import ts from 'typescript';
import * as TJS from 'typescript-json-schema';
import { FROURIO_FILE, PACKAGE_NAME, PARAMS_FILE } from '../constants.js';
import { createHash } from '../createHash.js';
import { listFrourioDirs } from '../listFrourioDirs.js';
import type { OpenapiConfig } from './getOpenapiConfig.js';

type OpenAPIV3_1Document = {
  paths: Record<string, TJS.Definition>;
  components: { schemas: Record<string, TJS.Definition> };
};

export const generateOpenapi = ({ appDir, basePath, output, template, root }: OpenapiConfig) => {
  if (!appDir) return;

  if (!existsSync(template)) {
    const skeleton = {
      openapi: '3.1.0',
      info: { title: `${output.split('/').at(-1)?.replace('.json', '')} api`, version: 'v0.0' },
      ...(basePath ? { servers: [{ url: basePath }] } : {}),
    };

    writeFileSync(template, `${JSON.stringify(skeleton, null, 2)}\n`);
    console.log(`${template} was generated successfully.`);
  }

  const templateDoc: OpenAPIV3_1Document = JSON.parse(readFileSync(template, 'utf8'));
  const baseDoc: OpenAPIV3_1Document = { ...templateDoc, paths: {} };
  const text = toOpenAPI({ appDir, template: baseDoc, root: root ?? appDir });

  if (existsSync(output) && readFileSync(output, 'utf8') === text) return;

  writeFileSync(output, text);
  console.log(`${output} was generated successfully.`);
};

const getRefText = (def: TJS.Definition) =>
  !def.$ref ? '' : decodeURIComponent(def.$ref.replace('#/definitions/', ''));

const resolveDefinition = (
  def: TJS.Definition,
  definitions: Record<string, TJS.Definition | boolean>,
): TJS.Definition => {
  const resolved = def.$ref ? definitions[getRefText(def)] : def;
  return typeof resolved === 'object' ? resolved : def;
};

const getSchemaExample = (
  def: TJS.Definition,
  definitions: Record<string, TJS.Definition | boolean>,
  depth = 0,
): unknown => {
  if (depth > 8) return undefined;
  const schema = resolveDefinition(def, definitions);
  if ('const' in schema) return schema.const;
  if (schema.enum) return schema.enum[0];
  const alternatives = schema.anyOf ?? schema.oneOf ?? schema.allOf;
  if (alternatives) {
    return alternatives
      .map((item) => getSchemaExample(item as TJS.Definition, definitions, depth + 1))
      .find((value) => value !== undefined && value !== null);
  }
  if (schema.type === 'string') return 'string';
  if (schema.type === 'number' || schema.type === 'integer') return 1;
  if (schema.type === 'boolean') return true;
  if (schema.type === 'null') return null;
  if (schema.type === 'array') return [];
  if (schema.type === 'object') return {};
  return undefined;
};

const getResponseCookieExamples = (
  cookie: TJS.Definition | undefined,
  definitions: Record<string, TJS.Definition | boolean>,
): string[] => {
  if (!cookie) return [];
  const cookies = resolveDefinition(cookie, definitions);
  return Object.entries(cookies.properties ?? {}).map(([name, definition]) => {
    const spec = resolveDefinition(definition as TJS.Definition, definitions).properties ?? {};
    const command = spec.command && getSchemaExample(spec.command as TJS.Definition, definitions);
    const options = spec.options
      ? (resolveDefinition(spec.options as TJS.Definition, definitions).properties ?? {})
      : {};
    const option = (key: string) =>
      options[key] && getSchemaExample(options[key] as TJS.Definition, definitions);
    const deleting = command === 'delete';
    const value = deleting
      ? ''
      : spec.value && getSchemaExample(spec.value as TJS.Definition, definitions);
    const attrs = [`${name}=${encodeURIComponent(String(value === undefined ? '' : value))}`];
    attrs.push(`Path=${option('path') ?? '/'}`);
    if (deleting || options.expires) {
      const expires = deleting ? 0 : option('expires');
      attrs.push(`Expires=${new Date(typeof expires === 'number' ? expires : 0).toUTCString()}`);
    }
    const maxAge = option('maxAge');
    if (typeof maxAge === 'number') attrs.push(`Max-Age=${maxAge}`);
    const domain = option('domain');
    if (domain) attrs.push(`Domain=${domain}`);
    if (option('secure')) attrs.push('Secure');
    if (option('httpOnly')) attrs.push('HttpOnly');
    const sameSite = option('sameSite');
    if (sameSite) attrs.push(`SameSite=${sameSite}`);
    if (option('partitioned')) attrs.push('Partitioned');
    const priority = option('priority');
    if (priority) attrs.push(`Priority=${priority}`);
    return attrs.join('; ');
  });
};

const convertTupleSchemas = (value: unknown): void => {
  if (!value || typeof value !== 'object') return;

  if (Array.isArray(value)) {
    value.forEach(convertTupleSchemas);
    return;
  }

  const schema = value as Record<string, unknown>;

  if (schema.type === 'array' && Array.isArray(schema.items)) {
    schema.prefixItems = schema.items;
    schema.items = schema.additionalItems ?? true;
    delete schema.additionalItems;
  }

  Object.values(schema).forEach(convertTupleSchemas);
};

const toOpenAPI = (params: {
  appDir: string;
  template: OpenAPIV3_1Document;
  root: string;
}): string => {
  const frourioDirs = listFrourioDirs(path.resolve(params.root));
  const hasParamsDirs = frourioDirs.filter((f) => f.includes('['));
  const typeFile = `import type { FrourioSpec } from '${PACKAGE_NAME}'
import type { z } from 'zod'
${frourioDirs
  .map(
    (d, i) =>
      `import type { frourioSpec as frourioSpec${i} } from '${path.posix.join(d, FROURIO_FILE)}'`,
  )
  .join('\n')}
${hasParamsDirs
  .map((d, i) => {
    const segments = d.split('/');
    const lastSegment = segments.at(-1) ?? '';
    if (lastSegment.startsWith('[')) {
      return `import type { paramsSchema as paramsSchema${i} } from '${path.posix.join(d, PARAMS_FILE)}'`;
    }
    const heads = segments.slice(0, -1);
    for (let j = heads.length - 1; j >= 0; j--) {
      if (heads[j].startsWith('[')) {
        const ancestorDir = segments.slice(0, j + 1).join('/');
        if (frourioDirs.includes(ancestorDir)) {
          const hasMiddles = heads.slice(j + 1).some((h) => h.startsWith('['));
          if (!hasMiddles) {
            return `import type { paramsSchema as paramsSchema${i} } from '${path.posix.join(ancestorDir, PARAMS_FILE)}'`;
          }
        }
      }
    }
    return `import type { paramsSchema as paramsSchema${i} } from '${path.posix.join(d, PARAMS_FILE)}'`;
  })
  .join('\n')}

type InferType<T extends z.ZodType | undefined> = T extends z.ZodType ? z.infer<T> : undefined;

type FrourioResponse = NonNullable<NonNullable<FrourioSpec['get']>['res']>;

type ToCookies<T> = {[Name in keyof T]: {
  [Key in keyof T[Name]]: T[Name][Key] extends z.ZodType ? InferType<T[Name][Key]> : T[Name][Key]
}};

type ToRes<T extends FrourioResponse | undefined> = {[S in keyof T]: T[S] extends {} ? {
  [Key in keyof T[S]]: Key extends 'dest' ? ToRes<T[S][Key] extends FrourioResponse ? T[S][Key] : undefined> : Key extends 'cookies' ? ToCookies<T[S][Key]> : T[S][Key] extends z.ZodType ? InferType<T[S][Key]> : T[S][Key]
}: undefined }

type ToSpecType<T extends FrourioSpec> = {
  param: InferType<T['param']>;
  get: T['get'] extends {}
    ? {
        headers: InferType<T['get']['headers']>;
        cookies: InferType<T['get']['cookies']>;
        query: InferType<T['get']['query']>;
        res: ToRes<T['get']['res']>;
      }
    : undefined;
  head: T['head'] extends {}
    ? {
        headers: InferType<T['head']['headers']>;
        cookies: InferType<T['head']['cookies']>;
        query: InferType<T['head']['query']>;
        res: ToRes<T['head']['res']>;
      }
    : undefined;
  options: T['options'] extends {}
    ? {
        headers: InferType<T['options']['headers']>;
        cookies: InferType<T['options']['cookies']>;
        query: InferType<T['options']['query']>;
        res: ToRes<T['options']['res']>;
      }
    : undefined;
  post: T['post'] extends {}
    ? {
        headers: InferType<T['post']['headers']>;
        cookies: InferType<T['post']['cookies']>;
        query: InferType<T['post']['query']>;
        format: T['post']['format'];
        body: InferType<T['post']['body']>;
        res: ToRes<T['post']['res']>;
      }
    : undefined;
  put: T['put'] extends {}
    ? {
        headers: InferType<T['put']['headers']>;
        cookies: InferType<T['put']['cookies']>;
        query: InferType<T['put']['query']>;
        format: T['put']['format'];
        body: InferType<T['put']['body']>;
        res: ToRes<T['put']['res']>;
      }
    : undefined;
  patch: T['patch'] extends {}
    ? {
        headers: InferType<T['patch']['headers']>;
        cookies: InferType<T['patch']['cookies']>;
        query: InferType<T['patch']['query']>;
        format: T['patch']['format'];
        body: InferType<T['patch']['body']>;
        res: ToRes<T['patch']['res']>;
      }
    : undefined;
  delete: T['delete'] extends {}
    ? {
        headers: InferType<T['delete']['headers']>;
        cookies: InferType<T['delete']['cookies']>;
        query: InferType<T['delete']['query']>;
        format: T['delete']['format'];
        body: InferType<T['delete']['body']>;
        res: ToRes<T['delete']['res']>;
      }
    : undefined;
};

type AllMethods = [${frourioDirs.map((_, i) => `ToSpecType<typeof frourioSpec${i}>`).join(', ')}]
type AllParams = [${hasParamsDirs.map((_, i) => `z.infer<typeof paramsSchema${i}>`).join(', ')}]`;

  const typeFilePath = path.posix.join(params.root, `@openapi-${Date.now()}.ts`);

  writeFileSync(typeFilePath, typeFile, 'utf8');

  const configDir = process.cwd();
  const configFileName = ts.findConfigFile(configDir, ts.sys.fileExists);
  const rawConfig = configFileName
    ? ts.readConfigFile(configFileName, ts.sys.readFile).config?.compilerOptions
    : {};
  const program = TJS.getProgramFromFiles([typeFilePath], { ...rawConfig, incremental: false });
  const methodsSchema = TJS.generateSchema(program, 'AllMethods', { required: true });
  const paramsSchema = TJS.generateSchema(program, 'AllParams', { required: true });
  const doc: OpenAPIV3_1Document = {
    ...params.template,
    paths: {},
    components: { ...params.template.components, schemas: methodsSchema?.definitions as any },
  };

  unlinkSync(typeFilePath);

  (methodsSchema?.items as TJS.Definition[])?.forEach((def, i) => {
    if (!def.properties) return;

    const methods = Object.entries(def.properties).filter(
      ([method]) => method !== 'param' && method !== 'middleware',
    );

    if (methods.length === 0) return;

    const parameters: {
      name: string;
      in: 'path' | 'query' | 'header' | 'cookie';
      required: boolean;
      schema: any;
    }[] = [];
    const dir = frourioDirs[i];
    const hasParams = dir.includes('[');

    if (hasParams) {
      const schema = (paramsSchema!.items as TJS.Definition[])[hasParamsDirs.indexOf(dir)];
      const paramsDefs = schema.allOf
        ? schema.allOf.map(
            (one) =>
              paramsSchema?.definitions?.[getRefText(one as TJS.Definition)] as TJS.Definition,
          )
        : [paramsSchema?.definitions?.[getRefText(schema)] as TJS.Definition];

      paramsDefs.forEach((def) => {
        parameters.push(
          ...Object.entries(def.properties!).map(([param, val]) => {
            return {
              name: param.replace('[', '').replace(']', '').replace('...', ''),
              in: 'path' as const,
              required: true,
              schema: param.includes('...') ? { type: 'string', pattern: '.+' } : val,
            };
          }),
        );
      });
    }

    const apiPath =
      dir
        .replace(/\/\(.+\)/g, '')
        .replace(/\[+\.*(.+?)]+/g, '{$1}')
        .replace(path.resolve(params.appDir).replaceAll('\\', '/'), '') || '/';

    doc.paths![apiPath] = methods.reduce((dict, [method, val]) => {
      const props = (val as TJS.Definition).properties as Record<string, TJS.Definition>;
      const methodParameters = [...parameters];

      if (props.query) {
        const def = methodsSchema?.definitions?.[getRefText(props.query)] as TJS.Definition;

        if (def.properties) {
          methodParameters.push(
            ...Object.entries(def.properties).map(([name, value]) => ({
              name,
              in: 'query' as const,
              required: def.required?.includes(name) ?? false,
              schema: value,
            })),
          );
        }
      }

      const reqFormat = props.format?.const as string;
      const headersDef =
        props.headers &&
        (methodsSchema?.definitions?.[getRefText(props.headers)] as TJS.Definition);

      if (headersDef?.properties) {
        methodParameters.push(
          ...Object.entries(headersDef.properties).map(([name, value]) => ({
            name,
            in: 'header' as const,
            required: headersDef.required?.includes(name) ?? false,
            schema: value,
          })),
        );
      }

      const cookiesDef =
        props.cookies &&
        (methodsSchema?.definitions?.[getRefText(props.cookies)] as TJS.Definition);

      if (cookiesDef?.properties) {
        methodParameters.push(
          ...Object.entries(cookiesDef.properties).map(([name, value]) => ({
            name,
            in: 'cookie' as const,
            required: cookiesDef.required?.includes(name) ?? false,
            schema: value,
          })),
        );
      }

      const reqContentType =
        ((headersDef?.properties?.['content-type'] as TJS.Definition)?.const as string) ??
        (reqFormat === 'formData'
          ? 'multipart/form-data'
          : reqFormat === 'urlencoded'
            ? 'application/x-www-form-urlencoded'
            : props.body?.$ref?.includes('Blob') || props.body?.$ref?.includes('ArrayBuffer')
              ? 'application/octet-stream'
              : typeof props.body?.type === 'string' && props.body.type === 'string'
                ? 'text/plain'
                : 'application/json');

      const resDef =
        props.res && (methodsSchema?.definitions?.[getRefText(props.res)] as TJS.Definition);

      return {
        ...dict,
        [method]: {
          parameters: methodParameters.length === 0 ? undefined : methodParameters,
          requestBody:
            props.body === undefined
              ? undefined
              : { content: { [reqContentType]: { schema: props.body } } },
          responses: resDef?.properties
            ? Object.entries(resDef.properties)
                .flatMap(([status, statusObj]): [string, TJS.DefinitionOrBoolean][] => {
                  const definition = methodsSchema?.definitions?.[
                    getRefText(statusObj as TJS.Definition)
                  ] as TJS.Definition;
                  const dest = definition.properties?.dest as TJS.Definition | undefined;
                  const destinations = (
                    dest?.$ref ? methodsSchema?.definitions?.[getRefText(dest)] : dest
                  ) as TJS.Definition | undefined;
                  return destinations?.properties
                    ? Object.entries(destinations.properties)
                    : [[status, statusObj]];
                })
                .reduce((dict: Record<string, any>, [status, statusObj]) => {
                  const statusDef = methodsSchema?.definitions?.[
                    getRefText(statusObj as TJS.Definition)
                  ] as TJS.Definition;

                  const headersDef = (statusDef.properties as Record<string, TJS.Definition>)
                    ?.headers?.$ref
                    ? (methodsSchema?.definitions?.[
                        getRefText((statusDef.properties as Record<string, TJS.Definition>).headers)
                      ] as TJS.Definition)
                    : (statusDef.properties as Record<string, TJS.Definition>)?.headers;

                  const responseCookies = getResponseCookieExamples(
                    (statusDef.properties as Record<string, TJS.Definition>)?.cookies,
                    methodsSchema?.definitions ?? {},
                  );

                  const resContentType =
                    ((headersDef?.properties?.['content-type'] as TJS.Definition)
                      ?.const as string) ??
                    ((statusDef.properties as Record<string, TJS.Definition>)?.format?.const ===
                    'formData'
                      ? 'multipart/form-data'
                      : (
                            statusDef.properties as Record<string, TJS.Definition>
                          )?.body?.$ref?.includes('Blob') ||
                          (
                            statusDef.properties as Record<string, TJS.Definition>
                          )?.body?.$ref?.includes('ArrayBuffer')
                        ? 'application/octet-stream'
                        : typeof (statusDef.properties as Record<string, TJS.Definition>)?.body
                              ?.type === 'string' &&
                            (statusDef.properties as Record<string, TJS.Definition>)?.body?.type ===
                              'string'
                          ? 'text/plain'
                          : 'application/json');

                  const body = (statusDef.properties as Record<string, TJS.Definition>)?.body;
                  const previous = dict[status]?.content?.[resContentType]?.schema;
                  const schema =
                    previous && body ? { anyOf: [...(previous.anyOf ?? [previous]), body] } : body;
                  const cookieSchema = (statusDef.properties as Record<string, TJS.Definition>)
                    ?.cookies;
                  const cookieDefinitions = cookieSchema
                    ? (resolveDefinition(cookieSchema, methodsSchema?.definitions ?? {})
                        .properties ?? {})
                    : {};
                  const cookieMetadata = Object.fromEntries(
                    Object.entries(cookieDefinitions).map(([name, definition]) => {
                      const cookie =
                        resolveDefinition(
                          definition as TJS.Definition,
                          methodsSchema?.definitions ?? {},
                        ).properties ?? {};
                      return [
                        name,
                        {
                          command: getSchemaExample(
                            cookie.command as TJS.Definition,
                            methodsSchema?.definitions ?? {},
                          ),
                          required:
                            !cookie.required ||
                            getSchemaExample(
                              cookie.required as TJS.Definition,
                              methodsSchema?.definitions ?? {},
                            ) !== false,
                        },
                      ];
                    }),
                  );
                  const response = {
                    ...(responseCookies.length ? { 'x-frourio-cookies': cookieMetadata } : {}),
                    description: '',
                    content: body
                      ? { ...dict[status]?.content, [resContentType]: { schema } }
                      : dict[status]?.content,
                    headers:
                      headersDef?.properties || responseCookies.length > 0
                        ? {
                            ...Object.entries(headersDef?.properties ?? {}).reduce(
                              (dict, [key, val]) => {
                                return {
                                  ...dict,
                                  [key]: {
                                    schema: val,
                                    required: headersDef?.required?.includes(key) ?? false,
                                  },
                                };
                              },
                              {},
                            ),
                            ...(responseCookies.length > 0
                              ? {
                                  'Set-Cookie': {
                                    description:
                                      'Each value is sent as a separate Set-Cookie header. Cookie names, commands, and required flags are described in x-frourio-cookies; examples use default options, which handlers may override.',
                                    schema: { type: 'array', items: { type: 'string' } },
                                    example: responseCookies,
                                  },
                                }
                              : {}),
                          }
                        : undefined,
                  };
                  const prior = dict[status];
                  if (prior) {
                    const headers = Object.fromEntries(
                      [
                        ...new Set([
                          ...Object.keys(prior.headers ?? {}),
                          ...Object.keys(response.headers ?? {}),
                        ]),
                      ].map((name) => {
                        const a = prior.headers?.[name];
                        const b = (response.headers as Record<string, any> | undefined)?.[name];
                        return [
                          name,
                          {
                            ...(a ?? b),
                            schema: a && b ? { anyOf: [a.schema, b.schema] } : (a ?? b).schema,
                            required: !!(a?.required && b?.required),
                          },
                        ];
                      }),
                    );
                    return {
                      ...dict,
                      [status]: {
                        ...response,
                        headers: Object.keys(headers).length ? headers : undefined,
                      },
                    };
                  }
                  return { ...dict, [status]: response };
                }, {})
            : undefined,
        },
      };
    }, {});
  });

  const noRefKeys: string[] = [];
  let docText = JSON.stringify(doc).replaceAll('#/definitions', '#/components/schemas');

  if (doc.components?.schemas)
    Object.keys(doc.components.schemas).forEach((key) => {
      if (/^[a-zA-Z0-9.\-_]+$/.test(key)) {
        if (!docText.includes(`"#/components/schemas/${key}"`)) noRefKeys.push(key);

        return;
      }

      const hash = createHash(key);
      const encodedKey = encodeURIComponent(key);

      docText = docText
        .replaceAll(`"${key.replaceAll('"', '\\"')}"`, `"${hash}"`)
        .replaceAll(`"#/components/schemas/${encodedKey}"`, `"#/components/schemas/${hash}"`);

      if (!docText.includes(`"#/components/schemas/${hash}"`)) noRefKeys.push(hash);
    });

  const newDoc = JSON.parse(docText);

  noRefKeys.forEach((key) => {
    delete newDoc.components.schemas[key];
  });

  if (newDoc.components.schemas?.File) {
    newDoc.components.schemas.File = { type: 'string', format: 'binary' };
  }

  if (newDoc.components.schemas?.ArrayBuffer) {
    newDoc.components.schemas.ArrayBuffer = {
      type: 'object',
      properties: { byteLength: { type: 'number' } },
      required: ['byteLength'],
    };
  }

  convertTupleSchemas(newDoc);

  return JSON.stringify(newDoc, null, 2);
};
