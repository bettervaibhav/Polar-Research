# POLAR SENSE AI — Database Schema Specification

## Overview
The schema is designed to represent complete relational provenance from scientific research papers down to atomic blackboard drawing actions and student interruption questions.

---

## Entity Relational Diagram (Conceptual)

```
[ResearchStation] ──< [Expedition] ──< [Document] ──< [DocumentChunk]
                                            │
                                            ├──< [GeneratedContent] ──< [ContentReview]
                                            │
                                            └──< [Lesson]
                                                    │
                                                    ├──< [LessonSection] ──< [LessonAction]
                                                    │
                                                    ├──< [QuizQuestion]
                                                    │
                                                    └──< [TeachingSession]
                                                                │
                                                                ├──< [TeachingEvent]
                                                                ├──< [TeachingQuestion]
                                                                └──< [QuizAttempt]
```

---

## Table Definitions

### 1. `users`
* `id`: `TEXT PRIMARY KEY` (UUID / CUID)
* `email`: `TEXT UNIQUE NOT NULL`
* `name`: `TEXT NOT NULL`
* `role`: `TEXT NOT NULL DEFAULT 'student'` (`student` | `educator` | `researcher` | `admin`)
* `createdAt`: `DATETIME DEFAULT CURRENT_TIMESTAMP`
* `updatedAt`: `DATETIME DEFAULT CURRENT_TIMESTAMP`

### 2. `research_stations`
* `id`: `TEXT PRIMARY KEY`
* `code`: `TEXT UNIQUE NOT NULL` (e.g., `BHARATI`, `MAITRI`, `HIMADRI`, `INDARC`, `DAKSHIN_GANGOTRI`)
* `name`: `TEXT NOT NULL`
* `region`: `TEXT NOT NULL` (`Antarctica` | `Arctic` | `Southern Ocean` | `Himalayas`)
* `latitude`: `REAL NOT NULL`
* `longitude`: `REAL NOT NULL`
* `establishedYear`: `INTEGER NOT NULL`
* `status`: `TEXT NOT NULL` (`active` | `seasonal` | `decommissioned`)
* `description`: `TEXT NOT NULL`
* `elevation`: `REAL`
* `image_url`: `TEXT`

### 3. `expeditions`
* `id`: `TEXT PRIMARY KEY`
* `stationId`: `TEXT REFERENCES research_stations(id)`
* `title`: `TEXT NOT NULL` (e.g., `43rd Indian Scientific Expedition to Antarctica (ISEA)`)
* `year`: `INTEGER NOT NULL`
* `season`: `TEXT NOT NULL` (`Austral Summer`, `Winterover`, etc.)
* `leader`: `TEXT NOT NULL`
* `objectives`: `TEXT NOT NULL`
* `organization`: `TEXT NOT NULL DEFAULT 'NCPOR / MoES'`

### 4. `documents`
* `id`: `TEXT PRIMARY KEY`
* `title`: `TEXT NOT NULL`
* `doi`: `TEXT UNIQUE`
* `authors`: `TEXT NOT NULL` (JSON array or comma-separated)
* `abstract`: `TEXT NOT NULL`
* `content`: `TEXT NOT NULL` (Full raw extracted text)
* `docType`: `TEXT NOT NULL` (`peer_reviewed_paper` | `expedition_report` | `scientific_dataset` | `policy_brief`)
* `stationId`: `TEXT REFERENCES research_stations(id)`
* `expeditionId`: `TEXT REFERENCES expeditions(id)`
* `year`: `INTEGER NOT NULL`
* `provenanceUrl`: `TEXT`
* `pdfUrl`: `TEXT`
* `status`: `TEXT NOT NULL DEFAULT 'approved'` (`draft` | `under_review` | `approved` | `archived`)
* `createdAt`: `DATETIME DEFAULT CURRENT_TIMESTAMP`

### 5. `document_chunks`
* `id`: `TEXT PRIMARY KEY`
* `documentId`: `TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE`
* `chunkIndex`: `INTEGER NOT NULL`
* `sectionTitle`: `TEXT`
* `pageNumber`: `INTEGER`
* `content`: `TEXT NOT NULL`
* `tokenCount`: `INTEGER NOT NULL`
* `embedding`: `TEXT` (Serialized vector for SQLite; `vector(1536)` for pgvector)
* `createdAt`: `DATETIME DEFAULT CURRENT_TIMESTAMP`

### 6. `lessons`
* `id`: `TEXT PRIMARY KEY`
* `title`: `TEXT NOT NULL`
* `topic`: `TEXT NOT NULL`
* `learnerLevel`: `TEXT NOT NULL` (`school` | `undergraduate` | `researcher`)
* `targetDurationMin`: `INTEGER NOT NULL`
* `learningObjectives`: `TEXT NOT NULL` (JSON array of strings)
* `summary`: `TEXT NOT NULL`
* `sourceDocumentIds`: `TEXT NOT NULL` (JSON array of Document UUIDs)
* `createdById`: `TEXT REFERENCES users(id)`
* `createdAt`: `DATETIME DEFAULT CURRENT_TIMESTAMP`

