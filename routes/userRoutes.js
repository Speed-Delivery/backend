// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/signup', UserController.createUser);
router.post( '/signin', UserController.signInUser);

module.exports = router;