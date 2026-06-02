const { User, KnowledgeQuestion, QuestionAnswer } = require('../models');
const ApiError = require('../utils/ApiError');

const levelOrder = { HOSPITAL: 1, DEPARTMENT: 2, ROLE: 3, COHORT: 4 };

function isQuestionApplicable(question, user) {
  if (!question || !user) return false;
  if (question.orgId !== user.orgId || question.isActive === false) return false;
  if (question.level === 'HOSPITAL') return true;
  if (question.level === 'DEPARTMENT') return question.department === user.department;
  if (question.level === 'ROLE') return question.targetRole === user.role;
  if (question.level === 'COHORT') {
    const cohortOk = user.applicableCohorts?.includes(question.cohortTag);
    const deptOk = !question.department || question.department === user.department;
    return cohortOk && deptOk;
  }
  return false;
}

function groupByLevel(questions) {
  const grouped = { HOSPITAL: [], DEPARTMENT: [], ROLE: [], COHORT: [] };
  for (const q of questions) grouped[q.level].push(q);
  return grouped;
}

async function getRelevantQuestions(userId) {
  const user = await User.findOne({ id: userId }).lean();
  if (!user) throw new ApiError(404, `User not found: ${userId}`);

  const query = {
    orgId: user.orgId,
    isActive: true,
    $or: [
      { level: 'HOSPITAL' },
      { level: 'DEPARTMENT', department: user.department },
      { level: 'ROLE', targetRole: user.role },
      { level: 'COHORT', cohortTag: { $in: user.applicableCohorts || [] }, $or: [{ department: user.department }, { department: null }] }
    ]
  };

  const questions = await KnowledgeQuestion.find(query).lean();
  const answers = await QuestionAnswer.find({ userId: user.id }).lean();
  const answerByQuestion = new Map(answers.map(a => [a.questionId, a]));

  const enriched = questions
    .filter(q => isQuestionApplicable(q, user))
    .map(q => ({ ...q, answered: answerByQuestion.has(q.id), answer: answerByQuestion.get(q.id) || null }))
    .sort((a, b) => (a.priority - b.priority) || (levelOrder[a.level] - levelOrder[b.level]) || a.id.localeCompare(b.id));

  const totalApplicable = enriched.length;
  const answeredCount = enriched.filter(q => q.answered).length;
  const mandatory = enriched.filter(q => q.priority === 0);
  const mandatoryP0Answered = mandatory.filter(q => q.answered).length;

  return {
    user,
    questions: enriched,
    grouped: groupByLevel(enriched),
    progress: {
      totalApplicable,
      answeredCount,
      mandatoryP0Total: mandatory.length,
      mandatoryP0Answered,
      canLaunchFirstSession: mandatory.length === mandatoryP0Answered
    },
    queryUsed: "org match AND (HOSPITAL OR department=user.department OR role=user.role OR cohort IN user.applicableCohorts) ORDER BY priority, level"
  };
}

module.exports = { getRelevantQuestions, isQuestionApplicable, levelOrder };
