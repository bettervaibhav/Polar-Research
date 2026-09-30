import { Lesson, BlackboardAction } from './lesson';
import { SourceCitation } from './index';

export type TeachingStatus =
  | 'idle'
  | 'intro'
  | 'explaining'
  | 'drawing'
  | 'knowledge_check'
  | 'paused'
  | 'interrupted'
  | 'resuming'
  | 'completed';

export interface BlackboardRenderElement {
  id: string;
  type: string;
  props: Record<string, any>;
  renderedAt: number;
}

export interface ConversationTurn {
  id: string;
  role: 'teacher' | 'student';
  content: string;
  citations?: SourceCitation[];
  timestamp: string;
  isInterruption?: boolean;
}

export interface TeachingSession {
  id: string;
  lessonId: string;
  lesson?: Lesson;
  userId?: string;
  status: TeachingStatus;
  currentSectionIndex: number;
  currentActionIndex: number;
  completedActionIds: string[];
  boardElements: BlackboardRenderElement[];
  conversationHistory: ConversationTurn[];
  progressPercent: number;
  activeQuestion?: string;
  lastRetrievedSources?: SourceCitation[];
  startedAt: string;
  lastActiveAt: string;
  completedAt?: string;
}

export interface InterruptionResult {
  interruptionId: string;
  answer: string;
  citations: SourceCitation[];
  suggestedFollowUps: string[];
  savedState: {
    sectionIndex: number;
    actionIndex: number;
    boardElementCount: number;
  };
}
