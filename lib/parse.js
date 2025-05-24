const fs = require('fs').promises;
const path = require('path');
const { analyzeFileType } = require('./analyze');

// Convert hex back to file
async function hexToFile(hexFilePath) {
    try {
        const absolutePath = path.resolve(process.cwd(), hexFilePath);
        const hexContent = await fs.readFile(absolutePath, 'utf8');
        const byteArray = hexContent
            .trim()
            .split(' ')
            .map(hex => parseInt(hex, 16));
        
        const buffer = Buffer.from(byteArray);
        const analysis = await analyzeFileType(new Uint8Array(buffer), absolutePath);
        
        const outputPath = path.join(path.dirname(absolutePath), 'output_restored' + (analysis.extension || '.bin'));
        await fs.writeFile(outputPath, buffer);
        
        console.log('File restored successfully!');
        console.log(`Output saved to: ${outputPath}`);
        console.log('\nFile Analysis:');
        console.log(JSON.stringify(analysis, null, 2));
    } catch (error) {
        console.error('Error parsing hex to file:', error.message);
    }
}

module.exports = {hexToFile}
