import path from 'path';
import { getConfig } from '../getConfig';

export type OpenapiConfig = {
  appDir: string | undefined;
  basePath: string | undefined;
  output: string;
  template: string;
  root: string | undefined;
};

export const getOpenapiConfig = async ({
  output,
  template,
  root,
  dir = process.cwd(),
}: {
  output: string | undefined;
  template: string | undefined;
  root: string | undefined;
  dir?: string;
}): Promise<OpenapiConfig> => {
  const config = await getConfig(dir);
  const resolvedOutput = output ?? path.posix.join(dir, 'public/openapi.json');

  return {
    ...config,
    output: resolvedOutput,
    template: template ?? path.posix.join(path.dirname(resolvedOutput), 'openapi_template.json'),
    root,
  };
};
