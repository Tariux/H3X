const fs = require('fs').promises;
const path = require('path');
const { analyzeFileType } = require('./analyze');
const { extractFileParts } = require('./extractor');

// Convert file to hex representation with parts separation
async function fileToHex(filePath, outputDir) {
    try {
        const absolutePath = path.resolve(process.cwd(), filePath);
        const buffer = await fs.readFile(absolutePath);
        const byteArray = new Uint8Array(buffer);
        const analysis = await analyzeFileType(byteArray, absolutePath);
        
        // Create output directory if it doesn't exist
        const outputPath = path.resolve(process.cwd(), outputDir);
        await fs.mkdir(outputPath, { recursive: true });
        
        // Extract different parts
        const parts = await extractFileParts(byteArray, analysis, absolutePath);
        
        // Save each part as hex
        const mapper = {
            originalFile: path.basename(absolutePath),
            fileType: analysis.fileType,
            extension: analysis.extension,
            totalSize: byteArray.length,
            timestamp: new Date().toISOString(),
            parts: []
        };
        
        for (const part of parts) {
            const hexContent = Array.from(part.data)
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join(' ');
            
            const partFileName = `${part.name}.hex`;
            const partPath = path.join(outputPath, partFileName);
            await fs.writeFile(partPath, hexContent);
            
            mapper.parts.push({
                name: part.name,
                file: partFileName,
                description: part.description,
                offset: part.offset,
                size: part.data.length,
                metadata: part.metadata || {}
            });
            
            console.log(`${part.name} saved to: ${partFileName}`);
        }
        
        // Save mapper file
        const mapperPath = path.join(outputPath, 'mapper.json');
        await fs.writeFile(mapperPath, JSON.stringify(mapper, null, 2));
        
        console.log('\nFile Analysis:');
        console.log(JSON.stringify(analysis, null, 2));
        console.log(`\nAll parts saved to directory: ${outputPath}`);
        console.log(`Mapper file saved to: mapper.json`);
        
    } catch (error) {
        console.error('Error converting file to hex:', error.message);
    }
}

module.exports = { fileToHex };