const { KnowledgeNode } = require('../models');
const { getContextCandidates } = require('../pipeline/rulesEngine');
exports.listNodes = async (req, res) => {
  const filter = {};
  if (req.query.sourceQuestionId) filter.sourceQuestionId = req.query.sourceQuestionId;
  if (req.query.department) filter.department = req.query.department === 'null' ? null : req.query.department;
  if (req.query.type) filter.type = req.query.type;
  res.json({ data: await KnowledgeNode.find(filter).sort({ createdAt: -1 }).lean() });
};
exports.contextCandidates = async (req, res) => {
  res.json({ data: await getContextCandidates({ userId: req.query.userId, patientId: req.query.patientId || null }) });
};
