import { AIProvider, GenerateLessonParams, GroundedQuestionParams, GenerateMediaParams } from './ai-provider';
import { GroundedAnswer } from '@/types';
import { Lesson } from '@/types/lesson';
import { GeneratedContentItem } from '@/types/media';
import { DemoProvider } from './demo-provider';

export class OpenAIProvider implements AIProvider {
  public name = 'OpenAIProvider (GPT-4o)';
  private apiKey?: string;
  private fallback: DemoProvider;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY;
    this.fallback = new DemoProvider();
  }

  public isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  public async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.isAvailable()) {
      return this.fallback.generateText(prompt, systemPrompt);
    }
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: prompt },
          ],
        }),
      });
      const data = await res.json();
      return data.choices?.[0]?.message?.content || this.fallback.generateText(prompt, systemPrompt);
    } catch (err) {
      console.error('[OpenAIProvider] API Error, falling back to DemoProvider:', err);
      return this.fallback.generateText(prompt, systemPrompt);
    }
  }

  public async answerGroundedQuestion(params: GroundedQuestionParams): Promise<GroundedAnswer> {
    return this.fallback.answerGroundedQuestion(params);
  }

  public async generateLesson(params: GenerateLessonParams): Promise<Lesson> {
    return this.fallback.generateLesson(params);
  }

  public async generateMediaContent(params: GenerateMediaParams): Promise<GeneratedContentItem[]> {
    return this.fallback.generateMediaContent(params);
  }
}
