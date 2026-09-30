import { z } from 'zod';

export const ExtractionMethodSchema = z.enum(['native_text', 'multimodal_ocr', 'hybrid']);
export type ExtractionMethod = z.infer<typeof ExtractionMethodSchema>;

export const ExtractedTableSchema = z.object({
  id: z.string(),
  page_number: z.number().int().positive().optional(),
  caption: z.string().optional(),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
  confidence: z.number().min(0).max(1).default(1.0),
});
export type ExtractedTable = z.infer<typeof ExtractedTableSchema>;

export const VisualElementTypeSchema = z.enum([
  'chart',
  'diagram',
  'infographic',
  'table',
  'photo',
  'screenshot',
  'other',
]);
export type VisualElementType = z.infer<typeof VisualElementTypeSchema>;

export const VisualElementSchema = z.object({
  id: z.string(),
  type: VisualElementTypeSchema,
  page_number: z.number().int().positive().optional(),
  description: z.string(),
  extracted_text: z.string().optional(),
  confidence: z.number().min(0).max(1).default(1.0),
});
export type VisualElement = z.infer<typeof VisualElementSchema>;

export const SourceMetadataSchema = z.object({
  fileName: z.string().optional(),
  mimeType: z.string(),
  fileSize: z.number().nonnegative(),
  characterCount: z.number().nonnegative(),
  pageCount: z.number().int().positive().optional(),
  processedAt: z.string().optional(),
});
export type SourceMetadata = z.infer<typeof SourceMetadataSchema>;

export const NormalizedSourceSchema = z.object({
  sourceId: z.string(),
  sourceType: z.enum(['pdf', 'docx', 'txt', 'image', 'text']),
  title: z.string(),
  text: z.string(),
  visual_content: z.array(VisualElementSchema).default([]),
  tables: z.array(ExtractedTableSchema).default([]),
  extraction_warnings: z.array(z.string()).default([]),
  extraction_method: ExtractionMethodSchema,
  page_count: z.number().int().positive().optional(),
  confidence_score: z.number().min(0).max(1).default(1.0),
  imagePart: z
    .object({
      inlineData: z.object({
        data: z.string(),
        mimeType: z.string(),
      }),
    })
    .optional(),
  metadata: SourceMetadataSchema,
});
export type NormalizedSource = z.infer<typeof NormalizedSourceSchema>;

export const MultimodalExtractionResponseSchema = z.object({
  extracted_text: z.string().default(''),
  tables: z.array(ExtractedTableSchema).default([]),
  visual_elements: z.array(VisualElementSchema).default([]),
  confidence_score: z.number().min(0).max(1).default(1.0),
  extraction_notes: z.array(z.string()).default([]),
});
export type MultimodalExtractionResponse = z.infer<typeof MultimodalExtractionResponseSchema>;

export const PreviewMultimodalRequestSchema = z.object({
  sourceId: z.string().optional(),
  rawText: z.string().optional(),
  contextInstructions: z.string().optional(),
});
export type PreviewMultimodalRequest = z.infer<typeof PreviewMultimodalRequestSchema>;
