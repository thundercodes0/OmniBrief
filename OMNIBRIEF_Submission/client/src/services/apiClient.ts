import {
  ConfigurationParameters,
  SourceBriefData,
  VerificationResult,
  BatchVerificationResult,
  NormalizedSourceData,
  ExtractedTable,
  VisualElement,
  ExtractionMethod,
} from '../types/transformation';

export interface ApiError {
  code:
    | 'BACKEND_UNREACHABLE'
    | 'HTTP_400'
    | 'HTTP_401'
    | 'HTTP_429'
    | 'HTTP_500'
    | 'API_KEY_ERROR'
    | 'RATE_LIMIT_EXCEEDED'
    | 'VALIDATION_ERROR'
    | 'FILE_TOO_LARGE'
    | 'INVALID_FILE_TYPE'
    | 'MISSING_SOURCE'
    | 'NETWORK_ERROR'
    | 'UNKNOWN_ERROR';
  message: string;
  status?: number;
  details?: any;
}

export interface IngestResponse {
  success: boolean;
  source?: NormalizedSourceData;
  error?: ApiError;
}

export interface MultimodalPreviewResponse {
  success: boolean;
  preview?: {
    sourceId: string;
    sourceType: string;
    title: string;
    pageCount?: number;
    tableCount: number;
    tables: ExtractedTable[];
    visualElementCount: number;
    visualContent: VisualElement[];
    extractionMethod: ExtractionMethod;
    warnings: string[];
    confidenceScore: number;
    characterCount: number;
  };
  error?: ApiError;
}

export interface BriefResponse {
  success: boolean;
  sourceBrief?: SourceBriefData;
  error?: ApiError;
}

// Configurable API base URL, defaulting to Vite dev proxy path '/api'
const PRIMARY_API_URL = ((import.meta as any).env?.VITE_API_URL as string) || '/api';
const DIRECT_BACKEND_URL = 'http://localhost:3001/api';

/**
 * Safely parses response regardless of whether body is JSON or text/html
 */
async function parseResponsePayload(res: Response): Promise<any> {
  const text = await res.text();
  if (!text || text.trim() === '') {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return { rawText: text };
  }
}

/**
 * Extracts a normalized ApiError from HTTP response or thrown error
 */
function extractApiError(res: Response, payload: any): ApiError {
  const status = res.status;
  const backendError = payload?.error;

  if (backendError && typeof backendError === 'object') {
    return {
      code: backendError.code || `HTTP_${status}`,
      message: backendError.message || `Server returned error (${status})`,
      status,
      details: backendError.details,
    };
  }

  if (status === 401) {
    return {
      code: 'API_KEY_ERROR',
      message:
        'GEMINI_API_KEY is not configured or is invalid. Please configure GEMINI_API_KEY in server/.env.',
      status,
    };
  }

  if (status === 429) {
    return {
      code: 'RATE_LIMIT_EXCEEDED',
      message:
        'Gemini API rate limit or quota exceeded. Please wait a moment and try again.',
      status,
    };
  }

  if (status === 413) {
    return {
      code: 'FILE_TOO_LARGE',
      message: 'Uploaded file exceeds the maximum 25 MB size limit.',
      status,
    };
  }

  if (status === 400) {
    return {
      code: 'HTTP_400',
      message:
        payload?.message ||
        payload?.rawText ||
        'Bad request: Please verify source inputs and parameters.',
      status,
    };
  }

  if (status === 502 || status === 503 || status === 504) {
    return {
      code: 'BACKEND_UNREACHABLE',
      message:
        'Backend server unreachable on port 3001. Please verify the backend service is running.',
      status,
    };
  }

  return {
    code: `HTTP_${status}` as any,
    message:
      payload?.rawText ||
      `Server request failed with status code ${status} (${res.statusText}).`,
    status,
  };
}

