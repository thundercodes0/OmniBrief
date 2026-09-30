import {
  PipelineGenerationResponse,
  SourceBrief,
  UserParameters,
  ArtifactType,
  GeneratedArtifactEnvelope,
} from '@shared/types';

export interface PresetSummary {
  id: string;
  name: string;
  description: string;
  category: string;
  sourceText: string;
  contextPrompt: string;
  defaultParams: UserParameters;
}

const API_BASE = '/api';

export const apiClient = {
  async getHealth(apiKey?: string): Promise<{ status: string; geminiConfigured: boolean }> {
    const headers: Record<string, string> = {};
    if (apiKey) headers['x-gemini-api-key'] = apiKey;
    const res = await fetch(`${API_BASE}/health`, { headers });
    return res.json();
  },

  async getPresets(): Promise<{ presets: PresetSummary[] }> {
    const res = await fetch(`${API_BASE}/presets`);
    return res.json();
  },

  async extractBrief(
    sourceText: string,
    contextPrompt?: string,
    file?: File,
    apiKey?: string
  ): Promise<{ success: boolean; brief: SourceBrief }> {
    const formData = new FormData();
    if (sourceText) formData.append('sourceText', sourceText);
    if (contextPrompt) formData.append('contextPrompt', contextPrompt);
    if (file) formData.append('file', file);

    const headers: Record<string, string> = {};
    if (apiKey) headers['x-gemini-api-key'] = apiKey;

    const res = await fetch(`${API_BASE}/brief/extract`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to extract brief');
    }

    return res.json();
  },

  async generateArtifacts(
    brief: SourceBrief,
    parameters: UserParameters,
    apiKey?: string
  ): Promise<PipelineGenerationResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKey) headers['x-gemini-api-key'] = apiKey;

    const res = await fetch(`${API_BASE}/artifacts/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ brief, parameters }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to generate artifacts');
    }

    return res.json();
  },

  async regenerateSingle(
    artifactType: ArtifactType,
    brief: SourceBrief,
    parameters: UserParameters,
    apiKey?: string
  ): Promise<{ success: boolean; artifact: GeneratedArtifactEnvelope }> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKey) headers['x-gemini-api-key'] = apiKey;

    const res = await fetch(`${API_BASE}/artifacts/regenerate-single`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ artifactType, brief, parameters }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to regenerate artifact');
    }

    return res.json();
  },
};
