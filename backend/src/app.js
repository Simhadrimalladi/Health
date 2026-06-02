const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');

const app = express();
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'BRAHMO backend', time: new Date().toISOString() }));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/patients', require('./routes/patients.routes'));
app.use('/api/questions', require('./routes/questions.routes'));
app.use('/api/answers', require('./routes/answers.routes'));
app.use('/api/nodes', require('./routes/nodes.routes'));
app.use('/api/session', require('./routes/session.routes'));
app.use('/api/comparison', require('./routes/comparison.routes'));
app.use('/api/health-score', require('./routes/health.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

app.use((req, res) => res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` }));
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error', details: err.details });
});

module.exports = app;