### 7. `lesson_sections`
* `id`: `TEXT PRIMARY KEY`
* `lessonId`: `TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE`
* `orderIndex`: `INTEGER NOT NULL`
* `title`: `TEXT NOT NULL`
* `concept`: `TEXT NOT NULL`
* `explanation`: `TEXT NOT NULL`
* `teacherScript`: `TEXT NOT NULL`
* `estimatedDurationSec`: `INTEGER NOT NULL`
* `expectedQuestions`: `TEXT` (JSON array of common student inquiries)
* `sourceCitations`: `TEXT` (JSON array of chunk and page references)

### 8. `lesson_actions`
* `id`: `TEXT PRIMARY KEY`
* `sectionId`: `TEXT NOT NULL REFERENCES lesson_sections(id) ON DELETE CASCADE`
* `orderIndex`: `INTEGER NOT NULL`
* `actionType`: `TEXT NOT NULL` (`WRITE_TEXT` | `DRAW_ARROW` | `DRAW_BOX` | `DRAW_CIRCLE` | `UNDERLINE` | `HIGHLIGHT` | `CLEAR_BOARD`)
* `payload`: `TEXT NOT NULL` (JSON structured visual coordinates & styling)
* `spokenTriggerPhrase`: `TEXT` (Sync point in teacher script)

### 9. `teaching_sessions`
* `id`: `TEXT PRIMARY KEY`
* `lessonId`: `TEXT NOT NULL REFERENCES lessons(id)`
* `userId`: `TEXT REFERENCES users(id)`
* `status`: `TEXT NOT NULL` (`in_progress` | `paused` | `interrupted` | `completed`)
* `currentSectionId`: `TEXT REFERENCES lesson_sections(id)`
* `currentActionId`: `TEXT REFERENCES lesson_actions(id)`
* `currentSpeechOffset`: `REAL NOT NULL DEFAULT 0.0`
* `progressPercent`: `INTEGER NOT NULL DEFAULT 0`
* `boardSnapshot`: `TEXT` (JSON representation of active canvas/SVG elements)
* `conversationHistory`: `TEXT NOT NULL DEFAULT '[]'` (JSON array of Q&A during session)
* `startedAt`: `DATETIME DEFAULT CURRENT_TIMESTAMP`
* `lastActiveAt`: `DATETIME DEFAULT CURRENT_TIMESTAMP`
* `completedAt`: `DATETIME`

### 10. `teaching_events`
* `id`: `TEXT PRIMARY KEY`
* `sessionId`: `TEXT NOT NULL REFERENCES teaching_sessions(id) ON DELETE CASCADE`
* `eventType`: `TEXT NOT NULL` (`START` | `SECTION_START` | `ACTION_EXECUTE` | `STUDENT_PAUSE` | `STUDENT_INTERRUPT` | `QUESTION_ANSWERED` | `RESUME` | `COMPLETE`)
* `eventData`: `TEXT` (JSON payload of event details)
* `timestamp`: `DATETIME DEFAULT CURRENT_TIMESTAMP`

### 11. `teaching_questions` (Interruption Log)
* `id`: `TEXT PRIMARY KEY`
* `sessionId`: `TEXT NOT NULL REFERENCES teaching_sessions(id) ON DELETE CASCADE`
* `sectionId`: `TEXT REFERENCES lesson_sections(id)`
* `studentQuestion`: `TEXT NOT NULL`
* `retrievedChunks`: `TEXT NOT NULL` (JSON array of evidence chunks used)
* `groundedAnswer`: `TEXT NOT NULL`
* `citations`: `TEXT NOT NULL` (JSON array of source citations)
* `confidenceScore`: `REAL NOT NULL`
* `timestamp`: `DATETIME DEFAULT CURRENT_TIMESTAMP`

### 12. `quiz_questions`
* `id`: `TEXT PRIMARY KEY`
* `lessonId`: `TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE`
* `question`: `TEXT NOT NULL`
* `options`: `TEXT NOT NULL` (JSON array of 4 choices)
* `correctAnswerIndex`: `INTEGER NOT NULL`
* `explanation`: `TEXT NOT NULL`
* `sourceReference`: `TEXT`

### 13. `generated_content` (Media Studio)
* `id`: `TEXT PRIMARY KEY`
* `contentType`: `TEXT NOT NULL` (`web_article` | `executive_brief` | `social_thread` | `infographic_spec` | `video_script`)
* `title`: `TEXT NOT NULL`
* `content`: `TEXT NOT NULL` (Markdown or structured JSON)
* `sourceDocumentIds`: `TEXT NOT NULL` (JSON array)
* `sourceChunkIds`: `TEXT NOT NULL` (JSON array)
* `modelUsed`: `TEXT NOT NULL`
* `status`: `TEXT NOT NULL DEFAULT 'draft'` (`draft` | `under_review` | `approved` | `published`)
* `createdById`: `TEXT REFERENCES users(id)`
* `createdAt`: `DATETIME DEFAULT CURRENT_TIMESTAMP`

### 14. `content_reviews`
* `id`: `TEXT PRIMARY KEY`
* `contentId`: `TEXT NOT NULL REFERENCES generated_content(id) ON DELETE CASCADE`
* `reviewerId`: `TEXT NOT NULL REFERENCES users(id)`
* `action`: `TEXT NOT NULL` (`approve` | `reject` | `request_changes`)
* `feedback`: `TEXT`
* `reviewedAt`: `DATETIME DEFAULT CURRENT_TIMESTAMP`
