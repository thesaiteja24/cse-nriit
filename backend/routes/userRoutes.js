const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const {
  registerUser,
  loginUser,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const router = express.Router();

/**
 * @route   POST /forgot-password
 * @desc    Reset Password of the user
 * @access  Public
 */
router.post("/reset/:token", resetPassword);

/**
 * @route   POST /forgot-password
 * @desc    Reset Password of the user
 * @access  Public
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route   POST /register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   POST /login
 * @desc    Authenticate a user and generate a session or token
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @route   POST /logout
 * @desc    Log out the authenticated user
 * @access  Private (Authenticated users only)
 */
router.post("/logout", authMiddleware, logout);

/**
 * @route   GET /getuser
 * @desc    Get the details of the currently logged-in user
 * @access  Private (Authenticated users only)
 */
router.get("/getuser", authMiddleware, getMe);

module.exports = router;
