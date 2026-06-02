const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  segment: { type: String, required: true },
  config: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);
