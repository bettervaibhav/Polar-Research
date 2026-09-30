import { Lesson } from '@/types/lesson';
import { db } from '@/lib/db';
import { lessonGenerator, GenerateLessonRequest } from './lesson-generator';

export class LessonService {
  public getAllLessons(): Lesson[] {
    return db.getLessons();
  }

  public getLessonById(id: string): Lesson | undefined {
    return db.getLessonById(id);
  }

  public async createOrGetLesson(req: GenerateLessonRequest): Promise<Lesson> {
    // Check if matching lesson already exists
    const existing = db.getLessons().find(
      (l) => l.topic.toLowerCase() === req.topic.toLowerCase() && l.learnerLevel === req.learnerLevel
    );
    if (existing) {
      return existing;
    }

    return lessonGenerator.generate(req);
  }
}

export const lessonService = new LessonService();
