import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";

const ViewCourses = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const axiosInstance = axios.create({
    withCredentials: true, // Important for session cookies
    
    baseURL: backend_url,
  });

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
  const [visibleDropdown, setVisibleDropdown] = useState(null);

  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [availableBranches, setAvailableBranches] = useState([]);
  const [availableRegulations, setAvailableRegulations] = useState([]);

  useEffect(() => {
    fetchDropdownOptions();
    // Add event listener to close dropdown on outside click
    const handleClickOutside = () => setVisibleDropdown(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (flashMessage.message) {
      const timer = setTimeout(() => {
        setFlashMessage({ type: "", message: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  const fetchDropdownOptions = async () => {
    setIsLoading(true);
    try {
      const [semestersRes, branchesRes, regulationsRes] = await Promise.all([
        axiosInstance.get(`${backend_url}api/semesters`),
        axiosInstance.get(`${backend_url}api/branches`),
        axiosInstance.get(`${backend_url}api/regulations`),
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
      const response = await axiosInstance.get(`${backend_url}courses`, {
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

      const response = await axiosInstance[method](
        url,
        selectedCourse || newCourse
      );

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
      const response = await axiosInstance.delete(
        `${backend_url}courses/${courseId}`
      );

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

  const toggleDropdown = (courseId) => {
    setVisibleDropdown(visibleDropdown === courseId ? null : courseId);
  };

  return (
    <>
      <Helmet>
        <title>Courses</title>
        <meta name="description" content="Explore our courses" />
        <meta name="keywords" content="courses, education, react" />
      </Helmet>
      <div className="bg-[#EDE6DA] min-h-screen font-sans relative">
        {/* Responsive Navbar */}
        <div className="bg-[#F6F1E6] p-4 md:p-6 flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between shadow-md">
          {/* Filters Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full md:w-auto m-1">
            <select
              className="w-full border border-gray-400 p-2 rounded bg-white text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
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
              className="w-full border border-gray-400 p-2 rounded bg-white text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
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
              className="w-full border border-gray-400 p-2 rounded bg-white text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
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

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end m-1">
            <button
              onClick={fetchCourses}
              className="flex-1 sm:flex-none bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              View
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 sm:flex-none bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Add
            </button>
          </div>
        </div>

        {/* Flash Message */}
        {flashMessage.message && (
          <div
            className={`fixed bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-96 z-50 p-4 rounded-lg text-white shadow-lg transition-all transform duration-500 ${
              flashMessage.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {flashMessage.message}
          </div>
        )}

        {/* Responsive Course Grid */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                          {course.name}
                        </h5>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Code:</span>{" "}
                            {course.courseCode}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Credits:</span>{" "}
                            {course.credits}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Type:</span>{" "}
                            {course.type}
                          </p>
                        </div>
                      </div>

                      {/* Actions Dropdown */}
                      <div className="relative ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(course._id);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <svg
                            className="w-5 h-5 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 16 3"
                          >
                            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                          </svg>
                        </button>

                        {visibleDropdown === course._id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10 overflow-hidden">
                            <button
                              onClick={() => openEditModal(course)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
                            >
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => deleteCourse(course._id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                            >
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center p-8">
                <p className="text-gray-500 text-lg">No courses to display</p>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Course Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-[#F6F1E6] rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-6 text-black">
                  {selectedCourse ? "Edit Course" : "Add Course"}
                </h2>
                <div className="space-y-4">
                  {/* Course Code */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Course Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter course code"
                      value={
                        selectedCourse
                          ? selectedCourse.courseCode
                          : newCourse.courseCode
                      }
                      onChange={(e) =>
                        handleInputChange("courseCode", e.target.value)
                      }
                      className="w-full border border-gray-400 p-3 rounded text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Course Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Course Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter course name"
                      value={
                        selectedCourse ? selectedCourse.name : newCourse.name
                      }
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full border border-gray-400 p-3 rounded text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Short Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Short Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter course name"
                      value={
                        selectedCourse ? selectedCourse.shortName : newCourse.shortName
                      }
                      onChange={(e) =>
                        handleInputChange("shortName", e.target.value)
                      }
                      className="w-full border border-gray-400 p-3 rounded text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Credits */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Credits
                    </label>
                    <input
                      type="number"
                      placeholder="Enter credits"
                      value={
                        selectedCourse
                          ? selectedCourse.credits
                          : newCourse.credits
                      }
                      onChange={(e) =>
                        handleInputChange("credits", e.target.value)
                      }
                      className="w-full border border-gray-400 p-3 rounded text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Course Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Course Type
                    </label>
                    <select
                      value={
                        selectedCourse ? selectedCourse.type : newCourse.type
                      }
                      onChange={(e) =>
                        handleInputChange("type", e.target.value)
                      }
                      className="w-full border border-gray-400 p-3 rounded text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    >
                      <option value="THEORY">Theory</option>
                      <option value="LAB">Lab</option>
                      <option value="PROJECT">Project</option>
                    </select>
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <select
                      value={
                        selectedCourse
                          ? selectedCourse.department
                          : newCourse.department
                      }
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                      className="w-full border border-gray-400 p-3 rounded text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    >
                      <option value="">Select Department</option>
                      {availableBranches.map((branch) => (
                        <option key={branch.id} value={branch.value}>
                          {branch.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Semester */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Semester
                    </label>
                    <select
                      value={
                        selectedCourse
                          ? selectedCourse.semester
                          : newCourse.semester
                      }
                      onChange={(e) =>
                        handleInputChange("semester", e.target.value)
                      }
                      className="w-full border border-gray-400 p-3 rounded text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    >
                      <option value="">Select Semester</option>
                      {availableSemesters.map((sem) => (
                        <option key={sem.id} value={sem.value}>
                          {sem.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Regulation */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Regulation
                    </label>
                    <select
                      value={
                        selectedCourse
                          ? selectedCourse.regulation
                          : newCourse.regulation
                      }
                      onChange={(e) =>
                        handleInputChange("regulation", e.target.value)
                      }
                      className="w-full border border-gray-400 p-3 rounded text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    >
                      <option value="">Select Regulation</option>
                      {availableRegulations.map((reg) => (
                        <option key={reg.id} value={reg.value}>
                          {reg.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setSelectedCourse(null);
                      }}
                      className="w-full sm:w-auto bg-gray-400 px-6 py-2 rounded text-white hover:bg-gray-500 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveCourse}
                      className="w-full sm:w-auto bg-black px-6 py-2 rounded text-white hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      {selectedCourse ? "Update" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewCourses;
