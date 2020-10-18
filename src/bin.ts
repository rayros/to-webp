#!/usr/bin/env node

import program from 'commander';
import { toWebP } from '.';

program
  .description('Convert png,jpg to webp if modification date is different.')
  .requiredOption("-p, --pattern '<pattern>'", 'glob path pattern')
  .parse(process.argv);

toWebP(program.pattern)
  .then(() => {
    console.log('Conversion to webp complete.');
  })
  .catch((error: Error) => {
    console.error(error.message);
    process.exit(1);
  });
