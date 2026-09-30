# OmniBrief AI
### AI Content Transformation & Verification Engine
**Smart India Hackathon (SIH 2026) Prototype · Status: DEMO-COMPLETE**

---

## 1. Project Overview

Organizations, security teams, research institutes, and enterprises produce vast quantities of dense, unstructured technical documents—such as incident advisories, research papers, compliance audits, and policy briefs. Repurposing this material into channel-specific formats (executive summaries, social posts, presentations, security advisories, infographics, and video scripts) is traditionally manual, slow, fragmented, and prone to factual drift and AI hallucinations.

**OmniBrief AI** solves this content repurposing bottleneck. It ingests complex, multi-format source materials, standardizes them into a normalized ground truth model, extracts a single canonical **Source Brief**, and uses structured Google Gemini AI models to synthesize **seven channel-specific communication artifacts** in parallel. Crucially, a post-generation **Factual Verification Layer** audits every factual assertion against the Source Brief using deterministic server-side scoring, identifying hallucinations, overbroad claims, or numerical discrepancies with 1-click artifact regeneration.

---

## 2. Core Transformation Pipeline

```
SOURCE
  │  (PDF, DOCX, TXT, MD, Images, Raw Text)
  ▼
INGESTION
  │  (Page Demarcation, Scanned Density Check, Gemini Vision OCR, Table Extraction)
  ▼
NORMALIZED SOURCE
  │  (Standardized Content, Extracted Tables, Visual Elements, Diagnostic Warnings)
  ▼
CANONICAL SOURCE BRIEF
  │  (Single Ground Truth Anchor, Atomic Claims, Verbatim Quotes, Uncertainties)
  ▼
7 ARTIFACT GENERATORS
  │  (Parallel Fan-Out via Structured Zod Schemas & Concurrency Pacing)
  ▼
FACTUAL VERIFICATION
  │  (Claim Audit against Brief, 5 Classification Statuses, Deterministic Scoring)
  ▼
RESULTS STUDIO
     (Interactive 7-Format Viewer, Claim Citation Chips, Audit Drawer, 1-Click Regeneration)
```

---

## 3. Key Capabilities

- **Multi-Format Ingestion**: Ingests multi-page PDFs, Microsoft Word (`.docx`), plain text (`.txt`, `.md`), high-resolution images (`.png`, `.jpg`, `.jpeg`, `.webp`), and direct raw text.
- **Page-Aware PDF Extraction**: Preserves page boundaries (`--- Page X ---`) to enable granular citation down to specific document pages.
- **Scanned & Low-Text Document Detection**: Evaluates character density per page (< 50 chars/page) and flags scanned or image-heavy documents with diagnostic warnings rather than failing.
- **Multimodal Gemini Vision OCR**: Deep multimodal visual understanding of document images, infographics, and architecture diagrams via Gemini's native vision capabilities.
- **Structured Table Extraction**: Detects tabular structures and preserves exact column headers and numerical values without rounding or alteration.
- **Visual & Chart Understanding**: Categorizes visual elements (charts, diagrams, flowcharts) and extracts analytical descriptions of depicted trends and architectures.
- **Canonical Source Brief**: Establishes a single, immutable intermediate ground truth layer anchoring all downstream generation.
- **Claim Traceability**: Extracts atomic `keyClaims` with unique identifiers (`CLAIM-01`, `CLAIM-02`), confidence scores, and exact `verbatimSourceQuote` strings.
- **Structured AI Generation**: Uses Gemini with strict Zod schema validation to eliminate JSON formatting failures.
- **Automated Factual Verification**: Audits generated claims against the Source Brief to detect unsupported assertions, contradictions, or hallucinations.
- **Deterministic Server-Side Scoring**: The AI classifies findings; the server deterministically calculates the final verification score using fixed mathematical weights.
- **1-Click Artifact Regeneration**: Enables instant regeneration and re-auditing of any artifact flagged with unsupported claims.

---

## 4. The 7 Generated Artifacts

