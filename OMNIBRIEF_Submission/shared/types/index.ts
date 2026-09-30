/**
 * Core Shared Types for Content Transformation Engine
 * Shared across Client and Server for 100% end-to-end type safety.
 */

export type ArtifactType =
  | 'executive_summary'
  | 'linkedin_post'
  | 'twitter_thread'
  | 'advisory'
  | 'infographic'
  | 'presentation'
  | 'video_package';

export interface UserParameters {
  targetAudience: string;
  tone: string;
  language: string;
  detailLevel: 'concise' | 'standard' | 'comprehensive';
  objective: string;
  contentStyle: string;
  selectedArtifacts: ArtifactType[];
}

export interface SourceIngestPayload {
  rawText?: string;
  contextPrompt?: string;
  sourceUrl?: string;
  sourceType: 'text' | 'document' | 'image' | 'prompt' | 'hybrid';
  fileName?: string;
  fileMimeType?: string;
  fileBase64?: string;
}

export interface KeyClaim {
  id: string; // e.g. "C1", "C2"
  statement: string;
  category: 'metric' | 'event' | 'technical_fact' | 'policy' | 'directive';
  verbatimQuote: string;
  confidence: number; // 0.0 - 1.0
}

export interface EntityStakeholder {
  name: string;
  role: string;
  impactLevel?: 'high' | 'medium' | 'low';
}

export interface QuantitativeMetric {
  metric: string;
  value: string;
  context: string;
  trend?: string;
}

export interface ActionDirective {
  directive: string;
  priority: 'Immediate' | 'Short-Term' | 'Strategic';
  targetAudience?: string;
}

/**
 * The Canonical Source Brief
 * The intermediate ground truth representation anchoring all generation.
 */
export interface SourceBrief {
  briefId: string;
  meta: {
    title: string;
    detectedDomain: string;
    primaryLanguage: string;
    urgencyLevel: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
    originalWordCount: number;
    timestamp: string;
  };
  executiveSummary: string;
  coreThesis: string;
  keyClaims: KeyClaim[];
  entitiesAndStakeholders: EntityStakeholder[];
  quantitativeData: QuantitativeMetric[];
  actionableDirectives: ActionDirective[];
  boundsAndUncertainties: string[];
}

// 1. Executive Summary Output
export interface ExecutiveSummaryArtifact {
  title: string;
  tldr: string;
  keyFindings: string[];
  strategicImplications: string[];
  recommendedActions: string[];
  highlightedMetrics: { label: string; value: string; significance: string }[];
  markdownContent: string;
}

// 2. LinkedIn Post Output
export interface LinkedInPostArtifact {
  hook: string;
  bodyParagraphs: string[];
  bulletInsights: string[];
  callToAction: string;
  hashtags: string[];
  characterCount: number;
  fullFormattedPost: string;
}

// 3. Twitter/X Thread Output
export interface TweetItem {
  tweetNumber: number;
  text: string;
  charCount: number;
  calloutBadge?: string;
}

export interface TwitterThreadArtifact {
  hookTweet: string;
  tweets: TweetItem[];
  concludingCta: string;
  totalTweets: number;
  hashtags: string[];
}

// 4. Advisory Output
export interface AdvisoryMitigationStep {
  stepNumber: number;
  action: string;
  urgency: 'Immediate' | 'Within 24h' | 'Routine';
  affectedComponent: string;
}

export interface AdvisoryArtifact {
  advisoryId: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
  targetSystemsOrStakeholders: string[];
  summary: string;
  threatOrIssueSynopsis: string;
  mitigationChecklist: AdvisoryMitigationStep[];
  tlpClassification: 'TLP:RED' | 'TLP:AMBER' | 'TLP:GREEN' | 'TLP:CLEAR';
  contactAndReportingChannel: string;
  fullMarkdownContent: string;
}

// 5. Infographic Output
export interface InfographicKpi {
  value: string;
  label: string;
  subtitle: string;
  trend?: 'up' | 'down' | 'neutral' | 'alert';
  highlightColor?: string;
}

export interface InfographicWorkflowStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface InfographicArtifact {
  title: string;
  subtitle: string;
  theme: {
    primaryColor: string;
    accentColor: string;
    badgeColor: string;
  };
  kpiStats: InfographicKpi[];
  workflowOrTimeline: InfographicWorkflowStep[];
  keyTakeawayBox: string;
  dataPointsOrComparison: { category: string; valueA: string; valueB?: string }[];
}

// 6. Presentation Output
export interface SlideItem {
  slideNumber: number;
  slideType: 'title' | 'agenda' | 'content' | 'data_metric' | 'action_plan' | 'conclusion';
  title: string;
  subtitle?: string;
  bulletPoints: string[];
  visualDiagramPrompt: string; // Describes visual layout/graphic for the slide
  speakerNotes: string;
}

export interface PresentationArtifact {
  deckTitle: string;
  subtitle: string;
  targetDurationMinutes: number;
  totalSlides: number;
  slides: SlideItem[];
}

// 7. Video Package Output
export interface VideoScene {
  sceneNumber: number;
  timestamp: string; // e.g. "00:00 - 00:10"
  durationSeconds: number;
  visualDescription: string;
  visualRecommendation: string; // Style guidance (cinematic, 2D vector, data overlay)
  narrationText: string;
  subtitles: string;
  onScreenText: string;
  cameraDirection: string;
  soundFxAndMusic: string;
}

export interface VideoPackageArtifact {
  videoMetadata: {
    title: string;
    targetDurationSeconds: number;
    recommendedAspectRatio: '16:9' | '9:16' | '1:1';
    tone: string;
    targetAudience: string;
  };
  scenes: VideoScene[];
  fullVoiceoverScript: string;
  productionNotes: {
    thumbnailConcept: string;
    srtSubtitles: string;
    bRollSuggestions: string[];
    musicRecommendation: string;
  };
}

// Map from ArtifactType to its concrete artifact interface
export type ArtifactPayloadMap = {
  executive_summary: ExecutiveSummaryArtifact;
  linkedin_post: LinkedInPostArtifact;
  twitter_thread: TwitterThreadArtifact;
  advisory: AdvisoryArtifact;
  infographic: InfographicArtifact;
  presentation: PresentationArtifact;
  video_package: VideoPackageArtifact;
};

// Grounding & Verification Types
export interface GroundingCitation {
  claimId: string;
  artifactSnippet: string;
  sourceVerbatimQuote: string;
  matchConfidence: number;
}

export interface FactAuditResult {
  artifactType: ArtifactType;
  factualityScore: number; // 0 to 100
  isFullyGrounded: boolean;
  claimsAudited: number;
  unsupportedClaims: {
    sentence: string;
    reason: string;
    suggestedCorrection?: string;
  }[];
  citations: GroundingCitation[];
}

export interface GeneratedArtifactEnvelope<T = any> {
  artifactType: ArtifactType;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  data?: T;
  audit?: FactAuditResult;
  latencyMs?: number;
  error?: string;
}

export interface PipelineGenerationResponse {
  brief: SourceBrief;
  artifacts: Record<ArtifactType, GeneratedArtifactEnvelope>;
  totalLatencyMs: number;
}
