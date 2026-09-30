import { ResearchStation, Expedition, Document } from '@/types';
import { db } from '@/lib/db';

export interface StationDetailView {
  station: ResearchStation;
  expeditions: Expedition[];
  documents: Document[];
}

export class ExplorerService {
  public getAllStations(): ResearchStation[] {
    return db.getStations();
  }

  public getStationDetails(stationCode: string): StationDetailView | undefined {
    const station = db.getStationByCode(stationCode);
    if (!station) return undefined;

    const expeditions = db.getExpeditionsByStation(station.id);
    const documents = db
      .getDocuments()
      .filter((d) => d.stationCode?.toLowerCase() === station.code.toLowerCase());

    return {
      station,
      expeditions,
      documents,
    };
  }

  public getAllExpeditions(): Expedition[] {
    return db.getExpeditions();
  }
}

export const explorerService = new ExplorerService();
