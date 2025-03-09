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

      const existingAssignment = await assignFaculty.findOne({
        semester,
        branch,
        regulation,
      });

      if (existingAssignment) {
        await assignFaculty.updateOne(
          { semester, branch, regulation },
          { assigned }
        );
        return res.status(200).json({
          success: "ture",
          message: "Existing Faculty and Course assignment has been updated",
        });
      }

      const newAssignment = new assignFaculty(req.body);
      await newAssignment.save();

      return res.status(201).json({
        success: true,
        message: "Faculty assignment to course is completed successfully",
      });
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
