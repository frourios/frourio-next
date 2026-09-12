import path from 'path';
import { getConfig } from '../getConfig.js';

export type MswConfig = { appDir: string | undefined; output: string };

export const getMswConfig = async ({
  output,
  dir = process.cwd(),
}: {
  output: string | undefined;
  dir?: string;
}): Promise<MswConfig> => {
  const config = await getConfig(dir);

  return { ...config, output: output ?? path.posix.join(dir, 'tests/setupMswHandlers.ts') };
};
