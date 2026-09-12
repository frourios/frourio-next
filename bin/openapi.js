#!/usr/bin/env node
import { run } from '../dist/openapi/cli.js';

await run(process.argv.slice(2));
