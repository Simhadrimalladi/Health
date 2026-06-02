const { convertAnswerToNode } = require('../questions/answerConverter');
exports.createAnswer = async (req, res) => res.status(201).json({ data: await convertAnswerToNode(req.body) });
