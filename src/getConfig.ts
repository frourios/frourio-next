import fs from 'fs';
import type { NextConfig } from 'next';
import path from 'path';

export type Config = { appDir: string | undefined; basePath: string | undefined };

export const getConfig = async (dir = process.cwd()): Promise<Config> => {
  const srcDir = fs.existsSync(path.posix.join(dir, 'src/app')) ? path.posix.join(dir, 'src') : dir;
  const appDir = path.posix.join(srcDir, 'app').replaceAll('\\', '/');
  const isAppDirUsed = fs.existsSync(appDir);
  const nextConfig: NextConfig = await require('next/dist/server/config').default(
    require('next/constants').PHASE_PRODUCTION_BUILD,
    dir,
  );

  return { appDir: isAppDirUsed ? appDir : undefined, basePath: nextConfig.basePath };
};
