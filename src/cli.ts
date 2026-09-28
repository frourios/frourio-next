import { parseArgs } from 'node:util';
import { generate } from './generate.js';
import { getConfig } from './getConfig.js';
import { watchInputDir } from './watchInputDir.js';

export const run = async (args: string[]) => {
  const { values } = parseArgs({
    args,
    options: { watch: { type: 'boolean', short: 'w' } },
  });

  const config = await getConfig();

  await generate(config);

  if (values.watch && config.appDir) {
    watchInputDir(config.appDir, () => generate(config));
  }
};
