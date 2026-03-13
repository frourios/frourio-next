import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import ts from 'typescript';
import { FROURIO_FILE } from './constants';
import { generateClientTexts } from './generateClient';
import { generateServerTexts } from './generateServerTexts';
import type { Config } from './getConfig';
import { getGlobalType } from './getGlobalType';
import { getPropOptions, getSchemaOption, inferZodType, type PropOption } from './getPropOptions';
import { initTSC } from './initTSC';
import { listFrourioDirs } from './listFrourioDirs';
import { writeDefaults } from './writeDefaults';

export type HasParamsDict = Record<string, boolean>;

export type MiddlewareDict = Record<string, { hasCtx: boolean } | undefined>;

export type MethodInfo = {
  name: string;
  hasHeaders: boolean;
  query: { isOptional: boolean; props: PropOption[] } | null;
  body:
    | { isFormData: true; isUrlEncoded: false; data: PropOption[] }
    | { isUrlEncoded: true; isFormData: false; data: PropOption[] }
    | { isFormData: false; isUrlEncoded: false; type: 'text' | 'json' | 'arrayBuffer' | 'blob' }
    | null;
  res:
    | {
        status: string;
        hasHeaders: boolean;
        body: { type: 'text' | 'json' | 'arrayBuffer' | 'blob' } | null;
      }[]
    | undefined;
};

export type DirSpec = {
  dirPath: string;
  spec: { param: PropOption | null; methods: MethodInfo[] };
};

