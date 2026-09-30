# POLAR SENSE AI (SIH26063) — Official Hackathon Demonstration Script

> **Problem Statement:** SIH26063 — Integrated Polar Science Outreach, Knowledge Repository and Media Dissemination Portal  
> **Target Audience:** SIH Evaluation Jury, NCPOR / MoES Polar Scientists, Educators, and Students  
> **Duration:** 3–5 Minutes Live Demonstration

---

## ⏱️ Live Presentation Timeline

```
  0:00 ───▶ 0:30 ───▶ 1:00 ───▶ 1:30 ───▶ 2:00 ───▶ 2:30 ───▶ 3:00 ───▶ 3:20 ───▶ 3:40 ───▶ 4:00 ───▶ 4:30
Homepage   Knowledge   Explorer  Ask Polar  Generate   Teaching   Student    Citation    Quiz     Media    Admin
+ Problem  Repository   (Map)       AI       Lesson      Room    Interrupt  + Resume  Evaluation Studio  Governance
```

---

### [0:00] Homepage & Problem Statement
* **Screen:** [`http://localhost:3000/`](http://localhost:3000/)
* **Presenter Script:**
  > "Honorable Jury, India's polar research conducted by NCPOR across Antarctica (**Bharati**, **Maitri**) and the Arctic (**Himadri**, **IndARC**) generates world-class science. However, these crucial findings remain trapped in dense PDFs inaccessible to students and the public.
  > 
  > Welcome to **POLAR SENSE AI**: an integrated platform transforming polar research into grounded knowledge, interactive classrooms with animated blackboards, and public outreach media."

---

### [0:30] Polar Knowledge Repository
* **Action:** Click **"Explore Polar Research"** or navigate to [`/repository`](http://localhost:3000/repository).
* **Presenter Script:**
  > "Here in the **Polar Knowledge Hub**, research papers from Bharati and Maitri stations are stored with verified DOIs, authors, and metadata.
  > 
  > Each paper undergoes automated binary PDF ingestion, section detection, and semantic chunking with exact physical page tracking—ensuring mathematical traceability for RAG."

---

### [1:00] Polar Explorer (2D Interactive Projection)
* **Action:** Click **"Explorer"** in navbar or navigate to [`/explorer`](http://localhost:3000/explorer).
* **Presenter Script:**
  > "The **Polar Explorer** visualizes India's polar footprint. We can toggle between **Antarctica** (Bharati, Maitri) and the **Arctic** (Himadri, IndARC underwater mooring).
  > 
  > Selecting Bharati Station displays live telemetry, operational instruments, and active expeditions with 1-click **'Teach Me This'** handoffs."

---

### [1:30] Grounded Polar AI (Zero-Hallucination Assistant)
* **Action:** Click the floating **"Ask Polar AI"** drawer (or press `Ctrl+K` for Global Search).
* **Ask Question:** *"Why does Antarctic sea ice albedo matter for global climate?"*
* **Presenter Script:**
  > "Our AI is strictly grounded. Notice the retrieved answer cites Bharati Station pyranometer measurements (*albedo dropping from 0.84 to 0.48*).
  > 
  > Every factual statement is backed by verifiable document citations and page numbers. Unsupported questions outside our knowledge base are safely refused."

---

### [2:00] AI Lesson Generator
* **Action:** Click **"Generate Lesson"** on the Antarctic Sea Ice topic.
* **Presenter Script:**
  > "In seconds, the system synthesizes a complete pedagogical curriculum: learning objectives, an AI teacher lecture script, pop-quiz assessments, and synchronized **blackboard vector directives**."

---

### [2:30] Flagship AI Teaching Room & Animated Blackboard
* **Action:** Enter [`/teaching-room`](http://localhost:3000/teaching-room) (Flagship Lesson: *Antarctic Sea Ice Dynamics & The Ice-Albedo Feedback Loop*).
* **Presenter Script:**
  > "This is our core innovation: **The AI Teaching Room**.
  > 
  > On the left, our AI Educator provides spoken lectures and synchronized transcripts. In the center, the digital blackboard dynamically draws concepts, thermodynamic formulas, and diagrams at human writing speed."

---

### [3:00] Live Student Interruption
* **Action:** Click **"✋ Ask Question (Pause)"** or press `Q`.
* **Ask Question:** *"Why does fresh snow reflect more heat than melt ponds?"*
* **Presenter Script:**
  > "In a real classroom, students interrupt. Watch what happens:
  > The teacher instantly pauses, the exact stroke coordinate and audio timer are snapshotted in our finite state machine."

---

### [3:20] Grounded Citation & Exact Resume
* **Action:** Inspect the retrieved response with DOI & page citation, then click **"Continue Lesson"**.
* **Presenter Script:**
  > "The AI retrieves the exact evidence from the repository (*0.84 dry snow vs 0.48 melt ponds*).
  > 
  > When we click resume, teaching continues from the exact vector stroke—**no restart, no lost context**."

---

### [3:40] Interactive Quiz Evaluation
* **Action:** Complete the 2-question quiz at the end of the lesson.
* **Presenter Script:**
  > "Students take instant pop quizzes. The system scores understanding in real-time, displays scientific rationale, and saves the attempt to the database."

---

### [4:00] Media Outreach Studio
* **Action:** Navigate to [`/media-studio`](http://localhost:3000/media-studio).
* **Presenter Script:**
  > "With one click, our **Media Studio** transforms raw research into public outreach packages: Press Releases, Infographics, Social Media Threads, and Educational Briefs for national science dissemination."

---

### [4:30] Admin Governance & Telemetry (Demo Mode vs Live Gemini)
* **Action:** Navigate to [`/admin`](http://localhost:3000/admin).
* **Presenter Script:**
  > "Administrators have full oversight: live telemetry on indexed chunks, binary PDF uploads, lesson scripts, and editorial moderation.
  > 
  > The platform features seamless dual-mode capability: **Live Google Gemini Mode** for cutting-edge grounded LLM inference, and **100% Offline Demo Mode** for zero-dependency hackathon reliability."

---

## 🏆 Closing Statement

> **"POLAR SENSE AI does not simply store polar research.**  
> **It makes polar research discoverable, understandable, teachable and shareable."**  
> 
> *Research ➔ Knowledge ➔ AI ➔ Teaching ➔ Outreach*
