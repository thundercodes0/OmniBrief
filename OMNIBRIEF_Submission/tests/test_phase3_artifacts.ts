const FRONTEND_ORIGIN = 'http://localhost:5173';

const sampleSourceBrief = {
  sourceTitle: "India's Digital Public Infrastructure Expansion",
  detectedDomain: "Digital Public Infrastructure",
  executiveSummary: "The document highlights the significant expansion of India's digital public infrastructure and discusses how interoperable digital systems, secure data exchange, scalable infrastructure, and user-centric design improve access to public services.",
  keyClaims: [
    {
      claimId: "CLAIM-01",
      statement: "India's digital public infrastructure has expanded significantly in recent years.",
      category: "Infrastructure Growth",
      verbatimSourceQuote: "India digital public infrastructure has expanded significantly in recent years.",
      confidence: 0.95
    },
    {
      claimId: "CLAIM-02",
      statement: "Interoperable digital systems improve access to public services.",
      category: "Public Service Delivery",
      verbatimSourceQuote: "The source document discusses the role of interoperable digital systems in improving access to public services.",
      confidence: 0.90
    },
    {
      claimId: "CLAIM-03",
      statement: "Secure data exchange, scalable infrastructure, and user-centric design are critical to the system.",
      category: "Architecture",
      verbatimSourceQuote: "It highlights the importance of secure data exchange, scalable infrastructure, and user-centric design.",
      confidence: 0.95
    }
  ],
  entities: [
    { name: "India", type: "Location/Country", relevance: "Primary focus" }
  ],
  statistics: [],
  recommendations: [
    "Implement secure data exchange mechanisms in digital public systems.",
    "Adopt user-centric design principles for public services."
  ],
  uncertainties: [
    "Specific metrics, budget allocations, and timelines are not detailed."
  ]
};

async function testPhase3() {
  console.log('=====================================================');
  console.log('🚀 TESTING PHASE 3: REAL GEMINI ARTIFACT GENERATION');
  console.log('=====================================================\n');

  // Test 1: Generate Batch (all 7 artifacts)
  console.log('--- TEST 1: POST /api/artifacts/generate-batch (All 7 formats) ---');
  const batchPayload = {
    sourceBrief: sampleSourceBrief,
    audience: 'Executive Leadership & Technical Operators',
    tone: 'Authoritative & Strategic',
    language: 'English',
    detail: 'Standard',
    objective: 'Accelerate digital public infrastructure adoption',
    requestedArtifacts: [
      'executive_summary',
      'linkedin',
      'x_thread',
      'advisory',
      'infographic',
      'presentation',
      'video'
    ]
  };

  const tStart = Date.now();
  const batchRes = await fetch(`${FRONTEND_ORIGIN}/api/artifacts/generate-batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(batchPayload)
  });

  const duration = Date.now() - tStart;
  console.log(`Batch Response: ${batchRes.status} ${batchRes.statusText} (${duration}ms)`);
  if (!batchRes.ok) {
    const errorText = await batchRes.text();
    console.error('Batch error body:', errorText);
    throw new Error(`Batch generation failed with status ${batchRes.status}`);
  }

  const batchData = await batchRes.json();
  console.log('Batch Success Status:', batchData.success);
  console.log('Generated Artifact Keys:', Object.keys(batchData.artifacts || {}));
  console.log('Batch Errors (if any):', batchData.errors);

  // Validate each of the 7 artifacts
  const requiredKeys = ['executive_summary', 'linkedin', 'x_thread', 'advisory', 'infographic', 'presentation', 'video'];
  for (const k of requiredKeys) {
    const art = batchData.artifacts[k];
    if (!art) {
      console.error(`❌ Missing artifact in batch response: ${k}`);
      throw new Error(`Artifact ${k} was not generated`);
    }
    console.log(`✅ [${k.toUpperCase()}]: Title/Hook -> "${art.title || art.hook || art.posts?.[0]?.text?.substring(0, 40)}" (Claims: ${JSON.stringify(art.source_claim_ids || art.posts?.[0]?.source_claim_ids || [])})`);
  }

  // Test 2: Regenerate One Artifact (e.g. linkedin)
  console.log('\n--- TEST 2: POST /api/artifacts/regenerate-one (linkedin) ---');
  const regenPayload = {
    sourceBrief: sampleSourceBrief,
    artifactType: 'linkedin',
    audience: 'Senior Enterprise Architects',
    tone: 'Visionary & Inspiring',
    language: 'English',
    detail: 'Concise',
    objective: 'Drive discussion on scalable DPI design'
  };

  const regenRes = await fetch(`${FRONTEND_ORIGIN}/api/artifacts/regenerate-one`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(regenPayload)
  });

  console.log(`Regenerate Response: ${regenRes.status} ${regenRes.statusText}`);
  if (!regenRes.ok) {
    const errorText = await regenRes.text();
    console.error('Regenerate error body:', errorText);
    throw new Error(`Regenerate failed with status ${regenRes.status}`);
  }

  const regenData = await regenRes.json();
  console.log('Regenerated Artifact Type:', regenData.artifactType);
  console.log('New Hook:', regenData.artifact?.hook);
  console.log('New Hashtags:', regenData.artifact?.hashtags);
  console.log('Claim IDs:', regenData.artifact?.source_claim_ids);

  console.log('\n🎉 ALL PHASE 3 BACKEND TESTS PASSED SUCCESSFULLY!');
}

testPhase3().catch((err) => {
  console.error('\n❌ Phase 3 test failed:', err);
  process.exit(1);
});
