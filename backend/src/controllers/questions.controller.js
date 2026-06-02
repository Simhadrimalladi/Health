const { getRelevantQuestions } = require('../questions/displayEngine');
exports.getRelevant = async (req, res) => res.json({ data: await getRelevantQuestions(req.params.userId) });
