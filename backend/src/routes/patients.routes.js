const router = require('express').Router();
const c = require('../controllers/patients.controller');
const ah = require('../utils/asyncHandler');
router.get('/', ah(c.listPatients));
module.exports = router;
