import { readdirSync } from 'fs';
import path from 'path';
import { FROURIO_FILE } from './constants.js';

const listDirNames = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).reduce<string[]>(
    (prev, d) => [
      ...prev,
      ...(d.isFile() && d.name === FROURIO_FILE
        ? [dir.replaceAll('\\', '/')]
        : !d.isDirectory() || d.name.startsWith('_')
          ? []
          : listDirNames(path.posix.join(dir, d.name))),
    ],
    [],
  );

export const listFrourioDirs = (dir: string): string[] => listDirNames(dir).sort();
