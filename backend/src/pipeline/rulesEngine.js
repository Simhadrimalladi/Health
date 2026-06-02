const { User, Patient, KnowledgeNode, HierarchyLevel, KnowledgeQuestion } = require('../models');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');
const { byTypePriority } = require('../utils/scoring');

function includesAny(list = [], value) {
  return value ? list.includes(value) : false;
}

async function getContextCandidates({ userId, patientId = null, mode = 'full' }) {
  const user = await User.findOne({ id: userId }).lean();
  if (!user) throw new ApiError(404, `User not found: ${userId}`);
  const patient = patientId ? await Patient.findOne({ id: patientId }).lean() : null;
  if (patientId && !patient) throw new ApiError(404, `Patient not found: ${patientId}`);

  const [levels, questions, allOrgNodes] = await Promise.all([
    HierarchyLevel.find({ orgId: user.orgId }).lean(),
    KnowledgeQuestion.find({ orgId: user.orgId }).lean(),
    KnowledgeNode.find({ orgId: user.orgId }).lean()
  ]);

  const levelById = new Map(levels.map(l => [l.id, l]));
  const questionById = new Map(questions.map(q => [q.id, q]));
  const patientToken = patient ? (patient.name.split(' ')[1] || patient.name).toLowerCase() : null;
  const patientLevelIds = patient
    ? levels
      .filter(l => l.levelName.toLowerCase().includes(patientToken))
      .map(l => l.id)
    : [];

  const annotated = [];
  const excludedCounts = {};

  for (const node of allOrgNodes) {
    const level = levelById.get(node.hierarchyLevelId);
    const question = node.sourceQuestionId ? questionById.get(node.sourceQuestionId) : null;
    const isPatientNode = node.sourceType === 'PATIENT' || patientLevelIds.includes(node.hierarchyLevelId);
    const scope = resolveScope(node, level, question);

    const rulesPass = {
      org_match: node.orgId === user.orgId,
      department_match: node.department === user.department || node.department === null,
      hierarchy_access: isHierarchyVisibleToUser({ node, level, user, isPatientNode }),
      active_status: node.status === 'ACTIVE',
      derivability_pass: Number(node.derivabilityScore || 0) < env.DERIVABILITY_THRESHOLD,
      patient_match: !isPatientNode || Boolean(patient && patientLevelIds.includes(node.hierarchyLevelId)),
      cohort_match: isCohortNodeAllowed({ question, user, patient }),
      mode_scope: modeAllowsScope(mode, scope)
    };

    const passed = Object.values(rulesPass).every(Boolean);
    if (!passed) {
      for (const [key, ok] of Object.entries(rulesPass)) {
        if (!ok) excludedCounts[key] = (excludedCounts[key] || 0) + 1;
      }
      continue;
    }

    const patientBoost = patient && isPatientNode ? 0.25 : 0;
    const scopeBoost = node.department === user.department ? 0.08 : 0.03;
    const score = (node.retrievalWeight || node.importance || 0.5) + patientBoost + scopeBoost + (byTypePriority(node.type) / 20);

    annotated.push({
      ...node,
      hierarchyLevel: level || null,
      relevanceScore: Number(score.toFixed(3)),
      rulesPass,
      scope
    });
  }

  annotated.sort((a, b) => (b.relevanceScore - a.relevanceScore) || (byTypePriority(b.type) - byTypePriority(a.type)) || (b.importance - a.importance));

  return {
    user,
    patient,
    totalPool: allOrgNodes.length,
    candidates: annotated.slice(0, 30),
    excludedSummary: {
      reason: 'Excluded by one or more 5-check rules: org, department/cohort, hierarchy/patient, active status, derivability, or comparison-mode scope.',
      counts: excludedCounts,
      orthoExcludedForAnanya: user.department === 'medicine' && Boolean(excludedCounts.department_match)
    }
  };
}

function isHierarchyVisibleToUser({ node, level, user, isPatientNode }) {
  if (!level) return false;
  if (isPatientNode) return true;
  if (node.zone === 2 || node.department === null) return true;
  return node.department === user.department;
}

function isCohortNodeAllowed({ question, user, patient }) {
  if (!question || question.level !== 'COHORT') return true;
  const userCohortMatch = includesAny(user.applicableCohorts || [], question.cohortTag);
  const patientCohortMatch = includesAny(patient?.cohortTags || [], question.cohortTag);
  const departmentMatch = !question.department || question.department === user.department;
  return departmentMatch && (userCohortMatch || patientCohortMatch);
}

function modeAllowsScope(mode, scope) {
  if (mode === 'none') return false;
  if (mode === 'hospital_department') return ['HOSPITAL', 'DEPARTMENT', 'COHORT'].includes(scope);
  return true;
}

function resolveScope(node, level, question = null) {
  if (node.sourceType === 'PATIENT') return 'PATIENT';
  if (question?.level === 'COHORT') return 'COHORT';
  if (question?.level === 'ROLE') return 'ROLE';
  if (question?.level === 'DEPARTMENT') return 'DEPARTMENT';
  if (!node.department && node.zone === 2) return 'HOSPITAL';
  if (node.department) return 'DEPARTMENT';
  if (level?.levelName?.toLowerCase().includes('clinical')) return 'ROLE';
  return 'HOSPITAL';
}

module.exports = { getContextCandidates, resolveScope, isCohortNodeAllowed, isHierarchyVisibleToUser };
