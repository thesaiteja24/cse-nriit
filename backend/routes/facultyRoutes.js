const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");
const auth = require("../middlewares/auth");

// Routes
router.get("/api/faculty", facultyController.getFaculty); // Get faculty by department
router.post("/faculty", auth, facultyController.addFaculty); // Add new faculty
router.put("/faculty/:id", auth, facultyController.updateFaculty); // Update faculty details
router.delete("/faculty/:id", auth, facultyController.deleteFaculty); // Delete faculty

module.exports = router;
