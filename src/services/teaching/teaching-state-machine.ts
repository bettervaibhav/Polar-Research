import { TeachingStatus, TeachingSession } from '@/types/teaching';

export class TeachingStateMachine {
  private static validTransitions: Record<TeachingStatus, TeachingStatus[]> = {
    idle: ['intro'],
    intro: ['explaining', 'interrupted', 'paused'],
    explaining: ['drawing', 'knowledge_check', 'interrupted', 'paused', 'completed'],
    drawing: ['explaining', 'knowledge_check', 'interrupted', 'paused'],
    knowledge_check: ['explaining', 'intro', 'interrupted', 'paused', 'completed'],
    paused: ['explaining', 'drawing', 'interrupted', 'completed'],
    interrupted: ['resuming', 'paused'],
    resuming: ['explaining', 'drawing'],
    completed: ['idle'],
  };

  public static canTransition(from: TeachingStatus, to: TeachingStatus): boolean {
    const allowed = this.validTransitions[from] || [];
    return allowed.includes(to);
  }

  public static transition(session: TeachingSession, newStatus: TeachingStatus): TeachingSession {
    if (!this.canTransition(session.status, newStatus)) {
      console.warn(`[FSM] Invalid state transition requested from ${session.status} to ${newStatus}`);
    }
    session.status = newStatus;
    session.lastActiveAt = new Date().toISOString();
    return session;
  }
}
