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

module.exports = {analyzeFileType}
