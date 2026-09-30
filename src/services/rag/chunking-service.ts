import { DocumentChunk } from '@/types';
import { ExtractedPdfPage } from './pdf-extractor';

export class ChunkingService {
  /**
   * Splits document text into structured semantic chunks with page and section tracking.
   */
  public chunkDocument(docId: string, fullText: string, defaultTitle: string = 'Section'): DocumentChunk[] {
    const lines = fullText.split(/\r?\n/);
    const chunks: DocumentChunk[] = [];
    let currentSection = defaultTitle;
    let currentLines: string[] = [];
    let chunkIndex = 0;
    let estimatedPage = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Detect section headers (e.g. "1. INTRODUCTION", "2. OBSERVATIONS")
      if (/^[0-9]+\.\s+[A-Z\s&]+$/.test(line) || line.startsWith('###') || line.startsWith('##')) {
        if (currentLines.length > 0) {
          const content = currentLines.join(' ');
          chunks.push(this.buildChunk(docId, chunkIndex++, currentSection, estimatedPage, content));
          currentLines = [];
        }
        currentSection = line.replace(/^[#0-9\.\s]+/, '').trim();
        estimatedPage = Math.floor(chunkIndex / 2) + 1;
        continue;
      }

      currentLines.push(line);

      // Paragraph token count estimation
      if (currentLines.join(' ').split(/\s+/).length >= 100) {
        const content = currentLines.join(' ');
        chunks.push(this.buildChunk(docId, chunkIndex++, currentSection, estimatedPage, content));
        currentLines = [];
        estimatedPage = Math.floor(chunkIndex / 2) + 1;
      }
    }

    if (currentLines.length > 0) {
      const content = currentLines.join(' ');
      chunks.push(this.buildChunk(docId, chunkIndex++, currentSection, estimatedPage, content));
    }

    return chunks;
  }

  /**
   * Chunks real extracted PDF pages while preserving exact physical page numbers.
   */
  public chunkPdfPages(docId: string, pages: ExtractedPdfPage[], defaultSection: string = 'Main Content'): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    let chunkIndex = 0;
    let currentSection = defaultSection;

    for (const page of pages) {
      const pageNumber = page.pageNumber;
      const lines = page.text.split(/\r?\n/);
      let currentLines: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Detect section header on page
        if (/^[0-9]+\.\s+[A-Z\s&]+$/.test(line) || /^(ABSTRACT|INTRODUCTION|METHODOLOGY|OBSERVATIONS|RESULTS|DISCUSSION|CONCLUSION)/i.test(line)) {
          if (currentLines.length > 0) {
            const content = currentLines.join(' ');
            chunks.push(this.buildChunk(docId, chunkIndex++, currentSection, pageNumber, content));
            currentLines = [];
          }
          currentSection = line.replace(/^[#0-9\.\s]+/, '').trim();
          continue;
        }

        currentLines.push(line);

        if (currentLines.join(' ').split(/\s+/).length >= 110) {
          const content = currentLines.join(' ');
          chunks.push(this.buildChunk(docId, chunkIndex++, currentSection, pageNumber, content));
          currentLines = [];
        }
      }

      if (currentLines.length > 0) {
        const content = currentLines.join(' ');
        chunks.push(this.buildChunk(docId, chunkIndex++, currentSection, pageNumber, content));
      }
    }

    return chunks;
  }

  private buildChunk(
    docId: string,
    index: number,
    section: string,
    page: number,
    content: string
  ): DocumentChunk {
    const tokens = content.split(/\s+/);
    const keywords = Array.from(
      new Set(
        tokens
          .map((t) => t.toLowerCase().replace(/[^\w]/g, ''))
          .filter((t) => t.length > 4)
      )
    ).slice(0, 8);

    return {
      id: `chk-${docId}-${index}`,
      documentId: docId,
      chunkIndex: index,
      sectionTitle: section,
      pageNumber: page,
      content,
      tokenCount: tokens.length,
      keywords,
    };
  }
}

export const chunkingService = new ChunkingService();
