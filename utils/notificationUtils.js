const Notification = require("../models/Notification");

/**
 * Sends a notification to the admin based on the event type.
 * @param {string} eventType - The type of event (e.g., "Job", "Payment", "Advertisement").
 * @param {string} companyName - Name of the company that triggered the event.
 * @param {string} details - Additional details related to the event.
 */
exports.sendNotificationToAdmin = async (eventType, companyName, details) => {
  try {
    let message = "";

    switch (eventType) {
      case "Job":
        message = `New job post created by ${companyName}: ${details}. Please review and approve.`;
        break;
      case "Payment":
        message = `Payment approval request received from ${companyName}. Please review.`;
        break;
      case "Advertisement":
        message = `New advertisement created by ${companyName}: ${details}. Please review and approve.`;
        break;
      default:
        console.error("Invalid event type.");
        return;
    }

    // Create a notification entry in the database
    const newNotification = new Notification({
      message,
      type: eventType,
      isRead: false,
    });

    await newNotification.save();
    console.log(`Notification sent to admin for ${eventType}:`, message);
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
};
