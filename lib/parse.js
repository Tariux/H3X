const fs = require('fs').promises;
const path = require('path');
const { analyzeFileType, analyzeHiddenData } = require('./analyze');
const { reassembleParts } = require('./assemble');

// Parse hex files back to original file using mapper
async function hexToFile(directoryPath) {
    try {
        const absolutePath = path.resolve(process.cwd(), directoryPath);
        
        // Read mapper file
        const mapperPath = path.join(absolutePath, 'mapper.json');
        const mapperContent = await fs.readFile(mapperPath, 'utf8');
        const mapper = JSON.parse(mapperContent);
        
        console.log(`Reassembling: ${mapper.originalFile}`);
        console.log(`File type: ${mapper.fileType}`);
        console.log(`Total parts: ${mapper.parts.length}`);
        
        // Read and combine all parts
        const combinedBuffer = await reassembleParts(absolutePath, mapper);
        
        // Analyze the reassembled file
        const analysis = await analyzeFileType(new Uint8Array(combinedBuffer), mapper.originalFile);
        
        // Save the reassembled file
        const outputFileName = `restored_${mapper.originalFile}`;
        const outputPath = path.join(absolutePath, outputFileName);
        await fs.writeFile(outputPath, combinedBuffer);
        
        console.log('\nFile restored successfully!');
        console.log(`Output saved to: ${outputFileName}`);
        console.log('\nReassembled File Analysis:');
        console.log(JSON.stringify(analysis, null, 2));
        
        // Display hidden data analysis
        await analyzeHiddenData(mapper, absolutePath);
        
    } catch (error) {
        console.error('Error parsing hex to file:', error.message);
    }
}



module.exports = { hexToFile }