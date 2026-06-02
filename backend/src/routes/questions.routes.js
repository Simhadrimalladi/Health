const router = require('express').Router();
const c = require('../controllers/questions.controller');
const ah = require('../utils/asyncHandler');
router.get('/relevant/:userId', ah(c.getRelevant));
module.exports = router;
