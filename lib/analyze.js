const signatures = require('./signatures');

// Analyze file type and metadata
async function analyzeFileType(byteArray, filePath) {
    const header = byteArray.slice(0, 64); // Read first 64 bytes for signatures
    let fileType = 'Unknown';
    let extension = '.bin';
    const metadata = {
        filePath,
        size: byteArray.length,
        timestamp: new Date().toISOString()
    };

    // Check binary signatures
    for (const sig of signatures) {
        if (sig.groups && sig.groups.length > 0) {
            for (const group of sig.groups) {
                let allMatch = true;
                for (const condition of group) {
                    const sigBytes = condition.signature;
                    const offset = condition.offset;
                    if (header.length < offset + sigBytes.length) {
                        allMatch = false;
                        break;
                    }
                    for (let i = 0; i < sigBytes.length; i++) {
                        if (header[offset + i] !== sigBytes[i]) {
                            allMatch = false;
                            break;
                        }
                    }
                    if (!allMatch) break;
                }
                if (allMatch) {
                    fileType = sig.name;
                    extension = sig.extension;
                    Object.assign(metadata, sig.metadata(header, metadata));
                    return { fileType, extension, metadata };
                }
            }
        }
    }

    // Check text-based formats (e.g., SVG)
    const text = new TextDecoder('utf-8', { fatal: false }).decode(byteArray.slice(0, 100)).trim();
    for (const sig of signatures) {
        if (sig.textCheck && sig.textCheck(text)) {
            fileType = sig.name;
            extension = sig.extension;
            Object.assign(metadata, sig.metadata(header, metadata));
            break;
        }
    }

    return { fileType, extension, metadata };
}

async function analyzeHiddenData(mapper, directoryPath) {
    console.log('\n=== Hidden Data Analysis ===');
    
    for (const part of mapper.parts) {
        console.log(`\n--- ${part.name} ---`);
        console.log(`Description: ${part.description}`);
        console.log(`Size: ${part.size} bytes`);
        console.log(`Offset: ${part.offset}`);
        
        if (part.metadata && Object.keys(part.metadata).length > 0) {
            console.log('Metadata:');
            for (const [key, value] of Object.entries(part.metadata)) {
                console.log(`  ${key}: ${value}`);
            }
        }
        
        // Analyze specific parts for hidden data
        if (part.name.includes('metadata') || part.name.includes('exif')) {
            await analyzeMetadataPart(part, directoryPath);
        }
        
        if (part.name.includes('header')) {
            await analyzeHeaderPart(part, directoryPath);
        }
    }
}

async function analyzeMetadataPart(part, directoryPath) {
    try {
        const partPath = path.join(directoryPath, part.file);
        const hexContent = await fs.readFile(partPath, 'utf8');
        const byteArray = hexContent
            .trim()
            .split(' ')
            .map(hex => parseInt(hex, 16));
        
        // Try to extract readable strings
        const buffer = Buffer.from(byteArray);
        const text = buffer.toString('utf8', 0, Math.min(buffer.length, 1000));
        const readableStrings = text.match(/[\x20-\x7E]{4,}/g);
        
        if (readableStrings && readableStrings.length > 0) {
            console.log('  Readable strings found:');
            readableStrings.slice(0, 10).forEach(str => {
                console.log(`    "${str}"`);
            });
        }
        
        // Look for common metadata patterns
        const commonPatterns = {
            'GPS coordinates': /GPS/i,
            'Camera make': /(Canon|Nikon|Sony|Apple|Samsung)/i,
            'Software': /(Photoshop|GIMP|Lightroom)/i,
            'Timestamps': /\d{4}[:\-]\d{2}[:\-]\d{2}/,
            'Email addresses': /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
            'URLs': /https?:\/\/[^\s]+/
        };
        
        for (const [patternName, regex] of Object.entries(commonPatterns)) {
            const matches = text.match(regex);
            if (matches) {
                console.log(`  ${patternName} detected: ${matches[0]}`);
            }
        }
        
    } catch (error) {
        console.error(`Error analyzing metadata part ${part.name}:`, error.message);
    }
}

async function analyzeHeaderPart(part, directoryPath) {
    try {
        const partPath = path.join(directoryPath, part.file);
        const hexContent = await fs.readFile(partPath, 'utf8');
        const byteArray = hexContent
            .trim()
            .split(' ')
            .map(hex => parseInt(hex, 16));
        
        console.log('  Header hex analysis:');
        console.log(`    First 16 bytes: ${byteArray.slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
        
        // Check for embedded signatures
        const signatures = [
            { name: 'Embedded JPEG', pattern: [0xFF, 0xD8, 0xFF] },
            { name: 'Embedded PNG', pattern: [0x89, 0x50, 0x4E, 0x47] },
            { name: 'Embedded PDF', pattern: [0x25, 0x50, 0x44, 0x46] }
        ];
        
        for (const sig of signatures) {
            for (let i = 0; i <= byteArray.length - sig.pattern.length; i++) {
                let match = true;
                for (let j = 0; j < sig.pattern.length; j++) {
                    if (byteArray[i + j] !== sig.pattern[j]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    console.log(`  ${sig.name} signature found at offset ${i}`);
                }
            }
        }
        
    } catch (error) {
        console.error(`Error analyzing header part ${part.name}:`, error.message);
    }
}

module.exports = {analyzeFileType, analyzeHiddenData, analyzeMetadataPart , analyzeHeaderPart}
