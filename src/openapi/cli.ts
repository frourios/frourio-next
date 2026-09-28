import { parseArgs } from 'node:util';
import { watchInputDir } from '../watchInputDir.js';
import { generateOpenapi } from './generateOpenapi.js';
import { getOpenapiConfig } from './getOpenapiConfig.js';

export const run = async (args: string[]) => {
  const { values } = parseArgs({
    args,
    options: {
      output: { type: 'string', short: 'o' },
      template: { type: 'string', short: 't' },
      watch: { type: 'boolean', short: 'w' },
      root: { type: 'string', short: 'r' },
    },
  });
  const config = await getOpenapiConfig({
    output: values.output,
    template: values.template,
    root: values.root,
  });

  generateOpenapi(config);

  if (values.watch && config.appDir) {
    watchInputDir(config.root ?? config.appDir, () => generateOpenapi(config));
  }
};
