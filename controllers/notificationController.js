const Notification = require("../models/NotificationModel");

exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.body;
    //find all notification by user id

    const newNoti = [
      {
        userId: userId,
        message: "Welcome to the app",
        type: "Info",
        createdAt: Date.now(),
      },
      {
        userId: userId,
        message: "Your parcel is delivered",
        type: "Success",
        createdAt: Date.now(),
      },
    ];

      const notifications = await Notification.find({ userId });
      if (!notifications) {
          return res.json({ notifications: [] });
      }
        res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};