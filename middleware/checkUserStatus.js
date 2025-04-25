// middleware/checkUserStatus.js
exports.checkUserStatus = async (req, res, next) => {
    if (req.user?.status === "Restricted") {
      return res.status(403).json({ message: "Access denied. Your account is restricted." });
    }
    next();
  };