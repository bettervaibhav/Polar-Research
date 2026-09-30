import { NextRequest, NextResponse } from 'next/server';
import { documentService } from '@/services/documents/document-service';
import { ingestionService } from '@/services/rag/ingestion-service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';
  const docType = searchParams.get('type') || undefined;
  const station = searchParams.get('station') || undefined;

  const docs = documentService.searchDocuments(query, docType, station);
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const doc = await ingestionService.ingestDocument(body);
    return NextResponse.json(doc, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Ingestion failed' }, { status: 500 });
  }
}
