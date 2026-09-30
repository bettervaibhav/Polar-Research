import { NextRequest, NextResponse } from 'next/server';
import { explorerService } from '@/services/explorer/explorer-service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (code) {
    const detail = explorerService.getStationDetails(code);
    if (!detail) {
      return NextResponse.json({ error: 'Station not found' }, { status: 404 });
    }
    return NextResponse.json(detail);
  }

  const stations = explorerService.getAllStations();
  return NextResponse.json(stations);
}
