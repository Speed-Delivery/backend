const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const NotificationController = require('../controllers/notificationController');


//route to get all the notficiations of a user by id
router.get('/', authenticate, NotificationController.getNotifications); 



module.exports = router;