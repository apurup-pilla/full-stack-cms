const router = require('express').Router();
const path = require('path');
const multer = require('multer');
const { getAll, upload, remove } = require('../controllers/media.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const fileUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/jpeg|jpg|png|gif|webp|svg\+xml/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  },
});

router.use(verifyToken);

router.get('/', getAll);
router.post('/upload', fileUpload.single('file'), upload);
router.delete('/:id', remove);

module.exports = router;
