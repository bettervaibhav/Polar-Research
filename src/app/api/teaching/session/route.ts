import { NextRequest, NextResponse } from 'next/server';
import { teachingEngine } from '@/services/teaching/teaching-engine';
import { db } from '@/lib/db';
import { z } from 'zod';

const createSessionSchema = z.object({
  lessonId: z.string().min(1),
  userId: z.string().optional().default('usr-default'),
});

export async function GET() {
  const sessions = db.getTeachingSessions();
  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = createSessionSchema.parse(json);

    const session = await teachingEngine.createSession(parsed.lessonId, parsed.userId);
    return NextResponse.json(session);
  } catch (err: any) {
    console.error('[API /api/teaching/session] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
