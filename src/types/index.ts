export type UserRole = 'student' | 'educator' | 'researcher' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash?: string;
  createdAt: string;
  updatedAt?: string;
}

export type Region = 'Antarctica' | 'Arctic' | 'Southern Ocean' | 'Himalayas';
export type StationStatus = 'active' | 'seasonal' | 'decommissioned';
export type DocumentType = 'peer_reviewed_paper' | 'expedition_report' | 'scientific_dataset' | 'policy_brief';
export type LearnerLevel = 'school' | 'undergraduate' | 'researcher';

export interface ResearchTopic {
  id: string;
  slug: string;
  title: string;
  category: 'Glaciology' | 'Atmospheric Physics' | 'Oceanography' | 'Limnology' | 'Biotechnology';
  description: string;
  keywords: string[];
}

export interface ResearchStation {
  id: string;
  code: string;
  name: string;
  region: Region;
  latitude: number;
  longitude: number;
  establishedYear: number;
  status: StationStatus;
  description: string;
  elevationMeters?: number;
  focusAreas: string[];
  imageUrl?: string;
  activeInstruments: string[];
  currentTempC?: number;
}

export interface Expedition {
  id: string;
  stationId: string;
  title: string;
  year: number;
  season: string;
  leader: string;
  objectives: string[];
  organization: string;
  summary: string;
}

export interface MediaAsset {
  id: string;
  documentId?: string;
  stationId?: string;
  mediaType: 'photo' | 'video' | 'satellite_map' | 'audio_clip' | 'chart';
  title: string;
  url: string;
  caption?: string;
  provenanceInfo?: string;
  createdAt: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  sectionTitle: string;
  pageNumber: number;
  content: string;
  tokenCount: number;
  embedding?: number[];
  keywords: string[];
  createdAt?: string;
}

export interface Document {
  id: string;
  title: string;
  doi?: string;
  authors: string[];
  abstract: string;
  content: string;
  docType: DocumentType;
  stationId?: string;
  stationCode?: string;
  expeditionId?: string;
  year: number;
  keywords: string[];
  provenanceUrl?: string;
  pdfUrl?: string;
  isDemo?: boolean;
  status: 'draft' | 'under_review' | 'approved' | 'archived';
  chunks?: DocumentChunk[];
  createdAt: string;
}

export interface SourceCitation {
  sourceId: string;
  title: string;
  doi?: string;
  page: number;
  section: string;
  snippet: string;
  relevanceScore: number;
  stationCode?: string;
  provenanceUrl?: string;
}

export interface GroundedAnswer {
  answer: string;
  citations: SourceCitation[];
  confidenceScore: number;
  model: string;
  retrievedCount: number;
  latencyMs: number;
}

export interface QuestionRecord {
  id: string;
  sessionId: string;
  sectionId?: string;
  studentQuestion: string;
  groundedAnswer: string;
  retrievedChunks: DocumentChunk[];
  citations: SourceCitation[];
  confidenceScore: number;
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  sessionId: string;
  userId?: string;
  score: number;
  totalQuestions: number;
  answersMap: Record<number, number>;
  passed: boolean;
  attemptedAt: string;
}

export interface ContentReview {
  id: string;
  contentId: string;
  reviewerId: string;
  action: 'approve' | 'reject' | 'request_changes';
  feedback?: string;
  reviewedAt: string;
}
