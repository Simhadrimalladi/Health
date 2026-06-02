const env = require('../config/env');
const { getContextCandidates } = require('./rulesEngine');
const { estimateTokens, compressNode } = require('./tokenBudget');

function group(nodes, predicate) {
  return nodes.filter(predicate);
}

function line(node) {
  return `- [${node.type} | ${node.sourceType}${node.sourceQuestionId ? `:${node.sourceQuestionId}` : ''}] ${node.title}: ${compressNode(node)}`;
}

function summarizeCounts(nodes) {
  const byType = {};
  const bySource = { QUESTION: 0, PRE_EXISTING: 0, PATIENT: 0 };
  for (const n of nodes) {
    byType[n.type] = (byType[n.type] || 0) + 1;
    bySource[n.sourceType] = (bySource[n.sourceType] || 0) + 1;
  }
  return { byType, bySource };
}

async function composeContext({ userId, patientId, query, mode = 'full' }) {
  const result = await getContextCandidates({ userId, patientId, mode });
  const { user, patient } = result;

  const sorted = [...result.candidates].sort((a, b) => {
    const ia = (a.injectionWeight || a.importance || 0) + (a.sourceType === 'PATIENT' ? 0.25 : 0) + (a.type === 'CONSTRAINT' ? 0.15 : 0);
    const ib = (b.injectionWeight || b.importance || 0) + (b.sourceType === 'PATIENT' ? 0.25 : 0) + (b.type === 'CONSTRAINT' ? 0.15 : 0);
    return ib - ia;
  });

  const selected = [];
  let used = 0;
  const budget = env.TOKEN_BUDGET;
  for (const node of sorted) {
    const cost = estimateTokens(line(node));
    if (used + cost <= budget - 500) {
      selected.push({ ...node, estimatedTokens: cost });
      used += cost;
    }
    if (selected.length >= 18) break;
  }

  const globalConstraints = group(selected, n => n.zone === 2 && n.type === 'CONSTRAINT').map(line).join('\n') || '- None';
  const departmentDecisions = group(selected, n => n.department === user.department && n.type === 'DECISION').map(line).join('\n') || '- None';
  const activeConstraints = group(selected, n => n.zone === 1 && n.type === 'CONSTRAINT').map(line).join('\n') || '- None';
  const patientNodes = group(selected, n => n.sourceType === 'PATIENT').map(line).join('\n') || '- No patient-specific nodes selected';
  const antiPatterns = group(selected, n => n.type === 'ANTI_PATTERN').map(line).join('\n') || '- None';
  const stale = group(selected, n => n.status === 'REVIEW_REQUIRED').map(line).join('\n') || '- None';

  const contextString = [
    `BLOCK 1 — ROLE FRAME:\nYou are assisting ${user.name}, a ${user.role} in ${user.department} at Supra Multi-Specialty Hospital. Apply organizational context to every response. Query: ${query || 'No query supplied'}.`,
    `BLOCK 2 — GLOBAL CONSTRAINTS:\n${globalConstraints}`,
    `BLOCK 3 — DEPARTMENT DECISIONS:\n${departmentDecisions}`,
    `BLOCK 4 — ACTIVE CONSTRAINTS:\n${activeConstraints}`,
    `BLOCK 5 — PATIENT CONTEXT:\n${patient ? `Current patient: ${patient.name}, ${patient.age}${patient.gender}. Conditions: ${patient.conditions.join(', ')}. Notes: ${patient.notes}` : 'No patient selected.'}\n${patientNodes}`,
    `BLOCK 6 — ANTI-PATTERNS:\n${antiPatterns}`,
    `BLOCK 7 — STALE FLAGS:\n${stale}`,
    'BLOCK 8 — SESSION BOUNDARIES:\nUse this organizational context. If new decisions or constraints should be remembered, end with CAPTURE: summary.'
  ].join('\n\n');

  return {
    user,
    patient,
    contextString,
    selectedNodes: selected,
    candidates: result.candidates,
    excludedSummary: result.excludedSummary,
    tokenUsage: estimateTokens(contextString),
    tokenBudget: budget,
    counts: summarizeCounts(selected),
    totalPool: result.totalPool
  };
}

module.exports = { composeContext };
