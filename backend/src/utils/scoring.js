function roundScore(value) {
  return Math.max(0, Math.min(100, Math.round(value || 0)));
}

function byTypePriority(type) {
  const order = { CONSTRAINT: 4, DECISION: 3, ANTI_PATTERN: 2, FACT: 1 };
  return order[type] || 0;
}

function nodeAuthority(createdBy) {
  if (!createdBy) return 0.2;
  if (createdBy.includes('MEERA') || createdBy.includes('VIKRAM')) return 1;
  if (createdBy.includes('ANANYA')) return 0.7;
  return 0.5;
}

module.exports = { roundScore, byTypePriority, nodeAuthority };
