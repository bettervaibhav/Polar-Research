import { TeachingSession } from '@/types/teaching';
import { TeachingStateMachine } from './teaching-state-machine';
import { db } from '@/lib/db';

export class ResumeService {
  public resumeSession(sessionId: string): TeachingSession {
    const session = db.getTeachingSessionById(sessionId);
    if (!session) {
      throw new Error(`Teaching session ${sessionId} not found`);
    }

    TeachingStateMachine.transition(session, 'resuming');
    session.activeQuestion = undefined;

    // Transition directly back to explaining/drawing
    TeachingStateMachine.transition(session, 'explaining');
    db.saveTeachingSession(session);

    return session;
  }
}

export const resumeService = new ResumeService();
