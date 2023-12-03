const express = require('express');
const router = express.Router();
const DriverController = require('../controllers/driverControllers');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Public routes
router.post('/', DriverController.createDriver); // Register a new user as driver
router.post('/signin', DriverController.signInDriver); // Sign in

// Private routes
router.get('/alldrivers', authenticate, authorize('user'), DriverController.getAllDrivers); // Get all users (admin only)
router.get('/', authenticate, authorize('user'), DriverController.getAllDrivers); // Alternative route for getting all drivers
router.get('/:userId', authenticate, DriverController.getDriver); // Get specific driver
router.put('/:userId', authenticate, authorize('user'), DriverController.updateDriver); // Update   driver
router.delete('/:userId', authenticate, authorize('user'), DriverController.deleteDriver); // Delete    driver

module.exports = router;