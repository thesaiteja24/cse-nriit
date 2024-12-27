const User = require("../models/userModel");

// Check if the user is authenticated
exports.authMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Check if the authenticated user is an admin
exports.adminMiddleware = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden: Admin access only" });
};