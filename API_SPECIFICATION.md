# POLAR SENSE AI — API Contracts & Specification

## 1. Grounded RAG & Question Answering

### `POST /api/ai/ask`
Answers arbitrary scientific queries grounded in repository documents.
* **Request Contract:**
  ```typescript
  interface AskRequest {
    query: string;
    stationFilter?: string; // 'BHARATI' | 'MAITRI' | 'HIMADRI' | 'INDARC'
    topK?: number;          // Default: 4
    conversationContext?: string;
  }
  ```
* **Response Contract:**
  ```typescript
  interface AskResponse {
    answer: string;
    citations: {
      sourceId: string;
      title: string;
      doi?: string;
      page: number;
      section: string;
      snippet: string;
      relevanceScore: number;
      stationCode?: string;
      provenanceUrl?: string;
    }[];
    confidenceScore: number;
    model: string;
    retrievedCount: number;
    latencyMs: number;
  }
  ```

---

## 2. AI Lesson Generation

### `POST /api/ai/lesson/generate`
Generates a structured, pedagogical lesson plan with blackboard directives.
* **Request Contract:**
  ```typescript
  interface GenerateLessonRequest {
    topic: string;
    learnerLevel: 'school' | 'undergraduate' | 'researcher';
    targetDurationMin: number;
    learningObjective?: string;
    sourceDocumentIds?: string[];
  }
  ```
* **Response Contract:**
  ```typescript
  interface GenerateLessonResponse {
    id: string;
    title: string;
    topic: string;
    learnerLevel: 'school' | 'undergraduate' | 'researcher';
    targetDurationMin: number;
    learningObjectives: string[];
    summary: string;
    sections: {
      id: string;
      orderIndex: number;
      title: string;
      concept: string;
      explanation: string;
      teacherScript: string;
      estimatedDurationSec: number;
      blackboardActions: {
        id: string;
        actionType: 'WRITE_TEXT' | 'DRAW_ARROW' | 'DRAW_BOX' | 'DRAW_CIRCLE' | 'HIGHLIGHT' | 'CLEAR_BOARD';
        orderIndex: number;
        payload: Record<string, any>;
        spokenTriggerPhrase?: string;
      }[];
      expectedQuestions: string[];
      sourceCitations: string[];
    }[];
    quiz: {
      id: string;
      question: string;
      options: string[];
      correctAnswerIndex: number;
      explanation: string;
      sourceReference?: string;
    }[];
  }
  ```

---

## 3. Teaching Room State Machine

### `POST /api/teaching/session`
Creates and initializes a new persistent classroom teaching session.
* **Request:** `{ "lessonId": string, "userId"?: string }`
* **Response:** `{ "id": string, "lessonId": string, "status": "intro", "currentSectionIndex": 0, "lesson": Lesson }`

### `GET /api/teaching/session/[sessionId]`
Fetches full session state for page refresh/restore.
* **Response:** `TeachingSession` object.

### `POST /api/teaching/session/[sessionId]/interrupt`
Pauses the active lesson, snapshots the blackboard, and retrieves grounded answers for the student's question.
* **Request Contract:**
  ```typescript
  interface InterruptRequest {
    studentQuestion: string;
    currentSectionIndex: number;
    currentActionIndex: number;
    boardElements?: any[];
  }
  ```
* **Response Contract:**
  ```typescript
  interface InterruptResponse {
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
  ```

### `POST /api/teaching/session/[sessionId]/resume`
Resumes teaching from the exact saved checkpoint.
* **Request:** `{}`
* **Response:** `TeachingSession` (status transitioned back to 'explaining').

### `POST /api/teaching/session/[sessionId]/advance`
Advances the lesson to the next section or triggers completion quiz.
* **Request:** `{}`
* **Response:** `TeachingSession` (incremented `currentSectionIndex`).

---

## 4. Knowledge Repository & Documents

### `GET /api/documents`
* **Query Parameters:** `q` (keyword), `type` (paper/report), `station` (BHARATI/MAITRI/etc.)
* **Response:** `Document[]` with semantic chunk counts and DOIs.

### `POST /api/documents`
* **Request Contract:**
  ```typescript
  interface IngestDocRequest {
    title: string;
    doi?: string;
    authors: string[];
    abstract: string;
    content: string;
    docType: 'peer_reviewed_paper' | 'expedition_report' | 'scientific_dataset';
    stationCode?: string;
    year: number;
    keywords: string[];
  }
  ```
* **Response:** `Document` (with generated semantic chunks).

---

## 5. Media Studio Dissemination

### `POST /api/media/generate`
* **Request Contract:**
  ```typescript
  interface GenerateMediaRequest {
    topic: string;
    documentIds: string[];
    targetFormats: ('web_article' | 'executive_brief' | 'social_thread' | 'infographic_spec' | 'video_script')[];
  }
  ```
* **Response:** `GeneratedContentItem[]` linked to source IDs.

---

## 6. Admin Telemetry

### `GET /api/admin/stats`
* **Response Contract:**
  ```typescript
  interface AdminStatsResponse {
    totalDocuments: number;
    totalChunks: number;
    totalStations: number;
    totalExpeditions: number;
    totalLessons: number;
    totalTeachingSessions: number;
    totalGeneratedMedia: number;
    verifiedCitationsCount: number;
  }
  ```
