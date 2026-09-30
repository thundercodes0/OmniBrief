import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://127.0.0.1:3001/api';

async function runTests() {
  console.log('🚀 Starting Automated Verification Suite for Phase 2...\n');
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

  // TEST 1: Healthcheck
  console.log('--- TEST 1: Healthcheck Endpoint (GET /api/health) ---');
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    assert(res.status === 200, 'Health endpoint returns HTTP 200');
    assert(data.status === 'ok', 'Health response payload has status: "ok"', data);
  } catch (err: any) {
    assert(false, 'Health endpoint reachable', err.message);
  }

  // TEST 2: Raw Text Ingestion with Prompt Sample
  console.log('\n--- TEST 2: Raw Text Ingestion (POST /api/source/ingest) ---');
  const sampleText = "India's digital public infrastructure has expanded significantly in recent years. The source document discusses the role of interoperable digital systems in improving access to public services. It highlights the importance of secure data exchange, scalable infrastructure, and user-centric design.";
  try {
    const res = await fetch(`${BASE_URL}/source/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText: sampleText }),
    });
    const data = await res.json();
    assert(res.status === 200, 'Raw text ingest returns HTTP 200');
    assert(data.success === true, 'Response indicates success: true');
    assert(data.source?.type === 'raw_text', 'Source type is "raw_text"');
    assert(data.source?.sourceContent.includes('interoperable digital systems'), 'Extracted text preserved');
    assert(data.source?.wordCount > 25, `Word count calculated properly (${data.source?.wordCount} words)`);
    assert(data.source?.sourceTitle.length > 0, `Auto-generated title present: "${data.source?.sourceTitle}"`);
  } catch (err: any) {
    assert(false, 'Raw text ingestion succeeded', err.message);
  }

  // TEST 3: Empty Input Handling
  console.log('\n--- TEST 3: Empty Raw Text Validation (POST /api/source/ingest) ---');
  try {
    const res = await fetch(`${BASE_URL}/source/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText: '    ' }),
    });
    const data = await res.json();
    assert(res.status === 400, 'Empty raw text returns HTTP 400');
    assert(data.success === false, 'success is false');
    assert(data.error?.code === 'MISSING_SOURCE', 'Error code is MISSING_SOURCE', data);
  } catch (err: any) {
    assert(false, 'Empty input error test', err.message);
  }

  // TEST 4: TXT File Ingestion
  console.log('\n--- TEST 4: TXT File Upload (POST /api/source/ingest multipart) ---');
  try {
    const filePath = path.join(__dirname, 'sample.txt');
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', blob, 'sample.txt');

    const res = await fetch(`${BASE_URL}/source/ingest`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    assert(res.status === 200, 'TXT file upload returns HTTP 200');
    assert(data.success === true, 'TXT ingestion success is true');
    assert(data.source?.fileType === 'txt', 'File type detected as txt');
    assert(data.source?.sourceTitle === 'sample.txt', 'Source title matches filename');
    assert(data.source?.sourceContent.includes("India's digital public infrastructure"), 'Content matches');
  } catch (err: any) {
    assert(false, 'TXT upload succeeded', err.message);
  }

  // TEST 5: PDF File Ingestion
  console.log('\n--- TEST 5: PDF File Upload (POST /api/source/ingest multipart) ---');
  try {
    const filePath = path.join(__dirname, 'sample.pdf');
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', blob, 'sample.pdf');

    const res = await fetch(`${BASE_URL}/source/ingest`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    assert(res.status === 200, 'PDF file upload returns HTTP 200');
    assert(data.success === true, 'PDF ingestion success is true');
    assert(data.source?.fileType === 'pdf', 'File type detected as pdf');
    assert(data.source?.sourceContent.includes('India Digital Public Infrastructure Report'), 'Extracted text contains PDF contents', data.source?.sourceContent);
  } catch (err: any) {
    assert(false, 'PDF upload succeeded', err.message);
  }

  // TEST 6: DOCX File Ingestion
  console.log('\n--- TEST 6: DOCX File Upload (POST /api/source/ingest multipart) ---');
  try {
    const filePath = path.join(__dirname, 'sample.docx');
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const formData = new FormData();
    formData.append('file', blob, 'sample.docx');

    const res = await fetch(`${BASE_URL}/source/ingest`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    assert(res.status === 200, 'DOCX file upload returns HTTP 200');
    assert(data.success === true, 'DOCX ingestion success is true');
    assert(data.source?.fileType === 'docx', 'File type detected as docx');
    assert(data.source?.sourceContent.includes('Interoperable Digital Systems and Public Services Report'), 'Extracted text contains DOCX contents', data.source?.sourceContent);
  } catch (err: any) {
    assert(false, 'DOCX upload succeeded', err.message);
  }

  // TEST 7: Image Ingestion (PNG)
  console.log('\n--- TEST 7: Image File Upload (POST /api/source/ingest multipart) ---');
  try {
    const filePath = path.join(__dirname, 'sample.png');
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', blob, 'sample.png');

    const res = await fetch(`${BASE_URL}/source/ingest`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    assert(res.status === 200, 'PNG file upload returns HTTP 200');
    assert(data.success === true, 'PNG ingestion success is true');
    assert(data.source?.fileType === 'png', 'File type detected as png');
    assert(data.source?.imageData?.data?.length > 0, 'Base64 image data extracted for multimodal Gemini input');
  } catch (err: any) {
    assert(false, 'PNG upload succeeded', err.message);
  }

  // TEST 8: Invalid File Type Rejection
  console.log('\n--- TEST 8: Invalid File Type Rejection (POST /api/source/ingest) ---');
  try {
    const filePath = path.join(__dirname, 'sample.exe');
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'application/x-msdownload' });
    const formData = new FormData();
    formData.append('file', blob, 'sample.exe');

    const res = await fetch(`${BASE_URL}/source/ingest`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    assert(res.status === 400, 'Invalid file returns HTTP 400');
    assert(data.success === false, 'success is false');
    assert(data.error?.code === 'INVALID_FILE_TYPE', `Error code is INVALID_FILE_TYPE (got ${data.error?.code})`);
  } catch (err: any) {
    assert(false, 'Invalid file rejection test', err.message);
  }

  // TEST 9: Brief Generation Missing API Key / Graceful Handling
  console.log('\n--- TEST 9: Brief Generation API Key Error Handling (POST /api/brief/generate) ---');
  try {
    const res = await fetch(`${BASE_URL}/brief/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceContent: sampleText,
        targetAudience: 'Executive Leadership',
        tone: 'formal',
        language: 'en',
        detailLevel: 'balanced',
        communicationObjective: 'Provide strategic overview of digital public infrastructure',
      }),
    });
    const data = await res.json();
    assert(res.status === 401, 'Unconfigured API key returns HTTP 401');
    assert(data.success === false, 'success is false');
    assert(data.error?.code === 'API_KEY_ERROR', `Error code is API_KEY_ERROR: ${data.error?.message}`);
    assert(!data.stack, 'No stack trace is leaked in error response');
  } catch (err: any) {
    assert(false, 'API key error handling test', err.message);
  }

  // TEST 10: Brief Generation Schema Validation Error Handling
  console.log('\n--- TEST 10: Brief Generation Validation Error Handling ---');
  try {
    const res = await fetch(`${BASE_URL}/brief/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // missing required sourceContent
        targetAudience: 'Executive Leadership',
      }),
    });
    const data = await res.json();
    assert(res.status === 400, 'Malformed request returns HTTP 400');
    assert(data.success === false, 'success is false');
    assert(data.error?.code === 'VALIDATION_ERROR', `Error code is VALIDATION_ERROR: ${data.error?.message}`);
  } catch (err: any) {
    assert(false, 'Validation error test', err.message);
  }

  console.log('\n======================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('======================================================\n');
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
