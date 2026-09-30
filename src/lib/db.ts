import fs from 'fs';
import path from 'path';
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
} from '../types/index';
import { Lesson } from '../types/lesson';
import { TeachingSession } from '../types/teaching';
import { GeneratedContentItem } from '../types/media';
import { DatabaseAdapter, DatabaseState } from './db-adapter';
import {
  SEED_STATIONS,
  SEED_EXPEDITIONS,
  SEED_DOCUMENTS,
  SEED_TOPICS,
  SEED_MEDIA,
  INITIAL_FLAGSHIP_LESSON,
} from './seed-data';

const DB_FILE_PATH = path.join(process.cwd(), '.polar_db.json');

export class LocalDatabaseAdapter implements DatabaseAdapter {
  public name = 'LocalFileDatabaseAdapter (JSON Relational File Persistence)';
  private state: DatabaseState;

  constructor() {
    this.state = this.loadOrInitialize();
  }

  public isReady(): boolean {
    return true;
  }

  private loadOrInitialize(): DatabaseState {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.stations && parsed.documents && parsed.topics) {
          return parsed;
        }
      }
    } catch {
      console.warn('[LocalDB] Error reading existing database file. Initializing with fresh seed data.');
    }

    const defaultUser: User = {
      id: 'usr-default',
      email: 'scientist@ncpor.gov.in',
      name: 'Dr. Polar Scientist (NCPOR)',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };

    const allChunks: DocumentChunk[] = [];
    SEED_DOCUMENTS.forEach((doc) => {
      if (doc.chunks) {
        allChunks.push(...doc.chunks);
      }
    });

    const initial: DatabaseState = {
      users: [defaultUser],
      stations: SEED_STATIONS,
      expeditions: SEED_EXPEDITIONS,
      topics: SEED_TOPICS,
      media: SEED_MEDIA,
      documents: SEED_DOCUMENTS,
      chunks: allChunks,
      lessons: [INITIAL_FLAGSHIP_LESSON],
      teachingSessions: [],
      questions: [],
      quizAttempts: [],
      generatedContent: [],
      contentReviews: [],
      initializedAt: new Date().toISOString(),
    };

    this.persist(initial);
    return initial;
  }

  public persist(state: DatabaseState = this.state): void {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(state, null, 2), 'utf-8');
    } catch (err) {
      console.error('[LocalDB] Failed to persist database to disk:', err);
    }
  }

  // --- Users ---
  public getUsers(): User[] {
    return this.state.users;
  }

  // --- Stations & Topics ---
  public getStations(): ResearchStation[] {
    return this.state.stations;
  }

  public getStationByCode(code: string): ResearchStation | undefined {
    return this.state.stations.find(
      (s) => s.code.toLowerCase() === code.toLowerCase()
    );
  }

  public getTopics(): ResearchTopic[] {
    return this.state.topics;
  }

  // --- Expeditions & Media ---
  public getExpeditions(): Expedition[] {
    return this.state.expeditions;
  }

  public getExpeditionsByStation(stationId: string): Expedition[] {
    return this.state.expeditions.filter((e) => e.stationId === stationId);
  }

  public getMediaAssets(): MediaAsset[] {
    return this.state.media;
  }

  // --- Documents & Chunks ---
  public getDocuments(): Document[] {
    return this.state.documents;
  }

  public getDocumentById(id: string): Document | undefined {
    return this.state.documents.find((d) => d.id === id);
  }

  public addDocument(doc: Document): Document {
    this.state.documents.unshift(doc);
    if (doc.chunks && doc.chunks.length > 0) {
      this.state.chunks.push(...doc.chunks);
    }
    this.persist();
    return doc;
  }

  public updateDocumentStatus(id: string, status: Document['status']): Document | undefined {
    const doc = this.getDocumentById(id);
    if (doc) {
      doc.status = status;
      this.persist();
    }
    return doc;
  }

  public getAllChunks(): DocumentChunk[] {
    return this.state.chunks;
  }

  public getChunksByDocumentId(docId: string): DocumentChunk[] {
    return this.state.chunks.filter((c) => c.documentId === docId);
  }

  // --- Lessons ---
  public getLessons(): Lesson[] {
    return this.state.lessons;
  }

  public getLessonById(id: string): Lesson | undefined {
    return this.state.lessons.find((l) => l.id === id);
  }

  public saveLesson(lesson: Lesson): Lesson {
    const idx = this.state.lessons.findIndex((l) => l.id === lesson.id);
    if (idx >= 0) {
      this.state.lessons[idx] = lesson;
    } else {
      this.state.lessons.unshift(lesson);
    }
    this.persist();
    return lesson;
  }

  // --- Teaching Sessions ---
  public getTeachingSessions(): TeachingSession[] {
    return this.state.teachingSessions;
  }

  public getTeachingSessionById(id: string): TeachingSession | undefined {
    return this.state.teachingSessions.find((s) => s.id === id);
  }

  public saveTeachingSession(session: TeachingSession): TeachingSession {
    const idx = this.state.teachingSessions.findIndex((s) => s.id === session.id);
    session.lastActiveAt = new Date().toISOString();
    if (idx >= 0) {
      this.state.teachingSessions[idx] = session;
    } else {
      this.state.teachingSessions.unshift(session);
    }
    this.persist();
    return session;
  }

  // --- Questions (Interruption Logs) ---
  public logQuestion(q: QuestionRecord): QuestionRecord {
    this.state.questions.unshift(q);
    this.persist();
    return q;
  }

  public getQuestionsBySession(sessionId: string): QuestionRecord[] {
    return this.state.questions.filter((q) => q.sessionId === sessionId);
  }

  // --- Quiz Attempts ---
  public saveQuizAttempt(attempt: QuizAttempt): QuizAttempt {
    this.state.quizAttempts.unshift(attempt);
    this.persist();
    return attempt;
  }

  public getQuizAttempts(sessionId?: string): QuizAttempt[] {
    if (sessionId) {
      return this.state.quizAttempts.filter((a) => a.sessionId === sessionId);
    }
    return this.state.quizAttempts;
  }

  // --- Generated Content (Media Studio) ---
  public getGeneratedContent(): GeneratedContentItem[] {
    return this.state.generatedContent;
  }

  public saveGeneratedContent(content: GeneratedContentItem): GeneratedContentItem {
    const idx = this.state.generatedContent.findIndex((c) => c.id === content.id);
    if (idx >= 0) {
      this.state.generatedContent[idx] = content;
    } else {
      this.state.generatedContent.unshift(content);
    }
    this.persist();
    return content;
  }

  public updateContentStatus(id: string, status: GeneratedContentItem['status']): GeneratedContentItem | undefined {
    const item = this.state.generatedContent.find((c) => c.id === id);
    if (item) {
      item.status = status;
      this.persist();
    }
    return item;
  }

  // --- Telemetry & System Stats ---
  public getSystemStats() {
    return {
      totalDocuments: this.state.documents.length,
      totalChunks: this.state.chunks.length,
      totalStations: this.state.stations.length,
      totalExpeditions: this.state.expeditions.length,
      totalTopics: this.state.topics.length,
      totalLessons: this.state.lessons.length,
      totalTeachingSessions: this.state.teachingSessions.length,
      totalQuestionsAnswered: this.state.questions.length,
      totalGeneratedMedia: this.state.generatedContent.length,
      verifiedCitationsCount: this.state.chunks.length * 2,
    };
  }

  // --- Reset to Seed State ---
  public resetToSeedData(): DatabaseState {
    const defaultUser: User = {
      id: 'usr-default',
      email: 'scientist@ncpor.gov.in',
      name: 'Dr. Polar Scientist (NCPOR)',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };

    const allChunks: DocumentChunk[] = [];
    SEED_DOCUMENTS.forEach((doc) => {
      if (doc.chunks) {
        allChunks.push(...doc.chunks);
      }
    });

    const resetState: DatabaseState = {
      users: [defaultUser],
      stations: SEED_STATIONS,
      expeditions: SEED_EXPEDITIONS,
      topics: SEED_TOPICS,
      media: SEED_MEDIA,
      documents: SEED_DOCUMENTS,
      chunks: allChunks,
      lessons: [INITIAL_FLAGSHIP_LESSON],
      teachingSessions: [],
      questions: [],
      quizAttempts: [],
      generatedContent: [],
      contentReviews: [],
      initializedAt: new Date().toISOString(),
    };

    this.state = resetState;
    this.persist(resetState);
    return resetState;
  }
}

export const db: DatabaseAdapter = new LocalDatabaseAdapter();
