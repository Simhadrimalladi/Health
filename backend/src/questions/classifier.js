const ranges = {
  CONSTRAINT: { min: 0.80, max: 1.00, decayProfile: 'FIXED' },
  DECISION: { min: 0.50, max: 0.85, decayProfile: 'STANDARD_24M' },
  ANTI_PATTERN: { min: 0.70, max: 0.95, decayProfile: 'SLOW_36M' },
  FACT: { min: 0.30, max: 0.75, decayProfile: 'FAST_12M' }
};

function clampImportance(type, value) {
  const range = ranges[type] || ranges.FACT;
  return Number(Math.max(range.min, Math.min(range.max, Number(value || range.min))).toFixed(2));
}

function classifyFromQuestion(question, answerText, strictAutoOverride = false) {
  const originalType = question.typeHint;
  const dangerWords = /\b(never|absolutely|must not|contraindicated|no exceptions|critical|strictly)\b/i;
  const suggestedType = dangerWords.test(answerText || '') && ['DECISION', 'FACT'].includes(originalType)
    ? 'CONSTRAINT'
    : originalType;
  const overrideApplied = strictAutoOverride && suggestedType !== originalType;
  const finalType = overrideApplied ? suggestedType : originalType;
  return {
    originalType,
    suggestedType,
    finalType,
    overrideApplied,
    warning: suggestedType !== originalType ? `Answer language looks like ${suggestedType}; kept ${originalType} because typeHint is source of truth unless strictAutoOverride=true.` : null,
    importance: clampImportance(finalType, question.importanceDefault),
    decayProfile: ranges[finalType].decayProfile
  };
}

function deriveTitle(question, answerText) {
  const clean = (answerText || question.questionText || '').replace(/\s+/g, ' ').trim();
  const first = clean.split(/[.!?]/)[0].slice(0, 80);
  return first || question.id;
}

function deriveZone(question, hierarchyLevel) {
  if (hierarchyLevel?.zone === 2) return 2;
  if (question.level === 'HOSPITAL' && question.typeHint === 'CONSTRAINT') return 2;
  return 1;
}

function derivabilityScoreFor(question, answerText) {
  const base = question.level === 'HOSPITAL' ? 0.12 : question.level === 'COHORT' ? 0.07 : 0.15;
  const specific = /supra|ekadashi|padma|calpol|piperacillin|zimmer|glimepiride/i.test(answerText || '') ? -0.04 : 0;
  return Number(Math.max(0.01, Math.min(0.20, base + specific)).toFixed(2));
}

module.exports = { classifyFromQuestion, clampImportance, deriveTitle, deriveZone, derivabilityScoreFor, ranges };
