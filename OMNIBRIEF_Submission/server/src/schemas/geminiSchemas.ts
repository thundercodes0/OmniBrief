/**
 * Structured JSON schemas for Gemini API responses
 * Compatible with responseSchema in @google/genai
 */

export const sourceBriefJsonSchema = {
  type: "object",
  properties: {
    meta: {
      type: "object",
      properties: {
        title: { type: "string" },
        detectedDomain: { type: "string" },
        primaryLanguage: { type: "string" },
        urgencyLevel: {
          type: "string",
          enum: ["Critical", "High", "Medium", "Low", "Informational"],
        },
        originalWordCount: { type: "integer" },
      },
      required: ["title", "detectedDomain", "primaryLanguage", "urgencyLevel"],
    },
    executiveSummary: { type: "string" },
    coreThesis: { type: "string" },
    keyClaims: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          statement: { type: "string" },
          category: {
            type: "string",
            enum: ["metric", "event", "technical_fact", "policy", "directive"],
          },
          verbatimQuote: { type: "string" },
          confidence: { type: "number" },
        },
        required: ["id", "statement", "category", "verbatimQuote", "confidence"],
      },
    },
    entitiesAndStakeholders: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          role: { type: "string" },
          impactLevel: { type: "string", enum: ["high", "medium", "low"] },
        },
        required: ["name", "role"],
      },
    },
    quantitativeData: {
      type: "array",
      items: {
        type: "object",
        properties: {
          metric: { type: "string" },
          value: { type: "string" },
          context: { type: "string" },
          trend: { type: "string" },
        },
        required: ["metric", "value", "context"],
      },
    },
    actionableDirectives: {
      type: "array",
      items: {
        type: "object",
        properties: {
          directive: { type: "string" },
          priority: { type: "string", enum: ["Immediate", "Short-Term", "Strategic"] },
          targetAudience: { type: "string" },
        },
        required: ["directive", "priority"],
      },
    },
    boundsAndUncertainties: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "meta",
    "executiveSummary",
    "coreThesis",
    "keyClaims",
    "entitiesAndStakeholders",
    "quantitativeData",
    "actionableDirectives",
    "boundsAndUncertainties",
  ],
};

export const executiveSummaryJsonSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    tldr: { type: "string" },
    keyFindings: {
      type: "array",
      items: { type: "string" },
    },
    strategicImplications: {
      type: "array",
      items: { type: "string" },
    },
    recommendedActions: {
      type: "array",
      items: { type: "string" },
    },
    highlightedMetrics: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          value: { type: "string" },
          significance: { type: "string" },
        },
        required: ["label", "value", "significance"],
      },
    },
    markdownContent: { type: "string" },
  },
  required: [
    "title",
    "tldr",
    "keyFindings",
    "strategicImplications",
    "recommendedActions",
    "highlightedMetrics",
    "markdownContent",
  ],
};

export const linkedinPostJsonSchema = {
  type: "object",
  properties: {
    hook: { type: "string" },
    bodyParagraphs: {
      type: "array",
      items: { type: "string" },
    },
    bulletInsights: {
      type: "array",
      items: { type: "string" },
    },
    callToAction: { type: "string" },
    hashtags: {
      type: "array",
      items: { type: "string" },
    },
    characterCount: { type: "integer" },
    fullFormattedPost: { type: "string" },
  },
  required: [
    "hook",
    "bodyParagraphs",
    "bulletInsights",
    "callToAction",
    "hashtags",
    "characterCount",
    "fullFormattedPost",
  ],
};

export const twitterThreadJsonSchema = {
  type: "object",
  properties: {
    hookTweet: { type: "string" },
    tweets: {
      type: "array",
      items: {
        type: "object",
        properties: {
          tweetNumber: { type: "integer" },
          text: { type: "string" },
          charCount: { type: "integer" },
          calloutBadge: { type: "string" },
        },
        required: ["tweetNumber", "text", "charCount"],
      },
    },
    concludingCta: { type: "string" },
    totalTweets: { type: "integer" },
    hashtags: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["hookTweet", "tweets", "concludingCta", "totalTweets", "hashtags"],
};

export const advisoryJsonSchema = {
  type: "object",
  properties: {
    advisoryId: { type: "string" },
    title: { type: "string" },
    severity: {
      type: "string",
      enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFORMATIONAL"],
    },
    targetSystemsOrStakeholders: {
      type: "array",
      items: { type: "string" },
    },
    summary: { type: "string" },
    threatOrIssueSynopsis: { type: "string" },
    mitigationChecklist: {
      type: "array",
      items: {
        type: "object",
        properties: {
          stepNumber: { type: "integer" },
          action: { type: "string" },
          urgency: {
            type: "string",
            enum: ["Immediate", "Within 24h", "Routine"],
          },
          affectedComponent: { type: "string" },
        },
        required: ["stepNumber", "action", "urgency", "affectedComponent"],
      },
    },
    tlpClassification: {
      type: "string",
      enum: ["TLP:RED", "TLP:AMBER", "TLP:GREEN", "TLP:CLEAR"],
    },
    contactAndReportingChannel: { type: "string" },
    fullMarkdownContent: { type: "string" },
  },
  required: [
    "advisoryId",
    "title",
    "severity",
    "targetSystemsOrStakeholders",
    "summary",
    "threatOrIssueSynopsis",
    "mitigationChecklist",
    "tlpClassification",
    "contactAndReportingChannel",
    "fullMarkdownContent",
  ],
};

export const infographicJsonSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    subtitle: { type: "string" },
    theme: {
      type: "object",
      properties: {
        primaryColor: { type: "string" },
        accentColor: { type: "string" },
        badgeColor: { type: "string" },
      },
      required: ["primaryColor", "accentColor", "badgeColor"],
    },
    kpiStats: {
      type: "array",
      items: {
        type: "object",
        properties: {
          value: { type: "string" },
          label: { type: "string" },
          subtitle: { type: "string" },
          trend: {
            type: "string",
            enum: ["up", "down", "neutral", "alert"],
          },
        },
        required: ["value", "label", "subtitle"],
      },
    },
    workflowOrTimeline: {
      type: "array",
      items: {
        type: "object",
        properties: {
          stepNumber: { type: "integer" },
          title: { type: "string" },
          description: { type: "string" },
        },
        required: ["stepNumber", "title", "description"],
      },
    },
    keyTakeawayBox: { type: "string" },
    dataPointsOrComparison: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          valueA: { type: "string" },
          valueB: { type: "string" },
        },
        required: ["category", "valueA"],
      },
    },
  },
  required: [
    "title",
    "subtitle",
    "theme",
    "kpiStats",
    "workflowOrTimeline",
    "keyTakeawayBox",
    "dataPointsOrComparison",
  ],
};

