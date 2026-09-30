import { Request, Response, NextFunction } from 'express';
import { BriefGenerateSchema } from '../schemas/ingestSchema';
import { geminiService } from '../services/geminiService';

export const generateBrief = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = BriefGenerateSchema.safeParse(req.body);

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

    const input = parseResult.data;
    const overrideKey = (req.headers['x-gemini-api-key'] as string) || (req.body?.apiKey as string);
    const sourceBrief = await geminiService.generateSourceBrief(input, overrideKey);

    res.status(200).json({
      success: true,
      sourceBrief,
    });
  } catch (err: any) {
    next(err);
  }
};
