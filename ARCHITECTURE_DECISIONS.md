# POLAR SENSE AI — Architecture Decisions (SIH26063)

## 1. Context & Problem Statement
Polar science is critical to understanding global climate change, sea-level rise, and ocean-atmospheric circulation. However, polar datasets and expedition records (such as those from India's NCPOR stations: Bharati, Maitri, Himadri, IndARC) are often siloed, technically opaque to students, and under-utilized for public science communication.

**Polar Sense AI** is an integrated Polar Science Outreach, Knowledge Repository, and Media Dissemination Portal that turns raw research into grounded knowledge, adaptive AI lessons, a live interactive digital Teaching Room, and multi-format outreach media.

---

## 2. Key Architecture Decisions

### Decision 1: Single Unified Full-Stack Architecture (Next.js 15 App Router + TypeScript)
* **Rationale:** A monolithic repository with API routes and server actions provides rapid iteration for hackathon delivery, strict type-sharing between backend services and UI components, zero CORS friction, and simple single-command deployment.
* **Separation of Concerns:** UI components must *never* execute business logic or call external AI endpoints directly. All logic is isolated in a modular `services/` layer (AI, RAG, Teaching Engine, Lessons, Ingestion, Citations).

### Decision 2: Pluggable AI Provider Abstraction (`AIProvider`)
* **Rationale:** SIH prototypes often face network constraints or API quota exhaustion during live judging.
* **Design:** An `AIProvider` interface abstracts all LLM calls (`generateText`, `generateStructuredOutput`, `generateLesson`, `answerGroundedQuestion`).
* **Implementations:**
  * `GeminiProvider`: Native Gemini Flash/Pro models with structured JSON schemas.
  * `OpenAIProvider`: OpenAI GPT-4o / GPT-4o-mini implementation.
  * `DemoProvider`: Offline, fully deterministic polar science reasoning engine that parses actual RAG evidence and generates dynamic, grounded responses without requiring an active external API key.

### Decision 3: Relational Persistence with Vector Abstraction (SQLite + Prisma / Local VectorStore)
* **Rationale:** The system requires relational foreign keys (Stations → Expeditions → Documents → Chunks → Lessons → Teaching Sessions → Blackboard Actions) and persistent state across page reloads.
* **Design:** Relational schema supporting SQLite for instantaneous zero-config local development and testing, with a clean repository abstraction for smooth migration to PostgreSQL + `pgvector`.
* **Vector & Retrieval:** Hybrid retrieval combining Cosine Similarity dense vector search and BM25 token-level exact keyword matching.

### Decision 4: Deterministic, Resumable Teaching State Machine
* **Rationale:** The Teaching Room is the core differentiator. It cannot simply be a chatbot streaming text. It must model an actual classroom with an active teacher, a synchronized chalkboard, and student interruptions.
* **Design:** A discrete state machine (`IDLE` → `INTRO` → `EXPLAINING` → `BOARD_DRAWING` → `KNOWLEDGE_CHECK` → `NEXT_SECTION` → `COMPLETED`).
* **Interruption Handling:** When a student asks a question, the active state (`currentSectionId`, `currentActionId`, `boardSnapshot`, `speechOffset`) is saved to the database. The RAG engine answers the student's question using grounded evidence. On clicking *Continue*, the engine restores the exact action state without restarting the board or section.

### Decision 5: Structured Blackboard Action Protocol (SVG + Canvas Hybrid)
* **Rationale:** Static chalkboard images or uncoordinated canvas animations fail to communicate concepts effectively.
* **Design:** Blackboard contents are defined as structured, replayable action commands:
  * `WRITE_TEXT(x, y, text, size, color)`
  * `DRAW_ARROW(fromX, fromY, toX, toY, label)`
  * `DRAW_BOX(x, y, w, h, title)`
  * `DRAW_CIRCLE(x, y, r)`
  * `HIGHLIGHT(targetId)`
  * `CLEAR_BOARD()`
* SVG ensures sharp, responsive vector typography and diagram layout, while HTML5 Canvas provides authentic progressive chalk stroke rendering.

### Decision 6: Strict Citation & Hallucination Guardrails
* **Rationale:** Scientific dissemination requires 100% provenance.
* **Design:** The `citation-service.ts` validates that every claim corresponds to an extracted chunk from the repository. If retrieved evidence has confidence below threshold, the AI explicitly reports insufficient verified data rather than hallucinating.

---

## 3. Technology Matrix

| Layer | Selected Technology | Alternative Considered | Why Selected |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router, TypeScript) | React + Express separate servers | Single runtime, unified typing, streamlined API routes. |
| **Styling** | Tailwind CSS + Lucide Icons | Chakra UI / Material UI | Custom glassmorphism polar design system, zero bundle bloat. |
| **Client State** | Zustand | Redux Toolkit | Lightweight, minimal boilerplate for complex Teaching Room UI state. |
| **Database** | SQLite + Prisma ORM (pgvector ready) | Pure PostgreSQL container | Zero-setup local execution for judging + seamless Postgres deployability. |
| **Vector Search** | In-Memory / SQLite Cosine + BM25 | Pinecone / Qdrant | Zero external cloud dependency, runs anywhere offline. |
| **Speech** | Web Speech API + SpeechProvider | ElevenLabs only | Instant client-side TTS/STT fallback with pluggable cloud voice adapter. |
