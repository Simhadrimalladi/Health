const router = require('express').Router();
const c = require('../controllers/answers.controller');
const ah = require('../utils/asyncHandler');
router.post('/', ah(c.createAnswer));
module.exports = router;
