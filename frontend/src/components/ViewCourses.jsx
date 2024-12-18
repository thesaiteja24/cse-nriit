import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ViewCourses = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const location = useLocation();
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [regulation, setRegulation] = useState("");
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [flashMessage, setFlashMessage] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);

  // Dropdown options state
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [availableBranches, setAvailableBranches] = useState([]);
  const [availableRegulations, setAvailableRegulations] = useState([]);

  // New course state with all required fields
  const [newCourse, setNewCourse] = useState({
    courseCode: "",
    name: "",
    shortName: "",
    credits: "",
    type: "THEORY", // Default value
    department: "",
    semester: "",
    regulation: "",
    category: {},
  });

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  // Flash message timeout logic
  useEffect(() => {
    if (flashMessage.message) {
      const timer = setTimeout(() => {
        setFlashMessage({ type: "", message: "" });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  const fetchDropdownOptions = async () => {
    setIsLoading(true);
    try {
      const [semestersRes, branchesRes, regulationsRes] = await Promise.all([
        axios.get(`${backend_url}api/semesters`),
        axios.get(`${backend_url}api/branches`),
        axios.get(`${backend_url}api/regulations`),
      ]);
  
      setAvailableSemesters(semestersRes.data); // axios responses have `.data`
      setAvailableBranches(branchesRes.data);
      setAvailableRegulations(regulationsRes.data);
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
      setFlashMessage({
        type: "error",
        message: "Failed to load dropdown options.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCourses = async () => {
    if (!semester || !branch || !regulation) {
      setFlashMessage({
        type: "error",
        message: "Please select all filters before viewing courses.",
      });
      return;
    }

    try {
      const response = await fetch(
        `/courses?semester=${encodeURIComponent(
          semester
        )}&branch=${encodeURIComponent(branch)}&regulation=${encodeURIComponent(
          regulation
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const { success, data, count } = await response.json();

      if (!success) {
        throw new Error("Failed to fetch courses");
      }

      setCourses(data);

      setFlashMessage({
        type: "success",
        message: `Found ${count} courses`,
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      setFlashMessage({
        type: "error",
        message: error.message || "Failed to fetch courses.",
      });
    }
  };

  const addCourse = async () => {
    // Validate required fields
    const requiredFields = [
      "courseCode",
      "name",
      "credits",
      "type",
      "department",
      "semester",
      "regulation",
    ];
    const missingFields = requiredFields.filter((field) => !newCourse[field]);

    if (missingFields.length > 0) {
      setFlashMessage({
        type: "error",
        message: `Please fill in: ${missingFields.join(", ")}`,
      });
      return;
    }

    // Validate credits is a number
    if (isNaN(newCourse.credits)) {
      setFlashMessage({
        type: "error",
        message: "Credits must be a number",
      });
      return;
    }

    try {
      const response = await fetch("/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCourse,
          credits: Number(newCourse.credits),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add course");
      }

      setShowModal(false);
      setNewCourse({
        courseCode: "",
        name: "",
        shortName: "",
        credits: "",
        type: "THEORY",
        department: "",
        semester: "",
        regulation: "",
        category: {},
      });

      await fetchCourses();

      setFlashMessage({
        type: "success",
        message: data.message || "Course added successfully!",
      });
    } catch (error) {
      console.error("Error adding course:", error);
      setFlashMessage({
        type: "error",
        message: error.message || "Failed to add course.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#EDE6DA]">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#EDE6DA] min-h-screen font-sans relative">
      {/* Navbar */}
      <div className="bg-[#F6F1E6] px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-md">
        <div className="flex gap-4 mb-2 md:mb-0">
          {/* Dropdowns */}
          <select
            className="border border-gray-400 p-2 rounded bg-white text-black"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            {availableSemesters.map((sem) => (
              <option key={sem.id} value={sem.value}>
                {sem.label}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-400 p-2 rounded bg-white text-black"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            {availableBranches.map((branch) => (
              <option key={branch.id} value={branch.value}>
                {branch.label}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-400 p-2 rounded bg-white text-black"
            value={regulation}
            onChange={(e) => setRegulation(e.target.value)}
          >
            <option value="">Select Regulation</option>
            {availableRegulations.map((reg) => (
              <option key={reg.id} value={reg.value}>
                {reg.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={fetchCourses}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            View
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Flash Message */}
      {flashMessage.message && (
        <div
          className={`fixed bottom-4 left-4 z-50 p-4 rounded-lg text-white shadow-lg transition-opacity duration-500 ${
            flashMessage.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {flashMessage.message}
        </div>
      )}

      {/* Course Table */}
      <div className="p-6">
        {courses.length > 0 ? (
          <table className="w-full table-auto bg-white shadow-md rounded-md">
            <thead className="bg-[#F6F1E6] text-black">
              <tr>
                <th className="p-2 border">Course Code</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Short Name</th>
                <th className="p-2 border">Credits</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Department</th>
                <th className="p-2 border">Semester</th>
                <th className="p-2 border">Regulation</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course._id}
                  className="text-center hover:bg-gray-100 transition-colors"
                >
                  <td className="p-2 border">{course.courseCode}</td>
                  <td className="p-2 border">{course.name}</td>
                  <td className="p-2 border">{course.shortName}</td>
                  <td className="p-2 border">{course.credits}</td>
                  <td className="p-2 border">{course.type}</td>
                  <td className="p-2 border">{course.department}</td>
                  <td className="p-2 border">{course.semester}</td>
                  <td className="p-2 border">{course.regulation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No courses to display</p>
        )}
      </div>

      {/* Add Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#F6F1E6] p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Add Course
            </h2>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Course Code"
                value={newCourse.courseCode}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, courseCode: e.target.value })
                }
                className="border border-gray-400 p-2 rounded text-black"
              />
              <input
                type="text"
                placeholder="Name"
                value={newCourse.name}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, name: e.target.value })
                }
                className="border border-gray-400 p-2 rounded text-black"
              />
              <input
                type="text"
                placeholder="Short Name"
                value={newCourse.shortName}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, shortName: e.target.value })
                }
                className="border border-gray-400 p-2 rounded text-black"
              />
              <input
                type="number"
                placeholder="Credits"
                value={newCourse.credits}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, credits: e.target.value })
                }
                className="border border-gray-400 p-2 rounded text-black"
              />
              <select
                value={newCourse.type}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, type: e.target.value })
                }
                className="border border-gray-400 p-2 rounded text-black"
              >
                <option value="THEORY">Theory</option>
                <option value="LAB">Lab</option>
                <option value="PROJECT">Project</option>
              </select>
              <select
                value={newCourse.department}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, department: e.target.value })
                }
                className="border border-gray-400 p-2 rounded text-black"
              >
                <option value="">Select Department</option>
                {availableBranches.map((branch) => (
                  <option key={branch.id} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </select>
              <select
                value={newCourse.semester}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, semester: e.target.value })
                }
                className="border border-gray-400 p-2 rounded text-black"
              >
                <option value="">Select Semester</option>
                {availableSemesters.map((sem) => (
                  <option key={sem.id} value={sem.value}>
                    {sem.label}
                  </option>
                ))}
              </select>
              <select
                value={newCourse.regulation}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, regulation: e.target.value })
                }
                className="border border-gray-400 p-2 rounded text-black"
              >
                <option value="">Select Regulation</option>
                {availableRegulations.map((reg) => (
                  <option key={reg.id} value={reg.value}>
                    {reg.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 px-4 py-2 rounded text-white hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addCourse}
                className="bg-black px-4 py-2 rounded text-white hover:bg-gray-800 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCourses;
