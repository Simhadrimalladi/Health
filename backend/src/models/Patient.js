const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  orgId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  age: Number,
  gender: String,
  department: { type: String, index: true },
  conditions: [{ type: String }],
  cohortTags: [{ type: String }],
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
