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

/**
 * Registers a new user.
 * @param {Object} req - Express request object containing user details in the body.
 * @param {Object} res - Express response object to send the response.
 * @returns {void}
 */
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    // Check for missing required fields
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({
      resetToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }

    // Wrap user.authenticate in a Promise so we can await its result
    const isSamePassword = await new Promise((resolve, reject) => {
      user.authenticate(password, (err, authenticatedUser) => {
        if (err) return reject(err);
        // If authenticatedUser is truthy, it means the provided password
        // matches the current password.
        resolve(!!authenticatedUser);
      });
    });

    if (isSamePassword) {
      return res.status(400).json({
        message:
          "You cannot use your current password. Please enter a new password.",
      });
    }

    // Set the new password using passport-local-mongoose's setPassword method
    await user.setPassword(password);
    user.resetToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Regular expression for strong password validation
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Reset password of user.
 * @param {Object} req - Express request object containing user email in the body.
 * @param {Object} res - Express response object to send the response.
 * @returns {void}
 */
exports.forgotPassword = [
  async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res
          .status(400)
          .json({ success: false, message: "Email is required" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No account with that email address exists",
        });
      }
      console.log(user);
      const token = crypto.randomBytes(24).toString("hex");
      user.resetToken = token;
      user.resetPasswordExpires = Date.now() + 600000; // 10 minutes

      await user.save();

      req.mailOptions = {
        to: user.email,
        from: process.env.EMAIL,
        subject: "Reset Your Password",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border-radius: 10px; background: #ffffff; text-align: center; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Logo -->
          <h1 style="color: #FFA500; font-size: 50px">Time Table Generator</h1>

          <!-- Greeting -->
          <h2 style="color: #000; margin-top: 20px;">Hello ${user.fullname},</h2>

          <!-- Message -->
          <p style="color: #333; font-size: 16px; padding: 0 20px;">
            We have received a request for changing your password for Time Table Generator.
          </p>
          
          <!-- Reset Password Button -->
          <a href="${process.env.CLIENT_URL}/reset/${token}" 
            style="display: inline-block; padding: 12px 24px; margin: 20px auto; font-size: 16px; font-weight: bold; 
            color: #ffffff; background: #007bff; border-radius: 5px; text-decoration: none;">
            Reset Password
          </a>

          <!-- Token Expiry Notice -->
          <p style="color: #ff0000; font-size: 14px; margin-top: 10px;">
            ⚠️ This link is valid for only 10 minutes. Please reset your password before it expires.
          </p>

          <!-- Additional Message -->
          <p style="color: #777; font-size: 14px; padding: 0 20px;">
            If you didn’t request this, you can safely ignore this email.
          </p>

          <!-- Footer -->
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            <strong>Time Table Generator</strong><br>
            The Most Loved Scheduling Tool ❤️
          </p>
          <p style="color: #aaa; font-size: 10px;">
            &copy; 2025 Time Table Generator. All rights reserved.
          </p>
        </div>

        `,
      };

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  emailMiddleware,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Password reset instructions Sent",
      email: req.body.email,
    });
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
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ success: true, message: "Logged out successfully" });
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
