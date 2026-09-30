import fs from 'fs';
import path from 'path';

const FRONTEND_ORIGIN = 'http://localhost:5173';

async function runTests() {
  console.log('=====================================================');
  console.log('🚀 TESTING FULL FRONTEND → BACKEND → GEMINI PIPELINE');
  console.log(`🌐 Frontend Origin: ${FRONTEND_ORIGIN}`);
  console.log('=====================================================\n');

  // Test 1: Frontend root HTML
  console.log('--- TEST 1: Ping Frontend Dev Server ---');
  const feRes = await fetch(`${FRONTEND_ORIGIN}/`);
  console.log(`Frontend Status: ${feRes.status} ${feRes.statusText}`);
  const html = await feRes.text();
  console.log(`Frontend HTML Title Match: ${html.includes('<title>OmniBrief AI') ? '✅ Found' : '❌ Not Found'}`);
  if (feRes.status !== 200) throw new Error('Frontend dev server failed to respond');

  // Test 2: Health check via Frontend Proxy
  console.log('\n--- TEST 2: Health Check through Frontend Proxy (/api/health) ---');
  const healthRes = await fetch(`${FRONTEND_ORIGIN}/api/health`, {
    headers: { 'Accept': 'application/json' }
  });
  console.log(`Health Status: ${healthRes.status} ${healthRes.statusText}`);
  const healthData = await healthRes.json();
  console.log('Health Response:', JSON.stringify(healthData));
  if (healthRes.status !== 200 || healthData.status !== 'ok') {
    throw new Error('Health check via frontend proxy failed');
  }
  console.log('✅ Proxy successfully routed GET /api/health -> backend port 3001');

  // Test 3: Raw Text Ingestion via Frontend Proxy
  console.log('\n--- TEST 3: Raw Text Ingestion (/api/source/ingest) ---');
  const rawTextContent = "India's digital public infrastructure has expanded significantly in recent years. The source document discusses the role of interoperable digital systems in improving access to public services. It highlights the importance of secure data exchange, scalable infrastructure, and user-centric design.";
  const rawTextPayload = {
    rawText: rawTextContent,
    contextInstructions: 'Focus on enterprise DPI deployment'
  };

  const rawIngestRes = await fetch(`${FRONTEND_ORIGIN}/api/source/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(rawTextPayload)
  });
  console.log(`Raw Ingest Status: ${rawIngestRes.status} ${rawIngestRes.statusText}`);
  const rawIngestData = await rawIngestRes.json();
  console.log(`Extracted Words: ${rawIngestData.source?.metadata?.wordCount}`);
  console.log(`Character Count: ${rawIngestData.source?.metadata?.charCount}`);
  if (rawIngestRes.status !== 200 || !rawIngestData.success) throw new Error('Raw text ingestion failed');
  console.log('✅ Raw text ingested successfully through frontend proxy');

  // Test 4: PDF Ingestion via Frontend Proxy (multipart/form-data)
  console.log('\n--- TEST 4: PDF File Ingestion (/api/source/ingest) ---');
  const pdfPath = path.resolve(__dirname, 'sample.pdf');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const formData = new FormData();
  formData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), 'sample.pdf');

  const pdfIngestRes = await fetch(`${FRONTEND_ORIGIN}/api/source/ingest`, {
    method: 'POST',
    body: formData
  });
  console.log(`PDF Ingest Status: ${pdfIngestRes.status} ${pdfIngestRes.statusText}`);
  const pdfIngestData = await pdfIngestRes.json();
  console.log(`PDF Title: "${pdfIngestData.source?.title}"`);
  console.log(`PDF Extracted Characters: ${pdfIngestData.source?.metadata?.charCount}`);
  console.log(`PDF Word Count: ${pdfIngestData.source?.metadata?.wordCount}`);
  if (pdfIngestRes.status !== 200 || !pdfIngestData.success) throw new Error('PDF file ingestion failed');
  console.log('✅ PDF file ingested and parsed successfully through frontend proxy');

  // Test 5: Real Gemini Source Brief Generation via Frontend Proxy
  console.log('\n--- TEST 5: Real Gemini Source Brief Generation (/api/brief/generate) ---');
  const briefPayload = {
    sourceContent: rawTextContent,
    targetAudience: 'Executive Leadership',
    tone: 'Formal & Professional',
    language: 'English',
    detailLevel: 'Comprehensive',
    communicationObjective: 'Strategic Briefing',
    additionalContext: 'Focus on public service transformation and architectural scalability'
  };

  const tStart = Date.now();
  console.log('Sending brief generation request to Gemini via frontend proxy...');
  const briefRes = await fetch(`${FRONTEND_ORIGIN}/api/brief/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(briefPayload)
  });

  const durationMs = Date.now() - tStart;
  console.log(`Brief Generate Status: ${briefRes.status} ${briefRes.statusText} (${durationMs}ms)`);
  
  if (briefRes.status !== 200) {
    const errorText = await briefRes.text();
    console.error('Error response body:', errorText);
    throw new Error(`Brief generation failed with HTTP ${briefRes.status}`);
  }

  const responseJson = await briefRes.json();
  const briefData = responseJson.sourceBrief;
  console.log('\n🎉 REAL GEMINI SOURCE BRIEF RECEIVED:');
  console.log('-----------------------------------------------------');
  console.log(`Title: ${briefData.sourceTitle}`);
  console.log(`Domain: ${briefData.detectedDomain}`);
  console.log(`Summary: ${briefData.executiveSummary}`);
  console.log(`Key Claims (${briefData.keyClaims?.length || 0}):`);
  for (const claim of briefData.keyClaims || []) {
    console.log(`  - [${claim.claimId}] ${claim.statement}`);
    console.log(`    Quote: "${claim.verbatimSourceQuote}" (Confidence: ${claim.confidence})`);
  }
  console.log(`Entities (${briefData.entities?.length || 0}):`, briefData.entities?.map((e: any) => `${e.name} (${e.type})`).join(', '));
  console.log(`Recommendations (${briefData.recommendations?.length || 0}):`, briefData.recommendations);
  console.log(`Uncertainties (${briefData.uncertainties?.length || 0}):`, briefData.uncertainties);
  console.log('-----------------------------------------------------');

  console.log('\n✅ ALL 5 PIPELINE STAGES PASSED COMPLETELY!');
}

runTests().catch((err) => {
  console.error('\n❌ Test pipeline encountered an error:', err);
  process.exit(1);
});
