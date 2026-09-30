import { NextRequest, NextResponse } from 'next/server';
import { teachingEngine } from '@/services/teaching/teaching-engine';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const session = teachingEngine.getSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Teaching session not found' }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await req.json();
    const updated = teachingEngine.updateSessionState(sessionId, body);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
