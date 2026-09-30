import { getHealth } from '../server/src/controllers/healthController';
import { ingestSource } from '../server/src/controllers/sourceController';
import { generateBrief } from '../server/src/controllers/briefController';
import fs from 'fs';
import path from 'path';

// Helper to mock Express req and res
function createMockContext(body: any = {}, file?: any) {
  let statusCode = 200;
  let jsonResponse: any = null;
  let sent = false;

  const req: any = {
    body,
    file,
    method: 'POST',
    path: '/',
    headers: {},
  };

  const res: any = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      jsonResponse = data;
      sent = true;
      return this;
    },
    send(data: any) {
      jsonResponse = data;
      sent = true;
      return this;
    },
  };

  return {
    req,
    res,
    getStatus: () => statusCode,
    getJson: () => jsonResponse,
  };
}

async function runControllerTests() {
  console.log('🏛️ Testing Express Controllers Directly (End-to-End Pipeline)...\n');
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

  // 1. Health Controller
  console.log('--- TEST 1: Health Controller ---');
  {
    const ctx = createMockContext();
    getHealth(ctx.req, ctx.res);
    assert(ctx.getStatus() === 200, 'Health status is 200');
    assert(ctx.getJson()?.status === 'ok', 'Health payload is { status: "ok" }', ctx.getJson());
  }

  // 2. Source Ingest with Raw Text
  console.log('\n--- TEST 2: Source Ingest with Raw Text ---');
  const sampleText = "India's digital public infrastructure has expanded significantly in recent years. The source document discusses the role of interoperable digital systems in improving access to public services. It highlights the importance of secure data exchange, scalable infrastructure, and user-centric design.";
  {
    const ctx = createMockContext({ rawText: sampleText });
    await ingestSource(ctx.req, ctx.res, (err) => console.error('Next called with err:', err));
    assert(ctx.getStatus() === 200, 'Raw text ingest status is 200');
    const json = ctx.getJson();
    assert(json?.success === true, 'Raw text ingest success is true');
    assert(json?.source?.sourceType === 'text', 'sourceType is "text"');
    assert(json?.source?.text === sampleText, 'Text preserved verbatim');
    assert(json?.source?.metadata?.characterCount === sampleText.length, 'Character count matches');
  }

  // 3. Source Ingest with Empty Text
  console.log('\n--- TEST 3: Source Ingest with Empty / Whitespace Input ---');
  {
    const ctx = createMockContext({ rawText: '    \n  ' });
    await ingestSource(ctx.req, ctx.res, (err) => {});
    assert(ctx.getStatus() === 400, 'Empty raw text returns HTTP 400');
    assert(ctx.getJson()?.success === false, 'success is false');
    assert(ctx.getJson()?.error?.code === 'MISSING_SOURCE', 'Error code is MISSING_SOURCE');
  }

  // 4. Source Ingest with PDF File Upload
  console.log('\n--- TEST 4: Source Ingest with PDF File Upload ---');
  {
    const pdfBuffer = fs.readFileSync(path.join(__dirname, 'sample.pdf'));
    const mockPdfFile = {
      buffer: pdfBuffer,
      originalname: 'india_dpi_report.pdf',
      mimetype: 'application/pdf',
      size: pdfBuffer.length,
    };
    const ctx = createMockContext({}, mockPdfFile);
    await ingestSource(ctx.req, ctx.res, (err) => console.error('Error in PDF ingest:', err));
    assert(ctx.getStatus() === 200, 'PDF upload returns HTTP 200');
    const json = ctx.getJson();
    assert(json?.success === true, 'PDF success is true');
    assert(json?.source?.sourceType === 'pdf', 'Detected sourceType as pdf');
    assert(json?.source?.text?.includes('India Digital Public Infrastructure Report'), 'Extracted text contains PDF stream content');
  }

  // 5. Source Ingest with DOCX File Upload
  console.log('\n--- TEST 5: Source Ingest with DOCX File Upload ---');
  {
    const docxBuffer = fs.readFileSync(path.join(__dirname, 'sample.docx'));
    const mockDocxFile = {
      buffer: docxBuffer,
      originalname: 'india_dpi_report.docx',
      mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: docxBuffer.length,
    };
    const ctx = createMockContext({}, mockDocxFile);
    await ingestSource(ctx.req, ctx.res, (err) => console.error('Error in DOCX ingest:', err));
    assert(ctx.getStatus() === 200, 'DOCX upload returns HTTP 200');
    const json = ctx.getJson();
    assert(json?.success === true, 'DOCX success is true');
    assert(json?.source?.sourceType === 'docx', 'Detected sourceType as docx');
    assert(json?.source?.text?.includes('Interoperable Digital Systems and Public Services Report'), 'Extracted text contains DOCX stream content');
  }

  // 6. Source Ingest with Image File Upload
  console.log('\n--- TEST 6: Source Ingest with Image File Upload ---');
  {
    const pngBuffer = fs.readFileSync(path.join(__dirname, 'sample.png'));
    const mockPngFile = {
      buffer: pngBuffer,
      originalname: 'architecture_diagram.png',
      mimetype: 'image/png',
      size: pngBuffer.length,
    };
    const ctx = createMockContext({}, mockPngFile);
    await ingestSource(ctx.req, ctx.res, (err) => console.error('Error in PNG ingest:', err));
    assert(ctx.getStatus() === 200, 'PNG upload returns HTTP 200');
    const json = ctx.getJson();
    assert(json?.success === true, 'PNG success is true');
    assert(json?.source?.sourceType === 'image', 'Detected sourceType as image');
    assert(json?.source?.imagePart?.inlineData?.mimeType === 'image/png', 'MIME type preserved in imagePart');
    assert(json?.source?.imagePart?.inlineData?.data?.length > 0, 'Base64 image data populated');
  }

  // 7. Brief Generator Validation Rejection
  console.log('\n--- TEST 7: Brief Controller Schema Validation (Invalid Request) ---');
  {
    const ctx = createMockContext({
      // Missing sourceContent, targetAudience, etc.
      detailLevel: 'balanced',
    });
    await generateBrief(ctx.req, ctx.res, (err) => {});
    assert(ctx.getStatus() === 400, 'Invalid request returns HTTP 400');
    assert(ctx.getJson()?.success === false, 'success is false');
    assert(ctx.getJson()?.error?.code === 'VALIDATION_ERROR', 'Error code is VALIDATION_ERROR');
    assert(Array.isArray(ctx.getJson()?.error?.details), 'Validation error details array is provided');
  }

  // 8. Brief Generator API Key Missing Guard
  console.log('\n--- TEST 8: Brief Controller Missing API Key Handling ---');
  {
    const ctx = createMockContext({
      sourceContent: sampleText,
      targetAudience: 'Enterprise Executives',
      tone: 'Formal',
      language: 'en',
      detailLevel: 'Concise (TL;DR)',
      communicationObjective: 'Provide executive brief',
    });
    let errorPassedToNext: any = null;
    await generateBrief(ctx.req, ctx.res, (err) => {
      errorPassedToNext = err;
    });
    assert(errorPassedToNext !== null, 'geminiService threw error and passed to error handler');
    assert(errorPassedToNext?.message?.includes('GEMINI_API_KEY is not configured'), 'Error message informs user of missing key without exposing secrets');
  }

  console.log('\n======================================================');
  console.log(`TOTAL CONTROLLER TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('======================================================\n');
  if (failed > 0) process.exit(1);
}

runControllerTests().catch((err) => {
  console.error('Fatal error running controller tests:', err);
  process.exit(1);
});
