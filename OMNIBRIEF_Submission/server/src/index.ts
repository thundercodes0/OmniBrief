import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './routes/apiRoutes';
import { globalErrorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for local development
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use(globalErrorHandler);

app.listen(Number(PORT), '0.0.0.0', () => {
  logger.info(`======================================================`);
  logger.info(`🚀 Content Transformation Engine Backend listening on port ${PORT}`);
  logger.info(`🔗 Healthcheck: http://localhost:${PORT}/api/health`);
  logger.info(`🤖 Configured Gemini Model: ${process.env.GEMINI_MODEL || 'gemini-3.6-flash'}`);
  logger.info(`🔑 Gemini API Key configured: ${process.env.GEMINI_API_KEY ? 'YES' : 'NO (Required for AI generation)'}`);
  logger.info(`======================================================`);
});

export default app;