OmniBrief AI synthesizes seven tailored communication formats from the single Source Brief:

1. **Executive Summary**: Strategic briefing for C-suite and leadership featuring a high-impact TL;DR, key takeaways, strategic implications, action items, and claim link citations.
2. **LinkedIn Post**: Professional thought-leadership post structured with an engaging hook, scannable bullet points, call-to-action, relevant hashtags, and cited claim IDs.
3. **X / Twitter Thread**: Numbered microblogging thread strictly enforcing 280-character limits per tweet, sequential thread ordering (`1/X`, `2/X`), and claim citations.
4. **Advisory**: Formal operational alert with colored severity classification (`critical`, `high`, `medium`, `low`, `informational`), target audience, threat synopsis, and numbered mitigation action checklist.
5. **Infographic Specification**: High-impact information design layout featuring Hero KPI stat cards, process flow nodes, visual component descriptions, and core takeaways.  
   *(Note: This is an information design specification for graphic designers, not an automatically exported final image canvas).*
6. **Presentation Deck**: Complete 16:9 slide deck with structured slide titles, concise bullet points, and an expandable speaker notes drawer for presenters.
7. **Video Package**: Production-ready video storyboard featuring scene-by-scene timestamps, continuous narration script, on-screen text, subtitle streams, and camera/visual direction guidelines.  
   *(Note: This is a complete production package for video editors and creators, not an automatically rendered MP4 video file).*

---

## 5. System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (client/)                              │
│  - React 18 + TypeScript + Vite                                        │
│  - Tailwind CSS + Lucide Icons                                         │
│  - Zustand Global State Management (useAppStore.ts)                    │
│  - Multi-page App Shell: Dashboard, New Transformation, Results Studio │
│  - Interactive Verification Audit Modal & Source Brief Inspector       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON / Multipart
                                    ▼ (Vite Proxy: /api -> port 3001)
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (server/)                               │
│  - Node.js + Express + TypeScript                                      │
│  - Google GenAI SDK (@google/genai)                                    │
│  - Extraction Service: pdf-parse v2, mammoth, buffer parsing           │
│  - Multer Memory Storage (in-memory buffer, zero disk writes)          │
│  - Zod Schemas for request, brief, artifact, and verification validation│
│  - Deterministic Verification Scoring Engine                           │
│  - Concurrency Worker Pool (concurrency: 2, 400ms delay)               │
└────────────────────────────────────────────────────────────────────────┘
```

### Why the Canonical Source Brief Architecture?
In traditional generative workflows, each output is generated directly from raw source material. This leads to **cross-channel divergence**: the executive summary might emphasize one set of numbers while the advisory contradicts them, and the social post might hallucinate an ungrounded metric.

OmniBrief AI decouples ingestion from generation:
1. **Source ➔ Source Brief**: The raw material is distilled once into an immutable, canonical ground truth representation with atomic claim IDs and verbatim quotes.
2. **Source Brief ➔ 7 Artifacts**: All downstream generators are strictly bound to the Source Brief.
3. **Artifacts ➔ Verification**: The verification engine audits each output strictly against the Source Brief, guaranteeing cross-channel factual coherence.

---

## 6. Backend API Endpoints

The backend exposes the following RESTful endpoints on `http://localhost:3001`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check returning `{ status: "ok" }`. |
| `POST` | `/api/source/ingest` | Ingests multipart document upload (PDF, DOCX, TXT, image) or JSON raw text; returns `NormalizedSource`. |
| `POST` | `/api/source/preview-multimodal` | Previews extraction breakdown (tables, visual elements, page count, warnings) without running downstream pipeline. |
| `POST` | `/api/brief/generate` | Generates the canonical `SourceBrief` via Gemini, incorporating extracted tables and visual context. |
| `POST` | `/api/artifacts/generate-batch` | Generates requested communication artifacts in parallel using worker pool and Zod validation. |
| `POST` | `/api/artifacts/regenerate-one` | Regenerates a single specified artifact with targeted grounding prompts. |
| `POST` | `/api/artifacts/verify` | Audits a single artifact against the Source Brief and returns claim findings and deterministic score. |
| `POST` | `/api/artifacts/verify-batch` | Audits multiple artifacts in batch with failure isolation (`Promise.allSettled`). |