export const apiClient = {
  getBaseUrl(): string {
    return PRIMARY_API_URL;
  },

  /**
   * Healthcheck testing both Vite proxy and direct backend connectivity
   */
  async checkHealth(): Promise<{ ok: boolean; status: string; url: string; error?: string }> {
    // 1. Try primary URL (/api/health)
    try {
      const res = await fetch(`${PRIMARY_API_URL}/health`);
      if (res.ok) {
        const data = await parseResponsePayload(res);
        if (data?.status === 'ok') {
          return { ok: true, status: 'ok', url: `${PRIMARY_API_URL}/health` };
        }
      }
    } catch (e: any) {
      console.warn('[apiClient] Primary healthcheck failed, attempting direct backend...');
    }

    // 2. Fallback directly to backend port 3001 if Vite proxy had an issue
    try {
      const res = await fetch(`${DIRECT_BACKEND_URL}/health`);
      if (res.ok) {
        const data = await parseResponsePayload(res);
        if (data?.status === 'ok') {
          return { ok: true, status: 'ok (direct)', url: `${DIRECT_BACKEND_URL}/health` };
        }
      }
    } catch (e: any) {
      return {
        ok: false,
        status: 'unreachable',
        url: PRIMARY_API_URL,
        error: e.message || 'Connection refused on port 3001',
      };
    }

    return {
      ok: false,
      status: 'error',
      url: PRIMARY_API_URL,
      error: 'Backend did not return status ok',
    };
  },

  /**
   * Ingests source document or raw text
   */
  async ingestSource(input: {
    rawText?: string;
    file?: File | null;
    contextInstructions?: string;
  }): Promise<IngestResponse> {
    const doFetch = async (baseUrl: string) => {
      if (input.file) {
        const formData = new FormData();
        formData.append('file', input.file);
        if (input.contextInstructions) {
          formData.append('contextInstructions', input.contextInstructions);
        }
        return await fetch(`${baseUrl}/source/ingest`, {
          method: 'POST',
          body: formData,
        });
      } else {
        return await fetch(`${baseUrl}/source/ingest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rawText: input.rawText || '',
            contextInstructions: input.contextInstructions || '',
          }),
        });
      }
    };

    let res: Response;
    try {
      res = await doFetch(PRIMARY_API_URL);
    } catch (err: any) {
      // Automatic fallback to direct backend if proxy is down
      try {
        console.warn('[apiClient] Ingestion through proxy failed, attempting direct connection...');
        res = await doFetch(DIRECT_BACKEND_URL);
      } catch (directErr: any) {
        return {
          success: false,
          error: {
            code: 'BACKEND_UNREACHABLE',
            message:
              'Cannot connect to transformation server. Please verify backend is running on http://localhost:3001.',
          },
        };
      }
    }

    const payload = await parseResponsePayload(res);

    if (!res.ok || !payload?.success) {
      return {
        success: false,
        error: extractApiError(res, payload),
      };
    }

    return payload as IngestResponse;
  },

  /**
   * Previews multimodal extraction breakdown (tables, visual elements, warnings)
   */
  async previewMultimodal(input: {
    rawText?: string;
    file?: File | null;
    contextInstructions?: string;
  }): Promise<MultimodalPreviewResponse> {
    const doFetch = async (baseUrl: string) => {
      if (input.file) {
        const formData = new FormData();
        formData.append('file', input.file);
        if (input.contextInstructions) {
          formData.append('contextInstructions', input.contextInstructions);
        }
        return await fetch(`${baseUrl}/source/preview-multimodal`, {
          method: 'POST',
          body: formData,
        });
      } else {
        return await fetch(`${baseUrl}/source/preview-multimodal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rawText: input.rawText || '',
            contextInstructions: input.contextInstructions || '',
          }),
        });
      }
    };

    let res: Response;
    try {
      res = await doFetch(PRIMARY_API_URL);
    } catch {
      try {
        res = await doFetch(DIRECT_BACKEND_URL);
      } catch {
        return {
          success: false,
          error: {
            code: 'BACKEND_UNREACHABLE',
            message: 'Transformation server unreachable on port 3001.',
          },
        };
      }
    }

    const payload = await parseResponsePayload(res);
    if (!res.ok || !payload?.success) {
      return {
        success: false,
        error: extractApiError(res, payload),
      };
    }

    return payload as MultimodalPreviewResponse;
  },

  /**
   * Generates structured canonical Source Brief via Gemini
   */
  async generateBrief(params: {
    sourceContent: string;
    sourceMetadata?: any;
    imageData?: { data: string; mimeType: string };
    tables?: ExtractedTable[];
    visualContent?: VisualElement[];
    extractionWarnings?: string[];
    extractionMethod?: string;
    pageCount?: number;
    additionalContext?: string;
    configuration: ConfigurationParameters;
  }): Promise<BriefResponse> {
    const payloadBody = {
      sourceContent: params.sourceContent,
      sourceMetadata: params.sourceMetadata,
      imageData: params.imageData,
      tables: params.tables,
      visualContent: params.visualContent,
      extractionWarnings: params.extractionWarnings,
      extractionMethod: params.extractionMethod,
      pageCount: params.pageCount,
      additionalContext: params.additionalContext,
      targetAudience: params.configuration.targetAudience,
      tone: params.configuration.tone,
      language: params.configuration.language,
      detailLevel: params.configuration.detailLevel,
      communicationObjective: params.configuration.communicationObjective,
    };

    const doFetch = async (baseUrl: string) => {
      return await fetch(`${baseUrl}/brief/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadBody),
      });
    };

    let res: Response;
    try {
      res = await doFetch(PRIMARY_API_URL);
    } catch (err: any) {
      // Fallback directly to backend port 3001
      try {
        console.warn('[apiClient] Brief generation through proxy failed, attempting direct connection...');
        res = await doFetch(DIRECT_BACKEND_URL);
      } catch (directErr: any) {
        return {
          success: false,
          error: {
            code: 'BACKEND_UNREACHABLE',
            message:
              'Cannot connect to transformation server. Please verify backend is running on http://localhost:3001.',
          },
        };
      }
    }

    const payload = await parseResponsePayload(res);

    if (!res.ok || !payload?.success) {
      return {
        success: false,
        error: extractApiError(res, payload),
      };
    }

    return payload as BriefResponse;
  },

  /**
   * Generates batch of real structured artifacts via Gemini (Phase 3)
   */
  async generateArtifactsBatch(params: {
    sourceBrief: any;
    requestedArtifacts: string[];
    configuration: ConfigurationParameters;
  }): Promise<{
    success: boolean;
    artifacts?: Partial<Record<string, any>>;
    errors?: Partial<Record<string, string>>;
    error?: ApiError;
  }> {
    const payloadBody = {
      sourceBrief: params.sourceBrief,
      requestedArtifacts: params.requestedArtifacts,
      audience: params.configuration.targetAudience,
      tone: params.configuration.tone,
      language: params.configuration.language,
      detail: params.configuration.detailLevel,
      objective: params.configuration.communicationObjective,
    };

    const doFetch = async (baseUrl: string) => {
      return await fetch(`${baseUrl}/artifacts/generate-batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadBody),
      });
    };

    let res: Response;
    try {
      res = await doFetch(PRIMARY_API_URL);
    } catch (err: any) {
      try {
        console.warn('[apiClient] Batch generation through proxy failed, attempting direct connection...');
        res = await doFetch(DIRECT_BACKEND_URL);
      } catch (directErr: any) {
        return {
          success: false,
          error: {
            code: 'BACKEND_UNREACHABLE',
            message:
              'Cannot connect to transformation server. Please verify backend is running on http://localhost:3001.',
          },
        };
      }
    }

    const payload = await parseResponsePayload(res);

    if (!res.ok || (!payload?.success && Object.keys(payload?.artifacts || {}).length === 0)) {
      return {
        success: false,
        error: extractApiError(res, payload),
      };
    }

    return payload;
  },

  /**
   * Regenerates a single real structured artifact via Gemini (Phase 3)
   */
  async regenerateArtifact(params: {
    sourceBrief: any;
    artifactType: string;
    configuration: ConfigurationParameters;
  }): Promise<{
    success: boolean;
    artifactType?: string;
    artifact?: any;
    error?: ApiError;
  }> {
    const payloadBody = {
      sourceBrief: params.sourceBrief,
      artifactType: params.artifactType,
      audience: params.configuration.targetAudience,
      tone: params.configuration.tone,
      language: params.configuration.language,
      detail: params.configuration.detailLevel,
      objective: params.configuration.communicationObjective,
    };

    const doFetch = async (baseUrl: string) => {
      return await fetch(`${baseUrl}/artifacts/regenerate-one`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadBody),
      });
    };

    let res: Response;
    try {
      res = await doFetch(PRIMARY_API_URL);
    } catch (err: any) {
      try {
        console.warn('[apiClient] Single artifact regeneration through proxy failed, attempting direct connection...');
        res = await doFetch(DIRECT_BACKEND_URL);
      } catch (directErr: any) {
        return {
          success: false,
          error: {
            code: 'BACKEND_UNREACHABLE',
            message:
              'Cannot connect to transformation server. Please verify backend is running on http://localhost:3001.',
          },
        };
      }
    }

    const payload = await parseResponsePayload(res);

    if (!res.ok || !payload?.success || !payload?.artifact) {
      return {
        success: false,
        error: extractApiError(res, payload),
      };
    }

    return payload;
  },

  /**
   * Verifies a single generated artifact against the canonical Source Brief (Phase 4)
   */
  async verifyArtifact(params: {
    sourceBrief: any;
    artifact: any;
    artifactType: string;
  }): Promise<{
    success: boolean;
    verification?: VerificationResult;
    error?: ApiError;
  }> {
    const payloadBody = {
      source_brief: params.sourceBrief,
      artifact: params.artifact,
      artifact_type: params.artifactType,
    };

    const doFetch = async (baseUrl: string) => {
      return await fetch(`${baseUrl}/artifacts/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadBody),
      });
    };

    let res: Response;
    try {
      res = await doFetch(PRIMARY_API_URL);
    } catch (err: any) {
      try {
        console.warn('[apiClient] Verification through proxy failed, attempting direct backend connection...');
        res = await doFetch(DIRECT_BACKEND_URL);
      } catch (directErr: any) {
        return {
          success: false,
          error: {
            code: 'BACKEND_UNREACHABLE',
            message: 'Cannot connect to transformation server. Please verify backend is running on http://localhost:3001.',
          },
        };
      }
    }

    const payload = await parseResponsePayload(res);

    if (!res.ok || (!payload?.success && !payload?.verification_score)) {
      return {
        success: false,
        error: extractApiError(res, payload),
      };
    }

    const verification: VerificationResult = payload.verification || payload;
    return {
      success: true,
      verification,
    };
  },

  /**
   * Verifies multiple generated artifacts against the canonical Source Brief in batch (Phase 4)
   */
  async verifyArtifactsBatch(params: {
    sourceBrief: any;
    artifacts: Array<{ artifact_type: string; artifact: any }>;
  }): Promise<{
    success: boolean;
    batchResult?: BatchVerificationResult;
    error?: ApiError;
  }> {
    const payloadBody = {
      source_brief: params.sourceBrief,
      artifacts: params.artifacts,
    };

    const doFetch = async (baseUrl: string) => {
      return await fetch(`${baseUrl}/artifacts/verify-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadBody),
      });
    };

    let res: Response;
    try {
      res = await doFetch(PRIMARY_API_URL);
    } catch (err: any) {
      try {
        console.warn('[apiClient] Batch verification through proxy failed, attempting direct backend connection...');
        res = await doFetch(DIRECT_BACKEND_URL);
      } catch (directErr: any) {
        return {
          success: false,
          error: {
            code: 'BACKEND_UNREACHABLE',
            message: 'Cannot connect to transformation server. Please verify backend is running on http://localhost:3001.',
          },
        };
      }
    }

    const payload = await parseResponsePayload(res);

    if (!res.ok || (!payload?.success && !payload?.results)) {
      return {
        success: false,
        error: extractApiError(res, payload),
      };
    }

    return {
      success: true,
      batchResult: payload,
    };
  },
};
