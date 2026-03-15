import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { FROURIO_FILE, PACKAGE_NAME, SERVER_FILE } from './constants';

export const writeDefaults = async (frourioDirs: string[]) => {
  await Promise.all(
    frourioDirs.map(async (dirPath) => {
      const filePath = path.posix.join(dirPath, FROURIO_FILE);
      const fileText = await readFile(filePath, 'utf8');
      const routePath = path.posix.join(dirPath, 'route.ts');

      if (fileText !== '' || existsSync(routePath)) return;

      await Promise.all([
        writeFile(filePath, defaultData, 'utf8'),
        writeFile(routePath, defaultRouteData, 'utf8'),
      ]);
    }),
  );
};

const defaultData = `import type { FrourioSpec } from '${PACKAGE_NAME}';
import { z } from 'zod';

export const frourioSpec = {
  get: {
    res: { 200: { body: z.object({ value: z.string() }) } },
  },
} satisfies FrourioSpec;
`;

const defaultRouteData = `import { createRoute } from './${SERVER_FILE.replace('.ts', '')}';

export const { GET } = createRoute({
  get: async () => {
    return { status: 200, body: { value: 'ok' } };
  },
});
`;
