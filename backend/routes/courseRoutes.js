const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { adminMiddleware, authMiddleware } = require("../middlewares/auth");

/**
 * @route   GET /api/semesters
 * @desc    Fetch all available semesters
 * @access  Public
 */
router.get("/api/semesters", courseController.getSemesters);

/**
 * @route   GET /api/branches
 * @desc    Fetch all available branches
 * @access  Public
 */
router.get("/api/branches", courseController.getBranches);

/**
 * @route   GET /api/regulations
 * @desc    Fetch all available regulations
 * @access  Public
 */
router.get("/api/regulations", courseController.getRegulations);

// Apply authentication middleware to all subsequent routes
router.use(authMiddleware);

/**
 * @route   GET /
 * @desc    Fetch courses based on provided filters (semester, branch, regulation)
 * @access  Private (Authenticated users)
 */
router.get("/", courseController.getCourses);

/**
 * @route   POST /
 * @desc    Add a new course
 * @access  Private (Admin only)
 */
router.post("/", adminMiddleware, courseController.addCourse);

/**
 * @route   PUT /:id
 * @desc    Update an existing course by ID
 * @access  Private (Admin only)
 * @param   {string} id - Course ID
 */
router.put("/:id", adminMiddleware, courseController.updateCourse);

/**
 * @route   DELETE /:id
 * @desc    Delete an existing course by ID
 * @access  Private (Admin only)
 * @param   {string} id - Course ID
 */
router.delete("/:id", adminMiddleware, courseController.deleteCourse);

module.exports = router;
