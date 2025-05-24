
async function extractFileParts(byteArray, analysis, filePath) {
    const parts = [];
    const fileType = analysis.fileType;
    
    // Common parts for all files
    parts.push({
        name: 'header',
        data: byteArray.slice(0, Math.min(64, byteArray.length)),
        description: 'File header containing signature and initial metadata',
        offset: 0,
        metadata: {
            signature: Array.from(byteArray.slice(0, 8)).map(b => b.toString(16).padStart(2, '0')).join(' ')
        }
    });
    
    // File-specific parsing
    switch (fileType) {
        case 'JPEG':
            return extractJPEGParts(byteArray);
        case 'PNG':
            return extractPNGParts(byteArray);
        case 'PDF':
            return extractPDFParts(byteArray);
        case 'MP4':
        case 'MOV':
            return extractMP4Parts(byteArray);
        case 'MP3':
            return extractMP3Parts(byteArray);
        default:
            return extractGenericParts(byteArray);
    }
}

function extractJPEGParts(byteArray) {
    const parts = [];
    let offset = 0;
    
    // JPEG Header
    parts.push({
        name: 'jpeg_header',
        data: byteArray.slice(0, 20),
        description: 'JPEG file header with SOI marker',
        offset: 0,
        metadata: { marker: 'SOI (Start of Image)' }
    });
    
    // Find EXIF data if present
    if (byteArray[2] === 0xFF && byteArray[3] === 0xE1) {
        const exifLength = (byteArray[4] << 8) | byteArray[5];
        parts.push({
            name: 'exif_metadata',
            data: byteArray.slice(2, 2 + exifLength + 2),
            description: 'EXIF metadata containing camera settings and GPS data',
            offset: 2,
            metadata: { type: 'EXIF', length: exifLength }
        });
        offset = 2 + exifLength + 2;
    } else {
        offset = 20;
    }
    
    // Image data
    parts.push({
        name: 'image_data',
        data: byteArray.slice(offset, -2),
        description: 'Compressed image data',
        offset: offset
    });
    
    // EOI marker
    parts.push({
        name: 'jpeg_footer',
        data: byteArray.slice(-2),
        description: 'JPEG End of Image marker',
        offset: byteArray.length - 2,
        metadata: { marker: 'EOI (End of Image)' }
    });
    
    return parts;
}

function extractPNGParts(byteArray) {
    const parts = [];
    let offset = 0;
    
    // PNG Signature
    parts.push({
        name: 'png_signature',
        data: byteArray.slice(0, 8),
        description: 'PNG file signature',
        offset: 0
    });
    offset = 8;
    
    // Parse chunks
    while (offset < byteArray.length - 8) {
        const length = (byteArray[offset] << 24) | (byteArray[offset + 1] << 16) | 
                      (byteArray[offset + 2] << 8) | byteArray[offset + 3];
        const type = String.fromCharCode(...byteArray.slice(offset + 4, offset + 8));
        
        const chunkData = byteArray.slice(offset, offset + length + 12);
        
        parts.push({
            name: `png_chunk_${type.toLowerCase()}`,
            data: chunkData,
            description: `PNG ${type} chunk`,
            offset: offset,
            metadata: { chunkType: type, dataLength: length }
        });
        
        offset += length + 12;
        
        if (type === 'IEND') break;
    }
    
    return parts;
}

function extractPDFParts(byteArray) {
    const parts = [];
    const text = new TextDecoder('utf-8', { fatal: false }).decode(byteArray);
    
    // PDF Header
    parts.push({
        name: 'pdf_header',
        data: byteArray.slice(0, 100),
        description: 'PDF header with version information',
        offset: 0
    });
    
    // Find metadata
    const metadataStart = text.indexOf('/Info');
    if (metadataStart !== -1) {
        const metadataEnd = text.indexOf('>>', metadataStart);
        if (metadataEnd !== -1) {
            parts.push({
                name: 'pdf_metadata',
                data: byteArray.slice(metadataStart, metadataEnd + 2),
                description: 'PDF metadata including title, author, creation date',
                offset: metadataStart
            });
        }
    }
    
    // PDF Body (simplified)
    const bodyStart = text.indexOf('stream');
    if (bodyStart !== -1) {
        const trailerStart = text.lastIndexOf('trailer');
        parts.push({
            name: 'pdf_body',
            data: byteArray.slice(bodyStart, trailerStart !== -1 ? trailerStart : byteArray.length - 100),
            description: 'PDF content streams and objects',
            offset: bodyStart
        });
    }
    
    // PDF Trailer
    const trailerStart = text.lastIndexOf('trailer');
    if (trailerStart !== -1) {
        parts.push({
            name: 'pdf_trailer',
            data: byteArray.slice(trailerStart),
            description: 'PDF trailer with cross-reference table',
            offset: trailerStart
        });
    }
    
    return parts;
}

