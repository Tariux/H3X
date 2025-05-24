const fs = require('fs').promises;
const path = require('path');
const { analyzeFileType } = require('./analyze');

// Convert file to hex representation
async function fileToHex(filePath) {
    try {
        const absolutePath = path.resolve(process.cwd(), filePath);
        const buffer = await fs.readFile(absolutePath);
        const byteArray = new Uint8Array(buffer);
        const hexOutput = Array.from(byteArray)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join(' ');
        const analysis = await analyzeFileType(byteArray, absolutePath);
        
        console.log('Hex Output:', hexOutput);
        console.log('\nFile Analysis:');
        console.log(JSON.stringify(analysis, null, 2));
        
        // Save hex output to a file
        const outputPath = path.join(path.dirname(absolutePath), 'output.hex');
        await fs.writeFile(outputPath, hexOutput);
        console.log(`Hex output saved to: ${outputPath}`);
    } catch (error) {
        console.error('Error converting file to hex:', error.message);
    }
}

module.exports = {fileToHex}