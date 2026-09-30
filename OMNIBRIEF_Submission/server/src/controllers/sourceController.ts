import { Request, Response, NextFunction } from 'express';
import { extractionService } from '../services/extractionService';

export const ingestSource = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const file = req.file;
    const { rawText, contextInstructions, performOcr } = req.body;
    const overrideKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;

    const shouldPerformOcr = performOcr !== false && performOcr !== 'false';

    // 1. File Upload Processing
    if (file) {
      const extracted = await extractionService.extractFromBuffer(
        file.buffer,
        file.mimetype,
        file.originalname,
        {
          performOcr: shouldPerformOcr,
          apiKey: overrideKey,
          contextInstructions,
        }
      );

      res.status(200).json({
        success: true,
        source: extracted,
      });
      return;
    }

    // 2. Raw Text Processing
    if (rawText && typeof rawText === 'string' && rawText.trim().length > 0) {
      const extracted = extractionService.extractFromRawText(rawText, contextInstructions);

      res.status(200).json({
        success: true,
        source: extracted,
      });
      return;
    }

    res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_SOURCE',
        message: 'Please provide either raw text or upload a document file (PDF, DOCX, TXT, PNG, JPG).',
      },
    });
  } catch (err) {
    next(err);
  }
};

export const previewMultimodal = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const file = req.file;
    const { rawText, contextInstructions } = req.body;
    const overrideKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;

    if (file) {
      const extracted = await extractionService.extractFromBuffer(
        file.buffer,
        file.mimetype,
        file.originalname,
        {
          performOcr: true,
          apiKey: overrideKey,
          contextInstructions,
        }
      );

      res.status(200).json({
        success: true,
        preview: {
          sourceId: extracted.sourceId,
          sourceType: extracted.sourceType,
          title: extracted.title,
          pageCount: extracted.page_count,
          tableCount: extracted.tables.length,
          tables: extracted.tables,
          visualElementCount: extracted.visual_content.length,
          visualContent: extracted.visual_content,
          extractionMethod: extracted.extraction_method,
          warnings: extracted.extraction_warnings,
          confidenceScore: extracted.confidence_score,
          characterCount: extracted.metadata.characterCount,
        },
      });
      return;
    }

    if (rawText && typeof rawText === 'string' && rawText.trim().length > 0) {
      const extracted = extractionService.extractFromRawText(rawText, contextInstructions);

      res.status(200).json({
        success: true,
        preview: {
          sourceId: extracted.sourceId,
          sourceType: extracted.sourceType,
          title: extracted.title,
          pageCount: extracted.page_count,
          tableCount: extracted.tables.length,
          tables: extracted.tables,
          visualElementCount: 0,
          visualContent: [],
          extractionMethod: extracted.extraction_method,
          warnings: extracted.extraction_warnings,
          confidenceScore: extracted.confidence_score,
          characterCount: extracted.metadata.characterCount,
        },
      });
      return;
    }

    res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_SOURCE',
        message: 'No file or text provided to preview multimodal analysis.',
      },
    });
  } catch (err) {
    next(err);
  }
};
