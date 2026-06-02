const { v4: uuid } = require('uuid');
const { User, KnowledgeQuestion, KnowledgeNode, QuestionAnswer, HierarchyLevel } = require('../models');
const ApiError = require('../utils/ApiError');
const { isQuestionApplicable } = require('./displayEngine');
const { classifyFromQuestion, deriveTitle, deriveZone, derivabilityScoreFor } = require('./classifier');

function computeWeights(type, importance, sourceType) {
  const typeBoost = { CONSTRAINT: 0.18, DECISION: 0.10, ANTI_PATTERN: 0.07, FACT: 0.03 }[type] || 0;
  const sourceBoost = sourceType === 'PATIENT' ? 0.10 : sourceType === 'QUESTION' ? 0.05 : 0;
  return {
    retrievalWeight: Number(Math.min(1, importance + typeBoost + sourceBoost).toFixed(2)),
    injectionWeight: Number(Math.min(1, importance + typeBoost + sourceBoost + 0.04).toFixed(2))
  };
}

function buildNodePatch({ user, question, answerText, hierarchyLevel, classified, nodeId = null }) {
  const sourceType = 'QUESTION';
  const weights = computeWeights(classified.finalType, classified.importance, sourceType);
  const id = nodeId || `N-${question.id}-${user.id}-${uuid().slice(0, 8)}`;
  return {
    id,
    orgId: user.orgId,
    hierarchyLevelId: question.targetHierarchyLevel,
    type: classified.finalType,
    title: deriveTitle(question, answerText),
    content: answerText.trim(),
    importance: classified.importance,
    zone: deriveZone(question, hierarchyLevel),
    status: 'ACTIVE',
    department: question.department || null,
    derivabilityScore: derivabilityScoreFor(question, answerText),
    sourceQuestionId: question.id,
    sourceType,
    createdBy: user.id,
    decayProfile: classified.decayProfile,
    retrievalWeight: weights.retrievalWeight,
    injectionWeight: weights.injectionWeight,
    compressionMode: classified.finalType === 'CONSTRAINT' ? 'FULL' : 'COMPRESSED'
  };
}

async function convertAnswerToNode({ userId, questionId, answerText, strictAutoOverride = false }) {
  if (!userId || !questionId || !answerText?.trim()) {
    throw new ApiError(400, 'userId, questionId and answerText are required');
  }

  const [user, question] = await Promise.all([
    User.findOne({ id: userId }).lean(),
    KnowledgeQuestion.findOne({ id: questionId }).lean()
  ]);
  if (!user) throw new ApiError(404, `User not found: ${userId}`);
  if (!question) throw new ApiError(404, `Question not found: ${questionId}`);
  if (!isQuestionApplicable(question, user)) throw new ApiError(403, `Question ${questionId} is not applicable to ${userId}`);

  const [hierarchyLevel, existingAnswer] = await Promise.all([
    HierarchyLevel.findOne({ id: question.targetHierarchyLevel }).lean(),
    QuestionAnswer.findOne({ questionId: question.id, userId: user.id }).lean()
  ]);

  const classified = classifyFromQuestion(question, answerText, strictAutoOverride);
  const patch = buildNodePatch({
    user,
    question,
    answerText,
    hierarchyLevel,
    classified,
    nodeId: existingAnswer?.nodeId || null
  });

  // One answer should point to one active node. If the doctor edits the answer,
  // update the existing node instead of creating duplicate active knowledge.
  let node;
  if (existingAnswer?.nodeId) {
    node = await KnowledgeNode.findOneAndUpdate(
      { id: existingAnswer.nodeId },
      patch,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  } else {
    node = await KnowledgeNode.create(patch);
  }

  const answer = await QuestionAnswer.findOneAndUpdate(
    { questionId: question.id, userId: user.id },
    {
      id: existingAnswer?.id || `A-${question.id}-${user.id}`,
      questionId: question.id,
      userId: user.id,
      answerText: answerText.trim(),
      nodeId: node.id,
      answeredAt: new Date()
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await maybeMarkOnboardingComplete(user.id);

  return {
    node,
    answer,
    question,
    audit: {
      classificationSource: 'question.typeHint',
      storedAs: 'knowledge_nodes',
      questionAnswersRole: 'progress/audit only',
      duplicateActiveNodePolicy: 'updates existing node for this user/question',
      warning: classified.warning,
      overrideApplied: classified.overrideApplied
    },
    badge: 'Stored as regular knowledge node'
  };
}

async function maybeMarkOnboardingComplete(userId) {
  const { getRelevantQuestions } = require('./displayEngine');
  const relevant = await getRelevantQuestions(userId);
  if (relevant.progress.canLaunchFirstSession) {
    await User.updateOne({ id: userId }, { hasCompletedOnboarding: true });
  }
}

module.exports = { convertAnswerToNode, computeWeights, buildNodePatch };
