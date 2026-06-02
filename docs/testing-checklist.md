# Testing Checklist

- [ ] `docker compose up -d mongo`
- [ ] `npm run install:all`
- [ ] `npm run seed`
- [ ] Backend health: `http://localhost:5000/api/health`
- [ ] Frontend loads: `http://localhost:5173`
- [ ] `GET /api/questions/relevant/U-ANANYA` returns no Ortho questions
- [ ] `GET /api/questions/relevant/U-PRIYA` returns no Medicine questions
- [ ] Answering a question creates a `knowledge_nodes` record
- [ ] `question_answers` links to the new node id
- [ ] Session with Ananya + Padma returns context and AI response
- [ ] Context has question, patient, and global nodes
- [ ] Comparison shows Level 3 better than Level 2
- [ ] Health score returns four scores
- [ ] Admin surprise question can be added and answered
- [ ] `npm run seed:month12` adds 500 nodes
- [ ] Context remains under 4,000 tokens
