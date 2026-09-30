import { create } from 'zustand';
import {
  ArtifactType,
  GeneratedArtifactEnvelope,
  SourceBrief,
  UserParameters,
} from '@shared/types';
import { apiClient, PresetSummary } from '../services/api';

export type PipelineStage =
  | 'idle'
  | 'extracting_brief'
  | 'brief_ready'
  | 'generating_artifacts'
  | 'completed'
  | 'failed';

export const DEFAULT_PARAMETERS: UserParameters = {
  targetAudience: 'Enterprise IT & Security Teams',
  tone: 'Urgent & Authoritative',
  language: 'English',
  detailLevel: 'standard',
  objective: 'Warn & Advise',
  contentStyle: 'Threat-Focused & Actionable',
  selectedArtifacts: [
    'executive_summary',
    'linkedin_post',
    'twitter_thread',
    'advisory',
    'infographic',
    'presentation',
    'video_package',
  ],
};

interface TransformationState {
  apiKey: string;
  isGeminiConfigured: boolean;
  presets: PresetSummary[];
  selectedPresetId: string | null;

  sourceText: string;
  contextPrompt: string;
  selectedFile: File | null;

  parameters: UserParameters;
  sourceBrief: SourceBrief | null;
  artifacts: Partial<Record<ArtifactType, GeneratedArtifactEnvelope>> | null;
  activeArtifactTab: ArtifactType;

  pipelineStage: PipelineStage;
  generationLatency: number | null;
  isBriefModalOpen: boolean;
  isFactInspectorOpen: boolean;
  errorMessage: string | null;

  // Actions
  setApiKey: (key: string) => void;
  setSourceText: (text: string) => void;
  setContextPrompt: (prompt: string) => void;
  setSelectedFile: (file: File | null) => void;
  setParameter: <K extends keyof UserParameters>(key: K, value: UserParameters[K]) => void;
  toggleArtifactSelection: (type: ArtifactType) => void;
  selectAllArtifacts: () => void;
  setActiveArtifactTab: (tab: ArtifactType) => void;
  setIsBriefModalOpen: (open: boolean) => void;
  setIsFactInspectorOpen: (open: boolean) => void;
  resetAll: () => void;

  // Async actions
  initApp: () => Promise<void>;
  loadPreset: (presetId: string) => void;
  extractSourceBrief: () => Promise<void>;
  generateAllArtifacts: () => Promise<void>;
  regenerateSingleArtifact: (type: ArtifactType) => Promise<void>;
}

