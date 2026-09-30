import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    const freshState = db.resetToSeedData();
    return NextResponse.json({
      success: true,
      message: 'Demo database state reset successfully to default research seed data.',
      stats: {
        documents: freshState.documents.length,
        chunks: freshState.chunks.length,
        stations: freshState.stations.length,
        expeditions: freshState.expeditions.length,
        lessons: freshState.lessons.length,
      },
    });
  } catch (error: any) {
    console.error('[Admin Reset Error]', error);
    return NextResponse.json(
      { error: 'Failed to reset demonstration database state' },
      { status: 500 }
    );
  }
}
