const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const auth = require("../middlewares/auth");

// Get dropdown options
router.get("/api/semesters", courseController.getSemesters);
router.get("/api/branches", courseController.getBranches);
router.get("/api/regulations", courseController.getRegulations);

// Course CRUD operations
router.get("/courses", courseController.getCourses); // Get courses based on filters
router.post(
  "/courses",
  auth.isAuthenticated,
  auth.isAdmin,
  courseController.addCourse
); // Adding new course
router.put(
  "/courses/:id",
  auth.isAuthenticated,
  auth.isAdmin,
  courseController.updateCourse
); // Updating existing course
router.delete(
  "/courses/:id",
  auth.isAuthenticated,
  auth.isAdmin,
  courseController.deleteCourse
); // Deleting existing course

module.exports = router;
