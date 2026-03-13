/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import path from 'path';
import type { OpenAPIV3_1 } from 'openapi-types';
import ts from 'typescript';
import * as TJS from 'typescript-json-schema';
import { FROURIO_FILE, SERVER_FILE } from '../constants';
import { createHash } from '../createHash';
import { listFrourioDirs } from '../listFrourioDirs';
import type { OpenapiConfig } from './getOpenapiConfig';

export const generateOpenapi = ({ appDir, basePath, output, root }: OpenapiConfig) => {
  if (!appDir) return;

  const existingDoc: OpenAPIV3_1.Document | undefined = existsSync(output)
    ? JSON.parse(readFileSync(output, 'utf8'))
    : undefined;
  const template: OpenAPIV3_1.Document = {
    openapi: '3.1.0',
    info: { title: `${output.split('/').at(-1)?.replace('.json', '')} api`, version: 'v0.0' },
    ...(basePath ? { servers: [{ url: basePath }] } : {}),
    ...existingDoc,
    paths: {},
    components: {},
  };
  const text = toOpenAPI({ appDir, template, root: root ?? appDir });

  if (existsSync(output) && readFileSync(output, 'utf8') === text) return;

  writeFileSync(output, text);
  console.log(`${output} was generated successfully.`);
};

const getRefText = (def: TJS.Definition) =>
  !def.$ref ? '' : decodeURIComponent(def.$ref.replace('#/definitions/', ''));

const toOpenAPI = (params: {
  appDir: string;
  template: OpenAPIV3_1.Document;
  root: string;
}): string => {
  const frourioDirs = listFrourioDirs(path.resolve(params.root));
  const hasParamsDirs = frourioDirs.filter((f) => f.includes('['));
  const typeFile = `import type { FrourioSpec } from '@frourio/next'
import type { z } from 'zod'
${frourioDirs
  .map(
    (d, i) =>
      `import type { frourioSpec as frourioSpec${i} } from '${path.posix.join(d, FROURIO_FILE)}'`,
  )
  .join('\n')}
${hasParamsDirs
  .map(
    (d, i) =>
      `import type { paramsSchema as paramsSchema${i} } from '${path.posix.join(d, SERVER_FILE)}'`,
  )
  .join('\n')}

type InferType<T extends z.ZodTypeAny | undefined> = T extends z.ZodTypeAny ? z.infer<T> : undefined;

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type FrourioResponse = {
  [Status in \`\${2 | 4 | 5}\${Digit}\${Digit}\`]?: {
    headers?: z.ZodTypeAny;
    format?: 'formData' | 'urlencoded';
    body?: z.ZodTypeAny;
  };
};

type ToRes<T extends FrourioResponse | undefined> = {[S in keyof T]: T[S] extends {} ? {
  [Key in keyof T[S]]: T[S][Key] extends z.ZodTypeAny ? InferType<T[S][Key]> : T[S][Key]
}: undefined }

type ToSpecType<T extends FrourioSpec> = {
  param: InferType<T['param']>;
  get: T['get'] extends {}
    ? {
        headers: InferType<T['get']['headers']>;
        query: InferType<T['get']['query']>;
        res: ToRes<T['get']['res']>;
      }
    : undefined;
  head: T['head'] extends {}
    ? {
        headers: InferType<T['head']['headers']>;
        query: InferType<T['head']['query']>;
        res: ToRes<T['head']['res']>;
      }
    : undefined;
  options: T['options'] extends {}
    ? {
        headers: InferType<T['options']['headers']>;
        query: InferType<T['options']['query']>;
        res: ToRes<T['options']['res']>;
      }
    : undefined;
  post: T['post'] extends {}
    ? {
        headers: InferType<T['post']['headers']>;
        query: InferType<T['post']['query']>;
        format: T['post']['format'];
        body: InferType<T['post']['body']>;
        res: ToRes<T['post']['res']>;
      }
    : undefined;
  put: T['put'] extends {}
    ? {
        headers: InferType<T['put']['headers']>;
        query: InferType<T['put']['query']>;
        format: T['put']['format'];
        body: InferType<T['put']['body']>;
        res: ToRes<T['put']['res']>;
      }
    : undefined;
  patch: T['patch'] extends {}
    ? {
        headers: InferType<T['patch']['headers']>;
        query: InferType<T['patch']['query']>;
        format: T['patch']['format'];
        body: InferType<T['patch']['body']>;
        res: ToRes<T['patch']['res']>;
      }
    : undefined;
  delete: T['delete'] extends {}
    ? {
        headers: InferType<T['delete']['headers']>;
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
  const compilerOptions = configFileName
    ? ts.parseJsonConfigFileContent(
        ts.readConfigFile(configFileName, ts.sys.readFile).config,
        ts.sys,
        configDir,
      )
    : undefined;

  const program = TJS.getProgramFromFiles([typeFilePath], {
    ...compilerOptions?.options,
    incremental: false,
  });
  const methodsSchema = TJS.generateSchema(program, 'AllMethods', { required: true });
  const paramsSchema = TJS.generateSchema(program, 'AllParams', { required: true });
  const doc: OpenAPIV3_1.Document = {
    ...params.template,
    paths: {},
    components: { schemas: methodsSchema?.definitions as any },
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
      in: 'path' | 'query' | 'header';
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
            ? Object.entries(resDef.properties).reduce((dict, [status, statusObj]) => {
                const statusDef = methodsSchema?.definitions?.[
                  getRefText(statusObj as TJS.Definition)
                ] as TJS.Definition;

                const headersDef = (statusDef.properties as Record<string, TJS.Definition>)?.headers
                  ?.$ref
                  ? (methodsSchema?.definitions?.[
                      getRefText((statusDef.properties as Record<string, TJS.Definition>).headers)
                    ] as TJS.Definition)
                  : (statusDef.properties as Record<string, TJS.Definition>)?.headers;

                const resContentType =
                  ((headersDef?.properties?.['content-type'] as TJS.Definition)?.const as string) ??
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

                return {
                  ...dict,
                  [status]: {
                    description: '',
                    content: {
                      [resContentType]: {
                        schema: (statusDef.properties as Record<string, TJS.Definition>)?.body,
                      },
                    },
                    headers:
                      headersDef?.properties &&
                      Object.entries(headersDef.properties).reduce((dict, [key, val]) => {
                        return {
                          ...dict,
                          [key]: {
                            schema: val,
                            required: headersDef.required?.includes(key) ?? false,
                          },
                        };
                      }, {}),
                  },
                };
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

      docText = docText
        .replaceAll(`"${key.replaceAll('"', '\\"')}"`, `"${hash}"`)
        .replaceAll(
          `"#/components/schemas/${key.replaceAll('"', '\\"')}"`,
          `"#/components/schemas/${hash}"`,
        );

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

  return JSON.stringify(newDoc, null, 2);
};
