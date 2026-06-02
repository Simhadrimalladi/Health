# Architecture Notes

## One pipeline

BRAHMO is intentionally a developer implementation, not a separate agent workflow. Questions are only the input surface. Once an answer is submitted, it becomes a regular `knowledge_nodes` record and flows through the same retrieval and composition path as every other knowledge node.

```text
knowledge_questions
  ↓ displayEngine selects relevant questions
answerConverter
  ↓ creates/updates a regular knowledge_nodes row/document
Rules Engine 5-check filter
  ↓ candidate nodes
Composition Agent 8-block context builder
  ↓ token-budgeted system prompt
AI Session / Comparison
```

## Collections

- `knowledge_questions`: admin-configured prompts across hospital, department, role, and cohort levels.
- `question_answers`: audit/progress tracker linking user + question + created node.
- `knowledge_nodes`: source of truth for injected knowledge context.
- `hierarchy_levels`, `users`, `patients`, `organizations`: scoping and session context.

## Question display engine

A user sees active questions where:

```text
same org AND (
  HOSPITAL
  OR DEPARTMENT matches user.department
  OR ROLE matches user.role
  OR COHORT in user.applicableCohorts and department matches/null
)
ORDER BY priority, level, id
```

P0 questions are mandatory before the first AI session can launch.

## Answer → node converter

The node type is automatically classified from `question.typeHint`. The answering doctor does not choose it manually.

The converter writes:

- `type`
- `importance`
- `hierarchyLevelId`
- `department`
- `zone`
- `derivabilityScore`
- `sourceQuestionId`
- `sourceType = QUESTION`
- `createdBy`
- `decayProfile`
- retrieval/injection weights

If the same user edits the same question answer, the existing node is updated. This prevents multiple active nodes for one user/question answer while preserving `question_answers` as the audit/progress link.

## Rules Engine

The simplified filter performs the assessment’s intended checks:

1. Organization match.
2. Department or hospital/global match.
3. Hierarchy/patient relevance.
4. Active status.
5. Low derivability score.
6. Cohort compatibility for cohort-derived question nodes.
7. Mode scope for comparison levels.

Every injected node carries `rulesPass` details so the UI can explain why it entered context.

## Composition Agent

Candidates are sorted using dual weights:

- retrieval/relevance weight for recall
- injection weight for token allocation

Compression strategy:

- constraints: full content
- patient high-importance nodes: full content
- top decisions: full content
- anti-patterns and facts: concise/compressed

The final output is an 8-block context string under the configured token budget.

## Innovation included

1. Heuristic classification warning when an answer’s language conflicts with `typeHint`.
2. Duplicate active-node prevention for edited answers.
3. Cohort-aware rules filtering.
4. P0 first-session lock.
5. Basic contradiction detection for sepsis antibiotic conflicts.
6. Month-12 seed with 500 nodes to demonstrate scale.
7. Knowledge Health Score across coverage, freshness, balance, and consistency.
