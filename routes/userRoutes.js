const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Public routes
router.post('/', UserController.createUser); // Register a new user
router.post('/signin', UserController.signInUser); // Sign in

// Private routes
router.get('/allusers', authenticate, authorize('admin'), UserController.getAllUsers); // Get all users (admin only)
router.get('/', authenticate, authorize('admin'), UserController.getAllUsers); // Alternative route for getting all users
router.get('/:userId', authenticate, UserController.getUser); // Get specific user
router.put('/:userId', authenticate, authorize('admin', 'user'), UserController.updateUser); // Update user
router.delete('/:userId', authenticate, authorize('admin'), UserController.deleteUser); // Delete user

module.exports = router;
