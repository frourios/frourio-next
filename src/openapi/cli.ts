import minimist from 'minimist';
import watch from '../watchInputDir.js';
import { generateOpenapi } from './generateOpenapi.js';
import { getOpenapiConfig } from './getOpenapiConfig.js';

export const run = async (args: string[]) => {
  const argv = minimist(args, {
    string: ['output', 'template', 'watch', 'root'],
    alias: { o: 'output', t: 'template', w: 'watch', r: 'root' },
  });
  const config = await getOpenapiConfig({
    output: argv.output,
    template: argv.template,
    root: argv.root,
  });

  generateOpenapi(config);

  if (argv.watch !== undefined && config.appDir) {
    watch(config.root ?? config.appDir, () => generateOpenapi(config));
  }
};
