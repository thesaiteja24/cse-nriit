/**
 * User Authentication Controller
 *
 * This module handles user authentication functionalities such as registering, logging in,
 * logging out, and fetching user details.
 */

const emailMiddleware = require("../middlewares/email");
const User = require("../models/userModel");
const passport = require("passport");
const crypto = require("crypto");

// Regular expression for strong password validation
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Reset password of user.
 * @param {Object} req - Express request object containing user email in the body.
 * @param {Object} res - Express response object to send the response.
 * @returns {void}
 */
exports.resetPassword = [
  async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "No account with that email address exists" });
      }

      const token = crypto.randomBytes(24).toString("hex");
      user.resetToken = token;
      user.resetPasswordExpires = Date.now() + 600000; // 10 minutes

      await user.save();

      req.mailOptions = {
        to: user.email,
        from: process.env.EMAIL,
        subject: "Reset your password",
        text: `You are receiving this because you (or someone else) have requested to reset the password for your account.\n\n
        Please click on the following link, or paste it into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  emailMiddleware,
  (req, res) => {
    res.status(200).json({ message: "Recovery email sent" });
  },
];
/**
 * Registers a new user.
 * @param {Object} req - Express request object containing user details in the body.
 * @param {Object} res - Express response object to send the response.
 * @returns {void}
 */
exports.registerUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Check for missing required fields
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate password strength
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Register the new user
    const user = new User({ fullname, email, role: "user" });
    await User.register(user, password);

    // Automatically log in the user after registration
    req.login(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Login after registration failed" });
      }
      res.status(201).json({
        success: true,
        message: "User registered and logged in successfully",
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Logs in an existing user.
 * @param {Object} req - Express request object containing user credentials in the body.
 * @param {Object} res - Express response object to send the response.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
exports.loginUser = (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    try {
      // Check if email exists
      const userExists = await User.findOne({ email: req.body.email });
      if (!userExists) {
        return res.status(400).json({
          success: false,
          message: "Email address is not registered",
        });
      }

      // Check if authentication failed due to incorrect password
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Incorrect password",
        });
      }

      // Log in the user
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Login failed",
          });
        }

        res.status(200).json({
          success: true,
          message: "Login successful",
          user: {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            role: user.role,
          },
        });
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error during login process",
      });
    }
  })(req, res, next);
};

/**
 * Logs out the currently authenticated user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object to send the response.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
};

/**
 * Retrieves the currently authenticated user's details.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object to send the response.
 * @returns {void}
 */
exports.getMe = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.status(200).json({
    user: {
      id: req.user._id,
      fullname: req.user.fullname,
      email: req.user.email,
      role: req.user.role,
    },
  });
};
