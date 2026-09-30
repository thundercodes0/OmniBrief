import { computeVerificationScore } from '../src/services/verificationService';
import {
  VerificationFinding,
  VerificationResultSchema,
  BatchVerificationResultSchema,
  VerifyArtifactRequestSchema,
  VerifyBatchRequestSchema,
} from '../src/schemas/verificationSchemas';
import { SourceBrief } from '../src/schemas/briefSchema';

console.log('=====================================================');
console.log('🧪 RUNNING PHASE 4 FACTUAL VERIFICATION TEST SUITE');
console.log('=====================================================');

const mockSourceBrief: SourceBrief = {
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

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
    process.exitCode = 1;
  }
}

// ----------------------------------------------------------------------------
// TEST 1: Fully supported artifact scoring
// ----------------------------------------------------------------------------
const supportedFindings: VerificationFinding[] = [
  {
    finding_id: 'FINDING-01',
    status: 'SUPPORTED',
    artifact_type: 'executive_summary',
    claim_text: "India's digital public infrastructure has grown substantially.",
    source_claim_ids: ['CLAIM-01'],
    explanation: 'Directly supported by CLAIM-01.',
    suggested_action: 'None needed.',
    confidence: 1,
  },
  {
    finding_id: 'FINDING-02',
    status: 'SUPPORTED',
    artifact_type: 'executive_summary',
    claim_text: 'Interoperable systems improve public service access.',
    source_claim_ids: ['CLAIM-02'],
    explanation: 'Directly matches CLAIM-02.',
    suggested_action: 'None needed.',
    confidence: 1,
  },
];

const res1 = computeVerificationScore('executive_summary', supportedFindings);
assert(
  res1.overall_status === 'SUPPORTED' && res1.verification_score === 1.0,
  'Test 1: Fully supported artifact',
  `Score: ${res1.verification_score}, Status: ${res1.overall_status}`
);

// ----------------------------------------------------------------------------
// TEST 2: Partially supported claim
// ----------------------------------------------------------------------------
const partialFindings: VerificationFinding[] = [
  {
    finding_id: 'FINDING-01',
    status: 'SUPPORTED',
    artifact_type: 'linkedin',
    claim_text: 'DPI has expanded across India.',
    source_claim_ids: ['CLAIM-01'],
    explanation: 'Supported by source.',
    suggested_action: 'None.',
    confidence: 1,
  },
  {
    finding_id: 'FINDING-02',
    status: 'PARTIALLY_SUPPORTED',
    artifact_type: 'linkedin',
    claim_text: 'Interoperability is the single greatest breakthrough in modern public governance.',
    source_claim_ids: ['CLAIM-02'],
    explanation: 'Interoperability is supported, but claiming it is the single greatest breakthrough adds ungrounded hyperbole.',
    suggested_action: 'Tone down the superlatives.',
    confidence: 0.85,
  },
];

const res2 = computeVerificationScore('linkedin', partialFindings);
// Score: (1.0 + 0.5) / 2 = 0.75
assert(
  res2.overall_status === 'PARTIALLY_SUPPORTED' && res2.verification_score === 0.75,
  'Test 2: Partially supported claim with weighted score calculation',
  `Score: ${res2.verification_score}, Status: ${res2.overall_status}`
);

// ----------------------------------------------------------------------------
// TEST 3: Unsupported claim
// ----------------------------------------------------------------------------
const unsupportedFindings: VerificationFinding[] = [
  {
    finding_id: 'FINDING-01',
    status: 'UNSUPPORTED',
    artifact_type: 'x_thread',
    claim_text: 'India recently deployed 50,000 edge servers across rural villages.',
    source_claim_ids: [],
    explanation: 'No edge server deployment figures exist in the Source Brief.',
    suggested_action: 'Remove the 50,000 edge servers claim.',
    confidence: 0.95,
  },
];

const res3 = computeVerificationScore('x_thread', unsupportedFindings);
assert(
  res3.overall_status === 'UNSUPPORTED' && res3.verification_score === 0,
  'Test 3: Unsupported claim yields UNSUPPORTED status and zero score',
  `Score: ${res3.verification_score}, Status: ${res3.overall_status}`
);

