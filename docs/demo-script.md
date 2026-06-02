# 20–25 Minute Demo Script

## 1. Architecture — 2 minutes

Show `architecture.md` and explain one pipeline:

```text
questions → regular knowledge_nodes → rules engine → composer → AI context
```

Emphasize no separate answer filtering system.

## 2. Scenario 1: Question → Node — 3 minutes

1. Open Onboarding.
2. Select Dr. Ananya.
3. Answer `Q-R-EDITOR01`.
4. Show node preview: type, importance, hierarchy level, department, derivability score, sourceQuestionId.
5. Explain answer is stored in `knowledge_nodes`; `question_answers` only tracks progress.

## 3. Scenario 2: Right Questions, Right User — 4 minutes

1. Select Dr. Ananya.
2. Show hospital + medicine + EDITOR + fasting diabetic questions.
3. Point out Ortho, VIEWER, and HOD questions are absent.
4. Show P0 progress and P0 blocked/launchable status.

## 4. Scenario 3: Full Pipeline — 5 minutes

1. Open Session.
2. Select Dr. Ananya + Mrs. Padma.
3. Run default Ekadashi query.
4. Show context panel: node sources, token budget, pass reasons.
5. Point to Dr. Meera's fasting node and Padma patient nodes.
6. Show AI response mentioning skip Glimepiride, continue Metformin, BG q4h, break if BG < 70.

## 5. Scenario 4: Three-Level Comparison — 4 minutes

1. Open Comparison.
2. Run comparison.
3. Explain Level 1 is generic, Level 2 knows Supra protocol, Level 3 knows Padma's exact meds and schedule.

## 6. Innovation — 2 minutes

Show Health page and explain coverage/freshness/balance/consistency. Mention classification warning and month-12 simulation.

## 7. Surprise Test — 5 minutes

1. Open Admin.
2. Add P0 hospital-wide CONSTRAINT question.
3. Answer as Dr. Meera.
4. Run Ananya + Padma session.
5. The new node appears without code changes.

## Scalability Answer

The rules engine filters 500 nodes to 20–30 candidates. The composer then uses retrieval/injection weights and compression to fit the best nodes under 4,000 tokens.
