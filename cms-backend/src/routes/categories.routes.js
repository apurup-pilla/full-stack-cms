const router = require('express').Router();
const { getAll, create, update, remove } = require('../controllers/categories.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/', getAll);
router.post('/',      requireRole('Administrator', 'Editor'), create);
router.put('/:id',    requireRole('Administrator', 'Editor'), update);
router.delete('/:id', requireRole('Administrator'), remove);

module.exports = router;
