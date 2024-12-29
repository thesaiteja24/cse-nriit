const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth");

// Routes
router.get("/api/faculty", facultyController.getFaculty); // Get faculty by department
router.post(
  "/faculty",
  authMiddleware,
  adminMiddleware,
  facultyController.addFaculty
); // Add new faculty
router.put(
  "/faculty/:id",
  authMiddleware,
  adminMiddleware,
  facultyController.updateFaculty
); // Update faculty details
router.delete(
  "/faculty/:id",
  authMiddleware,
  adminMiddleware,
  facultyController.deleteFaculty
); // Delete faculty

module.exports = router;
