import { create } from 'zustand';
import {
  ArtifactDataMap,
  ArtifactStatus,
  ConfigurationParameters,
  NavigationPage,
  OutputType,
  PipelineStep,
  SourceBriefData,
  SourceData,
  VerificationResult,
  BatchVerificationResult,
  NormalizedSourceData,
  RecentTransformation,
} from '../types/transformation';
import { apiClient } from '../services/apiClient';

export const ALL_OUTPUT_TYPES: OutputType[] = [
  'executive_summary',
  'linkedin_post',
  'x_thread',
  'advisory',
  'infographic',
  'presentation',
  'video_package',
];

export const DEFAULT_CONFIGURATION: ConfigurationParameters = {
  targetAudience: 'CISOs & Security Operations Teams',
  tone: 'Urgent & Authoritative',
  language: 'English',
  detailLevel: 'Standard (Balanced)',
  communicationObjective: 'Warn & Advise',
};

const DEFAULT_SOURCE_DATA: SourceData = {
  inputType: 'file',
  rawText: '',
  file: null,
  fileName: null,
  fileSize: null,
  fileType: null,
  contextInstructions: '',
};

interface AppState {
  // Navigation & Layout
  activePage: NavigationPage;
  sidebarCollapsed: boolean;

  // Transformation Data
  sourceData: SourceData;
  normalizedSource: NormalizedSourceData | null;
  configuration: ConfigurationParameters;
  selectedOutputs: OutputType[];

  // Output & Inspection State
  sourceBrief: SourceBriefData | null;
  artifacts: ArtifactDataMap | null;
  artifactStatuses: Record<OutputType, ArtifactStatus>;
  artifactErrors: Record<OutputType, string>;
  activeArtifact: OutputType;
  isBriefModalOpen: boolean;

  // Phase 4: Factual Verification State
  verificationResults: Record<OutputType, VerificationResult | null>;
  isVerifying: Record<OutputType, boolean>;
  isAuditModalOpen: boolean;
  auditModalTarget: OutputType | null;

  // Processing & Pipeline State
  pipelineStatus: PipelineStep;
  isProcessing: boolean;
  errors: string | null;

  // Session Transformation History
  recentTransformations: RecentTransformation[];

  // Actions
  setActivePage: (page: NavigationPage) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSourceData: (data: Partial<SourceData>) => void;
  setNormalizedSource: (source: NormalizedSourceData | null) => void;
  setConfiguration: (config: Partial<ConfigurationParameters>) => void;
  toggleOutputType: (type: OutputType) => void;
  selectAllOutputs: () => void;
  clearAllOutputs: () => void;
  setActiveArtifact: (type: OutputType) => void;
  setIsBriefModalOpen: (open: boolean) => void;
  openAuditModal: (type: OutputType) => void;
  closeAuditModal: () => void;
  loadSampleSource: () => void;
  startTransformation: () => Promise<void>;
  regenerateSingleArtifact: (type: OutputType) => Promise<void>;
  verifySingleArtifact: (type: OutputType) => Promise<void>;
  verifyAllArtifacts: () => Promise<void>;
  resetTransformation: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activePage: 'dashboard',
  sidebarCollapsed: false,
  recentTransformations: [],

  sourceData: DEFAULT_SOURCE_DATA,
  normalizedSource: null,
  configuration: DEFAULT_CONFIGURATION,
  selectedOutputs: ALL_OUTPUT_TYPES,

  sourceBrief: null,
  artifacts: null,
  artifactStatuses: {
    executive_summary: 'pending',
    linkedin_post: 'pending',
    x_thread: 'pending',
    advisory: 'pending',
    infographic: 'pending',
    presentation: 'pending',
    video_package: 'pending',
  },
  artifactErrors: {
    executive_summary: '',
    linkedin_post: '',
    x_thread: '',
    advisory: '',
    infographic: '',
    presentation: '',
    video_package: '',
  },
  activeArtifact: 'executive_summary',
  isBriefModalOpen: false,

