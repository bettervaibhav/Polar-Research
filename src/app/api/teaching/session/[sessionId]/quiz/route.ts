import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { QuizAttempt } from '@/types/index';

const quizAttemptSchema = z.object({
  score: z.number().min(0),
  totalQuestions: z.number().min(1),
  answersMap: z.record(z.string(), z.number()),
  userId: z.string().optional().default('usr-default'),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const json = await req.json();
    const parsed = quizAttemptSchema.parse(json);

    const session = db.getTeachingSessionById(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const passed = parsed.score / parsed.totalQuestions >= 0.5;

    // Convert string keys to number keys
    const numericAnswersMap: Record<number, number> = {};
    Object.entries(parsed.answersMap).forEach(([k, v]) => {
      numericAnswersMap[Number(k)] = v;
    });

    const attempt: QuizAttempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sessionId,
      userId: parsed.userId,
      score: parsed.score,
      totalQuestions: parsed.totalQuestions,
      answersMap: numericAnswersMap,
      passed,
      attemptedAt: new Date().toISOString(),
    };

    db.saveQuizAttempt(attempt);

    return NextResponse.json({
      attemptId: attempt.id,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      passed: attempt.passed,
      attemptedAt: attempt.attemptedAt,
    });
  } catch (err: any) {
    console.error('[API Quiz] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
