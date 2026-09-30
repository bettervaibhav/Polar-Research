import { vectorStore } from './vector-store';
import { citationService } from './citation-service';
import { getAIProvider } from '../ai/provider-factory';
import { GroundedAnswer } from '@/types/index';

export interface RetrievalQuery {
  query: string;
  stationFilter?: string;
  topK?: number;
  conversationContext?: string;
}

export class RetrievalService {
  public async retrieveAndAnswer(params: RetrievalQuery): Promise<GroundedAnswer> {
    const { query, stationFilter, topK = 4, conversationContext } = params;

    // 1. Hybrid Search via VectorStore
    const searchResults = vectorStore.search(query, stationFilter, topK);

    // 2. Strict Grounding Guardrail: If no relevant evidence is found
    if (!searchResults || searchResults.length === 0 || searchResults[0].score < 0.35) {
      return {
        answer: 'I could not find enough evidence in the POLAR SENSE research repository to answer this reliably.',
        citations: [],
        confidenceScore: 0.1,
        model: 'PolarSense-GroundingGuard-v1',
        retrievedCount: 0,
        latencyMs: 15,
      };
    }

    // 3. Format Context Chunks for AI Provider
    const contextChunks = searchResults.map((r) => ({
      id: r.chunk.id,
      docId: r.chunk.documentId,
      docTitle: r.docTitle,
      sectionTitle: r.chunk.sectionTitle,
      pageNumber: r.chunk.pageNumber,
      content: r.chunk.content,
      score: r.score,
    }));

    // 4. Delegate to AI Provider
    const aiProvider = getAIProvider();
    const rawAnswer = await aiProvider.answerGroundedQuestion({
      query,
      contextChunks,
      conversationContext,
    });

    // 5. Verify citations against DB records
    const verifiedCitations = citationService.verifyCitations(rawAnswer.citations);

    return {
      ...rawAnswer,
      citations: verifiedCitations,
    };
  }
}

export const retrievalService = new RetrievalService();
