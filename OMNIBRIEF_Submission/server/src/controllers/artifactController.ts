import { Request, Response, NextFunction } from 'express';
import {
  ArtifactBatchRequestSchema,
  ArtifactRegenerateRequestSchema,
  canonicalizeArtifactType,
} from '../schemas/artifactSchemas';
import { artifactGenerationService } from '../services/artifactGenerationService';

/**
 * Generates batch of artifacts from canonical Source Brief
 * POST /api/artifacts/generate-batch
 */
export const generateArtifactsBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = ArtifactBatchRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
          details: parseResult.error.errors,
        },
      });
      return;
    }

    const {
      sourceBrief,
      requestedArtifacts,
      audience,
      tone,
      language,
      detail,
      objective,
      style,
    } = parseResult.data;

    const overrideKey = (req.headers['x-gemini-api-key'] as string) || (req.body?.apiKey as string);

    const result = await artifactGenerationService.generateBatch(
      sourceBrief,
      requestedArtifacts,
      { audience, tone, language, detail, objective, style },
      overrideKey
    );

    res.status(200).json({
      success: result.success,
      artifacts: result.artifacts,
      errors: result.errors,
    });
  } catch (err: any) {
    next(err);
  }
};

/**
 * Regenerates a single artifact from canonical Source Brief
 * POST /api/artifacts/regenerate-one
 */
export const regenerateOneArtifact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = ArtifactRegenerateRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
          details: parseResult.error.errors,
        },
      });
      return;
    }

    const {
      sourceBrief,
      artifactType,
      audience,
      tone,
      language,
      detail,
      objective,
      style,
    } = parseResult.data;

    const canonicalType = canonicalizeArtifactType(artifactType);
    if (!canonicalType) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ARTIFACT_TYPE',
          message: `Unknown artifact type: "${artifactType}"`,
        },
      });
      return;
    }

    const overrideKey = (req.headers['x-gemini-api-key'] as string) || (req.body?.apiKey as string);

    const artifact = await artifactGenerationService.generateArtifact(
      canonicalType,
      sourceBrief,
      { audience, tone, language, detail, objective, style },
      overrideKey
    );

    res.status(200).json({
      success: true,
      artifactType: canonicalType,
      artifact,
    });
  } catch (err: any) {
    next(err);
  }
};
