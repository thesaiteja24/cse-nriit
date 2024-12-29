const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth");

// Apply authentication middleware to all routes in this router
router.use(authMiddleware);

/**
 * @route   GET /
 * @desc    Fetch faculty members based on department or filters
 * @access  Private (Authenticated users)
 */
router.get("/", facultyController.getFaculty);

/**
 * @route   POST /
 * @desc    Add a new faculty member
 * @access  Private (Admin only)
 */
router.post("/", adminMiddleware, facultyController.addFaculty);

/**
 * @route   PUT /:id
 * @desc    Update details of an existing faculty member
 * @access  Private (Admin only)
 * @param   {string} id - Faculty ID
 */
router.put("/:id", adminMiddleware, facultyController.updateFaculty);

/**
 * @route   DELETE /:id
 * @desc    Delete a faculty member by ID
 * @access  Private (Admin only)
 * @param   {string} id - Faculty ID
 */
router.delete("/:id", adminMiddleware, facultyController.deleteFaculty);

module.exports = router;
