const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const categoryController = require('../controllers/categoryController');

router.use(authMiddleware);

router.get('/notes/:id/categories', categoryController.getCategoriesForNote);
router.get('/', categoryController.getAllCategories);

module.exports = router;