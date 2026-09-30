import fs from 'fs';
import path from 'path';

const FRONTEND_URL = 'http://localhost:5173';
const BACKEND_DIRECT_URL = 'http://localhost:3001';

async function runFrontendFlowTests() {
  console.log('🌐 Testing Complete Flow Through Frontend Proxy: http://localhost:5173\n');
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

  // STEP 1: Frontend health check
  console.log('--- STEP 1: GET /api/health from Frontend (http://localhost:5173) ---');
  try {
    const res = await fetch(`${FRONTEND_URL}/api/health`);
    assert(res.status === 200, `Frontend proxy returned HTTP 200 (got ${res.status})`);
    const data = await res.json();
    assert(data.status === 'ok', 'Response payload is {"status": "ok"}', data);
  } catch (err: any) {
    assert(false, 'Frontend /api/health succeeded', err.message);
  }

  // STEP 2: Raw text ingestion through Frontend
  console.log('\n--- STEP 2: POST /api/source/ingest (Raw Text) from Frontend ---');
  const sampleRawText = "India's digital public infrastructure has expanded significantly in recent years. The source document discusses the role of interoperable digital systems in improving access to public services. It highlights the importance of secure data exchange, scalable infrastructure, and user-centric design.";
  let rawTextIngestResult: any = null;
  try {
    const res = await fetch(`${FRONTEND_URL}/api/source/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawText: sampleRawText,
        contextInstructions: 'Focus on digital public infrastructure.',
      }),
    });
    assert(res.status === 200, `Raw text ingest returned HTTP 200 (got ${res.status})`);
    rawTextIngestResult = await res.json();
    assert(rawTextIngestResult.success === true, 'Raw text ingest success is true');
    assert(rawTextIngestResult.source?.sourceType === 'text', 'sourceType is text');
    assert(rawTextIngestResult.source?.text === sampleRawText, 'Extracted text preserved faithfully');
    assert(rawTextIngestResult.source?.metadata?.characterCount === sampleRawText.length, 'Character count matches');
  } catch (err: any) {
    assert(false, 'Raw text ingestion through frontend succeeded', err.message);
  }

  // STEP 3: PDF Document ingestion through Frontend
  console.log('\n--- STEP 3: POST /api/source/ingest (PDF Upload) from Frontend ---');
  let pdfIngestResult: any = null;
  try {
    const pdfPath = path.join(__dirname, 'sample.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', blob, 'sample.pdf');
    formData.append('contextInstructions', 'National advisory evaluation');

    const res = await fetch(`${FRONTEND_URL}/api/source/ingest`, {
      method: 'POST',
      body: formData,
    });
    assert(res.status === 200, `PDF ingest returned HTTP 200 (got ${res.status})`);
    pdfIngestResult = await res.json();
    assert(pdfIngestResult.success === true, 'PDF ingest success is true');
    assert(pdfIngestResult.source?.sourceType === 'pdf', 'Detected sourceType as pdf');
    assert(pdfIngestResult.source?.text?.includes('India Digital Public Infrastructure Report'), 'Extracted PDF stream text preserved');
    assert(pdfIngestResult.source?.metadata?.fileName === 'sample.pdf', 'Metadata fileName recorded');
  } catch (err: any) {
    assert(false, 'PDF ingestion through frontend succeeded', err.message);
  }

  // STEP 4: Source Brief Generation through Frontend (POST /api/brief/generate)
  console.log('\n--- STEP 4: POST /api/brief/generate from Frontend ---');
  try {
    const res = await fetch(`${FRONTEND_URL}/api/brief/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceContent: sampleRawText,
        targetAudience: 'Executive Leadership',
        tone: 'formal',
        language: 'en',
        detailLevel: 'Standard (Balanced)',
        communicationObjective: 'Provide strategic overview of digital public infrastructure',
      }),
    });

    const data = await res.json();
    console.log(`  ℹ️ Brief generation response HTTP status: ${res.status}`);
    console.log(`  ℹ️ Response payload:`, JSON.stringify(data, null, 2));

    if (res.status === 200) {
      assert(data.success === true, 'Brief generation success is true');
      assert(typeof data.sourceBrief?.sourceTitle === 'string', 'Generated sourceTitle is string');
      assert(Array.isArray(data.sourceBrief?.keyClaims), 'Generated keyClaims is array');
    } else if (res.status === 401) {
      assert(data.success === false, 'success is false when API key is missing');
      assert(data.error?.code === 'API_KEY_ERROR', 'Correctly identified API_KEY_ERROR (cleanly handled without crash)');
      assert(data.error?.message.includes('GEMINI_API_KEY'), 'Clean message instructs how to configure GEMINI_API_KEY');
    } else {
      assert(false, `Unexpected status code: ${res.status}`);
    }
  } catch (err: any) {
    assert(false, 'Brief generation request handled cleanly', err.message);
  }

  // STEP 5: PDF Source Brief Generation through Frontend
  console.log('\n--- STEP 5: POST /api/brief/generate with Extracted PDF Content ---');
  if (pdfIngestResult?.source?.text) {
    try {
      const res = await fetch(`${FRONTEND_URL}/api/brief/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceContent: pdfIngestResult.source.text,
          targetAudience: 'Government Stakeholders',
          tone: 'authoritative',
          language: 'en',
          detailLevel: 'Standard (Balanced)',
          communicationObjective: 'Provide comprehensive advisory summary',
        }),
      });

      const data = await res.json();
      console.log(`  ℹ️ PDF Brief generation response HTTP status: ${res.status}`);
      if (res.status === 200) {
        assert(data.success === true, 'PDF Brief generation success is true');
        assert(Array.isArray(data.sourceBrief?.keyClaims), 'PDF Brief contains keyClaims');
      } else if (res.status === 401) {
        assert(data.error?.code === 'API_KEY_ERROR', 'Correctly handled API_KEY_ERROR for PDF payload');
      }
    } catch (err: any) {
      assert(false, 'PDF Brief generation handled', err.message);
    }
  }

  console.log('\n======================================================');
  console.log(`TOTAL FRONTEND FLOW TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('======================================================\n');
  if (failed > 0) process.exit(1);
}

runFrontendFlowTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
