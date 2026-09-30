import {
  ResearchStation,
  Expedition,
  Document,
  DocumentChunk,
  User,
  ResearchTopic,
  MediaAsset,
  QuestionRecord,
  QuizAttempt,
  ContentReview,
} from '@/types/index';
import { Lesson } from '@/types/lesson';
import { TeachingSession } from '@/types/teaching';
import { GeneratedContentItem } from '@/types/media';

export interface DatabaseState {
  users: User[];
  stations: ResearchStation[];
  expeditions: Expedition[];
  topics: ResearchTopic[];
  media: MediaAsset[];
  documents: Document[];
  chunks: DocumentChunk[];
  lessons: Lesson[];
  teachingSessions: TeachingSession[];
  questions: QuestionRecord[];
  quizAttempts: QuizAttempt[];
  generatedContent: GeneratedContentItem[];
  contentReviews: ContentReview[];
  initializedAt: string;
}

export interface DatabaseAdapter {
  name: string;
  isReady(): boolean;
  
  // Users
  getUsers(): User[];
  
  // Stations & Topics
  getStations(): ResearchStation[];
  getStationByCode(code: string): ResearchStation | undefined;
  getTopics(): ResearchTopic[];
  
  // Expeditions & Media
  getExpeditions(): Expedition[];
  getExpeditionsByStation(stationId: string): Expedition[];
  getMediaAssets(): MediaAsset[];
  
  // Documents & Chunks
  getDocuments(): Document[];
  getDocumentById(id: string): Document | undefined;
  addDocument(doc: Document): Document;
  updateDocumentStatus(id: string, status: Document['status']): Document | undefined;
  getAllChunks(): DocumentChunk[];
  getChunksByDocumentId(docId: string): DocumentChunk[];
  
  // Lessons
  getLessons(): Lesson[];
  getLessonById(id: string): Lesson | undefined;
  saveLesson(lesson: Lesson): Lesson;
  
  // Teaching Sessions
  getTeachingSessions(): TeachingSession[];
  getTeachingSessionById(id: string): TeachingSession | undefined;
  saveTeachingSession(session: TeachingSession): TeachingSession;
  
  // Questions (Interruption Logs)
  logQuestion(q: QuestionRecord): QuestionRecord;
  getQuestionsBySession(sessionId: string): QuestionRecord[];
  
  // Quiz Attempts
  saveQuizAttempt(attempt: QuizAttempt): QuizAttempt;
  getQuizAttempts(sessionId?: string): QuizAttempt[];
  
  // Media Studio
  getGeneratedContent(): GeneratedContentItem[];
  saveGeneratedContent(content: GeneratedContentItem): GeneratedContentItem;
  updateContentStatus(id: string, status: GeneratedContentItem['status']): GeneratedContentItem | undefined;
  
  // Telemetry
  getSystemStats(): {
    totalDocuments: number;
    totalChunks: number;
    totalStations: number;
    totalExpeditions: number;
    totalTopics: number;
    totalLessons: number;
    totalTeachingSessions: number;
    totalQuestionsAnswered: number;
    totalGeneratedMedia: number;
    verifiedCitationsCount: number;
  };
  
  // Demo Reset
  resetToSeedData(): DatabaseState;
}
