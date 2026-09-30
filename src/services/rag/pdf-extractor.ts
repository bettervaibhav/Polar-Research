// pdf-parse is a CommonJS library for binary PDF extraction
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');

export interface ExtractedPdfPage {
  pageNumber: number;
  text: string;
}

export interface ExtractedPdfResult {
  fullText: string;
  totalPages: number;
  pages: ExtractedPdfPage[];
  inferredTitle?: string;
  detectedSections: string[];
}

export class PdfExtractor {
  /**
   * Parses binary PDF buffer and extracts text, page boundaries, and section headers.
   */
  public async extractPdfText(pdfBuffer: Buffer): Promise<ExtractedPdfResult> {
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error('Invalid or empty PDF buffer supplied');
    }

    try {
      const pageTexts: ExtractedPdfPage[] = [];

      // Custom pager to capture individual page texts
      const renderPage = (pageData: any) => {
        return pageData.getTextContent().then((textContent: any) => {
          let lastY: number | null = null;
          let text = '';
          for (const item of textContent.items) {
            if (lastY === item.transform[5] || lastY === null) {
              text += item.str;
            } else {
              text += '\n' + item.str;
            }
            lastY = item.transform[5];
          }
          pageTexts.push({
            pageNumber: pageData.pageNumber || pageTexts.length + 1,
            text: text.trim(),
          });
          return text;
        });
      };

      // Support cjs/esm resolution of pdf-parse
      const parseFn: any = typeof pdfParse === 'function' ? pdfParse : (pdfParse as any)?.default || require('pdf-parse');
      const parsed = await parseFn(pdfBuffer, { pagerender: renderPage });

      const fullText = parsed.text || '';
      const totalPages = parsed.numpages || pageTexts.length || 1;

      // Extract section headings using regex patterns common in scientific papers
      const sectionRegex = /(?:^|\n)(?:(?:[0-9]+\.|\b[IVXLCDM]+\.)\s+([A-Z\s]{3,40})|\b(ABSTRACT|INTRODUCTION|STUDY AREA|METHODOLOGY|OBSERVATIONS|RESULTS|DISCUSSION|CONCLUSION|REFERENCES)\b)/g;
      const detectedSections: string[] = [];
      let match;
      while ((match = sectionRegex.exec(fullText)) !== null) {
        const heading = (match[1] || match[2] || '').trim();
        if (heading && !detectedSections.includes(heading)) {
          detectedSections.push(heading);
        }
      }

      // Infer title from first few lines if available
      const lines = fullText.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 5);
      const inferredTitle = lines.length > 0 ? lines[0].slice(0, 150) : undefined;

      return {
        fullText,
        totalPages,
        pages: pageTexts.length > 0 ? pageTexts : [{ pageNumber: 1, text: fullText }],
        inferredTitle,
        detectedSections,
      };
    } catch (err: any) {
      console.error('[PdfExtractor Error]', err);
      throw new Error(`Failed to parse PDF document: ${err.message || 'Corrupt or unreadable PDF structure'}`);
    }
  }
}

export const pdfExtractor = new PdfExtractor();
