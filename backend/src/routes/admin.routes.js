const router = require('express').Router();
const c = require('../controllers/admin.controller');
const ah = require('../utils/asyncHandler');
router.post('/questions', ah(c.addQuestion));
router.post('/questions/:questionId/answer', ah(c.answerQuestion));
router.post('/simulate-month12', ah(c.simulateMonth12));
module.exports = router;
