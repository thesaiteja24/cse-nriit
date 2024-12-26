const User = require("../models/userModel");

class AuthMiddleware {
  // Check if the user is authenticated
  static async isAuthenticated(req, res, next) {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Fetch the user from the database
      const user = await User.findById(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "Need to login" });
      }

      // Attach the user to the request object for further use in other middlewares/routes
      req.user = user;

      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Check if the authenticated user is an admin
  static isAdmin(req, res, next) {
    if (req.user && req.user.role === "admin") {
      return next(); // Proceed if the user is an admin
    }

    // If the user is not an admin, send a 403 Forbidden response
    return res
      .status(403)
      .json({ message: "Forbidden: Only admins can access this resource" });
  }
}

module.exports = AuthMiddleware;
