import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const expeditions = await db.getExpeditions();
    return NextResponse.json(expeditions);
  } catch (err: any) {
    console.error('[API Expeditions Error]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
