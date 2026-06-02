# API Reference

Base URL: `http://localhost:5000/api`

## Health

`GET /health`

## Users

`GET /users` lists seeded demo users.

`GET /users/:id` returns one user.

## Patients

`GET /patients` lists patient profiles.

## Questions

`GET /questions/relevant/:userId`

Returns active relevant questions grouped by HOSPITAL, DEPARTMENT, ROLE, COHORT. Includes progress and `canLaunchFirstSession`.

## Answers

`POST /answers`

```json
{
  "userId": "U-ANANYA",
  "questionId": "Q-R-EDITOR01",
  "answerText": "Always check allergies, current medications, renal function and pregnancy status."
}
```

Creates a regular `knowledge_nodes` document and tracks progress in `question_answers`.

## Nodes

`GET /nodes`

Optional filters: `type`, `department`, `sourceQuestionId`.

`GET /nodes/context-candidates?userId=U-ANANYA&patientId=PAT-PADMA`

Runs the simplified 5-check rules engine and returns candidates with pass reasons.

## Session

`POST /session`

```json
{
  "userId": "U-ANANYA",
  "patientId": "PAT-PADMA",
  "message": "What should I consider for Mrs. Padma's medication during her Ekadashi fast?"
}
```

Returns AI response, 8-block context, selected nodes, token usage, and source counts.

## Comparison

`POST /comparison`

Runs Level 1, Level 2, and Level 3 quality comparison.

## Health Score

`GET /health-score?userId=U-ANANYA`

Computes coverage, freshness, balance, and consistency.

## Admin

`POST /admin/questions` adds a new question as data.

`POST /admin/questions/:questionId/answer` answers it and creates a knowledge node.

`POST /admin/simulate-month12` adds 500 extra nodes.
