const signatures = [
    // Images
    {
        name: 'JPEG',
        extension: '.jpg',
        groups: [[{ signature: [0xFF, 0xD8, 0xFF], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'image/jpeg',
            details: header[3] === 0xE0 ? 'JFIF format' : 'EXIF format'
        })
    },
    {
        name: 'PNG',
        extension: '.png',
        groups: [[{ signature: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'image/png',
            details: 'PNG image'
        })
    },
    {
        name: 'GIF',
        extension: '.gif',
        groups: [[{ signature: [0x47, 0x49, 0x46, 0x38], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'image/gif',
            version: String.fromCharCode(header[4]) === '7' ? 'GIF87a' : 'GIF89a'
        })
    },
    {
        name: 'BMP',
        extension: '.bmp',
        groups: [[{ signature: [0x42, 0x4D], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'image/bmp',
            fileSize: metadata.size
        })
    },
    {
        name: 'TIFF',
        extension: '.tiff',
        groups: [
            [{ signature: [0x49, 0x49, 0x2A, 0x00], offset: 0 }], // Little-endian
            [{ signature: [0x4D, 0x4D, 0x00, 0x2A], offset: 0 }]  // Big-endian
        ],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'image/tiff',
            endianness: header[0] === 0x49 ? 'Little-endian' : 'Big-endian'
        })
    },
    {
        name: 'WebP',
        extension: '.webp',
        groups: [[
            { signature: [0x52, 0x49, 0x46, 0x46], offset: 0 },
            { signature: [0x57, 0x45, 0x42, 0x50], offset: 8 }
        ]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'image/webp',
            details: 'WebP image'
        })
    },
    // Videos
    {
        name: 'MOV',
        extension: '.mov',
        groups: [[
            { signature: [0x66, 0x74, 0x79, 0x70], offset: 4 },
            { signature: [0x71, 0x74, 0x20, 0x20], offset: 8 }
        ]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'video/quicktime',
            details: 'QuickTime MOV'
        })
    },
    {
        name: 'MP4',
        extension: '.mp4',
        groups: [[
            { signature: [0x66, 0x74, 0x79, 0x70], offset: 4 }
        ]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'video/mp4',
            details: 'MPEG-4 video'
        })
    },
    {
        name: 'AVI',
        extension: '.avi',
        groups: [[
            { signature: [0x52, 0x49, 0x46, 0x46], offset: 0 },
            { signature: [0x41, 0x56, 0x49, 0x20], offset: 8 }
        ]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'video/x-msvideo',
            details: 'AVI video'
        })
    },
    {
        name: 'MKV',
        extension: '.mkv',
        groups: [[{ signature: [0x1A, 0x45, 0xDF, 0xA3], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'video/x-matroska',
            details: 'Matroska video'
        })
    },
    // Vectors
    {
        name: 'PDF',
        extension: '.pdf',
        groups: [[{ signature: [0x25, 0x50, 0x44, 0x46, 0x2D], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'application/pdf',
            version: String.fromCharCode(header[5]) + '.' + String.fromCharCode(header[7]),
            note: 'May also be an Adobe Illustrator (.ai) file'
        })
    },
    {
        name: 'SVG',
        extension: '.svg',
        groups: [],
        textCheck: (text) => text.includes('<svg') || text.includes('<?xml'),
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'image/svg+xml',
            details: 'Scalable Vector Graphics'
        })
    },
    // Audio
    {
        name: 'MP3',
        extension: '.mp3',
        groups: [[{ signature: [0x49, 0x44, 0x33], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'audio/mpeg',
            details: 'MP3 audio'
        })
    },
    {
        name: 'WAV',
        extension: '.wav',
        groups: [[
            { signature: [0x52, 0x49, 0x46, 0x46], offset: 0 },
            { signature: [0x57, 0x41, 0x56, 0x45], offset: 8 }
        ]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'audio/wav',
            details: 'WAV audio'
        })
    },
    {
        name: 'FLAC',
        extension: '.flac',
        groups: [[{ signature: [0x66, 0x4C, 0x61, 0x43], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'audio/flac',
            details: 'FLAC audio'
        })
    },
    {
        name: 'OGG',
        extension: '.ogg',
        groups: [[{ signature: [0x4F, 0x67, 0x67, 0x53], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'audio/ogg',
            details: 'Ogg Vorbis audio'
        })
    },
    // Documents
    {
        name: 'DOCX',
        extension: '.docx',
        groups: [[{ signature: [0x50, 0x4B, 0x03, 0x04], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            details: 'Microsoft Word document'
        })
    },
    {
        name: 'XLSX',
        extension: '.xlsx',
        groups: [[{ signature: [0x50, 0x4B, 0x03, 0x04], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            details: 'Microsoft Excel spreadsheet'
        })
    },
    {
        name: 'PPTX',
        extension: '.pptx',
        groups: [[{ signature: [0x50, 0x4B, 0x03, 0x04], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            details: 'Microsoft PowerPoint presentation'
        })
    },
    {
        name: 'DOC',
        extension: '.doc',
        groups: [[{ signature: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'application/msword',
            details: 'Microsoft Word document'
        })
    },
    {
        name: 'XLS',
        extension: '.xls',
        groups: [[{ signature: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'application/vnd.ms-excel',
            details: 'Microsoft Excel spreadsheet'
        })
    },
    {
        name: 'PPT',
        extension: '.ppt',
        groups: [[{ signature: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'application/vnd.ms-powerpoint',
            details: 'Microsoft PowerPoint presentation'
        })
    },
    // Archives
    {
        name: 'ZIP',
        extension: '.zip',
        groups: [[{ signature: [0x50, 0x4B, 0x03, 0x04], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'application/zip',
            details: 'ZIP archive'
        })
    },
    {
        name: 'RAR',
        extension: '.rar',
        groups: [[{ signature: [0x52, 0x61, 0x72, 0x21], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'application/x-rar-compressed',
            details: 'RAR archive'
        })
    },
    {
        name: '7Z',
        extension: '.7z',
        groups: [[{ signature: [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'application/x-7z-compressed',
            details: '7-Zip archive'
        })
    },
    {
        name: 'TAR',
        extension: '.tar',
        groups: [[{ signature: [0x75, 0x73, 0x74, 0x61, 0x72], offset: 257 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'application/x-tar',
            details: 'TAR archive'
        })
    },
    {
        name: 'GZIP',
        extension: '.gz',
        groups: [[{ signature: [0x1F, 0x8B], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'application/gzip',
            details: 'GZIP compressed file'
        })
    },
    // Images
    {
        name: 'ICO',
        extension: '.ico',
        groups: [[{ signature: [0x00, 0x00, 0x01, 0x00], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'image/x-icon',
            details: 'Icon file'
        })
    },
    {
        name: 'HEIC',
        extension: '.heic',
        groups: [[{ signature: [0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63], offset: 4 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'image/heic',
            details: 'High Efficiency Image File Format'
        })
    },
    // Executables
    {
        name: 'EXE',
        extension: '.exe',
        groups: [[{ signature: [0x4D, 0x5A], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'application/x-msdownload',
            details: 'Windows executable'
        })
    },
    // Fonts
    {
        name: 'TTF',
        extension: '.ttf',
        groups: [[{ signature: [0x00, 0x01, 0x00, 0x00], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'font/ttf',
            details: 'TrueType Font'
        })
    },
    {
        name: 'OTF',
        extension: '.otf',
        groups: [[{ signature: [0x4F, 0x54, 0x54, 0x4F], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'font/otf',
            details: 'OpenType Font'
        })
    },
    // Database
    {
        name: 'SQLite',
        extension: '.db',
        groups: [[{ signature: [0x53, 0x51, 0x4C, 0x69, 0x74, 0x65, 0x20, 0x66, 0x6F, 0x72, 0x6D, 0x61, 0x74, 0x20, 0x33, 0x00], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'application/x-sqlite3',
            details: 'SQLite database'
        })
    },
    // Images
    {
        name: 'PSD',
        extension: '.psd',
        groups: [[{ signature: [0x38, 0x42, 0x50, 0x53], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'image/vnd.adobe.photoshop',
            details: 'Adobe Photoshop document'
        })
    },
    // Audio
    {
        name: 'MIDI',
        extension: '.mid',
        groups: [[{ signature: [0x4D, 0x54, 0x68, 0x64], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'audio/midi',
            details: 'MIDI file'
        })
    },
    // Video
    {
        name: 'WMV',
        extension: '.wmv',
        groups: [[{ signature: [0x30, 0x26, 0xB2, 0x75, 0x8E, 0x66, 0xCF, 0x11, 0xA6, 0xD9, 0x00, 0xAA, 0x00, 0x62, 0xCE, 0x6C], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'video/x-ms-wmv',
            details: 'Windows Media Video'
        })
    },
    {
        name: 'FLV',
        extension: '.flv',
        groups: [[{ signature: [0x46, 0x4C, 0x56], offset: 0 }]],
        metadata: (header, metadata) => ({
            ...metadata,
            mimeType: 'video/x-flv',
            details: 'Flash Video'
        })
    }
];

// To integrate, append to your existing signatures array:
module.exports = signatures;