  verificationResults: {
    executive_summary: null,
    linkedin_post: null,
    x_thread: null,
    advisory: null,
    infographic: null,
    presentation: null,
    video_package: null,
  },
  isVerifying: {
    executive_summary: false,
    linkedin_post: false,
    x_thread: false,
    advisory: false,
    infographic: false,
    presentation: false,
    video_package: false,
  },
  isAuditModalOpen: false,
  auditModalTarget: null,

  pipelineStatus: 'source',
  isProcessing: false,
  errors: null,

  setActivePage: (page) => set({ activePage: page }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  setSourceData: (data) =>
    set((state) => ({
      sourceData: { ...state.sourceData, ...data },
      errors: null,
    })),

  setNormalizedSource: (source) => set({ normalizedSource: source }),

  setConfiguration: (config) =>
    set((state) => ({
      configuration: { ...state.configuration, ...config },
    })),

  toggleOutputType: (type) =>
    set((state) => {
      const exists = state.selectedOutputs.includes(type);
      const updated = exists
        ? state.selectedOutputs.filter((t) => t !== type)
        : [...state.selectedOutputs, type];
      return { selectedOutputs: updated };
    }),

  selectAllOutputs: () => set({ selectedOutputs: ALL_OUTPUT_TYPES }),
  clearAllOutputs: () => set({ selectedOutputs: [] }),

  setActiveArtifact: (type) => set({ activeArtifact: type }),
  setIsBriefModalOpen: (open) => set({ isBriefModalOpen: open }),
  openAuditModal: (type) => set({ isAuditModalOpen: true, auditModalTarget: type }),
  closeAuditModal: () => set({ isAuditModalOpen: false, auditModalTarget: null }),

  loadSampleSource: () =>
    set({
      sourceData: {
        inputType: 'text',
        rawText: `India's digital public infrastructure has expanded significantly in recent years. The source document discusses the role of interoperable digital systems in improving access to public services. It highlights the importance of secure data exchange, scalable infrastructure, and user-centric design.`,
        file: null,
        fileName: null,
        fileSize: null,
        fileType: null,
        contextInstructions:
          'Focus on public service scalability and interoperable digital public infrastructure.',
      },
      errors: null,
    }),

  startTransformation: async () => {
    const { sourceData, selectedOutputs, configuration } = get();

    // 1. Validation
    if (!sourceData.rawText.trim() && !sourceData.file) {
      set({ errors: 'Please enter source text or upload a document file.' });
      return;
    }

    if (selectedOutputs.length === 0) {
      set({ errors: 'Please select at least one output type to generate.' });
      return;
    }

    set({ isProcessing: true, errors: null, activePage: 'new-transformation' });

    try {
      // Step 1: Source
      set({ pipelineStatus: 'source' });
      await new Promise((r) => setTimeout(r, 200));

      // Step 2: Ingest & Analyzing
      set({ pipelineStatus: 'analyzing' });

      const ingestResult = await apiClient.ingestSource({
        rawText: sourceData.rawText,
        file: sourceData.file,
        contextInstructions: sourceData.contextInstructions,
      });

      if (!ingestResult.success || !ingestResult.source) {
        const err = ingestResult.error;
        const prefix = err?.code === 'BACKEND_UNREACHABLE' ? 'Connection Error: ' : 'Source Ingestion Failed: ';
        throw new Error(`${prefix}${err?.message || 'Unable to extract content from source.'}`);
      }

      set({ normalizedSource: ingestResult.source });

      // Step 3: Source Brief Generation (Real AI via Gemini)
      set({ pipelineStatus: 'source_brief' });

      const briefResult = await apiClient.generateBrief({
        sourceContent: ingestResult.source.text,
        sourceMetadata: ingestResult.source.metadata,
        imageData: ingestResult.source.imagePart?.inlineData,
        tables: ingestResult.source.tables,
        visualContent: ingestResult.source.visual_content,
        extractionWarnings: ingestResult.source.extraction_warnings,
        extractionMethod: ingestResult.source.extraction_method,
        pageCount: ingestResult.source.page_count,
        additionalContext: sourceData.contextInstructions,
        configuration,
      });

      if (!briefResult.success || !briefResult.sourceBrief) {
        const err = briefResult.error;
        let msg = err?.message || 'Gemini AI analysis failed: Unable to generate Source Brief.';
        if (err?.code === 'API_KEY_ERROR') {
          msg = 'Gemini API Key Missing: Please configure GEMINI_API_KEY in server/.env to run live AI analysis.';
        } else if (err?.code === 'RATE_LIMIT_EXCEEDED') {
          msg = 'Gemini Rate Limit Exceeded: Google Gemini API quota reached. Please wait a moment and retry.';
        } else if (err?.code === 'BACKEND_UNREACHABLE') {
          msg = 'Connection Error: Transformation backend server is unreachable on port 3001.';
        }
        throw new Error(msg);
      }

      const liveBrief: SourceBriefData = {
        ...briefResult.sourceBrief,
        isLiveGenerated: true,
      };

      set({ sourceBrief: liveBrief });

      // Step 4: Generating Outputs (Real AI via Gemini Batch Generation)
      set({
        pipelineStatus: 'generating_outputs',
        artifactStatuses: selectedOutputs.reduce(
          (acc, cur) => ({ ...acc, [cur]: 'generating' }),
          { ...get().artifactStatuses }
        ),
      });

      const batchResult = await apiClient.generateArtifactsBatch({
        sourceBrief: liveBrief,
        requestedArtifacts: selectedOutputs,
        configuration,
      });

      if (!batchResult.success && (!batchResult.artifacts || Object.keys(batchResult.artifacts).length === 0)) {
        throw new Error(
          batchResult.error?.message ||
          'Artifact generation failed: Unable to generate requested formats from Source Brief.'
        );
      }

      // Map canonical backend keys to store
      const returnedArtifacts = batchResult.artifacts || {};
      const newArtifactMap: ArtifactDataMap = {
        executive_summary: returnedArtifacts.executive_summary,
        linkedin_post: returnedArtifacts.linkedin || returnedArtifacts.linkedin_post,
        linkedin: returnedArtifacts.linkedin || returnedArtifacts.linkedin_post,
        x_thread: returnedArtifacts.x_thread,
        advisory: returnedArtifacts.advisory,
        infographic: returnedArtifacts.infographic,
        presentation: returnedArtifacts.presentation,
        video_package: returnedArtifacts.video || returnedArtifacts.video_package,
        video: returnedArtifacts.video || returnedArtifacts.video_package,
      };

      const updatedStatuses = { ...get().artifactStatuses };
      const updatedErrors = { ...get().artifactErrors };

      selectedOutputs.forEach((outputType) => {
        const canonicalKey = outputType === 'linkedin_post' ? 'linkedin' : outputType === 'video_package' ? 'video' : outputType;
        if (returnedArtifacts[canonicalKey] || returnedArtifacts[outputType]) {
          updatedStatuses[outputType] = 'completed';
          updatedErrors[outputType] = '';
        } else {
          updatedStatuses[outputType] = 'failed';
          updatedErrors[outputType] = batchResult.errors?.[canonicalKey] || batchResult.errors?.[outputType] || 'Generation failed';
        }
      });

      // Step 5: Fact Verification (Phase 4: Real Gemini Factual Verification Layer)
      set({ pipelineStatus: 'fact_verification' });

      // Gather successfully returned artifacts for batch verification
      const verifyBatchList: Array<{ artifact_type: string; artifact: any }> = [];
      selectedOutputs.forEach((outputType) => {
        const canonicalKey = outputType === 'linkedin_post' ? 'linkedin' : outputType === 'video_package' ? 'video' : outputType;
        const art = (newArtifactMap as any)[outputType] || (newArtifactMap as any)[canonicalKey];
        if (art) {
          verifyBatchList.push({
            artifact_type: canonicalKey,
            artifact: art,
          });
        }
      });

      const initialVerifying = { ...get().isVerifying };
      selectedOutputs.forEach((t) => (initialVerifying[t] = true));
      set({ isVerifying: initialVerifying });

      const initialVerificationResults = { ...get().verificationResults };
      if (verifyBatchList.length > 0) {
        try {
          const verifyRes = await apiClient.verifyArtifactsBatch({
            sourceBrief: liveBrief,
            artifacts: verifyBatchList,
          });
          if (verifyRes.success && verifyRes.batchResult?.results) {
            verifyRes.batchResult.results.forEach((r) => {
              const uiKey = r.artifact_type === 'linkedin' ? 'linkedin_post' : r.artifact_type === 'video' ? 'video_package' : (r.artifact_type as OutputType);
              initialVerificationResults[uiKey] = r;
            });
          }
        } catch (vErr) {
          console.warn('[Pipeline Verification Warning]:', vErr);
        }
      }

      const clearedVerifying = { ...get().isVerifying };
      selectedOutputs.forEach((t) => (clearedVerifying[t] = false));

      // Step 6: Complete
      const newHistoryItem: RecentTransformation = {
        id: `tf-${Date.now().toString().slice(-4)}`,
        title: liveBrief.sourceTitle || sourceData.fileName || 'Verified Source Analysis',
        domain: liveBrief.detectedDomain || 'General',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        inputType: sourceData.file ? (sourceData.fileName?.endsWith('.pdf') ? 'PDF' : sourceData.fileName?.endsWith('.docx') ? 'DOCX' : 'Text') : 'Text',
        outputTypes: selectedOutputs,
        status: 'Completed',
      };

      set({
        pipelineStatus: 'complete',
        artifacts: newArtifactMap,
        artifactStatuses: updatedStatuses,
        artifactErrors: updatedErrors,
        verificationResults: initialVerificationResults,
        isVerifying: clearedVerifying,
        activeArtifact: selectedOutputs[0] || 'executive_summary',
        isProcessing: false,
        activePage: 'results',
        recentTransformations: [newHistoryItem, ...get().recentTransformations],
      });
    } catch (err: any) {
      console.error('[Pipeline Error]:', err);
      set({
        pipelineStatus: 'source',
        isProcessing: false,
        errors: err.message || 'Unable to analyze this source. Please try again.',
      });
    }
  },

  regenerateSingleArtifact: async (type: OutputType) => {
    const { sourceBrief, configuration, artifacts, artifactStatuses, artifactErrors } = get();
    if (!sourceBrief) return;

    set({
      artifactStatuses: { ...artifactStatuses, [type]: 'generating' },
      artifactErrors: { ...artifactErrors, [type]: '' },
    });

    try {
      const canonicalKey = type === 'linkedin_post' ? 'linkedin' : type === 'video_package' ? 'video' : type;
      const res = await apiClient.regenerateArtifact({
        sourceBrief,
        artifactType: canonicalKey,
        configuration,
      });

      if (!res.success || !res.artifact) {
        throw new Error(res.error?.message || 'Failed to regenerate artifact');
      }

      const updatedArtifacts = { ...artifacts };
      if (type === 'executive_summary') updatedArtifacts.executive_summary = res.artifact;
      else if (type === 'linkedin_post') {
        updatedArtifacts.linkedin_post = res.artifact;
        updatedArtifacts.linkedin = res.artifact;
      }
      else if (type === 'x_thread') updatedArtifacts.x_thread = res.artifact;
      else if (type === 'advisory') updatedArtifacts.advisory = res.artifact;
      else if (type === 'infographic') updatedArtifacts.infographic = res.artifact;
      else if (type === 'presentation') updatedArtifacts.presentation = res.artifact;
      else if (type === 'video_package') {
        updatedArtifacts.video_package = res.artifact;
        updatedArtifacts.video = res.artifact;
      }

      set({
        artifacts: updatedArtifacts,
        artifactStatuses: { ...get().artifactStatuses, [type]: 'completed' },
      });

      // Automatically re-verify newly regenerated artifact
      get().verifySingleArtifact(type);
    } catch (err: any) {
      console.error(`[Regenerate Error for ${type}]:`, err);
      set({
        artifactStatuses: { ...get().artifactStatuses, [type]: 'failed' },
        artifactErrors: { ...get().artifactErrors, [type]: err.message || 'Regeneration failed' },
      });
    }
  },

  verifySingleArtifact: async (type: OutputType) => {
    const { sourceBrief, artifacts, isVerifying } = get();
    if (!sourceBrief || !artifacts) return;

    const canonicalKey = type === 'linkedin_post' ? 'linkedin' : type === 'video_package' ? 'video' : type;
    const targetArtifact = (artifacts as any)[type] || (artifacts as any)[canonicalKey];
    if (!targetArtifact) return;

    set({ isVerifying: { ...isVerifying, [type]: true } });

    try {
      const res = await apiClient.verifyArtifact({
        sourceBrief,
        artifact: targetArtifact,
        artifactType: canonicalKey,
      });

      if (res.success && res.verification) {
        set({
          verificationResults: {
            ...get().verificationResults,
            [type]: res.verification,
          },
        });
      }
    } catch (err) {
      console.error(`[Verification Error for ${type}]:`, err);
    } finally {
      set({
        isVerifying: { ...get().isVerifying, [type]: false },
      });
    }
  },

  verifyAllArtifacts: async () => {
    const { sourceBrief, artifacts, selectedOutputs } = get();
    if (!sourceBrief || !artifacts) return;

    const batchList: Array<{ artifact_type: string; artifact: any }> = [];
    selectedOutputs.forEach((outputType) => {
      const canonicalKey = outputType === 'linkedin_post' ? 'linkedin' : outputType === 'video_package' ? 'video' : outputType;
      const targetArtifact = (artifacts as any)[outputType] || (artifacts as any)[canonicalKey];
      if (targetArtifact) {
        batchList.push({
          artifact_type: canonicalKey,
          artifact: targetArtifact,
        });
      }
    });

    if (batchList.length === 0) return;

    const newVerifying = { ...get().isVerifying };
    selectedOutputs.forEach((t) => (newVerifying[t] = true));
    set({ isVerifying: newVerifying });

    try {
      const res = await apiClient.verifyArtifactsBatch({
        sourceBrief,
        artifacts: batchList,
      });

      if (res.success && res.batchResult?.results) {
        const updated = { ...get().verificationResults };
        res.batchResult.results.forEach((r) => {
          const uiKey = r.artifact_type === 'linkedin' ? 'linkedin_post' : r.artifact_type === 'video' ? 'video_package' : (r.artifact_type as OutputType);
          updated[uiKey] = r;
        });
        set({ verificationResults: updated });
      }
    } catch (err) {
      console.error('[Batch Verification Error]:', err);
    } finally {
      const finishedVerifying = { ...get().isVerifying };
      selectedOutputs.forEach((t) => (finishedVerifying[t] = false));
      set({ isVerifying: finishedVerifying });
    }
  },

  resetTransformation: () =>
    set({
      sourceData: DEFAULT_SOURCE_DATA,
      configuration: DEFAULT_CONFIGURATION,
      selectedOutputs: ALL_OUTPUT_TYPES,
      sourceBrief: null,
      artifacts: null,
      artifactStatuses: {
        executive_summary: 'pending',
        linkedin_post: 'pending',
        x_thread: 'pending',
        advisory: 'pending',
        infographic: 'pending',
        presentation: 'pending',
        video_package: 'pending',
      },
      artifactErrors: {
        executive_summary: '',
        linkedin_post: '',
        x_thread: '',
        advisory: '',
        infographic: '',
        presentation: '',
        video_package: '',
      },
      verificationResults: {
        executive_summary: null,
        linkedin_post: null,
        x_thread: null,
        advisory: null,
        infographic: null,
        presentation: null,
        video_package: null,
      },
      isVerifying: {
        executive_summary: false,
        linkedin_post: false,
        x_thread: false,
        advisory: false,
        infographic: false,
        presentation: false,
        video_package: false,
      },
      isAuditModalOpen: false,
      auditModalTarget: null,
      normalizedSource: null,
      pipelineStatus: 'source',
      isProcessing: false,
      errors: null,
      activePage: 'new-transformation',
    }),
}));
