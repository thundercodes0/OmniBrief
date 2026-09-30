import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const testDir = path.join(__dirname);

// 1. Create test.txt
const txtContent = "India's digital public infrastructure has expanded significantly in recent years. The source document discusses the role of interoperable digital systems in improving access to public services. It highlights the importance of secure data exchange, scalable infrastructure, and user-centric design.";
fs.writeFileSync(path.join(testDir, 'sample.txt'), txtContent, 'utf-8');
console.log('Created sample.txt');

// 2. Create sample.pdf
const pdfData = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 55 >> stream
BT
/F1 12 Tf
100 700 Td
(India Digital Public Infrastructure Report) Tj
ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000373 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
455
%%EOF`;
fs.writeFileSync(path.join(testDir, 'sample.pdf'), pdfData, 'binary');
console.log('Created sample.pdf');

// 3. Create sample.docx using minimal zip structure
const docxTemp = path.join(testDir, 'docx_tmp');
fs.mkdirSync(path.join(docxTemp, 'word'), { recursive: true });
fs.mkdirSync(path.join(docxTemp, '_rels'), { recursive: true });

fs.writeFileSync(
  path.join(docxTemp, '[Content_Types].xml'),
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
);

fs.writeFileSync(
  path.join(docxTemp, '_rels', '.rels'),
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
);

fs.writeFileSync(
  path.join(docxTemp, 'word', 'document.xml'),
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:t>Interoperable Digital Systems and Public Services Report</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>`
);

try {
  execSync(`cd "${docxTemp}" && /usr/bin/zip -q -r "../sample.docx" .`);
  console.log('Created sample.docx');
} finally {
  fs.rmSync(docxTemp, { recursive: true, force: true });
}

// 4. Create sample.png (1x1 PNG base64)
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
fs.writeFileSync(path.join(testDir, 'sample.png'), Buffer.from(pngBase64, 'base64'));
console.log('Created sample.png');

// 5. Create invalid.exe
fs.writeFileSync(path.join(testDir, 'sample.exe'), 'MZ9000DummyExecutableBinaryContent');
console.log('Created sample.exe');
