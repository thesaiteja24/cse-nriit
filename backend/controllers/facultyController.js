const Faculty = require("../models/facultyModel");

class FacultyController {
  // Get faculty by department
  async getFaculty(req, res) {
    try {
      const { department } = req.query; // Using query parameters instead of body for GET requests
      const faculty = await Faculty.find({ department });
      res.json({ success: true, data: faculty, count: faculty.length });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Add new faculty
  async addFaculty(req, res) {
    try {
      const { name, contact, department } = req.body;
      const newFaculty = new Faculty({ name, contact, department });
      await newFaculty.save();
      res.status(201).json({ success: true, message: "Faculty added successfully", data: newFaculty });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update faculty details
  async updateFaculty(req, res) {
    try {
      const { id } = req.params;
      const { name, contact, department } = req.body;
      const updatedFaculty = await Faculty.findByIdAndUpdate(
        id,
        { name, contact, department },
        { new: true } // Return the updated document
      );
      if (!updatedFaculty) {
        return res.status(404).json({ success: false, message: "Faculty not found" });
      }
      res.json({ success: true, message: "Faculty updated successfully", data: updatedFaculty });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Delete faculty
  async deleteFaculty(req, res) {
    try {
      const { id } = req.params;
      const deletedFaculty = await Faculty.findByIdAndDelete(id);
      if (!deletedFaculty) {
        return res.status(404).json({ success: false, message: "Faculty not found" });
      }
      res.json({ success: true, message: "Faculty deleted successfully", data: deletedFaculty });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new FacultyController();