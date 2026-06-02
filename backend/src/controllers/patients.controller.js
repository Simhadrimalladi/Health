const { Patient } = require('../models');
exports.listPatients = async (req, res) => res.json({ data: await Patient.find().sort({ name: 1 }).lean() });
