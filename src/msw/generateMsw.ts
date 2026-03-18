import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import ts from 'typescript';
import { FROURIO_FILE } from '../constants';
import { createHash } from '../createHash';
import { initTSC } from '../initTSC';
import { listFrourioDirs } from '../listFrourioDirs';
import type { MswConfig } from './getMswConfig';

export const generateMsw = ({ appDir, output }: MswConfig) => {
  if (!appDir) return;

  const frourioDirs = listFrourioDirs(path.resolve(appDir));
  const { program, checker } = initTSC(frourioDirs);
  const specs = frourioDirs
    .map((dirPath) => {
      const source = program.getSourceFile(path.posix.join(dirPath, FROURIO_FILE));
      const methods = source?.forEachChild((node) => {
        if (!ts.isVariableStatement(node)) return;

        const decl = node.declarationList.declarations.find(
          (d) => d.name.getText() === 'frourioSpec',
        );

        if (!decl?.initializer) return;

        const specProps = checker.getTypeAtLocation(decl.initializer).getProperties();

        return specProps
          .map((t) =>
            t.getName() === 'param' || t.getName() === 'middleware' ? null : t.getName(),
          )
          .filter((n) => n !== null);
      });

      return methods && { posixDirPath: dirPath.replaceAll('\\', '/'), methods };
    })
    .filter((d) => d !== undefined)
    .filter((d) => d.methods.length > 0);

  const posixAppDir = appDir.replaceAll('\\', '/');
  const mswText = `import { http, type RequestHandler } from 'msw';
${specs.map(({ posixDirPath }) => `import * as route_${createHash(posixDirPath.replace(posixAppDir, ''))} from '${path.posix.relative(path.posix.resolve(output.replaceAll('\\', '/')).split('/').slice(0, -1).join('/'), `${posixDirPath}/route`)}';\n`).join('')}
export const patchDuplicateCookie = (req: Request): Request => {
  const cookie = req.headers.get('cookie');

  if (cookie) {
    const unique = [...new Set(cookie.split(/,\\s*/).flatMap((s) => s.split('; ')))];
    req.headers.set('cookie', unique.join('; '));
  }

  return req;
};

export function setupMswHandlers(option?: { baseURL: string }): RequestHandler[] {
  const baseURL = option?.baseURL.replace(/\\/$/, '') ?? '';

  return [
${specs
  .flatMap(({ posixDirPath, methods }) => {
    const methodPath = posixDirPath.replace(posixAppDir, '').replace(/\(.+\)\/?/g, '');
    const hasParams = methodPath.includes('/[');
    const paramsChunk = hasParams
      ? `
      const pathChunks = request.url.replace(baseURL || /https?:\\/\\/[^/]+/, '').split('/');
      const params = {${methodPath
        .split('/')
        .flatMap((name, index) =>
          name.startsWith('[')
            ? ` '${name.replace(/[[\].]/g, '')}': ${name.includes('...') ? `pathChunks.slice(${index})` : `\`\${pathChunks[${index}]}\``}`
            : [],
        )
        .join(',')} };\n`
      : '';

    return methods.map((method) => {
      return `    http.${method}(\`\${baseURL}${methodPath.replace(/\[+\.\.\..+?]+/, '*').replace(/\[(.+?)]/g, ':$1')}\`, ({ request }) => {${paramsChunk}
      return route_${createHash(posixDirPath.replace(posixAppDir, ''))}.${method.toUpperCase()}(patchDuplicateCookie(request)${
        hasParams ? `, { params: Promise.resolve(params) }` : ''
      });
    }),\n`;
    });
  })
  .join('')}  ];
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
`;

  if (existsSync(output) && readFileSync(output, 'utf8') === mswText) return;

  writeFileSync(output, mswText);
  console.log(`${output} was generated successfully.`);
};
