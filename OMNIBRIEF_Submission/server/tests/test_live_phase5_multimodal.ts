import { SourceBriefSchema } from '../src/schemas/briefSchema';

console.log('=====================================================');
console.log('🚀 TESTING LIVE PHASE 5 MULTIMODAL INGESTION & PIPELINE');
console.log('=====================================================');

const BACKEND_URL = 'http://127.0.0.1:3001/api';

// 1x1 PNG transparent pixel buffer
const pngBase64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

async function runLiveTests() {
  let passed = 0;
  let total = 0;

  // Test 1: Ingest text source and verify normalized source schema
  total++;
  try {
    console.log('\n--- 1. Testing Live Text Ingestion (/api/source/ingest) ---');
    const res = await fetch(`${BACKEND_URL}/source/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawText: `
# National Quantum Cryptography Directive 2025
This directive mandates that all federal financial networks transition to post-quantum algorithms by Q4 2026.

| Algorithm Category | Target Protocol | Migration Deadline |
|---|---|---|
| Key Encapsulation | ML-KEM-768 | June 2026 |
| Digital Signatures | ML-DSA-65  | November 2026 |

The transition will protect an estimated $4.8 trillion in daily interbank settlements.
`,
        contextInstructions: 'Focus on interbank settlement resilience and compliance deadlines.',
      }),
    });

    const data = await res.json();
    if (
      res.ok &&
      data.success &&
      data.source &&
      data.source.extraction_method === 'native_text' &&
      data.source.tables.length === 1 &&
      data.source.tables[0].headers.length === 3
    ) {
      console.log('✅ Ingestion succeeded! Extracted table:', data.source.tables[0].headers);
      passed++;
    } else {
      console.error('❌ Failed live text ingestion:', data);
    }
  } catch (err: any) {
    console.error('❌ Error during live text ingestion:', err.message);
  }

  // Test 2: Preview Multimodal Endpoint
  total++;
  try {
    console.log('\n--- 2. Testing Multimodal Preview (/api/source/preview-multimodal) ---');
    const res = await fetch(`${BACKEND_URL}/source/preview-multimodal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawText: `
Security Metrics Summary:
| Metric | Q1 Baseline | Q4 Target |
| Mean Time to Remediation | 18 days | 3 days |
| Critical Assets Covered | 45% | 100% |
`,
      }),
    });

    const data = await res.json();
    if (
      res.ok &&
      data.success &&
      data.preview &&
      data.preview.tableCount === 1 &&
      data.preview.tables[0].rows.length === 2
    ) {
      console.log('✅ Preview succeeded! Table count:', data.preview.tableCount, 'Rows:', data.preview.tables[0].rows);
      passed++;
    } else {
      console.error('❌ Failed preview multimodal:', data);
    }
  } catch (err: any) {
    console.error('❌ Error during preview multimodal:', err.message);
  }

  // Test 3: Live Image Ingestion via Multipart Form Data
  total++;
  try {
    console.log('\n--- 3. Testing Image File Ingestion (/api/source/ingest) ---');
    const imageBlob = Buffer.from(pngBase64, 'base64');
    const formData = new FormData();
    formData.append(
      'file',
      new Blob([imageBlob], { type: 'image/png' }),
      'system_architecture.png'
    );
    formData.append('contextInstructions', 'Architecture diagram showing cloud egress proxy.');

    const res = await fetch(`${BACKEND_URL}/source/ingest`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (
      res.ok &&
      data.success &&
      data.source &&
      data.source.sourceType === 'image' &&
      data.source.extraction_method === 'multimodal_ocr' &&
      data.source.imagePart?.inlineData?.mimeType === 'image/png'
    ) {
      console.log('✅ Image ingestion succeeded! Source ID:', data.source.sourceId, 'Type:', data.source.sourceType);
      passed++;
    } else {
      console.error('❌ Failed image ingestion:', data);
    }
  } catch (err: any) {
    console.error('❌ Error during image ingestion:', err.message);
  }

  // Test 4: Live Source Brief Generation with Extracted Tables and Visual Context
  total++;
  try {
    console.log('\n--- 4. Testing Live Source Brief Generation with Multimodal Context (/api/brief/generate) ---');
    const briefRes = await fetch(`${BACKEND_URL}/brief/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceContent: `
--- Page 1 ---
National Quantum Cryptography Directive 2025. Federal directive issued to protect financial stability.
--- Page 2 ---
The transition will safeguard $4.8 trillion in daily interbank settlements.
`,
        tables: [
          {
            id: 'table-1',
            page_number: 1,
            headers: ['Algorithm Category', 'Target Protocol', 'Migration Deadline'],
            rows: [
              ['Key Encapsulation', 'ML-KEM-768', 'June 2026'],
              ['Digital Signatures', 'ML-DSA-65', 'November 2026'],
            ],
            confidence: 1.0,
          },
        ],
        visualContent: [
          {
            id: 'visual-1',
            type: 'diagram',
            page_number: 2,
            description: 'Architecture data flow diagram illustrating post-quantum HSM key exchange between Federal Reserve banks.',
            confidence: 0.95,
          },
        ],
        pageCount: 2,
        extractionMethod: 'hybrid',
        targetAudience: 'Bank Chief Risk Officers & CISOs',
        tone: 'Urgent & Authoritative',
        language: 'English',
        detailLevel: 'Standard',
        communicationObjective: 'Warn & Advise',
      }),
    });

    const briefData = await briefRes.json();
    if (briefRes.ok && briefData.success && briefData.sourceBrief) {
      const parsed = SourceBriefSchema.safeParse(briefData.sourceBrief);
      if (parsed.success) {
        console.log('✅ Live Gemini Source Brief generated & validated successfully!');
        console.log('   Title:', briefData.sourceBrief.sourceTitle);
        console.log('   Claims count:', briefData.sourceBrief.keyClaims.length);
        console.log('   Sample Claim:', briefData.sourceBrief.keyClaims[0]?.statement);
        passed++;
      } else {
        console.error('❌ Source Brief Zod validation failed:', parsed.error.format());
      }
    } else {
      console.error('❌ Failed live brief generation:', briefData);
    }
  } catch (err: any) {
    console.error('❌ Error during live brief generation:', err.message);
  }

  console.log('\n=====================================================');
  console.log(`📊 LIVE TEST RESULTS: ${passed}/${total} PASSED`);
  console.log('=====================================================');

  if (passed === total) {
    console.log('🎉 ALL LIVE MULTIMODAL ENDPOINT TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error(`💥 ${total - passed} LIVE TEST(S) FAILED!`);
    process.exit(1);
  }
}

runLiveTests();
