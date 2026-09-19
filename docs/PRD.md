# Product Requirement Document (PRD) • Agentic RAG Studio

## 1. Executive Summary & Problem Statement
The client requires an intermediate-to-expert AI Full Stack Engineer to build and optimize an AI-powered web application incorporating robust RAG (Retrieval-Augmented Generation) pipelines, multi-agent workflows, and reliable backend services using Python/FastAPI and React/Next.js.

### Target Objectives
- Establish high-performance, deterministic document ingestion, embedding, and vector search.
- Construct modular, reliable multi-agent workflows that can execute tasks in parallel with validation gates.
- Create a premium, Stripe-style responsive dashboard to search documents and monitor pipeline operations.
- Ensure production readiness with multi-provider AI fallback, prompt injection security, and connection pooling.

---

## 2. Core Architectural Principles
- **Separation of Concerns**: Non-deterministic layers (LLM responses) are strictly bounded by deterministic validation layers (citation verification, schemas).
- **Multi-Provider Fallback**: If OpenAI experiences a primary outage or rate limit (429), the gateway shifts to Google Gemini in under 500ms.
- **Data Privacy & Governance**: Ingress validation scrubs PII and intercepts prompt injections before query processing.
- **Zero-Install Local Verification**: All services ship containerized via Docker Compose with standard PgVector storage.

---

## 3. System Scope
### In-Scope
- **FastAPI Backend**: Document ingestion, text chunking, and metadata parsing.
- **Supabase/PgVector Database**: Embedded vector indexing with hybrid dense/sparse (BM25) search.
- **Reranking Engine**: Cohere/BGE cross-encoder re-ranking to isolate the top 3 most relevant context chunks.
- **Multi-Agent Python Workflows**: Agentic orchestration with validator checking and consensus gates.
- **Stripe-Style React Frontend**: High-fidelity dashboard, semantic smooth-scrolling, live telemetry charts, and an interactive query cockpit.
- **Security Guardrails**: Prompt injection filters and RBAC role-based document access controls.

### Out-of-Scope (Phase 1)
- Native PDF rendering libraries inside the Next.js process (handled via optimized canvas snapshots).
- Physical payment processing/Stripe billing integrations.

---

## 4. Technical Specifications & Data Models
### Vector Embeddings Data Model
```typescript
interface DocumentChunk {
  id: string;
  chunkIndex: number;
  section: string;
  pageNumber: number;
  content: string; // Plaintext snippet
  ocrConfidence: number; // For scanned papers
  vectorScore: number; // Dense cosine similarity
  bm25Score: number; // Sparse lexical score
  rerankScore: number; // Cross-encoder confidence
  sha256: string; // Cryptographic verification seal
  classification: "RESTRICTED" | "CONFIDENTIAL" | "PUBLIC" | "INTERNAL";
}
```

---

## 5. Pipeline & Processing Flow
```
[User Query] ➔ [PII Scrub & Prompt Injection Filter] ➔ [RBAC Gated Verification]
     │
     ▼
[Hybrid Search: PgVector Cosine + BM25 Lexical] ➔ [Cohere Reranker Index]
     │
     ▼
[Top 3 Chunk Context Snippets Sourced with Page & Section Citations]
     │
     ▼
[AI Gateway Router: Primary OpenAI Chat ➔ Failover Gemini 2.0 Flash]
     │
     ▼
[Authoritative Bullet-Point Answer with Cryptographic SHA-256 Signatures]
```

---

## 6. Non-Functional Requirements
- **Latency**: Sub-300ms vector retrieval; sub-2s total end-to-end RAG query completions.
- **SLA Reliability**: 99.99% gateway uptime via automated multi-provider fallback.
- **Type-Safety**: 100% strict TypeScript and Python Pydantic definitions.
- **Security Audit**: Zero-exposure global API keys; NIST AI RMF compliant guardrails.

---

## 7. Risks & Mitigation Strategies
- **Risk**: API Key Exhaustion or Outage.
  - *Mitigation*: Automated client-side rate limiting and dual-provider circuit breaker logic.
- **Risk**: Hallucinations / Diluted Answers.
  - *Mitigation*: Force the LLM to strictly answer using cited reference snippets, and verify chunk hashes.

---

## 8. Acceptance Criteria (Checked against client requirements)
- [x] Python & FastAPI backend services fully configured.
- [x] Document ingestion, embeddings, and vector search.
- [x] Multi-agent workflows with parallel execution steps.
- [x] High-fidelity React/Next.js frontend dashboard.
- [x] Fully responsive, professional Stripe-style design.
- [x] Multi-provider AI fallback (OpenAI & Gemini).
- [x] Zero lock-in Docker Compose deployment structures.
