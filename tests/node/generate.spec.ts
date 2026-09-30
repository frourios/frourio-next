import { existsSync, mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from 'fs';
import path from 'path';
import { expect, test } from 'vitest';
import { generate } from '../../src/generate';
import { generateMsw } from '../../src/msw/generateMsw';
import { generateOpenapi } from '../../src/openapi/generateOpenapi';

test('generation removes obsolete server, client, middleware, and params files', async () => {
  const appDir = mkdtempSync(path.resolve('tests/node/.generate-lifecycle-'));
  let dir = path.join(appDir, '[id]');
  mkdirSync(dir);
  const spec = path.join(dir, 'frourio.ts');
  const config = { appDir, basePath: undefined };
  const files = [
    'frourio.server.ts',
    'frourio.client.ts',
    'frourio.middleware.ts',
    'frourio.params.ts',
  ];

  try {
    writeFileSync(
      spec,
      `
import type { FrourioSpec } from '@frourio/next';
import { z } from 'zod';
export const frourioSpec = {
  param: z.string(),
  middleware: { context: z.object({ userId: z.string() }) },
  get: {
    query: z.object({ search: z.string().optional() }).optional(),
    res: { 200: { cookies: { theme: { command: 'set', value: z.enum(['dark', 'light']) } } } },
  },
} satisfies FrourioSpec;
`,
    );
    await generate(config);
    for (const file of files) expect(existsSync(path.join(dir, file)), file).toBe(true);
    // A static endpoint with no methods or middleware needs none of the old helpers.
    writeFileSync(spec, 'export const frourioSpec = {};\n');
    const staticDir = path.join(appDir, 'static');
    renameSync(dir, staticDir);
    dir = staticDir;
    await generate(config);
    for (const file of files) expect(existsSync(path.join(dir, file)), file).toBe(false);
    expect(existsSync(path.join(dir, 'frourio.ts'))).toBe(true);
    await generate(config);
    for (const file of files) expect(existsSync(path.join(dir, file)), file).toBe(false);
  } finally {
    rmSync(appDir, { recursive: true, force: true });
  }
}, 100000);

test('generators do not create files when no app directory is configured', async () => {
  const dir = mkdtempSync(path.resolve('tests/node/.generate-no-app-'));
  const output = path.join(dir, 'output.ts');
  const template = path.join(dir, 'template.json');
  try {
    await generate({ appDir: undefined, basePath: undefined });
    generateMsw({ appDir: undefined, output });
    generateOpenapi({ appDir: undefined, basePath: undefined, root: undefined, template, output });
    expect(existsSync(output)).toBe(false);
    expect(existsSync(template)).toBe(false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
