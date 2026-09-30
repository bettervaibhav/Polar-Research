# POLAR SENSE AI — Production Database Design (PostgreSQL / SQLite Compatible)

## 1. Schema Overview & Relational Map

The schema models complete scientific and pedagogical provenance from physical polar research stations down to atomic chalkboard strokes and student interruption questions.

```text
[research_stations] ──< [expeditions] ──< [documents] ──< [document_chunks]
         │                                      │
[research_topics]                               ├──< [media]
                                                ├──< [generated_content] ──< [content_reviews]
                                                └──< [lessons]
                                                         │
                                                         ├──< [lesson_sections] ──< [lesson_actions]
                                                         ├──< [quiz_questions] ──< [quiz_attempts]
                                                         └──< [lesson_sessions]
                                                                     │
                                                                     ├──< [lesson_events]
                                                                     └──< [questions] (Interruptions)
```

---

## 2. Table Specifications (All 16 Tables)

### 1. `users`
* `id`: `VARCHAR(64) PRIMARY KEY`
* `email`: `VARCHAR(255) UNIQUE NOT NULL`
* `name`: `VARCHAR(255) NOT NULL`
* `role`: `VARCHAR(32) NOT NULL DEFAULT 'student'` (`student` | `educator` | `researcher` | `admin`)
* `password_hash`: `VARCHAR(255)`
* `created_at`: `TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
* `updated_at`: `TIMESTAMP WITH TIME ZONE DEFAULT NOW()`

### 2. `research_stations`
* `id`: `VARCHAR(64) PRIMARY KEY`
* `code`: `VARCHAR(32) UNIQUE NOT NULL` (e.g. `BHARATI`, `MAITRI`, `HIMADRI`, `INDARC`, `DAKSHIN_GANGOTRI`)
* `name`: `VARCHAR(255) NOT NULL`
* `region`: `VARCHAR(64) NOT NULL` (`Antarctica` | `Arctic` | `Southern Ocean` | `Himalayas`)
* `latitude`: `DOUBLE PRECISION NOT NULL`
* `longitude`: `DOUBLE PRECISION NOT NULL`
* `established_year`: `INTEGER NOT NULL`
* `elevation_meters`: `DOUBLE PRECISION`
* `status`: `VARCHAR(32) NOT NULL DEFAULT 'active'` (`active` | `seasonal` | `decommissioned`)
* `description`: `TEXT NOT NULL`
* `focus_areas`: `JSONB NOT NULL DEFAULT '[]'`
* `active_instruments`: `JSONB NOT NULL DEFAULT '[]'`
* `current_temp_c`: `DOUBLE PRECISION`

### 3. `expeditions`
* `id`: `VARCHAR(64) PRIMARY KEY`
* `station_id`: `VARCHAR(64) REFERENCES research_stations(id) ON DELETE SET NULL`
* `title`: `VARCHAR(255) NOT NULL` (e.g. `43rd Indian Scientific Expedition to Antarctica`)
* `year`: `INTEGER NOT NULL`
* `season`: `VARCHAR(64) NOT NULL`
* `leader`: `VARCHAR(255) NOT NULL`
* `organization`: `VARCHAR(255) NOT NULL DEFAULT 'NCPOR / MoES'`
* `objectives`: `JSONB NOT NULL DEFAULT '[]'`
* `summary`: `TEXT NOT NULL`

### 4. `research_topics`
* `id`: `VARCHAR(64) PRIMARY KEY`
* `slug`: `VARCHAR(128) UNIQUE NOT NULL`
* `title`: `VARCHAR(255) NOT NULL`
* `category`: `VARCHAR(64) NOT NULL` (`Glaciology` | `Atmospheric Physics` | `Oceanography` | `Limnology` | `Biotechnology`)
* `description`: `TEXT NOT NULL`
* `keywords`: `JSONB NOT NULL DEFAULT '[]'`

### 5. `documents`
* `id`: `VARCHAR(64) PRIMARY KEY`
* `title`: `VARCHAR(512) NOT NULL`
* `doi`: `VARCHAR(128) UNIQUE`
* `authors`: `JSONB NOT NULL DEFAULT '[]'`
* `abstract`: `TEXT NOT NULL`
* `content`: `TEXT NOT NULL`
* `doc_type`: `VARCHAR(64) NOT NULL` (`peer_reviewed_paper` | `expedition_report` | `scientific_dataset` | `policy_brief`)
* `station_id`: `VARCHAR(64) REFERENCES research_stations(id) ON DELETE SET NULL`
* `station_code`: `VARCHAR(32)`
* `expedition_id`: `VARCHAR(64) REFERENCES expeditions(id) ON DELETE SET NULL`
* `year`: `INTEGER NOT NULL`
* `keywords`: `JSONB NOT NULL DEFAULT '[]'`
* `provenance_url`: `VARCHAR(512)`
* `pdf_url`: `VARCHAR(512)`
* `status`: `VARCHAR(32) NOT NULL DEFAULT 'approved'` (`draft` | `under_review` | `approved` | `archived`)
* `created_at`: `TIMESTAMP WITH TIME ZONE DEFAULT NOW()`

### 6. `document_chunks`
* `id`: `VARCHAR(64) PRIMARY KEY`
* `document_id`: `VARCHAR(64) NOT NULL REFERENCES documents(id) ON DELETE CASCADE`
* `chunk_index`: `INTEGER NOT NULL`
* `section_title`: `VARCHAR(255) NOT NULL`
* `page_number`: `INTEGER NOT NULL DEFAULT 1`
* `content`: `TEXT NOT NULL`
* `token_count`: `INTEGER NOT NULL`
* `keywords`: `JSONB NOT NULL DEFAULT '[]'`
* `embedding`: `vector(1536)` (or serialized vector string for SQLite)
* `created_at`: `TIMESTAMP WITH TIME ZONE DEFAULT NOW()`

### 7. `media` (Raw & Processed Media Assets)
* `id`: `VARCHAR(64) PRIMARY KEY`
* `document_id`: `VARCHAR(64) REFERENCES documents(id) ON DELETE SET NULL`
* `station_id`: `VARCHAR(64) REFERENCES research_stations(id) ON DELETE SET NULL`
* `media_type`: `VARCHAR(32) NOT NULL` (`photo` | `video` | `satellite_map` | `audio_clip` | `chart`)
* `title`: `VARCHAR(255) NOT NULL`
* `url`: `VARCHAR(512) NOT NULL`
* `caption`: `TEXT`
* `provenance_info`: `TEXT`
* `created_at`: `TIMESTAMP WITH TIME ZONE DEFAULT NOW()`

### 8. `lessons`
* `id`: `VARCHAR(64) PRIMARY KEY`
* `topic`: `VARCHAR(255) NOT NULL`
* `title`: `VARCHAR(255) NOT NULL`
* `learner_level`: `VARCHAR(32) NOT NULL` (`school` | `undergraduate` | `researcher`)
* `target_duration_min`: `INTEGER NOT NULL DEFAULT 10`
* `learning_objectives`: `JSONB NOT NULL DEFAULT '[]'`
* `summary`: `TEXT NOT NULL`
* `source_document_ids`: `JSONB NOT NULL DEFAULT '[]'`
* `created_by_id`: `VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL`
* `created_at`: `TIMESTAMP WITH TIME ZONE DEFAULT NOW()`

### 9. `lesson_sections`
* `id`: `VARCHAR(64) PRIMARY KEY`
* `lesson_id`: `VARCHAR(64) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE`
* `order_index`: `INTEGER NOT NULL`
* `title`: `VARCHAR(255) NOT NULL`
* `concept`: `TEXT NOT NULL`
* `explanation`: `TEXT NOT NULL`
* `teacher_script`: `TEXT NOT NULL`
* `estimated_duration_sec`: `INTEGER NOT NULL`
* `expected_questions`: `JSONB NOT NULL DEFAULT '[]'`
* `source_citations`: `JSONB NOT NULL DEFAULT '[]'`

### 10. `lesson_sessions` (Active/Persisted Teaching Sessions)
* `id`: `VARCHAR(64) PRIMARY KEY`
* `lesson_id`: `VARCHAR(64) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE`
* `user_id`: `VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL`
* `status`: `VARCHAR(32) NOT NULL` (`idle` | `intro` | `explaining` | `drawing` | `paused` | `interrupted` | `completed`)
* `current_section_index`: `INTEGER NOT NULL DEFAULT 0`
* `current_action_index`: `INTEGER NOT NULL DEFAULT 0`
* `completed_action_ids`: `JSONB NOT NULL DEFAULT '[]'`
* `board_elements`: `JSONB NOT NULL DEFAULT '[]'`
* `progress_percent`: `INTEGER NOT NULL DEFAULT 0`
* `active_question`: `TEXT`
* `started_at`: `TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
* `last_active_at`: `TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
* `completed_at`: `TIMESTAMP WITH TIME ZONE`

### 11. `lesson_events` (Session Telemetry)
* `id`: `VARCHAR(64) PRIMARY KEY`
* `session_id`: `VARCHAR(64) NOT NULL REFERENCES lesson_sessions(id) ON DELETE CASCADE`
* `event_type`: `VARCHAR(64) NOT NULL` (`SESSION_START` | `SECTION_ADVANCE` | `ACTION_DRAW` | `INTERRUPT` | `ANSWER_DELIVER` | `RESUME` | `COMPLETE`)
* `payload`: `JSONB NOT NULL DEFAULT '{}'`
* `created_at`: `TIMESTAMP WITH TIME ZONE DEFAULT NOW()`

### 12. `questions` (Student Interruption Log & Grounded RAG Answers)
* `id`: `VARCHAR(64) PRIMARY KEY`
* `session_id`: `VARCHAR(64) NOT NULL REFERENCES lesson_sessions(id) ON DELETE CASCADE`
* `section_id`: `VARCHAR(64) REFERENCES lesson_sections(id) ON DELETE SET NULL`
* `student_question`: `TEXT NOT NULL`
* `grounded_answer`: `TEXT NOT NULL`
* `retrieved_chunks`: `JSONB NOT NULL DEFAULT '[]'`
* `citations`: `JSONB NOT NULL DEFAULT '[]'`
* `confidence_score`: `DOUBLE PRECISION NOT NULL`
* `created_at`: `TIMESTAMP WITH TIME ZONE DEFAULT NOW()`

### 13. `quiz_questions`
* `id`: `VARCHAR(64) PRIMARY KEY`
* `lesson_id`: `VARCHAR(64) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE`
* `question`: `TEXT NOT NULL`
* `options`: `JSONB NOT NULL` (Array of 4 strings)
* `correct_answer_index`: `INTEGER NOT NULL`
* `explanation`: `TEXT NOT NULL`
* `source_reference`: `VARCHAR(255)`

### 14. `quiz_attempts`
* `id`: `VARCHAR(64) PRIMARY KEY`
* `session_id`: `VARCHAR(64) NOT NULL REFERENCES lesson_sessions(id) ON DELETE CASCADE`
* `user_id`: `VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL`
* `score`: `INTEGER NOT NULL`
* `total_questions`: `INTEGER NOT NULL`
* `answers_map`: `JSONB NOT NULL DEFAULT '{}'`
* `passed`: `BOOLEAN NOT NULL`
* `attempted_at`: `TIMESTAMP WITH TIME ZONE DEFAULT NOW()`

### 15. `generated_content` (Media Studio)
* `id`: `VARCHAR(64) PRIMARY KEY`
* `content_type`: `VARCHAR(32) NOT NULL` (`web_article` | `executive_brief` | `social_thread` | `infographic_spec` | `video_script`)
* `title`: `VARCHAR(255) NOT NULL`
* `data`: `JSONB NOT NULL` (Structured format payload)
* `source_document_ids`: `JSONB NOT NULL DEFAULT '[]'`
* `source_titles`: `JSONB NOT NULL DEFAULT '[]'`
* `model_used`: `VARCHAR(64) NOT NULL`
* `status`: `VARCHAR(32) NOT NULL DEFAULT 'draft'` (`draft` | `under_review` | `approved` | `published`)
* `created_by_id`: `VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL`
* `created_at`: `TIMESTAMP WITH TIME ZONE DEFAULT NOW()`

### 16. `content_reviews`
* `id`: `VARCHAR(64) PRIMARY KEY`
* `content_id`: `VARCHAR(64) NOT NULL REFERENCES generated_content(id) ON DELETE CASCADE`
* `reviewer_id`: `VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE`
* `action`: `VARCHAR(32) NOT NULL` (`approve` | `reject` | `request_changes`)
* `feedback`: `TEXT`
* `reviewed_at`: `TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
