import { create } from 'zustand';
import { TeachingSession, TeachingStatus, ConversationTurn } from '@/types/teaching';
import { Lesson, BlackboardAction } from '@/types/lesson';
import { apiClient } from '@/services/api-client';

interface TeachingRoomStore {
  session: TeachingSession | null;
  lesson: Lesson | null;
  status: TeachingStatus;
  currentSectionIndex: number;
  currentActionIndex: number;
  isPlaying: boolean;
  isInterrupted: boolean;
  interruptionLoading: boolean;
  activeAnswer: string | null;
  activeCitations: any[];
  error: string | null;

  // Actions
  setSession: (session: TeachingSession) => void;
  loadSession: (sessionId: string) => Promise<void>;
  startSession: (lessonId: string) => Promise<string>;
  togglePlay: () => void;
  executeNextAction: () => void;
  advanceSection: () => Promise<void>;
  interrupt: (question: string) => Promise<void>;
  resume: () => Promise<void>;
  completeLesson: () => void;
}

export const useTeachingRoomStore = create<TeachingRoomStore>((set, get) => ({
  session: null,
  lesson: null,
  status: 'idle',
  currentSectionIndex: 0,
  currentActionIndex: 0,
  isPlaying: false,
  isInterrupted: false,
  interruptionLoading: false,
  activeAnswer: null,
  activeCitations: [],
  error: null,

  setSession: (session) => {
    set({
      session,
      lesson: session.lesson || null,
      status: session.status,
      currentSectionIndex: session.currentSectionIndex,
      currentActionIndex: session.currentActionIndex,
      isInterrupted: session.status === 'interrupted',
    });
  },

  loadSession: async (sessionId: string) => {
    try {
      const session = await apiClient.getTeachingSession(sessionId);
      get().setSession(session);
    } catch (err: any) {
      set({ error: err.message || 'Failed to load session' });
    }
  },

  startSession: async (lessonId: string) => {
    try {
      const session = await apiClient.createTeachingSession(lessonId);
      get().setSession(session);
      set({ isPlaying: true });
      return session.id;
    } catch (err: any) {
      set({ error: err.message || 'Failed to start session' });
      throw err;
    }
  },

  togglePlay: () => {
    const { isPlaying, status } = get();
    set({ isPlaying: !isPlaying });
  },

  executeNextAction: () => {
    const { session, currentSectionIndex, currentActionIndex } = get();
    if (!session || !session.lesson) return;

    const currentSection = session.lesson.sections[currentSectionIndex];
    if (!currentSection) return;

    if (currentActionIndex < currentSection.blackboardActions.length) {
      set({ currentActionIndex: currentActionIndex + 1 });
    }
  },

  advanceSection: async () => {
    const { session } = get();
    if (!session) return;
    try {
      const updated = await apiClient.advanceSection(session.id);
      get().setSession(updated);
      set({ currentActionIndex: 0 });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  interrupt: async (question: string) => {
    const { session, currentSectionIndex, currentActionIndex } = get();
    if (!session) return;

    set({
      isPlaying: false,
      isInterrupted: true,
      interruptionLoading: true,
      error: null,
    });

    try {
      const result = await apiClient.interruptSession({
        sessionId: session.id,
        studentQuestion: question,
        currentSectionIndex,
        currentActionIndex,
      });

      set({
        interruptionLoading: false,
        activeAnswer: result.answer,
        activeCitations: result.citations,
        status: 'interrupted',
      });
    } catch (err: any) {
      set({
        interruptionLoading: false,
        error: err.message || 'Interruption error',
      });
    }
  },

  resume: async () => {
    const { session } = get();
    if (!session) return;

    try {
      const updated = await apiClient.resumeSession(session.id);
      set({
        session: updated,
        status: 'explaining',
        isInterrupted: false,
        activeAnswer: null,
        activeCitations: [],
        isPlaying: true,
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  completeLesson: () => {
    set({ status: 'completed', isPlaying: false });
  },
}));
