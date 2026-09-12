import minimist from 'minimist';
import { generate } from './generate.js';
import { getConfig } from './getConfig.js';
import watch from './watchInputDir.js';

export const run = async (args: string[]) => {
  const argv = minimist(args, {
    string: ['watch'],
    alias: { w: 'watch' },
  });

  const config = await getConfig();

  await generate(config);

  if (argv.watch !== undefined && config.appDir) {
    watch(config.appDir, () => generate(config));
  }
};
