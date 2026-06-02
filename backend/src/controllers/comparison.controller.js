const { threeLevelComparison } = require('../comparison/threeLevel');
exports.compare = async (req, res) => res.json({ data: await threeLevelComparison(req.body) });
