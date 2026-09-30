import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log technical detail server-side for debugging
  console.error(`[Server Error] ${req.method} ${req.path}:`, err);

  const errorMessage = err?.message || 'Internal server error';

  // Check for rate limits / quota
  if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Gemini API quota or rate limit reached. Please wait a moment and try again.',
      },
    });
    return;
  }

  // Check for 503 high demand / service unavailable
  if (errorMessage.includes('503') || errorMessage.includes('UNAVAILABLE') || errorMessage.includes('high demand')) {
    res.status(503).json({
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Google Gemini service is temporarily experiencing high demand. Please wait a few seconds and retry.',
      },
    });
    return;
  }

  // Check for invalid or missing API key
  if (errorMessage.includes('API_KEY') || errorMessage.includes('API key')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'API_KEY_ERROR',
        message: 'GEMINI_API_KEY is not configured or is invalid. Please set it in server/.env.',
      },
    });
    return;
  }

  // Default clean error response without stack traces
  res.status(500).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message: 'Unable to analyze this source. Please verify your inputs and try again.',
    },
  });
};
