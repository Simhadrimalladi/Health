const router = require('express').Router();
const c = require('../controllers/session.controller');
const ah = require('../utils/asyncHandler');
router.post('/', ah(c.runSession));
module.exports = router;
