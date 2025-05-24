
const fs = require('fs').promises;
const path = require('path');

async function reassembleParts(directoryPath, mapper) {
    const buffers = [];
    
    // Sort parts by offset to maintain correct order
    const sortedParts = mapper.parts.sort((a, b) => (a.offset || 0) - (b.offset || 0));
    
    for (const part of sortedParts) {
        console.log(`Reading part: ${part.file}`);
        const partPath = path.join(directoryPath, part.file);
        
        try {
            const hexContent = await fs.readFile(partPath, 'utf8');
            const byteArray = hexContent
                .trim()
                .split(' ')
                .filter(hex => hex.length > 0)
                .map(hex => parseInt(hex, 16));
            
            buffers.push(Buffer.from(byteArray));
            console.log(`✓ Loaded ${part.name}: ${byteArray.length} bytes`);
        } catch (error) {
            console.error(`✗ Error reading part ${part.file}:`, error.message);
            throw error;
        }
    }
    
    // Combine all buffers
    const totalLength = buffers.reduce((sum, buffer) => sum + buffer.length, 0);
    const combinedBuffer = Buffer.concat(buffers, totalLength);
    
    console.log(`\nTotal reassembled size: ${combinedBuffer.length} bytes`);
    console.log(`Expected size: ${mapper.totalSize} bytes`);
    
    if (combinedBuffer.length !== mapper.totalSize) {
        console.warn('⚠️  Warning: Reassembled size does not match original size!');
    }
    
    return combinedBuffer;
}

module.exports = {reassembleParts}