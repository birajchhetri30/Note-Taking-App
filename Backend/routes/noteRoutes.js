const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const noteController = require('../controllers/noteController');

router.use(authMiddleware);

router.post('/', noteController.create);
router.get('/', noteController.getAll);
router.get('/:id', noteController.getOne);
router.put('/:id', noteController.update);
router.delete('/:id', noteController.remove);
router.post('/:id/categories', noteController.addCategory);
router.delete('/:id/categories/:categoryId', noteController.removeCategory);

module.exports = router;