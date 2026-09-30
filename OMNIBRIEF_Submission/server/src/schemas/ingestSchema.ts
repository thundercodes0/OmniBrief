import { z } from 'zod';
import { ExtractedTableSchema, VisualElementSchema } from './multimodalSchemas';

export const IngestTextSchema = z.object({
  rawText: z.string().optional(),
  contextInstructions: z.string().optional(),
});

export const BriefGenerateSchema = z.object({
  sourceContent: z.string().min(1, 'Source content is required'),
  sourceMetadata: z
    .object({
      sourceId: z.string().optional(),
      sourceType: z.string().optional(),
      title: z.string().optional(),
      fileName: z.string().optional(),
      mimeType: z.string().optional(),
      characterCount: z.number().optional(),
      pageCount: z.number().optional(),
    })
    .optional(),
  imageData: z
    .object({
      data: z.string(),
      mimeType: z.string(),
    })
    .optional(),
  tables: z.array(ExtractedTableSchema).optional(),
  visualContent: z.array(VisualElementSchema).optional(),
  extractionWarnings: z.array(z.string()).optional(),
  extractionMethod: z.string().optional(),
  pageCount: z.number().optional(),
  additionalContext: z.string().optional(),
  targetAudience: z.string().default('General Audience'),
  tone: z.string().default('Formal & Professional'),
  language: z.string().default('English'),
  detailLevel: z.string().default('Standard'),
  communicationObjective: z.string().default('Inform & Educate'),
});

export type BriefGenerateInput = z.infer<typeof BriefGenerateSchema>;
