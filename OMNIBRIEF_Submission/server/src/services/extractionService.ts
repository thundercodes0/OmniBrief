import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import {
  NormalizedSource,
  NormalizedSourceSchema,
  ExtractedTable,
  VisualElement,
  ExtractionMethod,
} from '../schemas/multimodalSchemas';
import { geminiService } from './geminiService';

export type ExtractionResult = NormalizedSource;

export interface ExtractionOptions {
  performOcr?: boolean;
  apiKey?: string;
  contextInstructions?: string;
}

/**
 * Extracts markdown-style tables from text content
 */
export function extractMarkdownTables(text: string): ExtractedTable[] {
  const tables: ExtractedTable[] = [];
  const lines = text.split('\n');
  let currentTableLines: string[] = [];
  let tableIndex = 1;

  const parseSingleTable = (tableLines: string[], id: string): ExtractedTable | null => {
    if (tableLines.length < 2) return null;
    const cleanCells = (row: string) =>
      row
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());

    const headers = cleanCells(tableLines[0]);
    if (headers.length === 0) return null;

    // Check if second line is markdown separator (e.g. |---|---|)
    let startIndex = 1;
    if (tableLines.length > 1 && tableLines[1].includes('-')) {
      const sepCells = cleanCells(tableLines[1]);
      const isSep = sepCells.every((cell) => /^[-:\s]+$/.test(cell));
      if (isSep) {
        startIndex = 2;
      }
    }

    const rows: string[][] = [];
    for (let r = startIndex; r < tableLines.length; r++) {
      const cells = cleanCells(tableLines[r]);
      if (cells.length > 0) {
        rows.push(cells);
      }
    }

    if (rows.length === 0) return null;

    return {
      id,
      headers,
      rows,
      confidence: 1.0,
    };
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      currentTableLines.push(line);
    } else {
      if (currentTableLines.length >= 2) {
        const parsed = parseSingleTable(currentTableLines, `table-${tableIndex++}`);
        if (parsed) tables.push(parsed);
      }
      currentTableLines = [];
    }
  }

  if (currentTableLines.length >= 2) {
    const parsed = parseSingleTable(currentTableLines, `table-${tableIndex++}`);
    if (parsed) tables.push(parsed);
  }

  return tables;
}

