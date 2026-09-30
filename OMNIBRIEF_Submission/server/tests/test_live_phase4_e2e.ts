import { SourceBrief } from '../src/schemas/briefSchema';

console.log('=====================================================');
console.log('🚀 TESTING LIVE PHASE 4 VERIFICATION ENDPOINTS');
console.log('=====================================================');

const BACKEND_URL = 'http://127.0.0.1:3001/api';

const sampleSourceBrief: SourceBrief = {
  sourceTitle: "India's Digital Public Infrastructure Expansion",
  detectedDomain: 'Public Policy & Digital Infrastructure',
  executiveSummary:
    "India's digital public infrastructure has expanded significantly in recent years. The document discusses interoperable digital systems and secure data exchange.",
  keyClaims: [
    {
      claimId: 'CLAIM-01',
      statement: "India's digital public infrastructure has experienced substantial expansion in recent years.",
      category: 'Infrastructure',
      verbatimSourceQuote: "India's digital public infrastructure has expanded significantly in recent years.",
      confidence: 1,
    },
    {
      claimId: 'CLAIM-02',
      statement: 'Interoperable digital systems are key to improving public service delivery.',
      category: 'Interoperability',
      verbatimSourceQuote: 'The source document discusses the role of interoperable digital systems in improving access to public services.',
      confidence: 1,
    },
    {
      claimId: 'CLAIM-03',
      statement: 'Secure data exchange, scalable infrastructure, and user-centric design are critical components.',
      category: 'Security & Design',
      verbatimSourceQuote: 'It highlights the importance of secure data exchange, scalable infrastructure, and user-centric design.',
      confidence: 1,
    },
  ],
  entities: [
    { name: 'India', type: 'Location', relevance: 'High' },
  ],
  statistics: [],
  uncertainties: [
    'The source does not provide specific metrics or timelines regarding the scale of the expansion.',
  ],
  recommendations: [
    'Incorporate interoperable digital systems to streamline and improve access to public services.',
  ],
};

const sampleGroundedExecutiveSummary = {
  title: "Strategic Overview: India's Digital Public Infrastructure",
  summary: "India's digital public infrastructure has expanded significantly, driven by interoperable systems and secure data exchange.",
  key_points: [
    "DPI expansion has grown substantially in recent years across key sectors.",
    "Interoperable systems significantly enhance delivery and access to public services.",
  ],
  implications: [
    "Scalable, secure infrastructure is necessary to maintain trust and data integrity.",
  ],
  recommendations: [
    "Adopt interoperable digital architecture for all government public service initiatives.",
  ],
  source_claim_ids: ["CLAIM-01", "CLAIM-02", "CLAIM-03"],
};

const sampleLinkedInWithHallucination = {
  hook: "India just connected 1.4 billion people to a revolutionary blockchain system!",
  body: [
    "India's digital public infrastructure has expanded significantly in recent years.",
    "Furthermore, every rural village now operates an unhackable decentralized node.",
  ],
  call_to_action: "Audit your infrastructure today.",
  hashtags: ["#DPI", "#DigitalIndia"],
  source_claim_ids: ["CLAIM-01"],
};

async function runLiveVerificationTests() {
  try {
    // TEST 1: Health check
    const healthRes = await fetch(`${BACKEND_URL}/health`);
    const healthJson = await healthRes.json();
    console.log(`Backend Health: ${healthRes.status} ->`, healthJson);
    if (!healthRes.ok) {
      throw new Error('Backend health check failed');
    }

    // TEST 2: Single Artifact Verification (Grounded Executive Summary)
    console.log('\n--- TEST 2: POST /api/artifacts/verify (Grounded Exec Summary) ---');
    const verifyRes1 = await fetch(`${BACKEND_URL}/artifacts/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_brief: sampleSourceBrief,
        artifact: sampleGroundedExecutiveSummary,
        artifact_type: 'executive_summary',
      }),
    });

    const verifyJson1 = await verifyRes1.json();
    console.log(`Verify Status: ${verifyRes1.status}`);
    console.log('Result Score:', verifyJson1.verification_score);
    console.log('Overall Status:', verifyJson1.overall_status);
    console.log('Findings Count:', verifyJson1.findings?.length);
    if (verifyJson1.findings && verifyJson1.findings.length > 0) {
      console.log('Sample Finding 1:', {
        finding_id: verifyJson1.findings[0].finding_id,
        status: verifyJson1.findings[0].status,
        claim: verifyJson1.findings[0].claim_text,
        explanation: verifyJson1.findings[0].explanation,
      });
    }

    if (!verifyRes1.ok || !verifyJson1.success) {
      throw new Error(`Single verification failed: ${JSON.stringify(verifyJson1)}`);
    }

    // TEST 3: Single Artifact Verification with Detected Hallucinations (LinkedIn Post)
    console.log('\n--- TEST 3: POST /api/artifacts/verify (LinkedIn with Hallucinated Figures) ---');
    const verifyRes2 = await fetch(`${BACKEND_URL}/artifacts/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_brief: sampleSourceBrief,
        artifact: sampleLinkedInWithHallucination,
        artifact_type: 'linkedin',
      }),
    });

    const verifyJson2 = await verifyRes2.json();
    console.log(`Verify Status: ${verifyRes2.status}`);
    console.log('Result Score:', verifyJson2.verification_score);
    console.log('Overall Status:', verifyJson2.overall_status);
    console.log('Unsupported Count:', verifyJson2.unsupported_count);
    console.log('Findings:', verifyJson2.findings?.map((f: any) => `[${f.status}] ${f.claim_text} -> ${f.explanation}`));

    if (!verifyRes2.ok || !verifyJson2.success) {
      throw new Error(`Hallucination detection verification failed: ${JSON.stringify(verifyJson2)}`);
    }

    // TEST 4: Batch Verification (POST /api/artifacts/verify-batch)
    console.log('\n--- TEST 4: POST /api/artifacts/verify-batch (Batch of 2 artifacts) ---');
    const batchRes = await fetch(`${BACKEND_URL}/artifacts/verify-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_brief: sampleSourceBrief,
        artifacts: [
          { artifact_type: 'executive_summary', artifact: sampleGroundedExecutiveSummary },
          { artifact_type: 'linkedin', artifact: sampleLinkedInWithHallucination },
        ],
      }),
    });

    const batchJson = await batchRes.json();
    console.log(`Batch Verify Status: ${batchRes.status}`);
    console.log('Total Artifacts Audited:', batchJson.total_artifacts);
    console.log('Verified Artifacts:', batchJson.verified_artifacts);
    console.log('Artifacts with Unsupported Claims:', batchJson.artifacts_with_unsupported_claims);
    console.log('Batch Results Summary:');
    batchJson.results?.forEach((r: any) => {
      console.log(`  - [${r.artifact_type}] Status: ${r.overall_status} | Score: ${(r.verification_score * 100).toFixed(0)}% | Findings: ${r.total_findings}`);
    });

    if (!batchRes.ok || !batchJson.success) {
      throw new Error(`Batch verification failed: ${JSON.stringify(batchJson)}`);
    }

    console.log('\n=====================================================');
    console.log('🎉 ALL LIVE PHASE 4 VERIFICATION ENDPOINT TESTS PASSED!');
    console.log('=====================================================');
  } catch (err: any) {
    console.error('❌ Live test error:', err);
    process.exit(1);
  }
}

runLiveVerificationTests();
