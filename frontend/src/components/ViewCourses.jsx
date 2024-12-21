import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";

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

  const [newCourse, setNewCourse] = useState({
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

  const [selectedCourse, setSelectedCourse] = useState(null);

  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [availableBranches, setAvailableBranches] = useState([]);
  const [availableRegulations, setAvailableRegulations] = useState([]);

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

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

      setAvailableSemesters(semestersRes.data);
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
      const response = await axios.get(`${backend_url}courses`, {
        params: { semester, branch, regulation },
      });

      if (!response.data.success) {
        throw new Error("Failed to fetch courses");
      }

      setCourses(response.data.data);
      setFlashMessage({
        type: "success",
        message: `Found ${response.data.count} courses`,
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      setFlashMessage({
        type: "error",
        message: error.message || "Failed to fetch courses.",
      });
    }
  };

  const saveCourse = async () => {
    try {
      const url = selectedCourse
        ? `${backend_url}courses/${selectedCourse._id}`
        : `${backend_url}courses`;
      const method = selectedCourse ? "put" : "post";

      const response = await axios[method](url, selectedCourse || newCourse);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to save course");
      }

      setShowModal(false);
      setSelectedCourse(null);
      fetchCourses();

      setFlashMessage({
        type: "success",
        message: response.data.message || "Course saved successfully!",
      });
    } catch (error) {
      console.error("Error saving course:", error);
      setFlashMessage({
        type: "error",
        message: error.message || "Failed to save course.",
      });
    }
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await axios.delete(`${backend_url}courses/${courseId}`);

      if (!response.data.success) {
        throw new Error("Failed to delete course");
      }

      fetchCourses();

      setFlashMessage({
        type: "success",
        message: response.data.message || "Course deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      setFlashMessage({
        type: "error",
        message: error.message || "Failed to delete course.",
      });
    }
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleInputChange = (key, value) => {
    const updated = selectedCourse ? { ...selectedCourse } : { ...newCourse };
    updated[key] = value;
    if (selectedCourse) setSelectedCourse(updated);
    else setNewCourse(updated);
  };

  return (
    <>
      <Helmet>
        <title>Courses</title>
        <meta name="description" content="Explore our courses" />
        <meta name="keywords" content="courses, education, react" />
      </Helmet>
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

        {/* Courses Display as Cards */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course._id}
                className="flex justify-between w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-200 dark:border-gray-700 p-4 m-2"
              >
                <div className="flex flex-col items-start">
                  <h5 className="mb-1 text-lg font-medium text-gray-900 dark:text-black">
                    {course.name}
                  </h5>
                  <span className="text-sm text-gray-500 dark:text-black">
                    Course Code: {course.courseCode}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-black">
                    Credits: {course.credits}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-black">
                    Type: {course.type}
                  </span>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="text-gray-500 dark:text-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg"
                  >
                    <svg
                      className="w-5 h-5 hover:text-gray-700 dark:hover:text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 16 3"
                    >
                      <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                    </svg>
                  </button>
                  {selectedCourse === course && (
                    <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-md z-10">
                      <button
                        onClick={() => openEditModal(course)}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCourse(course._id)}
                        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-200"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No courses to display</p>
          )}
        </div>

        {/* Add/Edit Course Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#F6F1E6] p-6 rounded shadow-md w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-black">
                {selectedCourse ? "Edit Course" : "Add Course"}
              </h2>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Course Code"
                  value={
                    selectedCourse
                      ? selectedCourse.courseCode
                      : newCourse.courseCode
                  }
                  onChange={(e) =>
                    handleInputChange("courseCode", e.target.value)
                  }
                  className="border border-gray-400 p-2 rounded text-black"
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={selectedCourse ? selectedCourse.name : newCourse.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border border-gray-400 p-2 rounded text-black"
                />
                <input
                  type="number"
                  placeholder="Credits"
                  value={
                    selectedCourse ? selectedCourse.credits : newCourse.credits
                  }
                  onChange={(e) => handleInputChange("credits", e.target.value)}
                  className="border border-gray-400 p-2 rounded text-black"
                />
                <select
                  value={selectedCourse ? selectedCourse.type : newCourse.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="border border-gray-400 p-2 rounded text-black"
                >
                  <option value="THEORY">Theory</option>
                  <option value="LAB">Lab</option>
                  <option value="PROJECT">Project</option>
                </select>
                <select
                  value={
                    selectedCourse
                      ? selectedCourse.department
                      : newCourse.department
                  }
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
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
                  value={
                    selectedCourse
                      ? selectedCourse.semester
                      : newCourse.semester
                  }
                  onChange={(e) =>
                    handleInputChange("semester", e.target.value)
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
                  value={
                    selectedCourse
                      ? selectedCourse.regulation
                      : newCourse.regulation
                  }
                  onChange={(e) =>
                    handleInputChange("regulation", e.target.value)
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
                  onClick={() => {
                    setShowModal(false);
                    setSelectedCourse(null);
                  }}
                  className="bg-gray-400 px-4 py-2 rounded text-white hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCourse}
                  className="bg-black px-4 py-2 rounded text-white hover:bg-gray-800 transition-colors"
                >
                  {selectedCourse ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewCourses;
