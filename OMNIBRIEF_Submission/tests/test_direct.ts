import fs from 'fs';
import path from 'path';
import { extractionService } from '../server/src/services/extractionService';
import { geminiService } from '../server/src/services/geminiService';
import { SourceBriefSchema } from '../server/src/schemas/briefSchema';

async function runDirectTests() {
  console.log('🧪 Running Direct In-Memory Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string, detail?: any) {
    if (condition) {
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${desc}`);
      if (detail) console.error('     Detail:', detail);
      failed++;
    }
  }

  // 1. Raw Text Ingestion & Extraction
  console.log('--- TEST 1: Raw Text Extraction & Normalization ---');
  const sampleText = "India's digital public infrastructure has expanded significantly in recent years. The source document discusses the role of interoperable digital systems in improving access to public services. It highlights the importance of secure data exchange, scalable infrastructure, and user-centric design.";
  const rawResult = extractionService.extractFromRawText(sampleText);
  assert(rawResult.sourceType === 'text', 'Source type is text');
  assert(rawResult.text === sampleText, 'Source text matches verbatim');
  assert(rawResult.metadata.characterCount === sampleText.length, `Character count is correct (${rawResult.metadata.characterCount})`);
  assert(rawResult.title.length > 0, `Auto-title extracted correctly: "${rawResult.title}"`);

  // 2. Empty Text Ingestion Rejection
  console.log('\n--- TEST 2: Empty Raw Text Rejection ---');
  try {
    extractionService.extractFromRawText('   \n  ');
    assert(false, 'Should throw on empty text');
  } catch (err: any) {
    assert(err.message.includes('Raw text input cannot be empty'), 'Throws clean error on whitespace/empty text');
  }

  // 3. TXT File Extraction
  console.log('\n--- TEST 3: TXT File Extraction ---');
  const txtBuffer = fs.readFileSync(path.join(__dirname, 'sample.txt'));
  const txtResult = await extractionService.extractFromBuffer(txtBuffer, 'text/plain', 'sample.txt');
  assert(txtResult.sourceType === 'txt', 'File type detected as txt');
  assert(txtResult.text.includes('interoperable digital systems'), 'Text content extracted faithfully');
  assert(txtResult.title === 'sample', 'Title stripped extension correctly');

  // 4. PDF File Extraction
  console.log('\n--- TEST 4: PDF File Extraction (pdf-parse v2) ---');
  const pdfBuffer = fs.readFileSync(path.join(__dirname, 'sample.pdf'));
  const pdfResult = await extractionService.extractFromBuffer(pdfBuffer, 'application/pdf', 'sample.pdf');
  assert(pdfResult.sourceType === 'pdf', 'File type detected as pdf');
  assert(pdfResult.text.includes('India Digital Public Infrastructure Report'), 'PDF parser extracted binary text stream');
  assert(pdfResult.title === 'sample', 'PDF title set to filename basename');

  // 5. DOCX File Extraction
  console.log('\n--- TEST 5: DOCX File Extraction (mammoth) ---');
  const docxBuffer = fs.readFileSync(path.join(__dirname, 'sample.docx'));
  const docxResult = await extractionService.extractFromBuffer(docxBuffer, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'sample.docx');
  assert(docxResult.sourceType === 'docx', 'File type detected as docx');
  assert(docxResult.text.includes('Interoperable Digital Systems and Public Services Report'), 'Mammoth extracted docx XML paragraphs');

  // 6. PNG Image Extraction
  console.log('\n--- TEST 6: Image Extraction (Multimodal Base64 Packaging) ---');
  const pngBuffer = fs.readFileSync(path.join(__dirname, 'sample.png'));
  const pngResult = await extractionService.extractFromBuffer(pngBuffer, 'image/png', 'sample.png');
  assert(pngResult.sourceType === 'image', 'File type detected as image');
  assert(pngResult.imagePart !== undefined, 'imagePart populated');
  assert(pngResult.imagePart?.inlineData?.mimeType === 'image/png', 'imagePart MIME type is image/png');
  assert(typeof pngResult.imagePart?.inlineData?.data === 'string' && pngResult.imagePart.inlineData.data.length > 0, 'Base64 image data valid string');

  // 7. MIME Allowed Checks
  console.log('\n--- TEST 7: MIME Type Security Whitelist ---');
  assert(extractionService.isMimeAllowed('application/pdf', 'doc.pdf'), 'Allows PDF');
  assert(extractionService.isMimeAllowed('text/plain', 'doc.txt'), 'Allows TXT');
  assert(extractionService.isMimeAllowed('image/jpeg', 'photo.jpg'), 'Allows JPEG');
  assert(extractionService.isMimeAllowed('image/png', 'diagram.png'), 'Allows PNG');
  assert(!extractionService.isMimeAllowed('application/x-msdownload', 'virus.exe'), 'Rejects EXE');
  assert(!extractionService.isMimeAllowed('application/x-sh', 'script.sh'), 'Rejects shell scripts');

  // 8. Gemini Key Missing Guard
  console.log('\n--- TEST 8: Gemini API Key Missing Guard ---');
  try {
    await geminiService.generateSourceBrief({
      sourceContent: sampleText,
      targetAudience: 'Executive Leadership',
      tone: 'formal',
      language: 'en',
      detailLevel: 'balanced',
      communicationObjective: 'Brief executives',
    });
    assert(false, 'Should throw error when GEMINI_API_KEY is not configured');
  } catch (err: any) {
    assert(err.message.includes('GEMINI_API_KEY is not configured'), 'Throws descriptive, non-leaking configuration error when key missing');
  }

  // 9. Zod Schema Validation of SourceBrief
  console.log('\n--- TEST 9: Zod Schema Strict Validation ---');
  const validBrief = {
    sourceTitle: "India's Digital Public Infrastructure Overview",
    detectedDomain: "Public Sector & Governance Technology",
    executiveSummary: "India's digital public infrastructure enables secure, interoperable access to public services through scalable and user-centric systems.",
    keyClaims: [
      {
        claimId: "claim_1",
        statement: "India's digital public infrastructure has expanded significantly in recent years.",
        verbatimSourceQuote: "India's digital public infrastructure has expanded significantly in recent years.",
        confidence: 0.98,
        category: "infrastructure"
      },
      {
        claimId: "claim_2",
        statement: "The systems emphasize secure data exchange, scalable infrastructure, and user-centric design.",
        verbatimSourceQuote: "It highlights the importance of secure data exchange, scalable infrastructure, and user-centric design.",
        confidence: 0.95,
        category: "security"
      }
    ],
    entities: [
      { name: "India", type: "location", relevance: "high" },
      { name: "Digital Public Infrastructure", type: "technology", relevance: "high" }
    ],
    statistics: [],
    recommendations: [
      "Maintain secure data exchange protocols and scalable infrastructure to ensure seamless public service delivery."
    ],
    uncertainties: [
      "Specific quantitative expansion metrics and timelines are not detailed in the source."
    ]
  };

  const zodValidation = SourceBriefSchema.safeParse(validBrief);
  assert(zodValidation.success === true, 'Sample SourceBrief strictly complies with Zod schema');

  const invalidBrief = { ...validBrief, keyClaims: [] }; // Empty key claims should fail min(1)
  const invalidZod = SourceBriefSchema.safeParse(invalidBrief);
  assert(invalidZod.success === false, 'Rejects SourceBrief with empty keyClaims (min 1 required)');

  console.log('\n======================================================');
  console.log(`TOTAL IN-MEMORY TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('======================================================\n');
  if (failed > 0) process.exit(1);
}

runDirectTests().catch((err) => {
  console.error('Fatal error in tests:', err);
  process.exit(1);
});
