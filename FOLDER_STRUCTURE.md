# POLAR SENSE AI — Production Folder Structure

```text
c:\Users\vaibh_42wyrow\OneDrive\Desktop\Polar Research Prototype V-1\
├── .env.example                            # Template environment configurations
├── .polar_db.json                         # Persistent local JSON relational store
├── package.json                           # Dependencies & scripts
├── tsconfig.json                          # TypeScript path mappings & strict compiler rules
├── tailwind.config.js                     # Arctic/Aurora theme colors & chalkboard typography
├── postcss.config.js                      # PostCSS tailwind runner
├── next.config.js                         # Next.js configuration
│
├── PRODUCTION_ARCHITECTURE.md             # Complete Production Architecture blueprint
├── DATABASE_DESIGN.md                     # Full 16-table relational schema specification
├── API_SPECIFICATION.md                   # REST and DTO contracts between frontend and backend
├── FOLDER_STRUCTURE.md                    # Detailed directory and file manifest
├── README.md                              # Project quickstart & executive overview
│
└── src/
    ├── app/                               # Next.js 15 App Router Routes & APIs
    │   ├── layout.tsx                     # Global layout with aurora background, navbar & footer
    │   ├── globals.css                    # Tailwind tokens, glassmorphism, chalk texture
    │   ├── page.tsx                       # Landing page with Grounded RAG quick-tester
    │   ├── repository/
    │   │   └── page.tsx                   # Module 1: Polar Knowledge Hub & Faceted Search
    │   ├── explorer/
    │   │   └── page.tsx                   # Module 5: Polar Explorer (Stations & Telemetry)
    │   ├── tutor/
    │   │   └── page.tsx                   # Module 3: AI Lesson Generator Studio
    │   ├── teaching-room/
    │   │   ├── page.tsx                   # Module 4: Teaching Room Launcher
    │   │   └── [sessionId]/
    │   │       └── page.tsx               # Module 4: Stateful Interactive AI Classroom
    │   ├── media/
    │   │   └── page.tsx                   # Module 6: Media Outreach Studio
    │   ├── admin/
    │   │   └── page.tsx                   # Module 7: Admin Ingestion & Governance Dashboard
    │   │
    │   └── api/                           # Backend REST API Routes
    │       ├── ai/
    │       │   ├── ask/route.ts           # Grounded RAG query endpoint
    │       │   └── lesson/
    │       │       └── generate/route.ts  # Structured lesson generation endpoint
    │       ├── teaching/
    │       │   └── session/
    │       │       ├── route.ts           # Create / list teaching sessions
    │       │       └── [sessionId]/
    │       │           ├── route.ts       # Get session / update state
    │       │           ├── interrupt/route.ts # Handle student interruption & Q&A
    │       │           ├── resume/route.ts    # Resume session from saved state
    │       │           └── advance/route.ts   # Advance lesson section
    │       ├── documents/
    │       │   └── route.ts               # Search & upload research documents
    │       ├── explorer/
    │       │   └── stations/route.ts      # Research stations telemetry endpoint
    │       ├── media/
    │       │   └── generate/route.ts      # Multi-format outreach generator
    │       └── admin/
    │           └── stats/route.ts         # Live database telemetry stats
    │
    ├── components/                        # Clean Modular React 19 UI Components
    │   ├── navbar.tsx                     # Global Header with active routes & SIH badge
    │   ├── footer.tsx                     # Scientific attribution & provenance footer
    │   ├── blackboard/
    │   │   └── blackboard-canvas.tsx      # SVG + Progressive Chalk drawing engine
    │   ├── teaching-room/
    │   │   ├── teacher-avatar.tsx         # AI Teacher persona & speech waves
    │   │   ├── interruption-modal.tsx     # Student interruption Q&A with citations
    │   │   └── quiz-modal.tsx             # Post-lesson evaluation quiz
    │   ├── knowledge/
    │   │   ├── document-detail-modal.tsx  # Document inspector with chunk preview
    │   │   └── citation-viewer.tsx        # Grounded citation badges & confidence scores
    │   ├── explorer/                      # Station & Expedition view components
    │   └── media/                         # Media Studio format viewers
    │
    ├── hooks/
    │   └── use-speech.ts                  # Web Speech API TTS & STT with text fallback
    │
    ├── stores/
    │   └── teaching-room-store.ts         # Zustand state machine for Teaching Room
    │
    ├── services/                          # Decoupled Domain Logic Layer
    │   ├── api-client.ts                  # Typed client-side API layer for components
    │   ├── ai/
    │   │   ├── ai-provider.ts             # Pluggable AIProvider interface
    │   │   ├── demo-provider.ts           # Offline deterministic grounded polar AI
    │   │   ├── gemini-provider.ts         # Google Gemini 1.5 Flash/Pro adapter
    │   │   ├── openai-provider.ts         # OpenAI GPT-4o adapter
    │   │   └── provider-factory.ts        # Dynamic provider selector
    │   ├── rag/
    │   │   ├── vector-store.ts            # Dual index (Cosine Similarity + BM25)
    │   │   ├── retrieval-service.ts       # Hybrid search orchestrator
    │   │   ├── chunking-service.ts        # Semantic paragraph chunking
    │   │   ├── citation-service.ts        # Strict citation validation & formatting
    │   │   └── ingestion-service.ts       # Document upload & chunk indexing
    │   ├── lessons/
    │   │   ├── lesson-generator.ts        # Multi-section pedagogical lesson generator
    │   │   └── lesson-service.ts          # Lesson matching & DB persistence
    │   ├── teaching/
    │   │   ├── teaching-engine.ts         # Session lifecycle manager
    │   │   ├── teaching-state-machine.ts  # FSM state transition rules
    │   │   ├── interruption-service.ts    # Interruption handler with grounded RAG
    │   │   └── resume-service.ts          # State restoration engine
    │   ├── media/
    │   │   └── media-generator.ts         # Outreach content synthesizer
    │   ├── explorer/
    │   │   └── explorer-service.ts        # Station & expedition queries
    │   └── documents/
    │       └── document-service.ts        # Repository query & telemetry service
    │
    ├── types/                             # Strict TypeScript Interfaces
    │   ├── index.ts                       # Core entities (Stations, Docs, Citations)
    │   ├── lesson.ts                      # Lesson, Sections, Blackboard Actions, Quiz
    │   ├── teaching.ts                    # TeachingSession, InterruptionResult
    │   └── media.ts                       # Multi-format Outreach Content Items
    │
    └── lib/                               # Core Infrastructure
        ├── db.ts                          # Relational persistent store
        ├── seed-data.ts                   # NCPOR research papers & stations dataset
        └── utils.ts                       # Class merger & styling helpers
```
