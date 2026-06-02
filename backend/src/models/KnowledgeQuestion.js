const mongoose = require('mongoose');

const knowledgeQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  orgId: { type: String, required: true, index: true },
  level: { type: String, required: true, enum: ['HOSPITAL', 'DEPARTMENT', 'ROLE', 'COHORT'], index: true },
  department: { type: String, default: null, index: true },
  targetRole: { type: String, default: null, index: true },
  cohortTag: { type: String, default: null, index: true },
  priority: { type: Number, min: 0, max: 3, required: true, index: true },
  questionText: { type: String, required: true },
  typeHint: { type: String, required: true, enum: ['CONSTRAINT', 'DECISION', 'ANTI_PATTERN', 'FACT'] },
  targetHierarchyLevel: { type: String, required: true },
  importanceDefault: { type: Number, required: true },
  placeholderText: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('KnowledgeQuestion', knowledgeQuestionSchema);