function extractMP4Parts(byteArray) {
    const parts = [];
    let offset = 0;
    
    // Parse MP4 atoms/boxes
    while (offset < byteArray.length - 8) {
        const size = (byteArray[offset] << 24) | (byteArray[offset + 1] << 16) | 
                    (byteArray[offset + 2] << 8) | byteArray[offset + 3];
        const type = String.fromCharCode(...byteArray.slice(offset + 4, offset + 8));
        
        if (size === 0 || size > byteArray.length - offset) break;
        
        const atomData = byteArray.slice(offset, offset + size);
        
        parts.push({
            name: `mp4_atom_${type.toLowerCase()}`,
            data: atomData,
            description: `MP4 ${type} atom`,
            offset: offset,
            metadata: { atomType: type, atomSize: size }
        });
        
        offset += size;
        
        // Limit to prevent too many small atoms
        if (parts.length > 20) break;
    }
    
    return parts;
}

function extractMP3Parts(byteArray) {
    const parts = [];
    
    // ID3v2 header if present
    if (byteArray[0] === 0x49 && byteArray[1] === 0x44 && byteArray[2] === 0x33) {
        const id3Size = ((byteArray[6] & 0x7F) << 21) | ((byteArray[7] & 0x7F) << 14) | 
                       ((byteArray[8] & 0x7F) << 7) | (byteArray[9] & 0x7F);
        
        parts.push({
            name: 'id3v2_metadata',
            data: byteArray.slice(0, id3Size + 10),
            description: 'ID3v2 metadata tags (title, artist, album, etc.)',
            offset: 0,
            metadata: { version: `2.${byteArray[3]}.${byteArray[4]}`, size: id3Size }
        });
        
        // Audio data
        parts.push({
            name: 'mp3_audio_data',
            data: byteArray.slice(id3Size + 10, -128),
            description: 'MP3 audio frames',
            offset: id3Size + 10
        });
    } else {
        // No ID3v2, check for audio data
        parts.push({
            name: 'mp3_audio_data',
            data: byteArray.slice(0, -128),
            description: 'MP3 audio frames',
            offset: 0
        });
    }
    
    // ID3v1 tag (last 128 bytes)
    if (byteArray.length >= 128) {
        const id3v1Start = byteArray.length - 128;
        if (byteArray[id3v1Start] === 0x54 && byteArray[id3v1Start + 1] === 0x41 && byteArray[id3v1Start + 2] === 0x47) {
            parts.push({
                name: 'id3v1_metadata',
                data: byteArray.slice(-128),
                description: 'ID3v1 metadata tag',
                offset: id3v1Start,
                metadata: { version: '1.0' }
            });
        }
    }
    
    return parts;
}

function extractGenericParts(byteArray) {
    const parts = [];
    const chunkSize = 1024; // 1KB chunks
    
    // Header
    parts.push({
        name: 'file_header',
        data: byteArray.slice(0, Math.min(256, byteArray.length)),
        description: 'File header and signature',
        offset: 0
    });
    
    // Body chunks
    let offset = 256;
    let chunkIndex = 1;
    while (offset < byteArray.length - 256 && chunkIndex <= 10) {
        const chunkEnd = Math.min(offset + chunkSize, byteArray.length - 256);
        parts.push({
            name: `data_chunk_${chunkIndex}`,
            data: byteArray.slice(offset, chunkEnd),
            description: `Data chunk ${chunkIndex}`,
            offset: offset
        });
        offset = chunkEnd;
        chunkIndex++;
    }
    
    // Footer
    if (byteArray.length > 256) {
        parts.push({
            name: 'file_footer',
            data: byteArray.slice(-256),
            description: 'File footer and trailing data',
            offset: byteArray.length - 256
        });
    }
    
    return parts;
}

module.exports = {extractFileParts}