---

## 7. Google Gemini Configuration

- **Active Model**: `gemini-3.6-flash` (configured via `GEMINI_MODEL` in `server/.env`).
- **Candidate Fallback Chain**: If the primary model experiences transient high demand (503/429), the engine automatically falls back across:
  `gemini-3.6-flash` ➔ `gemini-3.5-flash` ➔ `gemini-3-flash-preview`.
- **API Key Security**: The Gemini API key is configured strictly server-side in `server/.env` and is **never** sent to the client browser or exposed in client bundles.

---

## 8. Installation & Setup

### Prerequisites
- [Bun](https://bun.sh/) (v1.0+ recommended) or Node.js (v18+)
- A Google Gemini API Key from Google AI Studio

### Step 1: Install Dependencies
From the repository root:
```bash
# Install server dependencies
cd server
bun install

# Install client dependencies
cd ../client
bun install
```

### Step 2: Configure Server Environment
Create `server/.env` with your configuration:
```env
# Google Gemini API Key (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# Configured Gemini Model
GEMINI_MODEL=gemini-3.6-flash

# Multimodal & Document Limits
MAX_MULTIMODAL_PAGES=5
MAX_IMAGE_SIZE_MB=10

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```
*(Do NOT commit your actual API key to version control).*

### Step 3: Run the Application
In separate terminal tabs:

**Terminal 1 (Backend Server):**
```bash
cd server
bun run dev
```
*Server starts on `http://localhost:3001`.*

**Terminal 2 (Frontend Client):**
```bash
cd client
bun run dev
```
*Client starts on `http://localhost:5173` with Vite proxy forwarding `/api` to port 3001.*

---

## 9. Recommended Live Demo Workflow

1. **Open the Application**: Navigate to `http://localhost:5173` in your browser.
2. **Start a Transformation**: Click **New Transformation** in the sidebar.
3. **Provide Source Material**:
   - Option A: Click **Load Sample India DPI Case Study** to instantly populate realistic source material.
   - Option B: Upload a multi-page PDF, Word document (`.docx`), plain text file, or diagram image.
4. **Inspect Multimodal Extraction**: Notice the **Multimodal Extraction Intelligence Card** displaying detected pages, tables, visual elements, extraction method, and confidence score.
5. **Configure Parameters**: Customize Target Audience (e.g. *CISOs & Security Operations*), Tone (e.g. *Urgent & Authoritative*), Language, and Detail Level.
6. **Select Target Outputs**: Check or uncheck any of the 7 output formats (all 7 selected by default).
7. **Execute Pipeline**: Click **Analyze & Generate**.
8. **Watch Pipeline Progression**: Observe live status badges progressing through *Source Ingestion* ➔ *Source Brief Analysis* ➔ *Generating Outputs* ➔ *Factual Verification*.
9. **Inspect Results Studio**:
   - Navigate across all 7 format tabs (Executive Summary, LinkedIn, X Thread, Advisory, Infographic, Presentation, Video Package).
   - View the verification score badge (e.g. `95% Verified`) and status pill on each artifact.
   - Click **View Audit** to inspect the claim-by-claim reasoning drawer.
   - Click **Inspect Canonical Source Brief** in the top navigation bar to examine the single ground truth anchor.
10. **Demonstrate 1-Click Regeneration**: Click **Regenerate Artifact** to demonstrate how an ungrounded artifact can be re-synthesized in real time.

---

## 10. Factual Verification & Scoring Model

The verification engine audits generated claims strictly against the canonical Source Brief. Each factual assertion in an artifact is classified into one of five standard statuses:

| Status | Definition | Mathematical Weight |
| :--- | :--- | :---: |
| `SUPPORTED` | Factually corroborated by explicit statements or table data in the Source Brief. | **1.0** |
| `PARTIALLY_SUPPORTED` | Broadly accurate but contains minor phrasing extrapolation without new claims. | **0.5** |
| `NEEDS_REVIEW` | Pertains to an identified gap or uncertainty documented in the Source Brief. | **0.5** |
| `UNSUPPORTED` | Factual assertion or metric not present anywhere in the Source Brief. | **0.0** |
| `CONTRADICTED` | Directly conflicts with facts or numbers established in the Source Brief. | **0.0** |

### Deterministic Score Calculation:
Gemini performs the semantic audit; the server deterministically calculates the final score:
$$\text{verification\_score} = \frac{\sum \text{weighted\_points}}{\text{total\_factual\_findings}}$$

*Scope boundary: The verification engine verifies factual alignment against the provided source document. It does not establish absolute external real-world truth.*

---

## 11. Multimodal Handling & Known Limitations

- **Image Ingestion**: PNG, JPG, and WEBP images are base64-encoded in-memory and processed directly by Gemini Multimodal Vision API for OCR and chart analysis.
- **PDF Processing**: Text-based PDFs preserve multi-page demarcations.
- **Scanned / Raster PDF Limitation**: Scanned PDFs with no selectable text layer are detected by character density (< 50 chars/page) and flagged with non-blocking diagnostic notices. Native server-side rasterization of multi-page scanned PDFs into individual page images is not currently implemented (direct image uploads receive full vision OCR).

---

## 12. Security & Data Protection

- **Zero Client Credential Exposure**: The Gemini API key is isolated in `server/.env`.
- **In-Memory File Processing**: Multer uses memory storage (`multer.memoryStorage()`); uploaded files are never written to the host filesystem.
- **Upload Restrictions**: 25MB general upload limit, 10MB image limit, and strict MIME type whitelist.
- **Prompt Injection Defense**: All user content is treated as untrusted, passive data enclosed in strict delimiters (`<<<SOURCE_MATERIAL>>>`, `<<<SOURCE_BRIEF_DATA>>>`).
- **Scope Note**: As a hackathon prototype, OmniBrief AI does not include user authentication, multi-tenant databases, or persistent cloud storage.

---

## 13. Automated Test Suites & Validation

All test suites run natively via Bun:

```bash
# Run Phase 5 Multimodal Ingestion Unit Test Suite (16 Tests)
bun server/tests/test_phase5_multimodal.ts

# Run Phase 4 Factual Verification Unit Test Suite (12 Tests)
bun server/tests/test_phase4_verification.ts

# Run Live Multimodal Integration Test Suite (4 Tests - requires Gemini API key)
bun server/tests/test_live_phase5_multimodal.ts

# Run Live Verification Integration Test Suite (4 Tests - requires Gemini API key)
bun server/tests/test_live_phase4_e2e.ts
```

### Verified Test Summary:
- `test_phase5_multimodal.ts`: **16/16 Passed** (extraction, page boundaries, scanned detection, tables, limits).
- `test_phase4_verification.ts`: **12/12 Passed** (deterministic scoring, boundary handling, finding statuses).
- `test_live_phase5_multimodal.ts`: **4/4 Passed** (live text ingestion, preview, image ingestion, multimodal brief generation).
- `test_live_phase4_e2e.ts`: **4/4 Passed** (live batch verification and hallucination auditing).
- Production Builds: `client` compiles in 1.10s (0 errors); `server` bundles in 80ms (0 errors).

---

## 14. Project Status & Future Scope

### Current Status: DEMO-COMPLETE (SIH 2026 Prototype)
OmniBrief AI is fully functional for live hackathon evaluation and demonstration. All five development phases have been implemented, connected, and verified.

### Future Scope (Post-Hackathon):
- Native server-side PDF rasterization for multi-page scanned PDF documents.
- Multi-user authentication and workspace sharing.
- Direct export integrations (export presentation to `.pptx`, export video script to `.srt`, direct CMS webhooks).
