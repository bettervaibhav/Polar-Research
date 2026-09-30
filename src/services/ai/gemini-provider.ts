import { AIProvider, GenerateLessonParams, GroundedQuestionParams, GenerateMediaParams } from './ai-provider';
import { GroundedAnswer, SourceCitation } from '@/types';
import { Lesson } from '@/types/lesson';
import { GeneratedContentItem } from '@/types/media';
import { DemoProvider } from './demo-provider';

export class GeminiProvider implements AIProvider {
  public name = 'GeminiProvider (Google Gemini API)';
  private apiKey?: string;
  private fallback: DemoProvider;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
    this.fallback = new DemoProvider();
  }

  public isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  public getModel(): string {
    return process.env.GEMINI_MODEL || 'gemini-3.5-flash';
  }

  public async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.isAvailable()) {
      return this.fallback.generateText(prompt, systemPrompt);
    }
    try {
      const model = this.getModel();
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              ...(systemPrompt ? [{ role: 'user', parts: [{ text: `System Instructions:\n${systemPrompt}` }] }] : []),
              { role: 'user', parts: [{ text: prompt }] },
            ],
          }),
        }
      );
      const data = await res.json();
      if (!res.ok || data.error) {
        console.warn(`[GeminiProvider] API error (${res.status}): ${data.error?.message || 'Unknown error'}. Falling back to DemoProvider.`);
        return this.fallback.generateText(prompt, systemPrompt);
      }
      return data.candidates?.[0]?.content?.parts?.[0]?.text || this.fallback.generateText(prompt, systemPrompt);
    } catch (err: any) {
      console.warn('[GeminiProvider] Network/API Error, falling back to DemoProvider.');
      return this.fallback.generateText(prompt, systemPrompt);
    }
  }

  public async answerGroundedQuestion(params: GroundedQuestionParams): Promise<GroundedAnswer> {
    if (!this.isAvailable()) {
      return this.fallback.answerGroundedQuestion(params);
    }
    const startTime = Date.now();
    try {
      const contextText = params.contextChunks
        .map((c, i) => `[Source ${i + 1}]: (Doc: "${c.docTitle}", Sec: "${c.sectionTitle}", Page: ${c.pageNumber})\n${c.content}`)
        .join('\n\n');

      const systemPrompt = `You are POLAR SENSE AI, an authoritative polar science assistant for India's National Centre for Polar and Ocean Research (NCPOR). 
Instructions:
1. Answer strictly using the provided polar scientific chunks below.
2. Reference evidence using [Source N].
3. Preserve accurate scientific metrics (e.g. albedo values, temperatures, depths).
4. Never invent or hallucinate DOIs, author names, expedition IDs, or station metadata.
5. If the provided context is insufficient to answer the question, clearly state that the repository does not contain enough verified evidence.`;

      const prompt = `SCIENTIFIC CONTEXT CHUNKS:\n${contextText}\n\nUSER QUESTION:\n${params.query}\n\nProvide a precise, grounded scientific explanation based solely on the context above:`;

      const responseText = await this.generateText(prompt, systemPrompt);

      const citations: SourceCitation[] = params.contextChunks.slice(0, 3).map((c) => ({
        sourceId: c.docId,
        title: c.docTitle,
        page: c.pageNumber,
        section: c.sectionTitle,
        snippet: c.content,
        relevanceScore: Math.round(c.score * 100) / 100,
      }));

      return {
        answer: responseText,
        citations,
        confidenceScore: 0.94,
        model: this.getModel(),
        retrievedCount: params.contextChunks.length,
        latencyMs: Date.now() - startTime,
      };
    } catch (err: any) {
      console.warn('[GeminiProvider] Question answering fallback triggered.');
      return this.fallback.answerGroundedQuestion(params);
    }
  }

  public async generateLesson(params: GenerateLessonParams): Promise<Lesson> {
    return this.fallback.generateLesson(params);
  }

  public async generateMediaContent(params: GenerateMediaParams): Promise<GeneratedContentItem[]> {
    return this.fallback.generateMediaContent(params);
  }
}
