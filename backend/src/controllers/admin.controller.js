const { v4: uuid } = require('uuid');
const { KnowledgeQuestion } = require('../models');
const { convertAnswerToNode } = require('../questions/answerConverter');
const { execFile } = require('child_process');
const path = require('path');
const ApiError = require('../utils/ApiError');

exports.addQuestion = async (req, res) => {
  const body = req.body || {};
  const required = ['questionText', 'typeHint', 'level', 'priority', 'targetHierarchyLevel'];
  for (const field of required) if (body[field] === undefined || body[field] === '') throw new ApiError(400, `${field} is required`);
  const id = body.id || `Q-LIVE-${uuid().slice(0, 8)}`;
  const question = await KnowledgeQuestion.create({
    id,
    orgId: body.orgId || 'supra',
    level: body.level,
    department: body.department || null,
    targetRole: body.targetRole || null,
    cohortTag: body.cohortTag || null,
    priority: Number(body.priority),
    questionText: body.questionText,
    typeHint: body.typeHint,
    targetHierarchyLevel: body.targetHierarchyLevel,
    importanceDefault: Number(body.importanceDefault || 0.9),
    placeholderText: body.placeholderText || '',
    isActive: true
  });
  res.status(201).json({ data: question, message: 'Question added as data; no code changes needed.' });
};

exports.answerQuestion = async (req, res) => {
  const payload = { userId: req.body.userId || 'U-MEERA', questionId: req.params.questionId, answerText: req.body.answerText, strictAutoOverride: req.body.strictAutoOverride };
  res.status(201).json({ data: await convertAnswerToNode(payload) });
};

exports.simulateMonth12 = async (req, res) => {
  const script = path.join(__dirname, '../seed/month12Seed.js');
  execFile('node', [script], (error, stdout, stderr) => {
    if (error) return res.status(500).json({ error: error.message, stderr });
    res.json({ message: 'Month-12 simulation completed', stdout });
  });
};
