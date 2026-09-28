import minimist from 'minimist';
import { watchInputDir } from '../watchInputDir.js';
import { generateMsw } from './generateMsw.js';
import { getMswConfig } from './getMswConfig.js';

export const run = async (args: string[]) => {
  const argv = minimist(args, {
    string: ['output', 'watch'],
    alias: { o: 'output', w: 'watch' },
  });
  const config = await getMswConfig({ output: argv.output });

  generateMsw(config);

  if (argv.watch !== undefined && config.appDir) {
    watchInputDir(config.appDir, () => generateMsw(config));
  }
};
