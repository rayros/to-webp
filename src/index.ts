#!/usr/bin/env node

import { join } from 'path';
import program from 'commander';
import { toWebP } from './to-webp';

program
  .description('')
  .requiredOption('-p, --pattern <pattern>', 'glob pattern')
  .parse(process.argv);

toWebP(join(process.cwd(), program.pattern))
  .then(() => {
    console.log('Conversion to webp complete.');
  })
  .catch((error: Error) => {
    console.error(error.message);
    process.exit(1);
  });
