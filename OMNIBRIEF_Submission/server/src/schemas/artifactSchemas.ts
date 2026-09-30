import { z } from 'zod';
import { SourceBriefSchema } from './briefSchema';

// ============================================================================
// 1. INDIVIDUAL ARTIFACT SCHEMAS
// ============================================================================

/**
 * 1. Executive Summary Schema
 */
export const ExecutiveSummarySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().min(1, 'Executive summary narrative is required'),
  key_points: z.array(z.string()).min(1, 'At least one key point required'),
  implications: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  source_claim_ids: z.array(z.string()).default([]),
});

export type ExecutiveSummaryArtifact = z.infer<typeof ExecutiveSummarySchema>;

/**
 * 2. LinkedIn Post Schema
 */
export const LinkedInPostSchema = z.object({
  hook: z.string().min(1, 'Hook is required'),
  body: z.union([z.string(), z.array(z.string())]),
  call_to_action: z.string().min(1, 'Call to action is required'),
  hashtags: z.array(z.string()).default([]),
  source_claim_ids: z.array(z.string()).default([]),
});

export type LinkedInPostArtifact = z.infer<typeof LinkedInPostSchema>;

/**
 * 3. X / Twitter Post or Thread Schema
 */
export const XPostItemSchema = z.object({
  text: z.string().min(1, 'Post text is required'),
  source_claim_ids: z.array(z.string()).default([]),
});

export const XThreadSchema = z.object({
  is_thread: z.boolean().default(true),
  posts: z.array(XPostItemSchema).min(1, 'At least one post required'),
});

export type XThreadArtifact = z.infer<typeof XThreadSchema>;

/**
 * 4. Advisory Schema
 */
export const AdvisorySeveritySchema = z.enum([
  'critical',
  'high',
  'medium',
  'low',
  'informational',
]);

export const AdvisorySchema = z.object({
  title: z.string().min(1, 'Advisory title is required'),
  severity: AdvisorySeveritySchema.default('informational'),
  audience: z.string().default('Stakeholders and Operations Teams'),
  situation: z.string().min(1, 'Situation synopsis is required'),
  key_findings: z.array(z.string()).min(1, 'At least one key finding required'),
  recommended_actions: z.array(z.string()).min(1, 'At least one recommended action required'),
  warnings: z.array(z.string()).default([]),
  source_claim_ids: z.array(z.string()).default([]),
});

export type AdvisoryArtifact = z.infer<typeof AdvisorySchema>;

/**
 * 5. Infographic Information Design Specification Schema
 */
export const InfographicStatisticSchema = z.object({
  metric: z.string(),
  value: z.string(),
  source_claim_id: z.string().optional(),
});

export const InfographicSectionSchema = z.object({
  heading: z.string(),
  key_takeaways: z.array(z.string()).default([]),
});

export const InfographicVisualElementSchema = z.object({
  element_type: z.string(), // e.g. "bar_chart", "flowchart", "callout_card", "timeline"
  description: z.string(),
});

export const InfographicSchema = z.object({
  title: z.string().min(1, 'Infographic title is required'),
  subtitle: z.string().default(''),
  key_statistics: z.array(InfographicStatisticSchema).default([]),
  sections: z.array(InfographicSectionSchema).default([]),
  visual_elements: z.array(InfographicVisualElementSchema).default([]),
  footer: z.string().default('OmniBrief Intelligence Engine Specification'),
  source_claim_ids: z.array(z.string()).default([]),
});

export type InfographicArtifact = z.infer<typeof InfographicSchema>;

/**
 * 6. Presentation Schema
 */
export const SlideItemSchema = z.object({
  slide_number: z.number().int().positive(),
  title: z.string().min(1, 'Slide title is required'),
  bullets: z.array(z.string()).default([]),
  speaker_notes: z.string().default(''),
  source_claim_ids: z.array(z.string()).default([]),
});

export const PresentationSchema = z.object({
  title: z.string().min(1, 'Deck title is required'),
  subtitle: z.string().default(''),
  slides: z.array(SlideItemSchema).min(1, 'At least one slide required'),
});

export type PresentationArtifact = z.infer<typeof PresentationSchema>;

/**
 * 7. Video Package Storyboard & Script Schema
 */
export const VideoSceneSchema = z.object({
  scene_number: z.number().int().positive(),
  duration_seconds: z.number().positive(),
  narration: z.string().default(''),
  visual_description: z.string().default(''),
  on_screen_text: z.string().default(''),
  source_claim_ids: z.array(z.string()).default([]),
});

export const VideoPackageSchema = z.object({
  title: z.string().min(1, 'Video title is required'),
  duration_seconds: z.number().positive().default(60),
  target_audience: z.string().default('General Professional'),
  narration: z.string().min(1, 'Full continuous narration script is required'),
  scenes: z.array(VideoSceneSchema).min(1, 'At least one scene required'),
  subtitles: z.string().default(''),
  visual_recommendations: z.array(z.string()).default([]),
});

export type VideoPackageArtifact = z.infer<typeof VideoPackageSchema>;

// ============================================================================
// 2. DISPATCH & MAP TYPES
// ============================================================================

export const ARTIFACT_TYPE_KEYS = [
  'executive_summary',
  'linkedin',
  'x_thread',
  'advisory',
  'infographic',
  'presentation',
  'video',
] as const;

export type SupportedArtifactType = (typeof ARTIFACT_TYPE_KEYS)[number];

export const ArtifactSchemaMap = {
  executive_summary: ExecutiveSummarySchema,
  linkedin: LinkedInPostSchema,
  x_thread: XThreadSchema,
  advisory: AdvisorySchema,
  infographic: InfographicSchema,
  presentation: PresentationSchema,
  video: VideoPackageSchema,
};

// Map legacy or alternative keys to canonical keys
export function canonicalizeArtifactType(type: string): SupportedArtifactType | null {
  const normalized = type.toLowerCase().trim();
  if (normalized === 'executive_summary') return 'executive_summary';
  if (normalized === 'linkedin' || normalized === 'linkedin_post') return 'linkedin';
  if (normalized === 'x_thread' || normalized === 'twitter_thread' || normalized === 'twitter') return 'x_thread';
  if (normalized === 'advisory') return 'advisory';
  if (normalized === 'infographic') return 'infographic';
  if (normalized === 'presentation') return 'presentation';
  if (normalized === 'video' || normalized === 'video_package') return 'video';
  return null;
}

// ============================================================================
// 3. REQUEST / RESPONSE SCHEMAS
// ============================================================================

export const ArtifactBatchRequestSchema = z.object({
  sourceBrief: SourceBriefSchema,
  audience: z.string().optional(),
  tone: z.string().optional(),
  language: z.string().optional(),
  detail: z.string().optional(),
  objective: z.string().optional(),
  style: z.string().optional(),
  requestedArtifacts: z
    .array(z.string())
    .default([
      'executive_summary',
      'linkedin',
      'x_thread',
      'advisory',
      'infographic',
      'presentation',
      'video',
    ]),
});

export type ArtifactBatchRequest = z.infer<typeof ArtifactBatchRequestSchema>;

export const ArtifactRegenerateRequestSchema = z.object({
  sourceBrief: SourceBriefSchema,
  artifactType: z.string(),
  audience: z.string().optional(),
  tone: z.string().optional(),
  language: z.string().optional(),
  detail: z.string().optional(),
  objective: z.string().optional(),
  style: z.string().optional(),
});

export type ArtifactRegenerateRequest = z.infer<typeof ArtifactRegenerateRequestSchema>;
