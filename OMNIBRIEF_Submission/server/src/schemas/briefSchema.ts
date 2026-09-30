import { z } from 'zod';

export const KeyClaimSchema = z.object({
  claimId: z.string().default('CLAIM-01'),
  statement: z.string(),
  category: z.string().default('general'),
  verbatimSourceQuote: z.string(),
  confidence: z.number().min(0).max(1).default(0.95),
});

export const EntitySchema = z.object({
  name: z.string(),
  type: z.string(),
  relevance: z.string().default('High'),
});

export const StatisticSchema = z.object({
  metric: z.string(),
  value: z.string(),
  context: z.string(),
});

export const SourceBriefSchema = z.object({
  sourceTitle: z.string(),
  detectedDomain: z.string(),
  executiveSummary: z.string(),
  keyClaims: z.array(KeyClaimSchema).min(1),
  entities: z.array(EntitySchema).default([]),
  statistics: z.array(StatisticSchema).default([]),
  recommendations: z.array(z.string()).default([]),
  uncertainties: z.array(z.string()).default([]),
});

export type SourceBrief = z.infer<typeof SourceBriefSchema>;

/**
 * Structured OpenAPI/JSON Schema passed to Gemini config.responseSchema
 */
export const sourceBriefGeminiSchema = {
  type: "object",
  properties: {
    sourceTitle: { type: "string" },
    detectedDomain: { type: "string" },
    executiveSummary: { type: "string" },
    keyClaims: {
      type: "array",
      items: {
        type: "object",
        properties: {
          claimId: { type: "string" },
          statement: { type: "string" },
          category: { type: "string" },
          verbatimSourceQuote: { type: "string" },
          confidence: { type: "number" },
        },
        required: ["claimId", "statement", "category", "verbatimSourceQuote", "confidence"],
      },
    },
    entities: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          type: { type: "string" },
          relevance: { type: "string" },
        },
        required: ["name", "type", "relevance"],
      },
    },
    statistics: {
      type: "array",
      items: {
        type: "object",
        properties: {
          metric: { type: "string" },
          value: { type: "string" },
          context: { type: "string" },
        },
        required: ["metric", "value", "context"],
      },
    },
    recommendations: {
      type: "array",
      items: { type: "string" },
    },
    uncertainties: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "sourceTitle",
    "detectedDomain",
    "executiveSummary",
    "keyClaims",
    "entities",
    "statistics",
    "recommendations",
    "uncertainties",
  ],
};
