# POLAR SENSE AI — Blackboard Engine Specification

## 1. Engine Overview
The Polar Sense AI Blackboard Engine is a hybrid vector-stroke canvas engine designed to deliver a realistic digital chalkboard experience. It renders structured scientific concepts, hierarchical flowcharts, formulas, maps, and drawings synchronously with the AI teacher's narration.

---

## 2. Hybrid Architecture (SVG + Canvas)

* **SVG Layer (Top):** Crisp rendering of scientific text, interactive nodes, SVG icons, mathematical notation, bounding boxes, and connected arrows.
* **Canvas Stroke Layer (Base):** Progressive animated chalk dust particles, handwriting stroke simulations, dashed flow vectors, and tactile chalkboard texture.

```
┌────────────────────────────────────────────────────────┐
│  SVG Overlay (Vector Shapes, Sharp Text, Flowcharts)   │
├────────────────────────────────────────────────────────┤
│  Canvas Chalk Particle Layer (Progressive Strokes)     │
├────────────────────────────────────────────────────────┤
│  Textured Dark Slate Background (#0a1628 + Grain)      │
└────────────────────────────────────────────────────────┘
```

---

## 3. Blackboard Action Protocol

Every visual element rendered on the board is represented as an atomic, serializable JSON action:

### Supported Actions:
1. `WRITE_TEXT`
   ```json
   {
     "id": "act-01",
     "actionType": "WRITE_TEXT",
     "payload": {
       "x": 80,
       "y": 100,
       "text": "ANTARCTIC ICE SHEET DYNAMICS",
       "size": 22,
       "color": "#00f2fe",
       "weight": "bold",
       "font": "monospace"
     }
   }
   ```
2. `DRAW_ARROW`
   ```json
   {
     "id": "act-02",
     "actionType": "DRAW_ARROW",
     "payload": {
       "from": { "x": 120, "y": 140 },
       "to": { "x": 120, "y": 220 },
       "label": "Surface Melting",
       "color": "#38bdf8",
       "dashed": true
     }
   }
   ```
3. `DRAW_BOX`
   ```json
   {
     "id": "act-03",
     "actionType": "DRAW_BOX",
     "payload": {
       "x": 60,
       "y": 230,
       "width": 240,
       "height": 90,
       "label": "Subglacial Lakes (Lake Vostok)",
       "color": "#818cf8",
       "fill": "rgba(129, 140, 248, 0.1)"
     }
   }
   ```
4. `DRAW_CIRCLE` / `HIGHLIGHT`
   ```json
   {
     "id": "act-04",
     "actionType": "HIGHLIGHT",
     "payload": {
       "targetActionId": "act-01",
       "color": "rgba(250, 204, 21, 0.25)"
     }
   }
   ```
5. `CLEAR_BOARD`
   ```json
   {
     "id": "act-05",
     "actionType": "CLEAR_BOARD",
     "payload": { "wipeTransition": "fade" }
   }
   ```

---

## 4. Replayability & Resumability

* **Deterministic Snapshotting:** At any moment, the state is serialized as `BlackboardElement[]`.
* **No Loss on Interruption:** When interrupted during action $N$, actions $0 \dots N-1$ remain fully rendered on screen, while action $N$ resumes smoothly when playback continues.