export const useTransformationStore = create<TransformationState>((set, get) => ({
  apiKey: localStorage.getItem('omni_gemini_key') || '',
  isGeminiConfigured: false,
  presets: [],
  selectedPresetId: null,

  sourceText: '',
  contextPrompt: '',
  selectedFile: null,

  parameters: DEFAULT_PARAMETERS,
  sourceBrief: null,
  artifacts: null,
  activeArtifactTab: 'executive_summary',

  pipelineStage: 'idle',
  generationLatency: null,
  isBriefModalOpen: false,
  isFactInspectorOpen: false,
  errorMessage: null,

  setApiKey: (key: string) => {
    localStorage.setItem('omni_gemini_key', key);
    set({ apiKey: key });
    get().initApp();
  },

  setSourceText: (text: string) => set({ sourceText: text }),
  setContextPrompt: (prompt: string) => set({ contextPrompt: prompt }),
  setSelectedFile: (file: File | null) => set({ selectedFile: file }),

  setParameter: (key, value) =>
    set((state) => ({
      parameters: {
        ...state.parameters,
        [key]: value,
      },
    })),

  toggleArtifactSelection: (type: ArtifactType) =>
    set((state) => {
      const current = state.parameters.selectedArtifacts;
      const updated = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];
      return {
        parameters: {
          ...state.parameters,
          selectedArtifacts: updated,
        },
      };
    }),

  selectAllArtifacts: () =>
    set((state) => ({
      parameters: {
        ...state.parameters,
        selectedArtifacts: [
          'executive_summary',
          'linkedin_post',
          'twitter_thread',
          'advisory',
          'infographic',
          'presentation',
          'video_package',
        ],
      },
    })),

  setActiveArtifactTab: (tab: ArtifactType) => set({ activeArtifactTab: tab }),
  setIsBriefModalOpen: (open: boolean) => set({ isBriefModalOpen: open }),
  setIsFactInspectorOpen: (open: boolean) => set({ isFactInspectorOpen: open }),

  resetAll: () =>
    set({
      sourceText: '',
      contextPrompt: '',
      selectedFile: null,
      sourceBrief: null,
      artifacts: null,
      pipelineStage: 'idle',
      generationLatency: null,
      errorMessage: null,
      selectedPresetId: null,
    }),

  initApp: async () => {
    try {
      const health = await apiClient.getHealth(get().apiKey);
      const presetData = await apiClient.getPresets();
      set({
        isGeminiConfigured: health.geminiConfigured,
        presets: presetData.presets || [],
      });

      // Auto-load preset if available and requested
      if (!get().sourceText && presetData.presets?.length > 0) {
        // Preset available
      }
    } catch (err) {
      console.warn('Backend connection warning:', err);
    }
  },

  loadPreset: (presetId: string) => {
    const preset = get().presets.find((p) => p.id === presetId);
    if (!preset) return;

    set({
      selectedPresetId: preset.id,
      sourceText: preset.sourceText,
      contextPrompt: preset.contextPrompt,
      selectedFile: null,
      parameters: {
        ...DEFAULT_PARAMETERS,
        ...preset.defaultParams,
      },
      sourceBrief: null,
      artifacts: null,
      pipelineStage: 'idle',
      errorMessage: null,
    });
  },

  extractSourceBrief: async () => {
    const { sourceText, contextPrompt, selectedFile, apiKey } = get();
    if (!sourceText.trim() && !selectedFile) {
      set({ errorMessage: 'Please enter source text or upload a document.' });
      return;
    }

    set({ pipelineStage: 'extracting_brief', errorMessage: null });

    try {
      const res = await apiClient.extractBrief(
        sourceText,
        contextPrompt,
        selectedFile || undefined,
        apiKey
      );
      set({
        sourceBrief: res.brief,
        pipelineStage: 'brief_ready',
        isBriefModalOpen: true, // Open brief modal so user sees the canonical extraction
      });
    } catch (err: any) {
      set({
        pipelineStage: 'failed',
        errorMessage: err.message || 'Failed to extract Source Brief',
      });
    }
  },

  generateAllArtifacts: async () => {
    const { sourceBrief, parameters, apiKey } = get();

    // If brief not extracted yet, extract it first automatically!
    if (!sourceBrief) {
      await get().extractSourceBrief();
      if (!get().sourceBrief) return;
    }

    const currentBrief = get().sourceBrief!;
    set({ pipelineStage: 'generating_artifacts', errorMessage: null });

    try {
      const res = await apiClient.generateArtifacts(currentBrief, parameters, apiKey);
      set({
        artifacts: res.artifacts,
        generationLatency: res.totalLatencyMs,
        pipelineStage: 'completed',
      });
    } catch (err: any) {
      set({
        pipelineStage: 'failed',
        errorMessage: err.message || 'Failed to generate artifacts',
      });
    }
  },

  regenerateSingleArtifact: async (type: ArtifactType) => {
    const { sourceBrief, parameters, apiKey, artifacts } = get();
    if (!sourceBrief) return;

    try {
      const res = await apiClient.regenerateSingle(type, sourceBrief, parameters, apiKey);
      if (artifacts) {
        set({
          artifacts: {
            ...artifacts,
            [type]: res.artifact,
          },
        });
      }
    } catch (err: any) {
      set({ errorMessage: `Failed to regenerate ${type}: ${err.message}` });
    }
  },
}));
