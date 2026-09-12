import path from 'path';
import ts from 'typescript';
import { FROURIO_FILE } from './constants.js';

export const initTSC = (frourioDirs: string[]) => {
  const configDir = process.cwd();
  const configFileName = ts.findConfigFile(configDir, ts.sys.fileExists);
  const compilerOptions = configFileName
    ? ts.parseJsonConfigFileContent(
        ts.readConfigFile(configFileName, ts.sys.readFile).config,
        ts.sys,
        configDir,
      )
    : undefined;

  const program = ts.createProgram(
    frourioDirs.map((d) => path.posix.join(d, FROURIO_FILE)),
    compilerOptions?.options ?? {},
  );

  return { program, checker: program.getTypeChecker() };
};
