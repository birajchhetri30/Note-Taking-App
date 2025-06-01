const express = require('express');
const router = express.Router();
const {register, login, getProfile} = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);

const authMiddleware = require('../middleware/authMiddleware')
router.get('/me', authMiddleware, getProfile);

module.exports = router;