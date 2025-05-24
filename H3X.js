#!/usr/bin/env node

const { program } = require('commander');
const { fileToHex } = require('./lib/convert');
const { hexToFile } = require('./lib/parse');

// CLI setup
program
    .name('H3X')
    .description('CLI tool for converting files to hex and back');

program
    .command('convert')
    .description('Convert a file to hex representation')
    .argument('<file_path>', 'Path to the input file')
    .action(fileToHex);

program
    .command('parse')
    .description('Parse a hex file back to its original format')
    .argument('<file_path>', 'Path to the hex file')
    .action(hexToFile);

program.parseAsync(process.argv);