const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");

// Routes
router.get("/api/faculty", facultyController.getFaculty); // Get faculty by department
router.post("/faculty", facultyController.addFaculty); // Add new faculty
router.put("/faculty/:id", facultyController.updateFaculty); // Update faculty details
router.delete("/faculty/:id", facultyController.deleteFaculty); // Delete faculty

module.exports = router;