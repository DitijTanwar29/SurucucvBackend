const express = require("express");
const {
  getNotifications,
  markNotificationAsRead,
  clearAllNotifications,
} = require("../controllers/Notification");

const router = express.Router();

// Get all notifications
router.get("/notifications", getNotifications);

// Mark a notification as read
router.put("/notifications/:id/read", markNotificationAsRead);

// Clear all notifications
router.delete("/notifications/clear", clearAllNotifications);

module.exports = router;
