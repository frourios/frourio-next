import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          environment: 'happy-dom',
          include: ['tests/browser/*.spec.*'],
          setupFiles: ['./tests/browser/setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          environment: 'node',
          include: ['tests/node/*'],
        },
      },
    ],
    maxWorkers: 1,
    coverage: {
      include: ['src/**/*.ts'],
      exclude: [
        'src/cli.ts',
        'src/getConfig.ts',
        'src/initTSC.ts',
        'src/watchInputDir.ts',
        'src/writeDefaults.ts',
        'src/openapi/cli.ts',
        'src/msw/cli.ts',
      ],
      thresholds: { statements: 96, branches: 95, functions: 99, lines: 98 },
    },
  },
});
