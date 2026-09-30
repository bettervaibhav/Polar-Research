import { NextRequest, NextResponse } from 'next/server';
import { pdfExtractor } from '@/services/rag/pdf-extractor';
import { chunkingService } from '@/services/rag/chunking-service';
import { db } from '@/lib/db';
import { Document } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No PDF file supplied in form data' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file format. Only .pdf documents are supported.' }, { status: 400 });
    }

    // Check file size (max 25MB)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'PDF file exceeds maximum allowed size of 25MB' }, { status: 400 });
    }

    // 1. Extract raw text, pages, and detected sections from real binary PDF
    const extractionResult = await pdfExtractor.extractPdfText(buffer);

    // Metadata overrides or fallbacks
    const title = (formData.get('title') as string) || extractionResult.inferredTitle || file.name.replace(/\.pdf$/i, '');
    const stationCode = (formData.get('stationCode') as string) || 'BHARATI';
    const authorsRaw = (formData.get('authors') as string) || 'National Centre for Polar and Ocean Research (NCPOR)';
    const authors = authorsRaw.split(',').map((a) => a.trim()).filter(Boolean);
    const year = Number(formData.get('year')) || new Date().getFullYear();
    const doi = (formData.get('doi') as string) || undefined;
    const keywordsRaw = (formData.get('keywords') as string) || 'Polar Science, NCPOR, Cryosphere';
    const keywords = keywordsRaw.split(',').map((k) => k.trim()).filter(Boolean);

    const docId = `doc-pdf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // 2. Chunk document preserving exact page numbers
    const chunks = chunkingService.chunkPdfPages(docId, extractionResult.pages, 'Executive Summary');

    // 3. Create document record
    const newDoc: Document = {
      id: docId,
      title,
      doi,
      authors,
      abstract: extractionResult.fullText.slice(0, 300).replace(/\s+/g, ' ') + '...',
      content: extractionResult.fullText,
      docType: 'peer_reviewed_paper',
      stationCode,
      year,
      keywords,
      status: 'approved',
      chunks,
      createdAt: new Date().toISOString(),
    };

    // 4. Persist to database
    db.addDocument(newDoc);

    return NextResponse.json({
      success: true,
      document: newDoc,
      extraction: {
        totalPages: extractionResult.totalPages,
        detectedSections: extractionResult.detectedSections,
        chunksIndexed: chunks.length,
      },
    });
  } catch (err: any) {
    console.error('[API PDF Upload Error]', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process and index PDF document' },
      { status: 500 }
    );
  }
}
