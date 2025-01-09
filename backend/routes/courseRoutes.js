const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { adminMiddleware, authMiddleware } = require("../middlewares/auth");

// Get dropdown options
router.get("/api/semesters", courseController.getSemesters);
router.get("/api/branches", courseController.getBranches);
router.get("/api/regulations", courseController.getRegulations);

router.use(authMiddleware);
// Course CRUD operations
router.get("/", courseController.getCourses); // Get courses based on filters
router.post("/", adminMiddleware, courseController.addCourse); // Adding new course
router.put("/:id", adminMiddleware, courseController.updateCourse); // Updating existing course
router.delete("/:id", adminMiddleware, courseController.deleteCourse); // Deleting existing course

module.exports = router;
