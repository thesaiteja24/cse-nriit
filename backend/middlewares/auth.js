const User = require("../models/userModel");

/**
 * Middleware to check if the user is authenticated.
 * Ensures the user is logged in before granting access to protected routes.
 *
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Next middleware function
 * @returns {void} Calls the next middleware if authenticated, otherwise sends a 401 Unauthorized response
 */
exports.authMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

/**
 * Middleware to check if the authenticated user has admin privileges.
 * Ensures the user is logged in and has the 'admin' role.
 *
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Next middleware function
 * @returns {void} Calls the next middleware if the user is an admin, otherwise sends a 403 Forbidden response
 */
exports.adminMiddleware = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden: Admin access only" });
};
