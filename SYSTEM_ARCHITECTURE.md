# POLAR SENSE AI — System Architecture & Layered Design

## Overview
Polar Sense AI is structured into four clearly separated layers: **Presentation Layer**, **Application / Service Layer**, **Data Layer**, and **AI Provider Layer**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 PRESENTATION LAYER                                     │
│  Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS + Lucide Icons         │
│                                                                                        │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌────────────────────────────┐  │
│  │ Knowledge Hub │ │ Polar Explorer│ │ Lesson Studio │ │ AI Teaching Room (Zustand) │  │
│  │ /repository   │ │ /explorer     │ │ /tutor        │ │ /teaching-room             │  │
│  └───────┬───────┘ └───────┬───────┘ └───────┬───────┘ └──────────────┬─────────────┘  │
│          │                 │                 │                        │                │
│  ┌───────┴───────┐ ┌───────┴───────┐ ┌───────┴───────┐ ┌──────────────┴─────────────┐  │
│  │ Media Studio  │ │Admin Dashboard│ │Blackboard UI  │ │ Interactive Voice Controls │  │
│  │ /media        │ │ /admin        │ │(SVG + Canvas) │ │ (Web Speech Provider)      │  │
│  └───────────────┘ └───────────────┘ └───────────────┘ └────────────────────────────┘  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ API Client (Typed DTOs)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              APPLICATION / SERVICE LAYER                               │
│  Core Domain Services (Separated, Independently Testable, Zero UI Dependencies)         │
│                                                                                        │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌────────────────────────────────┐  │
│  │ RAG & Retrieval      │ │ AI Lesson Engine     │ │ AI Teaching Engine             │  │
│  │ • IngestionService   │ │ • LessonGenerator    │ │ • TeachingStateMachine         │  │
│  │ • ChunkingService    │ │ • LessonService      │ │ • InterruptionService          │  │
│  │ • HybridRetrieval    │ │ • StructureValidator │ │ • ResumeService                │  │
│  │ • CitationService    │ │                      │ │ • SessionStatePersistence      │  │
│  └──────────┬───────────┘ └──────────┬───────────┘ └───────────────┬────────────────┘  │
│             │                        │                             │                   │
│  ┌──────────┴───────────┐ ┌──────────┴───────────┐ ┌───────────────┴────────────────┐  │
│  │ Polar Explorer Svc   │ │ Media Engine         │ │ Document & Metadata Svc        │  │
│  │ • StationRelator     │ │ • OutreachGenerator  │ │ • MetadataExtractor           │  │
│  │ • ExpeditionMapper   │ │ • ProvenanceLinker   │ │ • ContentReviewWorkflow        │  │
│  └──────────────────────┘ └──────────────────────┘ └────────────────────────────────┘  │
└──────────────────────┬────────────────────────────────────────────┬────────────────────┘
                       │                                            │
                       ▼                                            ▼
┌───────────────────────────────────────────┐  ┌─────────────────────────────────────────┐
│            DATA LAYER & STORAGE           │  │           AI PROVIDER LAYER             │
│                                           │  │                                         │
│  ┌─────────────────────────────────────┐  │  │  ┌───────────────────────────────────┐  │
│  │ Relational Database (Prisma / SQLite│  │  │  │ AIProvider Interface              │  │
│  │ - postgres/pgvector compatible)     │  │  │  │ • generateText()                  │  │
│  │                                     │  │  │  │ • generateStructuredOutput()      │  │
│  │ Entities:                           │  │  │  │ • generateLesson()                │  │
│  │ • Users & RBAC                      │  │  │  │ • answerGroundedQuestion()        │  │
│  │ • Documents & Chunks                │  │  │  │ • generateSpeech()                │  │
│  │ • Stations & Expeditions            │  │  │  └─────────────────┬─────────────────┘  │
│  │ • Lessons & Section Actions         │  │  │                    │                    │
│  │ • Teaching Sessions & Events        │  │  │  ┌─────────────────┼─────────────────┐  │
│  │ • Media Assets & Reviews            │  │  │  ▼                 ▼                 ▼  │
│  └──────────────────┬──────────────────┘  │  │ ┌─────────┐   ┌─────────┐   ┌─────────┐ │
│                     │                     │  │ │ Gemini  │   │ OpenAI  │   │  Demo   │ │
│  ┌──────────────────┴──────────────────┐  │  │ │Provider│   │Provider │   │Provider │ │
│  │ Hybrid Vector & Keyword Store       │  │  │ └─────────┘   └─────────┘   └─────────┘ │
│  │ • Dense Embedding Cosine Index      │  │  └─────────────────────────────────────────┘
│  │ • BM25 Inverted Token Index         │  │
│  └─────────────────────────────────────┘  │
└───────────────────────────────────────────┘
```

## Directory Structure Plan

```
src/
  app/
    api/
      ai/
        ask/route.ts
        lesson/generate/route.ts
      teaching/
        session/route.ts
        session/[sessionId]/route.ts
        session/[sessionId]/interrupt/route.ts
        session/[sessionId]/resume/route.ts
      documents/
        route.ts
        [id]/route.ts
      explorer/
        stations/route.ts
        expeditions/route.ts
      media/
        generate/route.ts
      admin/
        stats/route.ts
    page.tsx
    repository/page.tsx
    explorer/page.tsx
    tutor/page.tsx
    teaching-room/page.tsx
    teaching-room/[sessionId]/page.tsx
    media/page.tsx
    admin/page.tsx

  components/
    ui/                  # Button, Card, Dialog, Badge, Tabs, Progress, Slider, etc.
    navbar.tsx           # Global Navigation Header
    footer.tsx           # Scientific Disclaimer & Attribution Footer
    knowledge/           # DocumentCard, FacetedSearch, CitationViewer, PDFViewer
    explorer/            # DualPolarGlobe, StationInspector, ExpeditionTimeline
    tutor/               # LessonConfigurator, GroundedQAPanel, LessonPreview
    teaching-room/       # TeachingRoomView, TeacherAvatar, ActionControls, QAModal
    blackboard/          # BlackboardCanvas, SVGDiagramRenderer, ChalkEngine
    media/               # OutreachStudio, ArticleViewer, ScriptViewer, SocialThread
    admin/               # DocumentIngestionModal, MetadataEditor, TelemetryCard

  hooks/
    use-speech.ts
    use-blackboard.ts
    use-teaching-session.ts

  stores/
    teaching-room-store.ts

  services/
    ai/
      ai-provider.ts
      gemini-provider.ts
      openai-provider.ts
      demo-provider.ts
      provider-factory.ts
    rag/
      ingestion-service.ts
      chunking-service.ts
      embedding-service.ts
      retrieval-service.ts
      reranking-service.ts
      citation-service.ts
      vector-store.ts
    lessons/
      lesson-generator.ts
      lesson-service.ts
    teaching/
      teaching-engine.ts
      teaching-state-machine.ts
      interruption-service.ts
      resume-service.ts
    media/
      media-generator.ts
    documents/
      document-service.ts
    explorer/
      explorer-service.ts

  types/
    index.ts
    document.ts
    lesson.ts
    teaching.ts
    media.ts
    explorer.ts

  lib/
    db.ts                # Database Client
    seed-data.ts         # Authentic NCPOR / Polar Science Datasets
    utils.ts             # Styling & Formatter Utilities
```
