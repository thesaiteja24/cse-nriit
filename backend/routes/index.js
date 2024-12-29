const express = require("express");
const userRoutes = require("./userRoutes");
const courseRoutes = require("./courseRoutes");
const facultyRoutes = require("./facultyRoutes");

const router = express.Router();

/**
 * @route   GET /
 * @desc    Health check endpoint
 * @access  Public
 */
router.get("/", (req, res) => {
  res.send("OK");
});

/**
 * @route   Varies (depends on userRoutes)
 * @desc    User-related routes
 * @access  Depends on route configuration
 */
router.use("/auth", userRoutes);

/**
 * @route   Varies (depends on courseRoutes)
 * @desc    Course-related routes
 * @access  Depends on route configuration
 */
router.use("/courses", courseRoutes);

/**
 * @route   Varies (depends on facultyRoutes)
 * @desc    Faculty-related routes
 * @access  Depends on route configuration
 */
router.use("/faculty", facultyRoutes);

module.exports = router;
