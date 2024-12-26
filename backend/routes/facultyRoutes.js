const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");
const auth = require("../middlewares/auth");

// Routes
router.get("/api/faculty", facultyController.getFaculty); // Get faculty by department
router.post(
  "/faculty",
  auth.isAuthenticated,
  auth.isAdmin,
  facultyController.addFaculty
); // Add new faculty
router.put(
  "/faculty/:id",
  auth.isAuthenticated,
  auth.isAdmin,
  facultyController.updateFaculty
); // Update faculty details
router.delete(
  "/faculty/:id",
  auth.isAuthenticated,
  auth.isAdmin,
  facultyController.deleteFaculty
); // Delete faculty

module.exports = router;
