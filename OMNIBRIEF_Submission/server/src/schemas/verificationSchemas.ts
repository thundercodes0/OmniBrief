import { z } from 'zod';
import { SourceBriefSchema } from './briefSchema';

// ============================================================================
// 1. VERIFICATION STATUS & FINDING SCHEMAS
// ============================================================================

export const VerificationStatusSchema = z.enum([
  'SUPPORTED',
  'PARTIALLY_SUPPORTED',
  'UNSUPPORTED',
  'CONTRADICTED',
  'NEEDS_REVIEW',
]);

export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;

export const VerificationFindingSchema = z.object({
  finding_id: z.string().min(1, 'Finding ID is required'),
  status: VerificationStatusSchema,
  artifact_type: z.string().min(1, 'Artifact type is required'),
  claim_text: z.string().min(1, 'Claim text is required'),
  source_claim_ids: z.array(z.string()).default([]),
  explanation: z.string().min(1, 'Explanation is required'),
  suggested_action: z.string().min(1, 'Suggested action is required'),
  confidence: z.number().min(0).max(1).default(1),
});

export type VerificationFinding = z.infer<typeof VerificationFindingSchema>;

// ============================================================================
// 2. VERIFICATION RESULT SCHEMAS
// ============================================================================

export const VerificationResultSchema = z.object({
  artifact_type: z.string().min(1, 'Artifact type is required'),
  overall_status: VerificationStatusSchema,
  verification_score: z.number().min(0).max(1),
  total_findings: z.number().int().nonnegative(),
  supported_count: z.number().int().nonnegative(),
  partially_supported_count: z.number().int().nonnegative(),
  unsupported_count: z.number().int().nonnegative(),
  contradicted_count: z.number().int().nonnegative(),
  needs_review_count: z.number().int().nonnegative(),
  findings: z.array(VerificationFindingSchema).default([]),
  verified_claim_ids: z.array(z.string()).default([]),
  unverified_claim_ids: z.array(z.string()).default([]),
  summary: z.string().default(''),
});

export type VerificationResult = z.infer<typeof VerificationResultSchema>;

export const BatchVerificationResultSchema = z.object({
  results: z.array(VerificationResultSchema),
  total_artifacts: z.number().int().nonnegative(),
  verified_artifacts: z.number().int().nonnegative(),
  artifacts_needing_review: z.number().int().nonnegative(),
  artifacts_with_unsupported_claims: z.number().int().nonnegative(),
  artifacts_with_contradictions: z.number().int().nonnegative(),
});

export type BatchVerificationResult = z.infer<typeof BatchVerificationResultSchema>;

// ============================================================================
// 3. REQUEST / RESPONSE SCHEMAS (Supporting camelCase & snake_case)
// ============================================================================

export const VerifyArtifactRequestSchema = z
  .object({
    source_brief: SourceBriefSchema.optional(),
    sourceBrief: SourceBriefSchema.optional(),
    artifact: z.record(z.any()),
    artifact_type: z.string().optional(),
    artifactType: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.source_brief && !data.sourceBrief) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'source_brief or sourceBrief is required',
        path: ['source_brief'],
      });
    }
    if (!data.artifact_type && !data.artifactType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'artifact_type or artifactType is required',
        path: ['artifact_type'],
      });
    }
  })
  .transform((data) => ({
    source_brief: (data.source_brief || data.sourceBrief)!,
    artifact: data.artifact,
    artifact_type: (data.artifact_type || data.artifactType)!,
  }));

export type VerifyArtifactRequest = z.infer<typeof VerifyArtifactRequestSchema>;

export const BatchArtifactItemSchema = z
  .object({
    artifact_type: z.string().optional(),
    artifactType: z.string().optional(),
    artifact: z.record(z.any()),
  })
  .superRefine((item, ctx) => {
    if (!item.artifact_type && !item.artifactType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'artifact_type or artifactType is required for each artifact',
        path: ['artifact_type'],
      });
    }
  })
  .transform((item) => ({
    artifact_type: (item.artifact_type || item.artifactType)!,
    artifact: item.artifact,
  }));

export const VerifyBatchRequestSchema = z
  .object({
    source_brief: SourceBriefSchema.optional(),
    sourceBrief: SourceBriefSchema.optional(),
    artifacts: z.array(BatchArtifactItemSchema).min(1, 'At least one artifact required'),
  })
  .superRefine((data, ctx) => {
    if (!data.source_brief && !data.sourceBrief) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'source_brief or sourceBrief is required',
        path: ['source_brief'],
      });
    }
  })
  .transform((data) => ({
    source_brief: (data.source_brief || data.sourceBrief)!,
    artifacts: data.artifacts,
  }));

export type VerifyBatchRequest = z.infer<typeof VerifyBatchRequestSchema>;