export class ExtractionService {
  private allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'text/markdown',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
  ];

  public getMaxPages(): number {
    return parseInt(process.env.MAX_MULTIMODAL_PAGES || '5', 10);
  }

  public getMaxImageSizeMb(): number {
    return parseInt(process.env.MAX_IMAGE_SIZE_MB || '10', 10);
  }

  public isMimeAllowed(mimeType: string, fileName?: string): boolean {
    if (this.allowedMimeTypes.includes(mimeType.toLowerCase())) {
      return true;
    }
    if (fileName) {
      const ext = fileName.split('.').pop()?.toLowerCase();
      if (['pdf', 'docx', 'txt', 'md', 'png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) {
        return true;
      }
    }
    return false;
  }

  public async extractFromBuffer(
    buffer: Buffer,
    mimeType: string,
    fileName: string,
    options?: ExtractionOptions
  ): Promise<NormalizedSource> {
    const sourceId = `src_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const lowerName = fileName.toLowerCase();
    const warnings: string[] = [];
    const tables: ExtractedTable[] = [];
    const visualContent: VisualElement[] = [];

    // 1. PDF Extraction (Page-Aware, Scanned-Detection, Boundary Preservation)
    if (mimeType === 'application/pdf' || lowerName.endsWith('.pdf')) {
      let parser: any = null;
      try {
        parser = new PDFParse({ data: buffer });
        const textResult: any = await parser.getText();

        let extractedPages: Array<{ num: number; text: string }> = [];
        let totalPages = 1;

        if (textResult && Array.isArray(textResult.pages) && textResult.pages.length > 0) {
          extractedPages = textResult.pages;
          totalPages = textResult.total || extractedPages.length;
        } else {
          let raw = '';
          if (typeof textResult === 'string') raw = textResult;
          else if (textResult && typeof textResult.text === 'string') raw = textResult.text;
          extractedPages = [{ num: 1, text: raw }];
          totalPages = 1;
        }

        // Limit checking
        const maxPages = this.getMaxPages();
        if (totalPages > maxPages) {
          warnings.push(
            `Document contains ${totalPages} pages, exceeding the recommended limit of ${maxPages} pages for multimodal extraction.`
          );
        }

        // Preserve page boundaries
        const formattedPageBlocks = extractedPages.map(
          (p) => `--- Page ${p.num} ---\n${(p.text || '').trim()}`
        );
        let unifiedText = formattedPageBlocks.join('\n\n').trim();

        // Calculate character density
        const rawChars = extractedPages.reduce((acc, p) => acc + (p.text || '').trim().length, 0);
        const avgCharsPerPage = totalPages > 0 ? rawChars / totalPages : rawChars;

        let extractionMethod: ExtractionMethod = 'native_text';
        let confidenceScore = 0.98;

        if (rawChars === 0) {
          warnings.push(
            'PDF contains no selectable native text layer. Document appears to be a scanned image or raster PDF.'
          );
          unifiedText = `[Scanned Document: ${fileName} - ${totalPages} page(s). No native text layer found.]`;
          extractionMethod = 'multimodal_ocr';
          confidenceScore = 0.6;
        } else if (avgCharsPerPage < 50) {
          warnings.push(
            `Low text density detected (${rawChars} characters across ${totalPages} pages; average ${Math.round(
              avgCharsPerPage
            )} chars/page). Document may be scanned or image-heavy.`
          );
          extractionMethod = 'hybrid';
          confidenceScore = 0.75;
        }

        // Extract markdown tables if present in text
        const detectedTables = extractMarkdownTables(unifiedText);
        tables.push(...detectedTables);

        const normalized: NormalizedSource = {
          sourceId,
          sourceType: 'pdf',
          title: fileName.replace(/\.[^/.]+$/, ''),
          text: unifiedText,
          visual_content: visualContent,
          tables,
          extraction_warnings: warnings,
          extraction_method: extractionMethod,
          page_count: totalPages,
          confidence_score: confidenceScore,
          metadata: {
            fileName,
            mimeType: 'application/pdf',
            fileSize: buffer.length,
            characterCount: unifiedText.length,
            pageCount: totalPages,
            processedAt: new Date().toISOString(),
          },
        };

        return NormalizedSourceSchema.parse(normalized);
      } catch (err: any) {
        throw new Error(`Failed to extract text from PDF: ${err.message || err}`);
      } finally {
        if (parser && typeof parser.destroy === 'function') {
          try {
            await parser.destroy();
          } catch {}
        }
      }
    }

    // 2. DOCX Extraction
    if (
      mimeType.includes('wordprocessingml') ||
      mimeType.includes('msword') ||
      lowerName.endsWith('.docx')
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        const extractedText = (result.value || '').trim();

        if (!extractedText) {
          throw new Error('DOCX document contains no readable text.');
        }

        const detectedTables = extractMarkdownTables(extractedText);
        tables.push(...detectedTables);

        const normalized: NormalizedSource = {
          sourceId,
          sourceType: 'docx',
          title: fileName.replace(/\.[^/.]+$/, ''),
          text: extractedText,
          visual_content: visualContent,
          tables,
          extraction_warnings: warnings,
          extraction_method: 'native_text',
          page_count: 1,
          confidence_score: 0.98,
          metadata: {
            fileName,
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            fileSize: buffer.length,
            characterCount: extractedText.length,
            pageCount: 1,
            processedAt: new Date().toISOString(),
          },
        };

        return NormalizedSourceSchema.parse(normalized);
      } catch (err: any) {
        throw new Error(`Failed to extract text from DOCX: ${err.message || err}`);
      }
    }

    // 3. Image (PNG, JPG, WEBP) - Multimodal OCR & Vision Intelligence
    if (
      mimeType.startsWith('image/') ||
      ['png', 'jpg', 'jpeg', 'webp'].some((ext) => lowerName.endsWith('.' + ext))
    ) {
      const maxImageMb = this.getMaxImageSizeMb();
      if (buffer.length > maxImageMb * 1024 * 1024) {
        throw new Error(
          `Image size (${(buffer.length / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum allowed limit of ${maxImageMb} MB.`
        );
      }

      const detectedMime = mimeType.startsWith('image/')
        ? mimeType
        : lowerName.endsWith('.png')
        ? 'image/png'
        : 'image/jpeg';

      const base64Data = buffer.toString('base64');
      let extractedOcrText = `[Visual Document Image: ${fileName}]`;
      let ocrConfidence = 0.9;
      let ocrExtractionMethod: ExtractionMethod = 'multimodal_ocr';

      // Always populate basic visual element for the image
      visualContent.push({
        id: 'visual-1',
        type: lowerName.includes('chart') || lowerName.includes('graph')
          ? 'chart'
          : lowerName.includes('diag') || lowerName.includes('arch')
          ? 'diagram'
          : lowerName.includes('info')
          ? 'infographic'
          : 'screenshot',
        page_number: 1,
        description: `Visual artifact source from ${fileName}`,
        confidence: 0.9,
      });

      // If performOcr is enabled (or true by default for images when key is present)
      const shouldRunGeminiVision = options?.performOcr !== false;
      if (shouldRunGeminiVision) {
        try {
          const multimodalResult = await geminiService.extractMultimodalContent(
            {
              imageBase64: base64Data,
              mimeType: detectedMime,
              fileName,
              documentContext: options?.contextInstructions,
            },
            options?.apiKey
          );

          if (multimodalResult.extracted_text && multimodalResult.extracted_text.trim().length > 0) {
            extractedOcrText = multimodalResult.extracted_text.trim();
          }

          if (multimodalResult.tables && multimodalResult.tables.length > 0) {
            tables.push(...multimodalResult.tables);
          }

          if (multimodalResult.visual_elements && multimodalResult.visual_elements.length > 0) {
            visualContent.length = 0; // Replace placeholder with rich AI analysis
            visualContent.push(...multimodalResult.visual_elements);
          }

          ocrConfidence = multimodalResult.confidence_score || 0.95;
          if (multimodalResult.extraction_notes && multimodalResult.extraction_notes.length > 0) {
            warnings.push(...multimodalResult.extraction_notes);
          }
        } catch (visionErr: any) {
          console.warn(`[ExtractionService] Multimodal AI vision pass skipped or failed: ${visionErr.message}`);
          warnings.push(
            `Automated multimodal OCR pass could not complete: ${visionErr.message}. Source will be analyzed during brief generation.`
          );
        }
      }

      const normalized: NormalizedSource = {
        sourceId,
        sourceType: 'image',
        title: fileName.replace(/\.[^/.]+$/, ''),
        text: extractedOcrText,
        visual_content: visualContent,
        tables,
        extraction_warnings: warnings,
        extraction_method: ocrExtractionMethod,
        page_count: 1,
        confidence_score: ocrConfidence,
        imagePart: {
          inlineData: {
            data: base64Data,
            mimeType: detectedMime,
          },
        },
        metadata: {
          fileName,
          mimeType: detectedMime,
          fileSize: buffer.length,
          characterCount: extractedOcrText.length,
          pageCount: 1,
          processedAt: new Date().toISOString(),
        },
      };

      return NormalizedSourceSchema.parse(normalized);
    }

    // 4. Plain Text or Markdown
    const textContent = buffer.toString('utf-8').trim();
    if (!textContent) {
      throw new Error('The submitted text file is empty.');
    }

    const detectedTables = extractMarkdownTables(textContent);
    tables.push(...detectedTables);

    const normalized: NormalizedSource = {
      sourceId,
      sourceType: 'txt',
      title: fileName.replace(/\.[^/.]+$/, ''),
      text: textContent,
      visual_content: visualContent,
      tables,
      extraction_warnings: warnings,
      extraction_method: 'native_text',
      page_count: 1,
      confidence_score: 1.0,
      metadata: {
        fileName,
        mimeType: 'text/plain',
        fileSize: buffer.length,
        characterCount: textContent.length,
        pageCount: 1,
        processedAt: new Date().toISOString(),
      },
    };

    return NormalizedSourceSchema.parse(normalized);
  }

  public extractFromRawText(rawText: string, contextInstructions?: string): NormalizedSource {
    const trimmed = rawText.trim();
    if (!trimmed) {
      throw new Error('Raw text input cannot be empty.');
    }

    const firstLine = trimmed.split('\n')[0].replace(/^#+\s*/, '').trim();
    const title =
      firstLine.length > 5 && firstLine.length < 80 ? firstLine : 'Submitted Source Document';

    const tables = extractMarkdownTables(trimmed);

    const normalized: NormalizedSource = {
      sourceId: `src_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sourceType: 'text',
      title,
      text: trimmed,
      visual_content: [],
      tables,
      extraction_warnings: [],
      extraction_method: 'native_text',
      page_count: 1,
      confidence_score: 1.0,
      metadata: {
        mimeType: 'text/plain',
        fileSize: Buffer.byteLength(trimmed, 'utf8'),
        characterCount: trimmed.length,
        pageCount: 1,
        processedAt: new Date().toISOString(),
      },
    };

    return NormalizedSourceSchema.parse(normalized);
  }
}

export const extractionService = new ExtractionService();
