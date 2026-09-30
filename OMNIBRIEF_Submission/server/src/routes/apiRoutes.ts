import { Router } from 'express';
import { getHealth } from '../controllers/healthController';
import { ingestSource, previewMultimodal } from '../controllers/sourceController';
import { generateBrief } from '../controllers/briefController';
import {
  generateArtifactsBatch,
  regenerateOneArtifact,
} from '../controllers/artifactController';
import { verificationController } from '../controllers/verificationController';
import { uploadMiddleware, handleMulterError } from '../middleware/uploadMiddleware';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', getHealth);

// Source Ingestion (Multipart file upload or JSON raw text)
apiRouter.post(
  '/source/ingest',
  uploadMiddleware.single('file') as any,
  handleMulterError,
  ingestSource
);

// Multimodal Preview Endpoint (Phase 5)
apiRouter.post(
  '/source/preview-multimodal',
  uploadMiddleware.single('file') as any,
  handleMulterError,
  previewMultimodal
);

// Source Brief Generation via Gemini API
apiRouter.post('/brief/generate', generateBrief);

// Artifact Generation (Phase 3)
apiRouter.post('/artifacts/generate-batch', generateArtifactsBatch);
apiRouter.post('/artifacts/regenerate-one', regenerateOneArtifact);

// Factual Verification / Hallucination Audit (Phase 4)
apiRouter.post('/artifacts/verify', (req, res) => verificationController.verifySingleArtifact(req, res));
apiRouter.post('/artifacts/verify-batch', (req, res) => verificationController.verifyBatchArtifacts(req, res));
