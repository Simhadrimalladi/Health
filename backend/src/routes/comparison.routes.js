const router = require('express').Router();
const c = require('../controllers/comparison.controller');
const ah = require('../utils/asyncHandler');
router.post('/', ah(c.compare));
module.exports = router;
