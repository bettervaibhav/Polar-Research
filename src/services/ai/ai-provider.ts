import { GroundedAnswer, SourceCitation } from '@/types';
import { Lesson, LearnerLevel } from '@/types/lesson';
import { GeneratedContentItem, ContentType } from '@/types/media';

export interface GenerateLessonParams {
  topic: string;
  learnerLevel: LearnerLevel;
  targetDurationMin: number;
  learningObjective?: string;
  sourceDocumentIds?: string[];
  contextChunks?: string[];
}

export interface GroundedQuestionParams {
  query: string;
  contextChunks: {
    id: string;
    docId: string;
    docTitle: string;
    sectionTitle: string;
    pageNumber: number;
    content: string;
    score: number;
  }[];
  conversationContext?: string;
}

export interface GenerateMediaParams {
  topic: string;
  sourceDocuments: {
    id: string;
    title: string;
    abstract: string;
    content: string;
  }[];
  targetFormats: ContentType[];
}

export interface AIProvider {
  name: string;
  isAvailable(): boolean;
  generateText(prompt: string, systemPrompt?: string): Promise<string>;
  answerGroundedQuestion(params: GroundedQuestionParams): Promise<GroundedAnswer>;
  generateLesson(params: GenerateLessonParams): Promise<Lesson>;
  generateMediaContent(params: GenerateMediaParams): Promise<GeneratedContentItem[]>;
}
