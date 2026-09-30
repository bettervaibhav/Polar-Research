import { Document } from '@/types';
import { db } from '@/lib/db';

export class DocumentService {
  public getAllDocuments(): Document[] {
    return db.getDocuments();
  }

  public getDocumentById(id: string): Document | undefined {
    return db.getDocumentById(id);
  }

  public searchDocuments(query: string, docType?: string, stationCode?: string): Document[] {
    let docs = db.getDocuments();

    if (docType && docType !== 'all') {
      docs = docs.filter((d) => d.docType === docType);
    }

    if (stationCode && stationCode !== 'all') {
      docs = docs.filter((d) => d.stationCode?.toLowerCase() === stationCode.toLowerCase());
    }

    if (query && query.trim().length > 0) {
      const q = query.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.abstract.toLowerCase().includes(q) ||
          d.keywords.some((k) => k.toLowerCase().includes(q)) ||
          d.authors.some((a) => a.toLowerCase().includes(q))
      );
    }

    return docs;
  }

  public getStats() {
    return db.getSystemStats();
  }
}

export const documentService = new DocumentService();
