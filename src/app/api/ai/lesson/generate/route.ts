import { NextRequest, NextResponse } from 'next/server';
import { lessonService } from '@/services/lessons/lesson-service';
import { z } from 'zod';

const generateLessonSchema = z.object({
  topic: z.string().min(2),
  learnerLevel: z.enum(['school', 'undergraduate', 'researcher']).default('undergraduate'),
  duration: z.number().optional(),
  targetDurationMin: z.number().optional().default(10),
  learningObjectives: z.array(z.string()).optional(),
  learningObjective: z.string().optional(),
  sourceDocumentIds: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = generateLessonSchema.parse(json);

    const lesson = await lessonService.createOrGetLesson({
      topic: parsed.topic,
      learnerLevel: parsed.learnerLevel,
      targetDurationMin: parsed.duration || parsed.targetDurationMin,
      learningObjective: parsed.learningObjective || (parsed.learningObjectives ? parsed.learningObjectives.join('. ') : undefined),
      sourceDocumentIds: parsed.sourceDocumentIds,
    });

    return NextResponse.json(lesson);
  } catch (err: any) {
    console.error('[API /api/ai/lesson/generate] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
