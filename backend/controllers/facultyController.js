const Faculty = require("../models/facultyModel");

class FacultyController {
  /**
   * Get faculty by department.
   * @route   GET /faculty
   * @access  Public
   * @query   {string} department - The department to filter faculty by.
   */
  async getFaculty(req, res) {
    try {
      const { department } = req.query; // Retrieve department from query parameters
      const faculty = await Faculty.find(department ? { department } : {}); // Filter if department is provided
      res.json({
        success: true,
        data: faculty,
        count: faculty.length,
      });
    } catch (error) {
      console.error("Error fetching faculty:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching faculty",
      });
    }
  }

  /**
   * Add a new faculty member.
   * @route   POST /faculty
   * @access  Admin
   * @body    {string} name - The name of the faculty member.
   * @body    {string} contact - The contact information of the faculty member.
   * @body    {string} department - The department of the faculty member.
   */
  async addFaculty(req, res) {
    try {
      const { name, contact, department } = req.body;
      // Validation for required fields
      if (!name || !contact || !department) {
        return res.status(400).json({
          success: false,
          message: "Name, contact, and department are required",
        });
      }
      const existingFaculty = await Faculty.findOne({ name });
      if (existingFaculty) {
        return res.status(409).json({
          success: false,
          message: `Faculty with name '${name}' already exists`,
        });
      }
      const newFaculty = new Faculty({ name, contact, department });
      await newFaculty.save();
      // Return count of faculty in the same department for the frontend
      const facultyCount = await Faculty.countDocuments({ department });
      res.status(201).json({
        success: true,
        message: "Faculty added successfully",
        data: newFaculty,
        count: facultyCount
      });
    } catch (error) {
      console.error("Error adding faculty:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Error adding faculty",
      });
    }
  }
  

  /**
   * Update faculty details by ID.
   * @route   PUT /faculty/:id
   * @access  Admin
   * @params  {string} id - The ID of the faculty member to update.
   * @body    {string} [name] - The updated name of the faculty member.
   * @body    {string} [contact] - The updated contact information.
   * @body    {string} [department] - The updated department.
   */
  async updateFaculty(req, res) {
    try {
      const { id } = req.params;
      const { name, contact, department } = req.body;
      
      // Check if faculty exists before update
      const faculty = await Faculty.findById(id);
      if (!faculty) {
        return res.status(404).json({
          success: false,
          message: "Faculty not found",
        });
      }
  
      const updatedFaculty = await Faculty.findByIdAndUpdate(
        id,
        { name, contact, department },
        { new: true, runValidators: true }
      );
      
      res.json({
        success: true,
        message: `Faculty ${name} updated successfully`,
        data: updatedFaculty,
      });
    } catch (error) {
      console.error("Error updating faculty:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Error updating faculty",
      });
    }
  }

  /**
   * Delete a faculty member by ID.
   * @route   DELETE /faculty/:id
   * @access  Admin
   * @params  {string} id - The ID of the faculty member to delete.
   */
  async deleteFaculty(req, res) {
    try {
      const { id } = req.params;

      const deletedFaculty = await Faculty.findByIdAndDelete(id);
      if (!deletedFaculty) {
        return res.status(404).json({
          success: false,
          message: "Faculty not found",
        });
      }

      res.json({
        success: true,
        message: "Faculty deleted successfully",
        data: deletedFaculty,
      });
    } catch (error) {
      console.error("Error deleting faculty:", error);
      res.status(500).json({
        success: false,
        message: "Error deleting faculty",
      });
    }
  }
}

module.exports = new FacultyController();
