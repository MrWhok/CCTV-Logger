const express = require('express');
const router = express.Router();
const { register, login, getAllUsers } = require('../controllers/userController');
const { checkUserExists, validateUserData } = require('../middleware/userMiddleware');

router.post('/register', validateUserData, checkUserExists, register);
router.post('/login', login);
router.get('/all', getAllUsers);

module.exports = router;
