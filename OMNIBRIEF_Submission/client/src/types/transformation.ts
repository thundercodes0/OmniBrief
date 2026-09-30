/**
 * Types for Content Transformation Engine (Frontend Foundation)
 */

export type NavigationPage =
  | 'dashboard'
  | 'new-transformation'
  | 'results'
  | 'history'
  | 'templates'
  | 'settings';

export type OutputType =
  | 'executive_summary'
  | 'linkedin_post'
  | 'x_thread'
  | 'advisory'
  | 'infographic'
  | 'presentation'
  | 'video_package';

export type PipelineStep =
  | 'source'
  | 'analyzing'
  | 'source_brief'
  | 'generating_outputs'
  | 'fact_verification'
  | 'complete';

export interface SourceData {
  inputType: 'file' | 'text';
  rawText: string;
  file: File | null;
  fileName: string | null;
  fileSize: number | null;
  fileType: string | null;
  contextInstructions: string;
}

export type ExtractionMethod = 'native_text' | 'multimodal_ocr' | 'hybrid';

export interface ExtractedTable {
  id: string;
  page_number?: number;
  caption?: string;
  headers: string[];
  rows: string[][];
  confidence?: number;
}

export interface VisualElement {
  id: string;
  type: 'chart' | 'diagram' | 'infographic' | 'table' | 'photo' | 'screenshot' | 'other';
  page_number?: number;
  description: string;
  extracted_text?: string;
  confidence?: number;
}

export interface NormalizedSourceData {
  sourceId: string;
  sourceType: 'pdf' | 'docx' | 'txt' | 'image' | 'text';
  title: string;
  text: string;
  visual_content: VisualElement[];
  tables: ExtractedTable[];
  extraction_warnings: string[];
  extraction_method: ExtractionMethod;
  page_count?: number;
  confidence_score?: number;
  imagePart?: {
    inlineData: {
      data: string;
      mimeType: string;
    };
  };
  metadata: {
    fileName?: string;
    mimeType: string;
    fileSize: number;
    characterCount: number;
    pageCount?: number;
    processedAt?: string;
  };
}

export interface ConfigurationParameters {
  targetAudience: string;
  tone: string;
  language: string;
  detailLevel: 'Concise (TL;DR)' | 'Standard (Balanced)' | 'Comprehensive (In-depth)';
  communicationObjective: string;
}

export interface KeyClaim {
  id?: string;
  claimId?: string;
  claim?: string;
  statement?: string;
  sourceQuote?: string;
  verbatimSourceQuote?: string;
  category?: string;
  confidence: number;
}

export interface EntityItem {
  name: string;
  type: string;
  relevance: string;
}

export interface MetricItem {
  metric: string;
  value: string;
  context: string;
}

export interface SourceBriefData {
  sourceTitle: string;
  detectedDomain: string;
  executiveSummary: string;
  keyClaims: KeyClaim[];
  entities: EntityItem[];
  statistics: MetricItem[];
  recommendations: string[];
  uncertainties: string[];
  isLiveGenerated?: boolean;
}

// Real Structured Artifact Interfaces (Phase 3)
export interface RealExecutiveSummary {
  title: string;
  summary?: string;
  key_points?: string[];
  implications?: string[];
  recommendations?: string[];
  source_claim_ids?: string[];
  // Backwards-compat
  tldr?: string;
  keyTakeaways?: string[];
  strategicImplications?: string[];
  actionItems?: string[];
  metrics?: { label: string; value: string }[];
}

export interface RealLinkedInPost {
  hook: string;
  body: string | string[];
  call_to_action?: string;
  callToAction?: string;
  hashtags: string[];
  source_claim_ids?: string[];
  // Backwards-compat
  bulletPoints?: string[];
  charCount?: number;
}

export interface RealXPost {
  text: string;
  source_claim_ids?: string[];
  index?: number;
  charCount?: number;
  tag?: string;
}

export interface RealXThread {
  is_thread?: boolean;
  posts?: RealXPost[];
  // Backwards-compat
  totalTweets?: number;
  tweets?: {
    index: number;
    text: string;
    charCount: number;
    tag?: string;
  }[];
}

