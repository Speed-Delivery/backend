// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/signup', UserController.createUser);
router.post( '/signin', UserController.signInUser);
router.get('/profile', UserController.getUserProfile);
router.put('/profile', UserController.updateUserProfile);

module.exports = router;