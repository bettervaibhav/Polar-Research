import { LearnerLevel, SourceCitation } from './index';

export type { LearnerLevel };

export type BlackboardActionType =
  | 'WRITE_TEXT'
  | 'DRAW_ARROW'
  | 'DRAW_LINE'
  | 'DRAW_BOX'
  | 'DRAW_CIRCLE'
  | 'UNDERLINE'
  | 'HIGHLIGHT'
  | 'CLEAR_BOARD';

export interface BlackboardActionPayload {
  x?: number;
  y?: number;
  text?: string;
  size?: number;
  color?: string;
  weight?: 'normal' | 'bold';
  from?: { x: number; y: number };
  to?: { x: number; y: number };
  fromLabel?: string;
  toLabel?: string;
  width?: number;
  height?: number;
  radius?: number;
  label?: string;
  targetActionId?: string;
  dashed?: boolean;
}

export interface BlackboardAction {
  id: string;
  actionType: BlackboardActionType;
  orderIndex: number;
  payload: BlackboardActionPayload;
  spokenTriggerPhrase?: string;
}

export interface LessonSection {
  id: string;
  orderIndex: number;
  title: string;
  concept: string;
  explanation?: string;
  teacherScript: string;
  estimatedDurationSec: number;
  blackboardActions: BlackboardAction[];
  expectedQuestions: string[];
  sourceCitations: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  sourceReference?: string;
}

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  learnerLevel: LearnerLevel;
  targetDurationMin: number;
  learningObjectives: string[];
  summary: string;
  sections: LessonSection[];
  quiz: QuizQuestion[];
  sourceDocumentIds: string[];
  createdAt: string;
}
