import { TeachingSession, InterruptionResult } from '@/types/teaching';
import { retrievalService } from '../rag/retrieval-service';
import { TeachingStateMachine } from './teaching-state-machine';
import { db } from '@/lib/db';

export interface HandleInterruptionParams {
  sessionId: string;
  studentQuestion: string;
  currentSectionIndex: number;
  currentActionIndex: number;
  boardElements?: any[];
}

export class InterruptionService {
  public async handleInterruption(params: HandleInterruptionParams): Promise<InterruptionResult> {
    const { sessionId, studentQuestion, currentSectionIndex, currentActionIndex, boardElements } = params;
    const session = db.getTeachingSessionById(sessionId);

    if (!session) {
      throw new Error(`Teaching session ${sessionId} not found`);
    }

    // 1. Snapshot and Pause Session in DB
    TeachingStateMachine.transition(session, 'interrupted');
    session.currentSectionIndex = currentSectionIndex;
    session.currentActionIndex = currentActionIndex;
    if (boardElements) {
      session.boardElements = boardElements;
    }
    session.activeQuestion = studentQuestion;

    // 2. Query Grounded RAG with student question + current section title context
    const currentSection = session.lesson?.sections[currentSectionIndex];
    const contextPrompt = currentSection
      ? `Lesson Section: "${currentSection.title}" (Concept: ${currentSection.concept}). Student asks: ${studentQuestion}`
      : studentQuestion;

    const groundedResponse = await retrievalService.retrieveAndAnswer({
      query: contextPrompt,
      topK: 3,
    });

    // 3. Record in conversation history
    session.conversationHistory.push({
      id: `turn-s-${Date.now()}`,
      role: 'student',
      content: studentQuestion,
      timestamp: new Date().toISOString(),
      isInterruption: true,
    });

    session.conversationHistory.push({
      id: `turn-t-${Date.now()}`,
      role: 'teacher',
      content: groundedResponse.answer,
      citations: groundedResponse.citations,
      timestamp: new Date().toISOString(),
      isInterruption: true,
    });

    session.lastRetrievedSources = groundedResponse.citations;
    db.saveTeachingSession(session);

    return {
      interruptionId: `int-${Date.now()}`,
      answer: groundedResponse.answer,
      citations: groundedResponse.citations,
      suggestedFollowUps: [
        'How does this relate to the previous step on the board?',
        'What instruments measured this data?',
      ],
      savedState: {
        sectionIndex: currentSectionIndex,
        actionIndex: currentActionIndex,
        boardElementCount: session.boardElements.length,
      },
    };
  }
}

export const interruptionService = new InterruptionService();
