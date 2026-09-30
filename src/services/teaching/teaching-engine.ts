import { TeachingSession, TeachingStatus } from '@/types/teaching';
import { Lesson } from '@/types/lesson';
import { db } from '@/lib/db';
import { lessonService } from '../lessons/lesson-service';
import { TeachingStateMachine } from './teaching-state-machine';

export class TeachingEngine {
  public async createSession(lessonId: string, userId: string = 'usr-default'): Promise<TeachingSession> {
    const lesson = lessonService.getLessonById(lessonId);
    if (!lesson) {
      throw new Error(`Lesson ${lessonId} not found`);
    }

    const sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const session: TeachingSession = {
      id: sessionId,
      lessonId,
      lesson,
      userId,
      status: 'intro',
      currentSectionIndex: 0,
      currentActionIndex: 0,
      completedActionIds: [],
      boardElements: [],
      conversationHistory: [
        {
          id: `turn-init-${Date.now()}`,
          role: 'teacher',
          content: `Welcome to the AI Teaching Room! Today we will learn about "${lesson.title}". Feel free to click "Ask Question" or interrupt whenever you need clarification.`,
          timestamp: new Date().toISOString(),
        },
      ],
      progressPercent: 0,
      startedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    db.saveTeachingSession(session);
    return session;
  }

  public getSession(sessionId: string): TeachingSession | undefined {
    const session = db.getTeachingSessionById(sessionId);
    if (session && !session.lesson) {
      session.lesson = lessonService.getLessonById(session.lessonId);
    }
    return session;
  }

  public updateSessionState(sessionId: string, updates: Partial<TeachingSession>): TeachingSession {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    Object.assign(session, updates);
    return db.saveTeachingSession(session);
  }

  public completeAction(sessionId: string, actionId: string): TeachingSession {
    const session = this.getSession(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    if (!session.completedActionIds.includes(actionId)) {
      session.completedActionIds.push(actionId);
    }

    session.currentActionIndex++;
    return db.saveTeachingSession(session);
  }

  public advanceSection(sessionId: string): TeachingSession {
    const session = this.getSession(sessionId);
    if (!session || !session.lesson) throw new Error(`Session ${sessionId} not found`);

    if (session.currentSectionIndex < session.lesson.sections.length - 1) {
      session.currentSectionIndex++;
      session.currentActionIndex = 0;
      session.progressPercent = Math.round(
        (session.currentSectionIndex / session.lesson.sections.length) * 100
      );
      TeachingStateMachine.transition(session, 'explaining');
    } else {
      session.status = 'completed';
      session.progressPercent = 100;
      session.completedAt = new Date().toISOString();
    }

    return db.saveTeachingSession(session);
  }
}

export const teachingEngine = new TeachingEngine();
