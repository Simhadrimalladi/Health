const { composeContext } = require('../pipeline/composer');
const { callLLM } = require('../ai/llmClient');
const { getRelevantQuestions } = require('../questions/displayEngine');
const ApiError = require('../utils/ApiError');

async function assertCanLaunchSession(userId) {
  const relevant = await getRelevantQuestions(userId);
  if (!relevant.user.hasCompletedOnboarding && !relevant.progress.canLaunchFirstSession) {
    throw new ApiError(
      403,
      `First session is locked until P0 mandatory questions are complete (${relevant.progress.mandatoryP0Answered}/${relevant.progress.mandatoryP0Total}).`
    );
  }
  return relevant;
}

exports.runSession = async (req, res) => {
  const { userId, patientId, message } = req.body;
  if (!userId || !message) throw new ApiError(400, 'userId and message are required');
  const onboarding = await assertCanLaunchSession(userId);
  const composed = await composeContext({ userId, patientId, query: message });
  const response = await callLLM({ message, contextString: composed.contextString, patient: composed.patient });
  res.json({ data: { response, onboarding: onboarding.progress, ...composed } });
};

exports.assertCanLaunchSession = assertCanLaunchSession;
