const router = require('express').Router();
const c = require('../controllers/users.controller');
const ah = require('../utils/asyncHandler');
router.get('/', ah(c.listUsers));
router.get('/:id', ah(c.getUser));
module.exports = router;
