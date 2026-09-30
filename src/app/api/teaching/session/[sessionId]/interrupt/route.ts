import { NextRequest, NextResponse } from 'next/server';
import { interruptionService } from '@/services/teaching/interruption-service';
import { z } from 'zod';

const interruptSchema = z.object({
  studentQuestion: z.string().min(1),
  currentSectionIndex: z.number().optional().default(0),
  currentActionIndex: z.number().optional().default(0),
  boardElements: z.array(z.any()).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const json = await req.json();
    const parsed = interruptSchema.parse(json);

    const result = await interruptionService.handleInterruption({
      sessionId,
      studentQuestion: parsed.studentQuestion,
      currentSectionIndex: parsed.currentSectionIndex,
      currentActionIndex: parsed.currentActionIndex,
      boardElements: parsed.boardElements,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API Interrupt] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
