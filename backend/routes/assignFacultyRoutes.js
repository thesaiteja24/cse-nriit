const express = require("express");
const router = express.Router();
const assignFacultyController = require("../controllers/assignFacultyController");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth");

router.post("/complete", assignFacultyController.completeAssignnent);

module.exports = router;
