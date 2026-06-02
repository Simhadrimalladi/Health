# BRAHMO — Developer Assessment 2 Implementation

A full-stack developer implementation of **Knowledge Questions → Typed Nodes → Filtered Context → AI Session**.

The product demonstrates the assessment’s core rule:

```text
Admin-configured questions → doctor answers → regular knowledge_nodes → one Rules Engine → Composition Agent → AI session context
```

`question_answers` is only an audit/progress tracker. The answer text used by the AI is stored as a normal `knowledge_nodes` record, so question-generated knowledge, pre-existing organizational knowledge, and patient nodes all pass through one retrieval/composition path.

## What was implemented

- 30 seeded knowledge questions across HOSPITAL, DEPARTMENT, ROLE, and COHORT levels.
- Multi-level question targeting by org, department, role, cohort, and P0 priority.
- Answer → typed node conversion using `question.typeHint`, `importanceDefault`, hierarchy target, zone, derivability, source question, and creator.
- Duplicate-answer protection: editing the same user/question updates the existing active node instead of creating duplicate active knowledge.
- Simplified 5-check Rules Engine: org, department/cohort, hierarchy/patient relevance, active status, derivability threshold, and comparison mode.
- 8-block context composition under the 4,000-token budget with source badges and raw prompt preview.
- AI session with real OpenAI-compatible integration if configured, plus deterministic mock fallback for zero-cost demo.
- Three-level comparison: empty AI vs hospital/department context vs full role/cohort/patient context.
- Knowledge Health Score: coverage, freshness, balance, consistency, and contradiction warnings.
- Admin surprise-question flow: add a question as data, answer it, and verify it appears in the next session without code changes.
- Month-12 scalability simulation with 500 extra nodes.

## Stack

This ZIP uses the assessment’s **Node.js + React + LLM + Tailwind CSS** implementation path.

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose for fast local demo
- AI: OpenAI-compatible call with mock fallback
- Local DB: Docker Compose MongoDB

## Setup

```bash
cd brahmo-mern-assessment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up -d mongo
npm run install:all
npm run seed
npm run dev
```

Open:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

## Demo users

| User | Role | Department | Cohorts | Notes |
|---|---|---|---|---|
| `U-MEERA` | HOD | medicine | fasting_diabetic, warfarin_patient | Pre-answered senior knowledge |
| `U-ANANYA` | EDITOR | medicine | fasting_diabetic | First-login onboarding demo |
| `U-PRIYA` | VIEWER | ortho | none | Shows Ortho/Viewer filtering |
| `U-VIKRAM` | HOD | ortho | warfarin_patient | Extra HOD/Ortho comparison user |

## Required demo scenarios

### 1. Question → Node Pipeline

Go to **Onboarding**, choose a relevant question, and submit an answer.

The node preview shows:

- node type from `question.typeHint`
- importance from `question.importanceDefault`
- hierarchy target from `question.targetHierarchyLevel`
- `sourceQuestionId`
- storage as `knowledge_nodes`
- audit/progress entry in `question_answers`

### 2. Multi-Level Question Display

Select `U-ANANYA` on the dashboard, then open **Onboarding**. She sees only:

- hospital-wide questions
- Medicine department questions
- EDITOR role questions
- fasting_diabetic cohort questions

She does **not** see Ortho questions, VIEWER questions, or HOD-only questions. P0 questions appear first and must be completed before her first AI session is unlocked.

### 3. End-to-End AI Session

After completing Ananya’s P0 onboarding questions, open **Session** with `PAT-PADMA`.

The context panel shows:

- question-generated nodes
- patient-specific nodes
- pre-existing nodes
- rules-pass badges
- raw 8-block context string
- token usage under 4,000

The response references Supra-specific knowledge such as Ekadashi, Glimepiride skip rule, Metformin timing, and BG q4h monitoring.

### 4. Three-Level Quality Comparison

Open **Comparison** and run the default query.

- Level 1: generic diabetes advice.
- Level 2: Supra hospital/department/cohort knowledge.
- Level 3: full patient-specific answer for Mrs. Padma.

### 5. Surprise Question Test

Open **Admin**:

1. Add a new P0 hospital-wide question.
2. Answer it as Dr. Meera.
3. Run Ananya + Padma session.

The newly created question-derived node appears in the session through the same pipeline, with zero code changes.

### 6. Month-12 Scalability Test

```bash
npm run seed:month12
```

This inserts 500 extra nodes. The Rules Engine still narrows the graph to roughly 20–30 candidates, and the composer injects the highest-value subset under the token budget.

## Scripts

```bash
npm run install:all      # install root, backend, frontend deps
npm run seed             # load 30 questions, users, patients, pre-answered nodes
npm run dev              # backend + frontend
npm run build            # frontend production build
npm run lint             # backend syntax check + frontend build gate placeholder
npm run seed:month12     # add 500 scalability nodes
```

## API highlights

```text
GET  /api/users
GET  /api/patients
GET  /api/questions/relevant/:userId
POST /api/answers
GET  /api/nodes
GET  /api/nodes/context-candidates?userId=&patientId=
POST /api/session
POST /api/comparison
GET  /api/health-score?userId=
POST /api/admin/questions
POST /api/admin/questions/:questionId/answer
POST /api/admin/simulate-month12
```

## Validation run performed before packaging

```bash
npm run lint
npm run build
```

Both completed successfully in this environment after dependency install.

## Important implementation notes

- There is no separate “question answer context” pipeline.
- The `question_answers` collection is audit/progress only.
- Session launch is locked for first-login users until P0 questions are answered.
- New questions are data-driven records, not hardcoded IDs.
- Cohort nodes are injected only when they match the user/patient cohort context.
- Ortho nodes are excluded from Medicine user sessions by the same Rules Engine path.