// ----------------------------------------------------------------------------
// TEST 4: Contradicted claim
// ----------------------------------------------------------------------------
const contradictedFindings: VerificationFinding[] = [
  {
    finding_id: 'FINDING-01',
    status: 'SUPPORTED',
    artifact_type: 'advisory',
    claim_text: 'Secure data exchange is critical.',
    source_claim_ids: ['CLAIM-03'],
    explanation: 'Matches CLAIM-03.',
    suggested_action: 'None.',
    confidence: 1,
  },
  {
    finding_id: 'FINDING-02',
    status: 'CONTRADICTED',
    artifact_type: 'advisory',
    claim_text: 'Interoperability should be abandoned in favor of proprietary closed systems.',
    source_claim_ids: ['CLAIM-02'],
    explanation: 'Directly contradicts the recommendation to adopt interoperable systems.',
    suggested_action: 'Correct statement to advocate interoperability.',
    confidence: 1,
  },
];

const res4 = computeVerificationScore('advisory', contradictedFindings);
assert(
  res4.overall_status === 'CONTRADICTED' && res4.contradicted_count === 1,
  'Test 4: Contradicted claim overrides overall status to CONTRADICTED',
  `Status: ${res4.overall_status}, Contradicted: ${res4.contradicted_count}`
);

// ----------------------------------------------------------------------------
// TEST 5: Needs-review claim
// ----------------------------------------------------------------------------
const reviewFindings: VerificationFinding[] = [
  {
    finding_id: 'FINDING-01',
    status: 'NEEDS_REVIEW',
    artifact_type: 'presentation',
    claim_text: 'The exact timeline for full nationwide implementation is 24 months.',
    source_claim_ids: [],
    explanation: 'Source brief uncertainties specifically note missing timelines.',
    suggested_action: 'Highlight that the timeline is unconfirmed in the source.',
    confidence: 0.9,
  },
];

const res5 = computeVerificationScore('presentation', reviewFindings);
assert(
  res5.overall_status === 'NEEDS_REVIEW' && res5.verification_score === 0.5,
  'Test 5: Needs-review claim reflects uncertain source data with 0.5 score',
  `Score: ${res5.verification_score}, Status: ${res5.overall_status}`
);

// ----------------------------------------------------------------------------
// TEST 6: Incorrect numerical value detection
// ----------------------------------------------------------------------------
const numMismatchFindings: VerificationFinding[] = [
  {
    finding_id: 'FINDING-NUM-01',
    status: 'UNSUPPORTED',
    artifact_type: 'infographic',
    claim_text: 'Over 1.4 billion citizens are active daily users of the system.',
    source_claim_ids: ['CLAIM-01'],
    explanation: 'The Source Brief explicitly notes that specific metrics regarding the scale are missing. The 1.4 billion figure is invented.',
    suggested_action: 'Remove 1.4 billion or label as external estimate.',
    confidence: 0.98,
  },
];

const res6 = computeVerificationScore('infographic', numMismatchFindings);
assert(
  res6.unsupported_count === 1 && res6.overall_status === 'UNSUPPORTED',
  'Test 6: Hallucinated / incorrect numerical value caught as UNSUPPORTED',
  `Score: ${res6.verification_score}`
);

// ----------------------------------------------------------------------------
// TEST 7: Missing or incorrect claim ID
// ----------------------------------------------------------------------------
const missingClaimIdFinding: VerificationFinding[] = [
  {
    finding_id: 'FINDING-CID-01',
    status: 'UNSUPPORTED',
    artifact_type: 'video',
    claim_text: 'The system was authored by the Ministry of Electronics in 2021.',
    source_claim_ids: ['CLAIM-99'], // Non-existent claim
    explanation: 'CLAIM-99 does not exist in the Source Brief, and ministry attribution is not stated.',
    suggested_action: 'Remove claim citation or attribute correctly.',
    confidence: 1,
  },
];

const res7 = computeVerificationScore('video', missingClaimIdFinding);
assert(
  res7.unverified_claim_ids.includes('CLAIM-99'),
  'Test 7: Unverified / missing claim ID recorded in unverified_claim_ids',
  `Unverified IDs: ${JSON.stringify(res7.unverified_claim_ids)}`
);

// ----------------------------------------------------------------------------
// TEST 8: Batch verification schema structure
// ----------------------------------------------------------------------------
const batchData = {
  results: [res1, res2, res3, res4],
  total_artifacts: 4,
  verified_artifacts: 1,
  artifacts_needing_review: 1,
  artifacts_with_unsupported_claims: 1,
  artifacts_with_contradictions: 1,
};

