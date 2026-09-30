import { SourceCitation } from '@/types';
import { db } from '@/lib/db';

export class CitationService {
  /**
   * Validates and verifies citations from an AI answer against database documents.
   * Ensures no hallucinated DOIs or titles reach the user.
   */
  public verifyCitations(rawCitations: Partial<SourceCitation>[]): SourceCitation[] {
    const verified: SourceCitation[] = [];
    const documents = db.getDocuments();
    const docMap = new Map(documents.map((d) => [d.id, d]));

    for (const raw of rawCitations) {
      if (!raw.sourceId) continue;
      const matchedDoc = docMap.get(raw.sourceId);

      if (matchedDoc) {
        verified.push({
          sourceId: matchedDoc.id,
          title: matchedDoc.title,
          doi: matchedDoc.doi,
          page: raw.page || 1,
          section: raw.section || 'General Observations',
          snippet: raw.snippet || matchedDoc.abstract.slice(0, 180),
          relevanceScore: raw.relevanceScore || 0.85,
          stationCode: matchedDoc.stationCode,
          provenanceUrl: matchedDoc.provenanceUrl,
        });
      }
    }

    return verified;
  }

  /**
   * Format citation into academic markdown notation
   */
  public formatCitationBadge(citation: SourceCitation): string {
    const doiPart = citation.doi ? ` [DOI: ${citation.doi}]` : '';
    return `[Source: ${citation.title} — Page ${citation.page}, Sec: ${citation.section}${doiPart}]`;
  }
}

export const citationService = new CitationService();
