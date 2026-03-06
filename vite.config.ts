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
    poolOptions: { forks: { singleFork: true } },
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
      thresholds: { statements: 98, branches: 95, functions: 100, lines: 98 },
    },
  },
});
