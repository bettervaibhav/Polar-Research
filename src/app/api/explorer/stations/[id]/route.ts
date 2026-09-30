import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ResearchStation, Expedition, MediaAsset, Document } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stations = db.getStations();
    const station = stations.find(
      (s) => s.id === id || s.code.toLowerCase() === id.toLowerCase()
    );

    if (!station) {
      return NextResponse.json({ error: 'Station not found' }, { status: 404 });
    }

    // Fetch related documents matching station code or id
    const allDocs = db.getDocuments();
    const relatedDocs: Document[] = allDocs.filter(
      (d) => d.stationCode === station.code || d.stationId === station.id
    );

    // Fetch related expeditions
    const allExpeditions = db.getExpeditions();
    const relatedExpeditions: Expedition[] = allExpeditions.filter(
      (e) => e.stationId === station.id
    );

    // Fetch media
    const allMedia = db.getMediaAssets();
    const relatedMedia: MediaAsset[] = allMedia.filter(
      (m) => m.stationId === station.id
    );

    return NextResponse.json({
      station,
      relatedDocuments: relatedDocs,
      relatedExpeditions,
      relatedMedia,
    });
  } catch (err: any) {
    console.error('[API Station Detail Error]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
