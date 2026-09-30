import { getAIProvider } from '../ai/provider-factory';
import { Lesson, LearnerLevel } from '@/types/lesson';
import { db } from '@/lib/db';

export interface GenerateLessonRequest {
  topic: string;
  learnerLevel: LearnerLevel;
  targetDurationMin: number;
  learningObjective?: string;
  sourceDocumentIds?: string[];
}

export class LessonGenerator {
  public async generate(req: GenerateLessonRequest): Promise<Lesson> {
    const aiProvider = getAIProvider();
    
    // Retrieve context chunks for topic if documents specified
    const lesson = await aiProvider.generateLesson({
      topic: req.topic,
      learnerLevel: req.learnerLevel,
      targetDurationMin: req.targetDurationMin,
      learningObjective: req.learningObjective,
      sourceDocumentIds: req.sourceDocumentIds,
    });

    // Save generated lesson to persistent repository
    db.saveLesson(lesson);

    return lesson;
  }
}

export const lessonGenerator = new LessonGenerator();
