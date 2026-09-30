import { Request, Response } from 'express';
import {
  VerifyArtifactRequestSchema,
  VerifyBatchRequestSchema,
} from '../schemas/verificationSchemas';
import { verificationService } from '../services/verificationService';

/**
 * Controller for Factual Verification / Hallucination Audit (Phase 4)
 */
export class VerificationController {
  /**
   * POST /artifacts/verify
   * Verifies a single artifact against the canonical Source Brief
   */
  public async verifySingleArtifact(req: Request, res: Response): Promise<void> {
    try {
      const validated = VerifyArtifactRequestSchema.safeParse(req.body);
      if (!validated.success) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid verification request parameters.',
            details: validated.error.format(),
          },
        });
        return;
      }

      const { source_brief, artifact, artifact_type } = validated.data;
      const result = await verificationService.verifyArtifact(
        source_brief,
        artifact,
        artifact_type
      );

      res.status(200).json({
        success: true,
        verification: result,
        ...result, // Flatten fields for direct accessibility
      });
    } catch (err: any) {
      console.error('[VerificationController] Single artifact verification error:', err);
      res.status(500).json({
        success: false,
        error: {
          code: 'VERIFICATION_ERROR',
          message: err.message || 'An unexpected error occurred during factual verification.',
        },
      });
    }
  }

  /**
   * POST /artifacts/verify-batch
   * Verifies multiple artifacts against the canonical Source Brief in micro-batches
   */
  public async verifyBatchArtifacts(req: Request, res: Response): Promise<void> {
    try {
      const validated = VerifyBatchRequestSchema.safeParse(req.body);
      if (!validated.success) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid batch verification request parameters.',
            details: validated.error.format(),
          },
        });
        return;
      }

      const { source_brief, artifacts } = validated.data;
      const batchResult = await verificationService.verifyBatch(
        source_brief,
        artifacts
      );

      res.status(200).json({
        success: true,
        ...batchResult,
      });
    } catch (err: any) {
      console.error('[VerificationController] Batch verification error:', err);
      res.status(500).json({
        success: false,
        error: {
          code: 'VERIFICATION_ERROR',
          message: err.message || 'An unexpected error occurred during batch verification.',
        },
      });
    }
  }
}

export const verificationController = new VerificationController();
