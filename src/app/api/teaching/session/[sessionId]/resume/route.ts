import { NextRequest, NextResponse } from 'next/server';
import { resumeService } from '@/services/teaching/resume-service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const session = resumeService.resumeSession(sessionId);
    return NextResponse.json(session);
  } catch (err: any) {
    console.error('[API Resume] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
