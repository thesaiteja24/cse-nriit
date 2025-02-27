const express = require("express");
const userRoutes = require("./userRoutes");
const courseRoutes = require("./courseRoutes");
const facultyRoutes = require("./facultyRoutes");

const router = express.Router();


/**
 * @route   GET /
 * @desc    Health check endpoint
 * @access  Public
 * @returns {String} Returns "OK" to confirm that the server is running.
*/
router.get("/", (req, res) => {
  res.send("OK");
});

/**
 * @route   /auth
 * @desc    User authentication routes (register, login, etc.)
 * @access  Public (some routes may be protected)
*/
router.use("/auth", userRoutes);

/**
 * @route   /courses
 * @desc    Course-related routes (CRUD operations, filters, etc.)
 * @access  Protected (some routes may require admin access)
*/
router.use("/courses", courseRoutes);

/**
 * @route   /faculty
 * @desc    Faculty-related routes (CRUD operations, etc.)
 * @access  Protected (admin access required for some operations)
*/
router.use("/faculty", facultyRoutes);

router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

module.exports = router;
