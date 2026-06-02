const router = require('express').Router();
const c = require('../controllers/health.controller');
const ah = require('../utils/asyncHandler');
router.get('/', ah(c.healthScore));
module.exports = router;
