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

module.exports = router;