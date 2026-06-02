const { KnowledgeNode, QuestionAnswer } = require('../models');
const { getRelevantQuestions } = require('./displayEngine');
const { roundScore } = require('../utils/scoring');

function detectContradictions(nodes) {
  const warnings = [];
  const sepsisNodes = nodes.filter(n => /sepsis/i.test(`${n.title} ${n.content}`));
  const hasPipTazo = sepsisNodes.some(n => /piperacillin|pip[- ]?tazo/i.test(n.content));
  const hasMeropenem = sepsisNodes.some(n => /meropenem/i.test(n.content));
  if (hasPipTazo && hasMeropenem) {
    warnings.push({
      topic: 'Sepsis empiric antibiotic',
      severity: 'MEDIUM',
      message: 'Possible contradiction: Pip-Tazo and Meropenem both appear as first-line sepsis choices. Keep both nodes but flag for HOD review.',
      authorityRule: 'HOD-created answer has priority until reviewed.'
    });
  }
  return warnings;
}

async function computeKnowledgeHealth(userId) {
  const relevant = await getRelevantQuestions(userId);
  const answers = await QuestionAnswer.find({ userId }).lean();
  const nodes = await KnowledgeNode.find({ orgId: relevant.user.orgId }).lean();

  const coverage = relevant.progress.totalApplicable
    ? (relevant.progress.answeredCount / relevant.progress.totalApplicable) * 100
    : 100;

  const activeNodes = nodes.filter(n => n.status === 'ACTIVE');
  const freshness = nodes.length ? (activeNodes.length / nodes.length) * 100 : 100;

  const represented = new Set(nodes.map(n => n.type));
  const balance = (represented.size / 4) * 100;

  const contradictions = detectContradictions(nodes);
  const consistency = nodes.length ? ((nodes.length - contradictions.length) / nodes.length) * 100 : 100;

  const byLevel = {};
  for (const q of relevant.questions) {
    byLevel[q.level] = byLevel[q.level] || { total: 0, answered: 0 };
    byLevel[q.level].total += 1;
    if (q.answered) byLevel[q.level].answered += 1;
  }

  const byType = nodes.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {});

  return {
    user: relevant.user,
    scores: {
      coverage: roundScore(coverage),
      freshness: roundScore(freshness),
      balance: roundScore(balance),
      consistency: roundScore(consistency),
      overall: roundScore((coverage + freshness + balance + consistency) / 4)
    },
    questionCoverage: byLevel,
    nodeTypeDistribution: byType,
    contradictions,
    answeredCount: answers.length,
    totalNodes: nodes.length
  };
}

module.exports = { computeKnowledgeHealth, detectContradictions };
