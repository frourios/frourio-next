#!/usr/bin/env node
import { run } from '../dist/msw/cli.js';

await run(process.argv.slice(2));
