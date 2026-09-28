import { parseArgs } from 'node:util';
import { watchInputDir } from '../watchInputDir.js';
import { generateMsw } from './generateMsw.js';
import { getMswConfig } from './getMswConfig.js';

export const run = async (args: string[]) => {
  const { values } = parseArgs({
    args,
    options: {
      output: { type: 'string', short: 'o' },
      watch: { type: 'boolean', short: 'w' },
    },
  });
  const config = await getMswConfig({ output: values.output });

  generateMsw(config);

  if (values.watch && config.appDir) {
    watchInputDir(config.appDir, () => generateMsw(config));
  }
};
