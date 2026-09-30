import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Expedition, ResearchStation, Document, MediaAsset } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const expeditions = db.getExpeditions();
    const expedition = expeditions.find((e) => e.id === id);

    if (!expedition) {
      return NextResponse.json({ error: 'Expedition not found' }, { status: 404 });
    }

    // Related station
    const stations = db.getStations();
    const station = expedition.stationId
      ? stations.find((s) => s.id === expedition.stationId) || null
      : null;

    // Related documents
    const allDocs = db.getDocuments();
    const relatedDocs: Document[] = allDocs.filter(
      (d) => d.expeditionId === expedition.id || (station && d.stationCode === station.code)
    );

    // Related media
    const allMedia = db.getMediaAssets();
    const relatedMedia: MediaAsset[] = allMedia.filter(
      (m: MediaAsset) => m.stationId === expedition.stationId
    );

    return NextResponse.json({
      expedition,
      station,
      relatedDocuments: relatedDocs,
      relatedMedia,
    });
  } catch (err: any) {
    console.error('[API Expedition Detail Error]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
