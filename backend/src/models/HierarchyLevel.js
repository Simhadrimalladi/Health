const mongoose = require('mongoose');

const hierarchyLevelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  orgId: { type: String, required: true, index: true },
  levelNumber: { type: Number, required: true },
  levelName: { type: String, required: true },
  department: { type: String, default: null, index: true },
  parentIds: [{ type: String }],
  zone: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('HierarchyLevel', hierarchyLevelSchema);
