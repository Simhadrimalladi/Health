const { computeKnowledgeHealth } = require('../questions/healthScore');
exports.healthScore = async (req, res) => res.json({ data: await computeKnowledgeHealth(req.query.userId || 'U-ANANYA') });