export const presentationJsonSchema = {
  type: "object",
  properties: {
    deckTitle: { type: "string" },
    subtitle: { type: "string" },
    targetDurationMinutes: { type: "integer" },
    totalSlides: { type: "integer" },
    slides: {
      type: "array",
      items: {
        type: "object",
        properties: {
          slideNumber: { type: "integer" },
          slideType: {
            type: "string",
            enum: ["title", "agenda", "content", "data_metric", "action_plan", "conclusion"],
          },
          title: { type: "string" },
          subtitle: { type: "string" },
          bulletPoints: {
            type: "array",
            items: { type: "string" },
          },
          visualDiagramPrompt: { type: "string" },
          speakerNotes: { type: "string" },
        },
        required: ["slideNumber", "slideType", "title", "bulletPoints", "visualDiagramPrompt", "speakerNotes"],
      },
    },
  },
  required: ["deckTitle", "subtitle", "targetDurationMinutes", "totalSlides", "slides"],
};

export const videoPackageJsonSchema = {
  type: "object",
  properties: {
    videoMetadata: {
      type: "object",
      properties: {
        title: { type: "string" },
        targetDurationSeconds: { type: "integer" },
        recommendedAspectRatio: {
          type: "string",
          enum: ["16:9", "9:16", "1:1"],
        },
        tone: { type: "string" },
        targetAudience: { type: "string" },
      },
      required: ["title", "targetDurationSeconds", "recommendedAspectRatio", "tone", "targetAudience"],
    },
    scenes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sceneNumber: { type: "integer" },
          timestamp: { type: "string" },
          durationSeconds: { type: "integer" },
          visualDescription: { type: "string" },
          visualRecommendation: { type: "string" },
          narrationText: { type: "string" },
          subtitles: { type: "string" },
          onScreenText: { type: "string" },
          cameraDirection: { type: "string" },
          soundFxAndMusic: { type: "string" },
        },
        required: [
          "sceneNumber",
          "timestamp",
          "durationSeconds",
          "visualDescription",
          "visualRecommendation",
          "narrationText",
          "subtitles",
          "onScreenText",
          "cameraDirection",
          "soundFxAndMusic",
        ],
      },
    },
    fullVoiceoverScript: { type: "string" },
    productionNotes: {
      type: "object",
      properties: {
        thumbnailConcept: { type: "string" },
        srtSubtitles: { type: "string" },
        bRollSuggestions: {
          type: "array",
          items: { type: "string" },
        },
        musicRecommendation: { type: "string" },
      },
      required: ["thumbnailConcept", "srtSubtitles", "bRollSuggestions", "musicRecommendation"],
    },
  },
  required: ["videoMetadata", "scenes", "fullVoiceoverScript", "productionNotes"],
};

export const verifierJsonSchema = {
  type: "object",
  properties: {
    factualityScore: { type: "integer" },
    isFullyGrounded: { type: "boolean" },
    claimsAudited: { type: "integer" },
    unsupportedClaims: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sentence: { type: "string" },
          reason: { type: "string" },
          suggestedCorrection: { type: "string" },
        },
        required: ["sentence", "reason"],
      },
    },
    citations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          claimId: { type: "string" },
          artifactSnippet: { type: "string" },
          sourceVerbatimQuote: { type: "string" },
          matchConfidence: { type: "number" },
        },
        required: ["claimId", "artifactSnippet", "sourceVerbatimQuote", "matchConfidence"],
      },
    },
  },
  required: ["factualityScore", "isFullyGrounded", "claimsAudited", "unsupportedClaims", "citations"],
};