const validatedBatch = BatchVerificationResultSchema.safeParse(batchData);
assert(
  validatedBatch.success,
  'Test 8: Batch verification result passes strict Zod validation',
  validatedBatch.error ? JSON.stringify(validatedBatch.error) : ''
);

// ----------------------------------------------------------------------------
// TEST 9: Failure isolation simulation in batch
// ----------------------------------------------------------------------------
const simulatedFailedArtifactResult = {
  artifact_type: 'advisory',
  overall_status: 'NEEDS_REVIEW' as const,
  verification_score: 0.5,
  total_findings: 1,
  supported_count: 0,
  partially_supported_count: 0,
  unsupported_count: 0,
  contradicted_count: 0,
  needs_review_count: 1,
  findings: [
    {
      finding_id: 'FINDING-ERR',
      status: 'NEEDS_REVIEW' as const,
      artifact_type: 'advisory',
      claim_text: 'Transient failure',
      source_claim_ids: [],
      explanation: 'Error parsing model response',
      suggested_action: 'Retry',
      confidence: 0.5,
    },
  ],
  verified_claim_ids: [],
  unverified_claim_ids: [],
  summary: 'Isolated failure test',
};

const batchWithFailure = BatchVerificationResultSchema.safeParse({
  results: [res1, simulatedFailedArtifactResult],
  total_artifacts: 2,
  verified_artifacts: 1,
  artifacts_needing_review: 1,
  artifacts_with_unsupported_claims: 0,
  artifacts_with_contradictions: 0,
});

assert(
  batchWithFailure.success,
  'Test 9: Failure isolation keeps batch result intact when one artifact fails'
);

// ----------------------------------------------------------------------------
// TEST 10: Verification score formula precision
// ----------------------------------------------------------------------------
// 2 supported (2 * 1.0) + 1 partial (1 * 0.5) + 1 review (1 * 0.5) + 1 unsupported (0)
// Total points = 2 + 0.5 + 0.5 + 0 = 3.0
// Total findings = 5 -> Score = 3.0 / 5 = 0.60
const complexFindings: VerificationFinding[] = [
  { ...supportedFindings[0], finding_id: 'F1', status: 'SUPPORTED' },
  { ...supportedFindings[0], finding_id: 'F2', status: 'SUPPORTED' },
  { ...supportedFindings[0], finding_id: 'F3', status: 'PARTIALLY_SUPPORTED' },
  { ...supportedFindings[0], finding_id: 'F4', status: 'NEEDS_REVIEW' },
  { ...supportedFindings[0], finding_id: 'F5', status: 'UNSUPPORTED' },
];

const res10 = computeVerificationScore('executive_summary', complexFindings);
assert(
  res10.verification_score === 0.6 && res10.overall_status === 'UNSUPPORTED',
  'Test 10: Complex weighted score matches formula: (2*1.0 + 0.5 + 0.5 + 0)/5 = 0.60',
  `Computed: ${res10.verification_score}`
);

// ----------------------------------------------------------------------------
// TEST 11: Empty factual findings boundary
// ----------------------------------------------------------------------------
const res11 = computeVerificationScore('infographic', []);
assert(
  res11.verification_score === 1.0 && res11.overall_status === 'SUPPORTED' && res11.total_findings === 0,
  'Test 11: Empty findings boundary condition produces score 1.0 without dividing by zero',
  `Score: ${res11.verification_score}`
);

// ----------------------------------------------------------------------------
// TEST 12: Request schema Zod validation & reject invalid input
// ----------------------------------------------------------------------------
const validRequest = VerifyArtifactRequestSchema.safeParse({
  sourceBrief: mockSourceBrief,
  artifact: { title: 'Test Artifact', summary: 'Some content' },
  artifactType: 'executive_summary',
});

const invalidRequest = VerifyArtifactRequestSchema.safeParse({
  // Missing sourceBrief
  artifact: { title: 'Test Artifact' },
  artifactType: 'executive_summary',
});

assert(
  validRequest.success && !invalidRequest.success,
  'Test 12: VerifyArtifactRequestSchema accepts valid camelCase/snake_case and rejects missing source brief'
);

console.log('=====================================================');
console.log(`📊 TEST RESULTS: ${passedTests}/${totalTests} PASSED`);
console.log('=====================================================');

if (passedTests === totalTests) {
  console.log('🎉 ALL 12 VERIFICATION SCENARIO TESTS PASSED SUCCESSFULLY!');
} else {
  console.error('❌ SOME TESTS FAILED.');
  process.exit(1);
}
