/**
 * Assign Faculty Controller
 *
 * This module handles operations related to faculty assignmet to course, such as completing a faculty assignment,
 *
 * Functionalities:
 * -
 * -
 */
const assignFaculty = require("../models/assignFacultyModel");

class AssignFaculty {
  /**
   * Assign Faculty to courses.
   * @route   POST /assign/complete
   * @access
   * */
  async completeAssignnent(req, res) {
    try {
      const requiredFields = ["semester", "branch", "regulation", "assigned"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      const { semester, branch, regulation, assigned } = req.body;

      const existingAssignment = await assignFaculty.findOneAndUpdate(
        { semester, branch, regulation },
        { assigned },
        { new: true, upsert: true }
      );
      console.log(existingAssignment);

      const message = existingAssignment
        ? "Existing Faculty and Course assignment has been updated"
        : "Faculty assignment to course is completed successfully";

      return res.status(201).json({ success: true, message });
    } catch (error) {
      console.error("Things went south", error);
      res.status(500).json({
        success: "false",
        message: error.message || "Internal Server error",
      });
    }
  }
}

module.exports = new AssignFaculty();
