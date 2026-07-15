const router = require('express').Router();
const { getAll, getById, create, update, remove } = require('../controllers/users.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/',       requireRole('Administrator'), getAll);
router.get('/:id',    requireRole('Administrator'), getById);
router.post('/',      requireRole('Administrator'), create);
router.put('/:id',    requireRole('Administrator'), update);
router.delete('/:id', requireRole('Administrator'), remove);

module.exports = router;
