const router = require('express').Router();
const { getPublishedPages, getPageBySlug, getPublicCategories } = require('../controllers/public.controller');

// No auth — these are publicly accessible
router.get('/categories', getPublicCategories);
router.get('/pages', getPublishedPages);
router.get('/pages/:slug', getPageBySlug);

module.exports = router;
