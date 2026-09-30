# POLAR SENSE AI — Grounded AI & RAG Pipeline

## 1. Pipeline Overview
The Polar Sense AI pipeline guarantees factual integrity through a 10-stage verifiable grounding pipeline.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      1. INGESTION & PARSING                            │
│  Extract text, metadata, tables, DOIs, expeditions from PDF / HTML    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      2. SEMANTIC CHUNKING                              │
│  Sliding window (500 tokens, 100 token overlap) preserving section headers│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      3. DUAL-INDEX EMBEDDING                           │
│  • Dense Vector: 1536-dim semantic embeddings (Cosine Similarity)      │
│  • Sparse Inverted Index: BM25 keyword matching for polar terminology   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      4. HYBRID RETRIEVAL (Query)                       │
│  Score = (0.65 × Vector_Score) + (0.35 × BM25_Score)                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      5. RERANKING & FILTERING                          │
│  Deduplicate overlapping chunks, enforce station/expedition filters     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      6. GROUNDED PROMPT INJECTION                      │
│  Strict boundary system prompt instructing LLM to cite provided chunks │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      7. MULTI-PROVIDER LLM CALL                        │
│  GeminiProvider / OpenAIProvider / Deterministic DemoProvider          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      8. CITATION VERIFICATION ENGINE                   │
│  Verify all inline citation tags [Source: X, Page Y] against chunk map │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      9. CONFIDENCE & FALLBACK CHECK                    │
│  If confidence < 0.65, return graceful "Insufficient Repository Data"  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     10. STRUCTURED OUTPUT DELIVERY                     │
│  Return answer + verified citation objects + provenance links          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Citation Service Logic (`citation-service.ts`)
* Extracts citation references from LLM outputs.
* Matches cited IDs to actual repository documents in database.
* Augments the UI with rich citation tooltips, DOI links, and excerpt previews.
* Ensures hallucinated citations cannot be presented to the user.

---

## 3. Grounded System Prompt Template

```text
You are POLAR SENSE AI, an authoritative polar scientific research assistant.
You must answer questions strictly using the verified scientific context provided below.

RULES:
1. ONLY make factual assertions supported by the context snippets.
2. For every scientific claim, reference the source chunk using the format: [Source: <doc_id>, Section: <sec>, Page: <pg>].
3. If the provided context does not contain enough information to answer with confidence, state:
   "I could not find enough verified data in the Polar Sense knowledge repository to answer this specific question."
4. Do not speculate or invent scientific measurements, station coordinates, or author names.

EVIDENCE CONTEXT:
{{RETRIEVED_CHUNKS}}

USER QUERY:
{{USER_QUERY}}
```
