const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth");

// Routes
router.get("/", facultyController.getFaculty); // Get faculty by department

router.use(authMiddleware);
router.post("/", adminMiddleware, facultyController.addFaculty); // Add new faculty
router.put("/:id", adminMiddleware, facultyController.updateFaculty); // Update faculty details
router.delete("/:id", adminMiddleware, facultyController.deleteFaculty); // Delete faculty

module.exports = router;
