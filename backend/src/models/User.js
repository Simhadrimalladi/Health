const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  orgId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['ADMIN', 'HOD', 'EDITOR', 'VIEWER'] },
  department: { type: String, required: true, index: true },
  ceilingLevel: { type: Number, required: true },
  applicableCohorts: [{ type: String }],
  hasCompletedOnboarding: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
