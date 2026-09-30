# POLAR SENSE AI — Interactive Teaching Engine & State Machine

## 1. Teaching State Machine Architecture

The AI Teaching Engine is modeled as a persistent, deterministic finite state machine (FSM). It executes structured lesson plans with blackboard visual cues, synchronized audio speech narration, and real-time interruption handling.

```
       ┌────────────────────────┐
       │         IDLE           │
       └───────────┬────────────┘
                   │ startSession(lessonId)
                   ▼
       ┌────────────────────────┐
       │         INTRO          │◄─────────────────────────────┐
       └───────────┬────────────┘                              │
                   │ loadSection(0)                            │
                   ▼                                           │
 ┌────────►┌────────────────────────┐                          │
 │         │       EXPLAINING       │                          │
 │         │ (Teacher Speaks/Narr)  │                          │
 │         └───────────┬────────────┘                          │
 │                     │ cueAction(actionId)                   │
 │                     ▼                                       │
 │         ┌────────────────────────┐                          │
 │         │     BOARD_DRAWING      │                          │
 │         │ (Animated Chalk/SVG)   │                          │
 │         └───────────┬────────────┘                          │
 │                     │ actionsComplete()                     │
 │                     ▼                                       │
 │         ┌────────────────────────┐                          │
 │         │    KNOWLEDGE_CHECK     │                          │
 │         │ (Mini Question/Check)  │                          │
 │         └───────────┬────────────┘                          │
 │                     │ nextSection()                         │
 │                     ▼                                       │
 └───No────┤ Has More Sections? ├───Yes────────────────────────┘
                   │
                   ▼ Complete
       ┌────────────────────────┐
       │       COMPLETED        │
       │ (Quiz & Certification) │
       └────────────────────────┘
```

---

## 2. Interruption & Resumption Lifecycle

When a student interrupts the AI teacher, the system captures a full execution snapshot:

```
[EXPLAINING / BOARD_DRAWING]
            │
            ▼ Student clicks "Ask Question" or submits speech
   ┌────────────────────────────────────────────────────────┐
   │ 1. PAUSE AUDIO & ANIMATION                            │
   │ 2. SNAPSHOT STATE:                                     │
   │    • sectionId: 'sec-02'                               │
   │    • actionIndex: 3 (out of 6)                         │
   │    • boardCanvasData: {...}                            │
   │    • speechOffsetMs: 14200                             │
   │ 3. PERSIST SNAPSHOT TO DATABASE                        │
   │ 4. TRANSITION FSM TO 'PAUSED_INTERRUPTED'              │
   └────────────────────────┬───────────────────────────────┘
                            │
                            ▼
   ┌────────────────────────────────────────────────────────┐
   │ 5. RETRIEVAL & ANSWER GENERATION:                      │
   │    • Query RAG with student question + section context │
   │    • Produce Grounded Answer with exact citations      │
   │    • Stream / render explanation in Q&A overlay        │
   └────────────────────────┬───────────────────────────────┘
                            │
                            ▼ Student clicks "Continue Lesson"
   ┌────────────────────────────────────────────────────────┐
   │ 6. RESTORE SNAPSHOT:                                   │
   │    • Keep Blackboard state intact (do not wipe/restart)│
   │    • Resume remaining board actions (actionIndex: 4..) │
   │    • Resume speech from natural sentence break         │
   │    • TRANSITION FSM TO 'RESUMING' -> 'EXPLAINING'      │
   └────────────────────────────────────────────────────────┘
```

---

## 3. Session State Persistence Schema

```typescript
export interface TeachingSessionState {
  sessionId: string;
  lessonId: string;
  status: 'idle' | 'intro' | 'explaining' | 'drawing' | 'interrupted' | 'resuming' | 'completed';
  currentSectionIndex: number;
  currentActionIndex: number;
  completedActionIds: string[];
  boardElements: BlackboardElement[];
  conversationHistory: {
    role: 'teacher' | 'student';
    content: string;
    citations?: SourceCitation[];
    timestamp: string;
  }[];
  progressPercent: number;
  lastUpdated: string;
}
```

If the user reloads the browser, `useTeachingSession` queries `GET /api/teaching/session/[sessionId]`, rehydrates the Zustand store, restores the blackboard vector elements, and enables instant resumption without restarting.
