import { NextRequest, NextResponse } from 'next/server';
import { teachingEngine } from '@/services/teaching/teaching-engine';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const session = teachingEngine.advanceSection(sessionId);
    return NextResponse.json(session);
  } catch (err: any) {
    console.error('[API Advance] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
