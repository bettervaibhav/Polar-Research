# POLAR SENSE AI — REST & Streaming API Specification

## 1. Grounded RAG & AI Endpoints

### `POST /api/ai/ask`
Answers arbitrary scientific queries grounded in repository documents.
* **Request Body:**
  ```json
  {
    "query": "Why does Antarctic sea ice albedo matter for global climate?",
    "filterStation": "BHARATI",
    "filterDocType": "peer_reviewed_paper",
    "topK": 5
  }
  ```
* **Response:**
  ```json
  {
    "answer": "Antarctic sea ice exerts a profound cooling effect via the ice-albedo feedback...",
    "citations": [
      {
        "sourceId": "doc-antarctic-ice-01",
        "title": "Albedo Dynamics of Antarctic Fast Ice at Larsemann Hills",
        "doi": "10.1016/j.polar.2023.100912",
        "page": 7,
        "section": "3.2 Surface Radiative Flux",
        "snippet": "Fresh snow reflects up to 85% of incoming solar radiation...",
        "relevanceScore": 0.94
      }
    ],
    "confidenceScore": 0.92,
    "model": "gemini-1.5-flash",
    "latencyMs": 420
  }
  ```

---

## 2. Lesson Generation Endpoints

### `POST /api/ai/lesson/generate`
Generates a structured, pedagogical lesson with blackboard directives.
* **Request Body:**
  ```json
  {
    "topic": "Thermohaline Circulation & Antarctic Bottom Water (AABW)",
    "learnerLevel": "undergraduate",
    "targetDurationMin": 10,
    "learningObjective": "Understand dense water formation at Weddell and Ross Seas"
  }
  ```
* **Response:**
  ```json
  {
    "lessonId": "les-aabw-99",
    "title": "Antarctic Bottom Water & Global Ocean Conveyor",
    "topic": "Thermohaline Circulation & Antarctic Bottom Water (AABW)",
    "learnerLevel": "undergraduate",
    "targetDurationMin": 10,
    "learningObjectives": [
      "Explain how brine rejection increases sea water density",
      "Trace the path of AABW across the global ocean basins"
    ],
    "sections": [
      {
        "id": "sec-01",
        "orderIndex": 0,
        "title": "Brine Rejection & Ice Formation",
        "concept": "Ice crystals reject salt during freezing, creating hyper-dense brine",
        "teacherScript": "Welcome! Let us examine how freezing at the Antarctic surface drives the deep ocean.",
        "estimatedDurationSec": 90,
        "blackboardActions": [
          {
            "id": "act-01",
            "actionType": "WRITE_TEXT",
            "payload": { "x": 60, "y": 80, "text": "ANTARCTIC BOTTOM WATER (AABW)", "size": 24, "color": "#00f2fe" }
          },
          {
            "id": "act-02",
            "actionType": "DRAW_ARROW",
            "payload": { "fromX": 200, "fromY": 110, "toX": 200, "toY": 170, "label": "Freezing -> Brine Rejection" }
          }
        ],
        "sourceCitations": ["doc-ocean-01:Sec 2.1"]
      }
    ],
    "quiz": [
      {
        "id": "q-01",
        "question": "What is the primary mechanism that increases salinity during sea ice growth?",
        "options": ["Sublimation", "Brine Rejection", "Ekman Transport", "Geothermal Heating"],
        "correctAnswerIndex": 1,
        "explanation": "During freezing, ice excludes salt crystals, sinking cold dense brine to the seabed."
      }
    ]
  }
  ```

---

## 3. Teaching Room State Machine Endpoints

### `POST /api/teaching/session`
Initializes a new persistent teaching session for a given lesson.
* **Request:** `{ "lessonId": "les-aabw-99", "userId": "usr-01" }`
* **Response:** `{ "sessionId": "sess-44", "status": "in_progress", "currentSectionIndex": 0, "lesson": {...} }`

### `GET /api/teaching/session/[sessionId]`
Fetches the current state of a teaching session (for page refresh/restore).
* **Response:**
  ```json
  {
    "sessionId": "sess-44",
    "lessonId": "les-aabw-99",
    "status": "in_progress",
    "currentSectionIndex": 1,
    "currentActionIndex": 2,
    "progressPercent": 45,
    "boardSnapshot": [...],
    "conversationHistory": [...]
  }
  ```

### `POST /api/teaching/session/[sessionId]/interrupt`
Pauses the active lesson, stores blackboard snapshot, and retrieves grounded answers for the student's question.
* **Request:**
  ```json
  {
    "studentQuestion": "Wait, why doesn't this hyper-dense water freeze solid at the bottom?",
    "currentSectionId": "sec-01",
    "currentActionId": "act-02",
    "boardSnapshot": [...]
  }
  ```
* **Response:**
  ```json
  {
    "interruptionId": "int-77",
    "answer": "Great question! Deep ocean water is under immense hydrostatic pressure, which lowers the freezing point...",
    "citations": [
      {
        "title": "Deep Water Hydrography of the Weddell Gyre",
        "doi": "10.1029/2022JC018900",
        "page": 14,
        "snippet": "Hydrostatic pressure depression of freezing temperature prevents in-situ crystal nucleation below 2000m."
      }
    ],
    "suggestedFollowUps": ["How cold does AABW get?", "Where does it flow next?"],
    "resumableState": {
      "sectionId": "sec-01",
      "actionId": "act-02",
      "speechOffset": 32.4
    }
  }
  ```

### `POST /api/teaching/session/[sessionId]/resume`
Resumes teaching from the exact saved checkpoint.
* **Request:** `{ "sessionId": "sess-44" }`
* **Response:** `{ "status": "resumed", "resumeFromActionId": "act-02", "nextAction": {...} }`

---

## 4. Media Studio Endpoints

### `POST /api/media/generate`
Converts verified research into multi-format science dissemination artifacts.
* **Request:**
  ```json
  {
    "documentIds": ["doc-antarctic-ice-01"],
    "targetFormats": ["web_article", "social_thread", "video_script", "infographic_spec"]
  }
  ```
* **Response:**
  ```json
  {
    "generationId": "gen-88",
    "status": "draft",
    "outputs": {
      "webArticle": { "headline": "...", "body": "...", "readingTimeMin": 4 },
      "socialThread": { "tweets": ["1/5 ...", "2/5 ..."] },
      "videoScript": {
        "title": "The Giant Polar Heat Mirror",
        "durationSec": 60,
        "scenes": [
          { "time": "0:00 - 0:10", "visual": "Drone shot over Bharati station", "audio": "Did you know Antarctica has an invisible mirror?" }
        ]
      },
      "infographicSpec": {
        "keyStats": ["85% solar reflectance", "-1.8°C seawater freezing point"],
        "diagramDescription": "Comparison of open ocean absorption vs sea ice reflection"
      }
    },
    "provenanceLinks": ["doc-antarctic-ice-01"]
  }
  ```
