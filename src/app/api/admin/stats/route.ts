import { NextResponse } from 'next/server';
import { documentService } from '@/services/documents/document-service';

export async function GET() {
  const stats = documentService.getStats();
  return NextResponse.json(stats);
}
