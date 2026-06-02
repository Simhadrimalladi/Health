const mongoose = require('mongoose');

const knowledgeNodeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  orgId: { type: String, required: true, index: true },
  hierarchyLevelId: { type: String, required: true, index: true },
  type: { type: String, required: true, enum: ['CONSTRAINT', 'DECISION', 'ANTI_PATTERN', 'FACT'], index: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  importance: { type: Number, required: true },
  zone: { type: Number, default: 1, index: true },
  status: { type: String, enum: ['ACTIVE', 'REVIEW_REQUIRED', 'SUPERSEDED', 'EXPIRED'], default: 'ACTIVE', index: true },
  department: { type: String, default: null, index: true },
  derivabilityScore: { type: Number, default: 0 },
  sourceQuestionId: { type: String, default: null, index: true },
  sourceType: { type: String, enum: ['QUESTION', 'PRE_EXISTING', 'PATIENT'], default: 'PRE_EXISTING', index: true },
  createdBy: { type: String, required: true },
  decayProfile: { type: String, default: 'STANDARD_24M' },
  retrievalWeight: { type: Number, default: 0 },
  injectionWeight: { type: Number, default: 0 },
  compressionMode: { type: String, default: 'FULL' },
  contradictionGroupId: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('KnowledgeNode', knowledgeNodeSchema);
