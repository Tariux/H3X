# File Signatures Table

| File Type | Extension | Signature (Hex) | Offset | MIME Type | Description |
|-----------|-----------|-----------------|--------|-----------|-------------|
| JPEG | .jpg | FF D8 FF | 0 | image/jpeg | JFIF or EXIF format |
| PNG | .png | 89 50 4E 47 0D 0A 1A 0A | 0 | image/png | PNG image |
| GIF | .gif | 47 49 46 38 | 0 | image/gif | GIF87a or GIF89a |
| BMP | .bmp | 42 4D | 0 | image/bmp | BMP image |
| TIFF | .tiff | 49 49 2A 00 or 4D 4D 00 2A | 0 | image/tiff | Little-endian or Big-endian TIFF |
| WebP | .webp | 52 49 46 46 (offset 0), 57 45 42 50 (offset 8) | 0, 8 | image/webp | WebP image |
| MOV | .mov | 66 74 79 70 (offset 4), 71 74 20 20 (offset 8) | 4, 8 | video/quicktime | QuickTime MOV |
| MP4 | .mp4 | 66 74 79 70 | 4 | video/mp4 | MPEG-4 video |
| AVI | .avi | 52 49 46 46 (offset 0), 41 56 49 20 (offset 8) | 0, 8 | video/x-msvideo | AVI video |
| MKV | .mkv | 1A 45 DF A3 | 0 | video/x-matroska | Matroska video |
| PDF | .pdf | 25 50 44 46 2D | 0 | application/pdf | PDF document; may also be an Adobe Illustrator (.ai) file |
| SVG | .svg | Text-based (`<svg` or `<?xml`) | N/A | image/svg+xml | Scalable Vector Graphics |
| MP3 | .mp3 | 49 44 33 | 0 | audio/mpeg | MP3 audio |
| WAV | .wav | 52 49 46 46 (offset 0), 57 41 56 45 (offset 8) | 0, 8 | audio/wav | WAV audio |
| FLAC | .flac | 66 4C 61 43 | 0 | audio/flac | FLAC audio |
| OGG | .ogg | 4F 67 67 53 | 0 | audio/ogg | Ogg Vorbis audio |
| DOCX | .docx | 50 4B 03 04 | 0 | application/vnd.openxmlformats-officedocument.wordprocessingml.document | Microsoft Word document |
| XLSX | .xlsx | 50 4B 03 04 | 0 | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | Microsoft Excel spreadsheet |
| PPTX | .pptx | 50 4B 03 04 | 0 | application/vnd.openxmlformats-officedocument.presentationml.presentation | Microsoft PowerPoint presentation |
| DOC | .doc | D0 CF 11 E0 A1 B1 1A E1 | 0 | application/msword | Microsoft Word document |
| XLS | .xls | D0 CF 11 E0 A1 B1 1A E1 | 0 | application/vnd.ms-excel | Microsoft Excel spreadsheet |
| PPT | .ppt | D0 CF 11 E0 A1 B1 1A E1 | 0 | application/vnd.ms-powerpoint | Microsoft PowerPoint presentation |
| ZIP | .zip | 50 4B 03 04 | 0 | application/zip | ZIP archive |
| RAR | .rar | 52 61 72 21 | 0 | application/x-rar-compressed | RAR archive |
| 7Z | .7z | 37 7A BC AF 27 1C | 0 | application/x-7z-compressed | 7-Zip archive |
| TAR | .tar | 75 73 74 61 72 | 257 | application/x-tar | TAR archive |
| GZIP | .gz | 1F 8B | 0 | application/gzip | GZIP compressed file |
| ICO | .ico | 00 00 01 00 | 0 | image/x-icon | Icon file |
| HEIC | .heic | 66 74 79 70 68 65 69 63 | 4 | image/heic | High Efficiency Image File Format |
| EXE | .exe | 4D 5A | 0 | application/x-msdownload | Windows executable |
| TTF | .ttf | 00 01 00 00 | 0 | font/ttf | TrueType Font |
| OTF | .otf | 4F 54 54 4F | 0 | font/otf | OpenType Font |
| SQLite | .db | 53 51 4C 69 74 65 20 66 6F 72 6D 61 74 20 33 00 | 0 | application/x-sqlite3 | SQLite database |
| PSD | .psd | 38 42 50 53 | 0 | image/vnd.adobe.photoshop | Adobe Photoshop document |
| MIDI | .mid | 4D 54 68 64 | 0 | audio/midi | MIDI file |
| WMV | .wmv | 30 26 B2 75 8E 66 CF 11 A6 D9 00 AA 00 62 CE 6C | 0 | video/x-ms-wmv | Windows Media Video |
| FLV | .flv | 46 4C 56 | 0 | video/x-flv | Flash Video |

#### Key Citations
- [List of file signatures - Wikipedia](https://en.wikipedia.org/wiki/List_of_file_signatures)
- [File Signatures Database - FileSignatures.net](https://www.filesignatures.net/)
- [PRONOM Technical Registry - National Archives](https://www.nationalarchives.gov.uk/PRONOM/)
- [FLAC - Wikipedia](https://en.wikipedia.org/wiki/FLAC)
- [Ogg - Wikipedia](https://en.wikipedia.org/wiki/Ogg)
- [High Efficiency Image File Format - Wikipedia](https://en.wikipedia.org/wiki/High_Efficiency_Image_File_Format)
- [TrueType - Wikipedia](https://en.wikipedia.org/wiki/TrueType)
- [MP3 File Format - Library of Congress](https://www.loc.gov/preservation/digital/formats/fdd/fdd000105.shtml)
- [OGG File - FileInfo](https://fileinfo.com/extension/ogg)
- [HEIF File - FileInfo](https://fileinfo.com/extension/heif)
- [TTF File - FileInfo](https://fileinfo.com/extension/ttf)