export const generate = async ({ appDir, basePath }: Config): Promise<void> => {
  if (!appDir) return;

  const frourioDirs = listFrourioDirs(appDir);

  await writeDefaults(frourioDirs);

  const { program, checker } = initTSC(frourioDirs);
  const hasParamDict: HasParamsDict = {};
  const middlewareDict: MiddlewareDict = {};
  const specs: DirSpec[] = frourioDirs
    .map((dirPath) => {
      const source = program.getSourceFile(path.posix.join(dirPath, FROURIO_FILE));
      const spec = source?.forEachChild((node) => {
        if (!ts.isVariableStatement(node)) return;

        const decl = node.declarationList.declarations.find(
          (d) => d.name.getText() === 'frourioSpec',
        );

        if (!decl?.initializer) return;

        const specProps = checker.getTypeAtLocation(decl.initializer).getProperties();
        const paramSymbol = specProps.find((t) => t.getName() === 'param');
        const paramZodType = paramSymbol ? inferZodType(checker, paramSymbol) : null;

        hasParamDict[dirPath] = !!paramSymbol;

        const middlewareSymbol = specProps.find((t) => t.getName() === 'middleware');
        const middlewareType =
          middlewareSymbol?.valueDeclaration &&
          checker.getTypeOfSymbolAtLocation(middlewareSymbol, middlewareSymbol.valueDeclaration);

        middlewareDict[dirPath] = middlewareType && {
          hasCtx: checker.typeToString(middlewareType) !== 'true',
        };

        return {
          param: paramZodType ? getSchemaOption(checker, paramZodType) : null,
          methods: specProps
            .map((t): MethodInfo | null => {
              if (t.getName() === 'param' || t.getName() === 'middleware') return null;

              const type =
                t.valueDeclaration && checker.getTypeOfSymbolAtLocation(t, t.valueDeclaration);

              if (!type) return null;

              const props = type.getProperties();
              const querySymbol = props.find((p) => p.getName() === 'query');
              const queryZodType = querySymbol ? inferZodType(checker, querySymbol) : null;
              const bodySymbol = props.find((p) => p.getName() === 'body');
              const bodyZodType = bodySymbol ? inferZodType(checker, bodySymbol) : null;
              const bodyType =
                bodyZodType?.valueDeclaration &&
                checker.getTypeOfSymbolAtLocation(bodyZodType, bodyZodType.valueDeclaration);
              const blobType = getGlobalType('Blob', checker);
              const res = props.find((p) => p.getName() === 'res');
              const resType =
                res?.valueDeclaration &&
                checker.getTypeOfSymbolAtLocation(res, res.valueDeclaration);

              return {
                name: t.getName(),
                hasHeaders: props.some((p) => p.getName() === 'headers'),
                query: queryZodType
                  ? {
                      isOptional: (() => {
                        if (!queryZodType.valueDeclaration) return false;

                        const zodType = checker.getTypeOfSymbolAtLocation(
                          queryZodType,
                          queryZodType.valueDeclaration,
                        );

                        return (
                          zodType.isUnion() &&
                          zodType.types.some((t) => t.flags & ts.TypeFlags.Undefined)
                        );
                      })(),
                      props: getPropOptions(checker, queryZodType) ?? [],
                    }
                  : null,
                body: props.some((p) => p.getName() === 'body')
                  ? (() => {
                      const formatSymbol = props.find((p) => p.getName() === 'format');
                      const formatType =
                        formatSymbol?.valueDeclaration &&
                        checker.getTypeOfSymbolAtLocation(
                          formatSymbol,
                          formatSymbol.valueDeclaration,
                        );
                      const formatValue = formatType ? checker.typeToString(formatType) : null;

                      if (formatValue === '"urlencoded"' && bodyZodType) {
                        return {
                          isUrlEncoded: true as const,
                          isFormData: false as const,
                          data: getPropOptions(checker, bodyZodType) ?? [],
                        };
                      }
                      if (formatSymbol && bodyZodType) {
                        return {
                          isFormData: true as const,
                          isUrlEncoded: false as const,
                          data: getPropOptions(checker, bodyZodType) ?? [],
                        };
                      }
                      return bodyType
                        ? {
                            isFormData: false as const,
                            isUrlEncoded: false as const,
                            type:
                              bodyType.getSymbol()?.getName() === 'ArrayBuffer'
                                ? ('arrayBuffer' as const)
                                : blobType && checker.isTypeAssignableTo(bodyType, blobType)
                                  ? ('blob' as const)
                                  : checker.isTypeAssignableTo(bodyType, checker.getStringType())
                                    ? ('text' as const)
                                    : ('json' as const),
                          }
                        : null;
                    })()
                  : null,
                res: resType
                  ?.getProperties()
                  .map((s) => {
                    const statusType =
                      s.valueDeclaration &&
                      checker.getTypeOfSymbolAtLocation(s, s.valueDeclaration);

                    if (!statusType) return null;

                    const statusProps = statusType.getProperties();
                    const resBodySymbol = statusProps.find((p) => p.getName() === 'body');
                    const resBodyZodType = resBodySymbol
                      ? inferZodType(checker, resBodySymbol)
                      : null;
                    const resBodyType =
                      resBodyZodType?.valueDeclaration &&
                      checker.getTypeOfSymbolAtLocation(
                        resBodyZodType,
                        resBodyZodType.valueDeclaration,
                      );

                    return {
                      status: s.getName(),
                      hasHeaders: statusProps.some((p) => p.getName() === 'headers'),
                      body: resBodyType
                        ? {
                            type:
                              resBodyType.getSymbol()?.getName() === 'ArrayBuffer'
                                ? ('arrayBuffer' as const)
                                : blobType && checker.isTypeAssignableTo(resBodyType, blobType)
                                  ? ('blob' as const)
                                  : checker.isTypeAssignableTo(resBodyType, checker.getStringType())
                                    ? ('text' as const)
                                    : ('json' as const),
                          }
                        : null,
                    };
                  })
                  .filter((s) => s !== null),
              };
            })
            .filter((n) => n !== null),
        };
      });

      return spec && { dirPath, spec };
    })
    .filter((d) => d !== undefined);

  await Promise.all(
    [
      ...generateServerTexts(specs, frourioDirs, middlewareDict),
      ...generateClientTexts(appDir, basePath, specs, hasParamDict),
    ].map(async (d) => {
      const needsUpdate =
        !existsSync(d.filePath) || (await readFile(d.filePath, 'utf8').then((t) => t !== d.text));

      return needsUpdate && writeFile(d.filePath, d.text);
    }),
  );
};
