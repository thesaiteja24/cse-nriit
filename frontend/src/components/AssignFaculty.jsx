import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";

const AssignFaculty = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const location = useLocation();
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [regulation, setRegulation] = useState("");
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [flashMessage, setFlashMessage] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFaculty1, setSelectedFaculty1] = useState("");
  const [selectedFaculty2, setSelectedFaculty2] = useState("");
  const [selectedFaculty3, setSelectedFaculty3] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [visibleDropdown, setVisibleDropdown] = useState(null);

  // Dropdown options state
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

  const assignFaculty = () => {
    try {
      if (!selectedCourse) {
        setFlashMessage({ type: "error", message: "Please select a course" });
        return;
      }

      if (!selectedFaculty1 && !selectedFaculty2 && !selectedFaculty3) {
        setFlashMessage({
          type: "error",
          message: "Please select at least one faculty for the course",
        });
        return;
      }

      const courseDetails = selectedCourse.split(","); // Convert the value into an array
      const faculty1Details = selectedFaculty1
        ? selectedFaculty1.split(",")
        : ["", "No faculty assigned"];
      const faculty2Details = selectedFaculty2
        ? selectedFaculty2.split(",")
        : ["", "No faculty assigned"];
      const faculty3Details = selectedFaculty3
        ? selectedFaculty3.split(",")
        : ["", "No faculty assigned"];

      setAssigned((prevAssigned) => [
        ...prevAssigned,
        {
          courseId: courseDetails[0],
          course: courseDetails[1],
          faculty1Id: faculty1Details[0],
          faculty1: faculty1Details[1],
          faculty2Id: faculty2Details[0],
          faculty2: faculty2Details[1],
          faculty3Id: faculty3Details[0],
          faculty3: faculty3Details[1],
        },
      ]);

      // Reset selections
      setSelectedCourse("");
      setSelectedFaculty1("");
      setSelectedFaculty2("");
      setSelectedFaculty3("");

      setFlashMessage({
        type: "success",
        message: "Faculty assigned successfully!",
      });
    } catch (err) {
      console.error("Error assigning faculty:", err);
      setFlashMessage({
        type: "error",
        message: "Failed to assign faculty. Please try again.",
      });
    }
  };

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

  const fetchFaculty = async () => {
    if (!branch) {
      setFlashMessage({
        type: "error",
        message: "Please select a valid branch.",
      });
      return;
    } else if (!courses) {
      setFlashMessage({
        type: "error",
        message: "Courses are not available for current selection",
      });
      return;
    }
    try {
      const response = await axios.get(`${backend_url}api/faculty`, {
        params: { department: branch },
      });

      if (!response.data.success) {
        throw new Error("Failed to fetch Faculty");
      }

      setFaculty(response.data.data);
      setFlashMessage({
        type: "success",
        message: `Found ${response.data.count} faculty`,
      });
    } catch (error) {
      console.error("Error fetching faculty:", error);
      setFlashMessage({
        type: "error",
        message: error.message || "Failed to fetch faculty.",
      });
    }
  };

  const toggleDropdown = (courseId) => {
    if (visibleDropdown === courseId) {
      setVisibleDropdown(null); // Close the dropdown if the same course is clicked
    } else {
      setVisibleDropdown(courseId); // Open the dropdown for the clicked course
    }
  };

  const deleteAssignment = (Id) => {
    try {
      // Filter out the course with the given courseId
      const updatedAssigned = assigned.filter(
        (item) => item.courseId !== Id
      );

      // Update the state with the new filtered array
      setAssigned(updatedAssigned);

      setFlashMessage({
        type: "success",
        message: "Course deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      setFlashMessage({
        type: "error",
        message: "Failed to delete course. Please try again.",
      });
    }
  };
  return (
    <>
      <Helmet>
        <title>Assing Courses</title>
        <meta name="description" content="Assign Courses to faculty" />
        <meta name="keywords" content="courses, education, react" />
      </Helmet>
      <div className="bg-[#EDE6DA] min-h-screen font-sans relative">
        {/* Navbar */}
        <div className="bg-[#F6F1E6] p-4 md:p-6 flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto m-1">
            {/* Dropdowns */}
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

          <div className="flex gap-3 justify-end m-1">
            <button
              onClick={() => {
                fetchCourses();
                fetchFaculty();
              }}
              className="flex-1 sm:flex-none bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Get Faculty and Courses
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

        {/* Assign Faculty */}

        <div className="bg-transparent p-4 md:p-6 flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto m-1">
            <select
              className="w-full border border-gray-400 p-2 rounded bg-white text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map((courses) => (
                <option
                  key={courses._id}
                  value={[courses._id, courses.shortName]}
                >
                  {courses.shortName}
                </option>
              ))}
            </select>

            <select
              className="w-full border border-gray-400 p-2 rounded bg-white text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              value={selectedFaculty1}
              onChange={(e) => setSelectedFaculty1(e.target.value)}
            >
              <option value="">Select Faculty 1</option>
              {faculty.map((faculty) => (
                <option key={faculty._id} value={[faculty._id, faculty.name]}>
                  {faculty.name}
                </option>
              ))}
            </select>

            <select
              className="w-full border border-gray-400 p-2 rounded bg-white text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              value={selectedFaculty2}
              onChange={(e) => setSelectedFaculty2(e.target.value)}
            >
              <option value="">Select Faculty 2</option>
              {faculty.map((faculty) => (
                <option key={faculty._id} value={[faculty._id, faculty.name]}>
                  {faculty.name}
                </option>
              ))}
            </select>
            <select
              className="w-full border border-gray-400 p-2 rounded bg-white text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              value={selectedFaculty3}
              onChange={(e) => setSelectedFaculty3(e.target.value)}
            >
              <option value="">Select Faculty 3</option>
              {faculty.map((faculty) => (
                <option key={faculty._id} value={[faculty._id, faculty.name]}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 w-full sm:w-auto m-1">
            <button
              className="flex-1 sm:flex-none bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-black"
              onClick={assignFaculty}
            >
              Save{" "}
            </button>
          </div>
        </div>

        {/* Assigned Faculty table*/}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {assigned.length > 0 ? (
              assigned.map((assigned) => (
                <div
                  key={assigned.courseId}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                          {assigned.course}
                        </h5>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Faculty 1</span>{" "}
                            <b>{assigned.faculty1}</b>
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Faculty 2</span>{" "}
                            <b>{assigned.faculty2}</b>
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Faculty 3</span>{" "}
                            <b>{assigned.faculty3}</b>
                          </p>
                        </div>
                      </div>

                      {/* Actions Dropdown */}
                      <div className="relative ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(assigned.courseId);
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

                        {visibleDropdown === assigned.courseId && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10 overflow-hidden">
                            <button
                              onClick={() =>
                                deleteAssignment(assigned.courseId)
                              }
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

        {/* Add Course Modal */}
        {showModal && <div></div>}
      </div>
    </>
  );
};

export default AssignFaculty;
