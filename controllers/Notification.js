const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    console.log("notifications :",notifications)
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching notifications." });
  }
};

// Mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating notification." });
  }
};

// Clear all notifications
exports.clearAllNotifications = async (req, res) => {
    try {
      await Notification.deleteMany({});
      res.status(200).json({ success: true, message: "All notifications cleared." });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error clearing notifications." });
    }
  };
  