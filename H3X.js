#!/usr/bin/env node

const { program } = require('commander');
const { fileToHex } = require('./lib/convert');
const { hexToFile } = require('./lib/parse');

// CLI setup
program
    .name('H3X')
    .description('CLI tool for converting files to hex parts and reassembling them')
    .version('2.0.0');

program
    .command('convert')
    .description('Convert a file to hex representation with separated parts')
    .argument('<file_path>', 'Path to the input file')
    .argument('<output_directory>', 'Directory to save hex parts (will be created if it doesn\'t exist)')
    .action((filePath, outputDirectory) => {
        fileToHex(filePath, outputDirectory);
    });

program
    .command('parse')
    .description('Parse hex parts back to original file using mapper.json')
    .argument('<directory_path>', 'Path to directory containing hex parts and mapper.json')
    .action((directoryPath) => {
        hexToFile(directoryPath);
    });

// Add help examples
program.on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  $ h3x convert sample.mp4 ./output_parts');
    console.log('  $ h3x convert image.jpg ./my_analysis');
    console.log('  $ h3x parse ./output_parts');
    console.log('  $ h3x parse ./my_analysis');
    console.log('');
    console.log('The convert command will create the output directory and save:');
    console.log('  - Multiple .hex files (header, metadata, body parts, etc.)');
    console.log('  - mapper.json file for reassembly and metadata analysis');
    console.log('');
    console.log('The parse command will:');
    console.log('  - Read mapper.json from the specified directory');
    console.log('  - Reassemble all .hex parts into the original file');
    console.log('  - Analyze hidden data and metadata');
});

program.parseAsync(process.argv);