export interface RealAdvisory {
  title?: string;
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'informational' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | string;
  audience?: string;
  situation?: string;
  key_findings?: string[];
  recommended_actions?: string[];
  warnings?: string[];
  source_claim_ids?: string[];
  // Backwards-compat
  advisoryId?: string;
  tlp?: string;
  targetAudience?: string[] | string;
  threatSummary?: string;
  technicalDetails?: string;
  mitigationSteps?: {
    step: number;
    action: string;
    urgency: string;
  }[];
  contactInfo?: string;
}

export interface RealInfographic {
  title?: string;
  subtitle?: string;
  key_statistics?: {
    metric: string;
    value: string;
    source_claim_id?: string;
  }[];
  sections?: {
    heading: string;
    key_takeaways: string[];
  }[];
  visual_elements?: {
    element_type: string;
    description: string;
  }[];
  footer?: string;
  source_claim_ids?: string[];
  // Backwards-compat
  headline?: string;
  subheadline?: string;
  kpiStats?: {
    value: string;
    label: string;
    subtitle: string;
    trend?: 'up' | 'down' | 'alert';
  }[];
  processSteps?: {
    step: number;
    title: string;
    description: string;
  }[];
  coreTakeaway?: string;
}

export interface RealSlide {
  slide_number?: number;
  title: string;
  bullets?: string[];
  speaker_notes?: string;
  source_claim_ids?: string[];
  // Backwards-compat
  slideNumber?: number;
  bulletPoints?: string[];
  visualPrompt?: string;
  speakerNotes?: string;
}

export interface RealPresentation {
  title?: string;
  subtitle?: string;
  slides: RealSlide[];
  // Backwards-compat
  deckTitle?: string;
  estimatedMinutes?: number;
}

export interface RealVideoScene {
  scene_number?: number;
  duration_seconds?: number;
  narration?: string;
  visual_description?: string;
  visualDescription?: string;
  on_screen_text?: string;
  source_claim_ids?: string[];
  // Backwards-compat
  sceneNumber?: number;
  timestamp?: string;
  visualRecommendation?: string;
  narrationText?: string;
  subtitles?: string;
  cameraDirection?: string;
}

export interface RealVideoPackage {
  title: string;
  duration_seconds?: number;
  durationSeconds?: number;
  aspectRatio?: string;
  target_audience?: string;
  narration?: string;
  scenes: RealVideoScene[];
  subtitles?: string;
  visual_recommendations?: string[];
  // Backwards-compat
  fullScript?: string;
  thumbnailConcept?: string;
}

export type ArtifactStatus = 'pending' | 'generating' | 'completed' | 'failed';

export interface ArtifactDataMap {
  executive_summary?: RealExecutiveSummary;
  linkedin_post?: RealLinkedInPost;
  linkedin?: RealLinkedInPost;
  x_thread?: RealXThread;
  advisory?: RealAdvisory;
  infographic?: RealInfographic;
  presentation?: RealPresentation;
  video_package?: RealVideoPackage;
  video?: RealVideoPackage;
}

export interface RecentTransformation {
  id: string;
  title: string;
  domain: string;
  date: string;
  inputType: 'PDF' | 'DOCX' | 'Text';
  outputTypes: OutputType[];
  status: 'Completed' | 'Processing' | 'Failed';
}

// ============================================================================
// Phase 4: Factual Verification / Hallucination Audit Types
// ============================================================================

export type VerificationStatus =
  | 'SUPPORTED'
  | 'PARTIALLY_SUPPORTED'
  | 'UNSUPPORTED'
  | 'CONTRADICTED'
  | 'NEEDS_REVIEW';

export interface VerificationFinding {
  finding_id: string;
  status: VerificationStatus;
  artifact_type: string;
  claim_text: string;
  source_claim_ids: string[];
  explanation: string;
  suggested_action: string;
  confidence: number;
}

export interface VerificationResult {
  artifact_type: string;
  overall_status: VerificationStatus;
  verification_score: number;
  total_findings: number;
  supported_count: number;
  partially_supported_count: number;
  unsupported_count: number;
  contradicted_count: number;
  needs_review_count: number;
  findings: VerificationFinding[];
  verified_claim_ids: string[];
  unverified_claim_ids: string[];
  summary: string;
}

export interface BatchVerificationResult {
  results: VerificationResult[];
  total_artifacts: number;
  verified_artifacts: number;
  artifacts_needing_review: number;
  artifacts_with_unsupported_claims: number;
  artifacts_with_contradictions: number;
}

