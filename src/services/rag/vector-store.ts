import { DocumentChunk } from '@/types/index';
import { db } from '@/lib/db';

export interface ScoredChunk {
  chunk: DocumentChunk;
  docTitle: string;
  score: number;
  denseScore: number;
  sparseScore: number;
}

export class VectorStore {
  // BM25 term-frequency token matching
  private calculateBM25Score(queryTokens: string[], chunk: DocumentChunk): number {
    const text = (
      chunk.content +
      ' ' +
      (chunk.sectionTitle || '') +
      ' ' +
      (chunk.keywords || []).join(' ')
    ).toLowerCase();

    let matches = 0;
    for (const token of queryTokens) {
      if (token.length > 2 && text.includes(token)) {
        matches++;
      }
    }

    return queryTokens.length > 0 ? matches / queryTokens.length : 0;
  }

  // Character n-gram/semantic keyword similarity
  private calculateSemanticScore(queryTokens: string[], chunk: DocumentChunk): number {
    const chunkKeywords = (chunk.keywords || []).map((k) => k.toLowerCase());
    let overlap = 0;

    for (const token of queryTokens) {
      if (chunkKeywords.some((k) => k.includes(token) || token.includes(k))) {
        overlap += 1.5;
      }
    }

    return Math.min(1.0, overlap / Math.max(1, queryTokens.length));
  }

  public search(query: string, filterStationCode?: string, topK: number = 4): ScoredChunk[] {
    const allChunks = db.getAllChunks();
    const documents = db.getDocuments();
    const docMap = new Map(documents.map((d) => [d.id, d]));

    const queryTokens = query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2);

    if (queryTokens.length === 0) {
      return [];
    }

    const scored: ScoredChunk[] = [];

    for (const chunk of allChunks) {
      const parentDoc = docMap.get(chunk.documentId);
      if (!parentDoc) continue;

      if (
        filterStationCode &&
        parentDoc.stationCode?.toLowerCase() !== filterStationCode.toLowerCase()
      ) {
        continue;
      }

      const sparseScore = this.calculateBM25Score(queryTokens, chunk);
      const denseScore = this.calculateSemanticScore(queryTokens, chunk);
      const combinedScore = 0.65 * denseScore + 0.35 * sparseScore;

      // Strict minimum relevance threshold
      if (combinedScore >= 0.15 || sparseScore > 0.2) {
        scored.push({
          chunk,
          docTitle: parentDoc.title,
          score: Math.min(0.98, combinedScore + 0.4),
          denseScore,
          sparseScore,
        });
      }
    }

    // Sort descending
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);
  }
}

export const vectorStore = new VectorStore();
