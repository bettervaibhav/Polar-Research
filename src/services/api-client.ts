import { Document, GroundedAnswer, ResearchStation, Expedition, ResearchTopic, MediaAsset } from '@/types';
import { Lesson, LearnerLevel } from '@/types/lesson';
import { TeachingSession, InterruptionResult } from '@/types/teaching';
import { GeneratedContentItem, ContentType } from '@/types/media';

export const apiClient = {
  // --- Grounded AI ---
  async askGroundedQuestion(query: string, stationFilter?: string): Promise<GroundedAnswer> {
    const res = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: query, stationFilter }),
    });
    if (!res.ok) throw new Error('Failed to query Polar AI');
    return res.json();
  },

  // --- Lessons ---
  async generateLesson(params: {
    topic: string;
    learnerLevel: LearnerLevel;
    targetDurationMin: number;
    learningObjective?: string;
    sourceDocumentIds?: string[];
  }): Promise<Lesson> {
    const res = await fetch('/api/ai/lesson/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to generate lesson');
    return res.json();
  },

  // --- Teaching Session ---
  async createTeachingSession(lessonId: string): Promise<TeachingSession> {
    const res = await fetch('/api/teaching/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId }),
    });
    if (!res.ok) throw new Error('Failed to create teaching session');
    return res.json();
  },

  async getTeachingSession(sessionId: string): Promise<TeachingSession> {
    const res = await fetch(`/api/teaching/session/${sessionId}`);
    if (!res.ok) throw new Error('Failed to load teaching session');
    return res.json();
  },

  async interruptSession(params: {
    sessionId: string;
    studentQuestion: string;
    currentSectionIndex: number;
    currentActionIndex: number;
    boardElements?: any[];
  }): Promise<InterruptionResult> {
    const res = await fetch(`/api/teaching/session/${params.sessionId}/interrupt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to interrupt lesson');
    return res.json();
  },

  async resumeSession(sessionId: string): Promise<TeachingSession> {
    const res = await fetch(`/api/teaching/session/${sessionId}/resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to resume lesson');
    return res.json();
  },

  async advanceSection(sessionId: string): Promise<TeachingSession> {
    const res = await fetch(`/api/teaching/session/${sessionId}/advance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to advance section');
    return res.json();
  },

  // --- Documents ---
  async getDocuments(query: string = '', type?: string, station?: string): Promise<Document[]> {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (type && type !== 'all') params.set('type', type);
    if (station && station !== 'all') params.set('station', station);

    const res = await fetch(`/api/documents?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load documents');
    return res.json();
  },

  async getDocumentById(id: string): Promise<Document> {
    const res = await fetch(`/api/documents/${id}`);
    if (!res.ok) throw new Error('Failed to load document');
    return res.json();
  },

  async uploadDocument(data: any): Promise<Document> {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to upload document');
    return res.json();
  },

  // --- Stations ---
  async getStations(): Promise<ResearchStation[]> {
    const res = await fetch('/api/explorer/stations');
    if (!res.ok) throw new Error('Failed to load stations');
    return res.json();
  },

  async getStationDetail(id: string): Promise<{
    station: ResearchStation;
    relatedDocuments: Document[];
    relatedExpeditions: Expedition[];
    relatedMedia: MediaAsset[];
  }> {
    const res = await fetch(`/api/explorer/stations/${id}`);
    if (!res.ok) throw new Error('Failed to load station details');
    return res.json();
  },

  // --- Expeditions ---
  async getExpeditions(): Promise<Expedition[]> {
    const res = await fetch('/api/explorer/expeditions');
    if (!res.ok) throw new Error('Failed to load expeditions');
    return res.json();
  },

  async getExpeditionDetail(id: string): Promise<{
    expedition: Expedition;
    station: ResearchStation | null;
    relatedDocuments: Document[];
    relatedMedia: MediaAsset[];
  }> {
    const res = await fetch(`/api/explorer/expeditions/${id}`);
    if (!res.ok) throw new Error('Failed to load expedition details');
    return res.json();
  },

  // --- Research Topics ---
  async getTopics(): Promise<any[]> {
    const res = await fetch('/api/explorer/topics');
    if (!res.ok) throw new Error('Failed to load research topics');
    return res.json();
  },

  // --- Media Studio ---
  async generateMedia(params: {
    topic: string;
    documentIds: string[];
    targetFormats: ContentType[];
    targetAudience?: string;
  }): Promise<GeneratedContentItem[]> {
    const res = await fetch('/api/media/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to generate media');
    return res.json();
  },

  async getGeneratedMedia(): Promise<GeneratedContentItem[]> {
    const res = await fetch('/api/media/generate');
    if (!res.ok) throw new Error('Failed to load media');
    return res.json();
  },

  // --- Admin Stats & Demo Reset ---
  async getAdminStats(): Promise<any> {
    const res = await fetch('/api/admin/stats');
    if (!res.ok) throw new Error('Failed to load admin stats');
    return res.json();
  },

  async resetDemoData(): Promise<any> {
    const res = await fetch('/api/admin/reset', {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset demo data');
    return res.json();
  },
};
