const router = require('express').Router();
const c = require('../controllers/nodes.controller');
const ah = require('../utils/asyncHandler');
router.get('/', ah(c.listNodes));
router.get('/context-candidates', ah(c.contextCandidates));
module.exports = router;
