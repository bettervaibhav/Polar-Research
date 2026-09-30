import { NextRequest, NextResponse } from 'next/server';
import { retrievalService } from '@/services/rag/retrieval-service';
import { z } from 'zod';

const askSchema = z.object({
  question: z.string().optional(),
  query: z.string().optional(),
  stationFilter: z.string().optional(),
  topK: z.number().optional().default(4),
  conversationId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = askSchema.parse(json);
    const searchQuery = parsed.question || parsed.query;

    if (!searchQuery || searchQuery.trim().length === 0) {
      return NextResponse.json({ error: 'Question or query string required' }, { status: 400 });
    }

    const result = await retrievalService.retrieveAndAnswer({
      query: searchQuery,
      stationFilter: parsed.stationFilter,
      topK: parsed.topK,
      conversationContext: parsed.conversationId,
    });

    return NextResponse.json({
      answer: result.answer,
      sources: result.citations,
      citations: result.citations,
      grounded: result.citations.length > 0 && result.confidenceScore > 0.4,
      confidenceScore: result.confidenceScore,
      model: result.model,
      retrievedCount: result.retrievedCount,
      latencyMs: result.latencyMs,
    });
  } catch (err: any) {
    console.error('[API /api/ai/ask] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
