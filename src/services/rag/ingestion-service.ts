import { Document } from '@/types';
import { db } from '@/lib/db';
import { chunkingService } from './chunking-service';

export interface IngestDocumentPayload {
  title: string;
  doi?: string;
  authors: string[];
  abstract: string;
  content: string;
  docType: Document['docType'];
  stationCode?: string;
  year: number;
  keywords: string[];
  provenanceUrl?: string;
}

export class IngestionService {
  public async ingestDocument(payload: IngestDocumentPayload): Promise<Document> {
    const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    
    // 1. Chunk document
    const chunks = chunkingService.chunkDocument(docId, payload.content);

    const newDoc: Document = {
      id: docId,
      title: payload.title,
      doi: payload.doi,
      authors: payload.authors,
      abstract: payload.abstract,
      content: payload.content,
      docType: payload.docType,
      stationCode: payload.stationCode,
      year: payload.year,
      keywords: payload.keywords,
      provenanceUrl: payload.provenanceUrl,
      status: 'approved',
      chunks,
      createdAt: new Date().toISOString(),
    };

    // 2. Persist to database
    db.addDocument(newDoc);

    return newDoc;
  }
}

export const ingestionService = new IngestionService();
