import { NextRequest, NextResponse } from 'next/server';
import { mediaGenerator } from '@/services/media/media-generator';

export async function GET() {
  const items = mediaGenerator.getGeneratedItems();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, documentIds, targetFormats } = body;

    if (!topic || !targetFormats || targetFormats.length === 0) {
      return NextResponse.json({ error: 'topic and targetFormats required' }, { status: 400 });
    }

    const items = await mediaGenerator.generateMedia({
      topic,
      documentIds: documentIds || [],
      targetFormats,
    });

    return NextResponse.json(items, { status: 201 });
  } catch (err: any) {
    console.error('[API Media] Error:', err);
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}
