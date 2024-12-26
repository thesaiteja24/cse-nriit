const Course = require("../models/courseModel");

class CourseController {
  // Get all unique semesters
  async getSemesters(req, res) {
    try {
      const semesters = await Course.distinct("semester");
      const formattedSemesters = semesters.map((semester, index) => ({
        id: index + 1,
        value: semester,
        label: semester,
      }));
      res.json(formattedSemesters);
    } catch (error) {
      console.error("Error fetching semesters:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching semesters",
      });
    }
  }

  // Get all unique branches/departments
  async getBranches(req, res) {
    try {
      const departments = await Course.distinct("department");
      const formattedDepartments = departments.map((department, index) => ({
        id: index + 1,
        value: department,
        label: department,
      }));
      res.json(formattedDepartments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching departments",
      });
    }
  }

  // Get all unique regulations
  async getRegulations(req, res) {
    try {
      const regulations = await Course.distinct("regulation");
      const formattedRegulations = regulations.map((regulation, index) => ({
        id: index + 1,
        value: regulation,
        label: regulation,
      }));
      res.json(formattedRegulations);
    } catch (error) {
      console.error("Error fetching regulations:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching regulations",
      });
    }
  }

  // Get filtered courses
  async getCourses(req, res) {
    try {
      const { semester, branch, regulation } = req.query;
      const query = {};

      if (semester) query.semester = semester;
      if (branch) query.department = branch;
      if (regulation) query.regulation = regulation;

      const courses = await Course.find(query);

      if (!courses || courses.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No courses found for the provided criteria",
        });
      }

      res.json({
        success: true,
        data: courses,
        count: courses.length,
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching courses",
      });
    }
  }

  // Add new course
  async addCourse(req, res) {
    try {
      const requiredFields = [
        "courseCode",
        "name",
        "credits",
        "type",
        "department",
        "semester",
        "regulation",
      ];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      const existingCourse = await Course.findOne({
        courseCode: req.body.courseCode,
      });
      if (existingCourse) {
        return res.status(400).json({
          success: false,
          message: "Course with this code already exists",
        });
      }

      const newCourse = new Course(req.body);
      await newCourse.save();

      res.status(201).json({
        success: true,
        message: "Course added successfully",
        data: newCourse,
      });
    } catch (error) {
      console.error("Error adding course:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Error adding course",
      });
    }
  }

  // Update course
  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      res.json({
        success: true,
        message: "Course updated successfully",
        data: course,
      });
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Error updating course",
      });
    }
  }

  // Delete course
  async deleteCourse(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findByIdAndDelete(id);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      res.json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Error deleting course",
      });
    }
  }
}

module.exports = new CourseController();
