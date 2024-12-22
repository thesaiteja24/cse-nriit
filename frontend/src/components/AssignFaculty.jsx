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
      } else if (!selectedFaculty1 && !selectedFaculty2 && !selectedFaculty3) {
        setFlashMessage({
          type: "error",
          message: "Please select atleast one faculty for the course",
        });
        return;
      }
      setAssigned([
        ...assigned,
        {
          faculty1: selectedFaculty1,
          faculty2: selectedFaculty2,
          faculty3: selectedFaculty3,
          course: selectedCourse,
        },
      ]);
      setSelectedCourse("");
      setSelectedFaculty1("");
      setSelectedFaculty2("");
      setSelectedFaculty3("");
    } catch (err) {
      console.error("Error assigning faculty", err);
      setFlashMessage({
        type: "error",
        message: "Cannot assign faculty. Please try again.",
      });
    }

    console.log(assigned);
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

  const openEditModal = (course) => {
    setShowModal(true);
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
              onClick={() => {
                fetchCourses();
                fetchFaculty();
              }}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Get Faculty and Courses
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

        {/* Assign Faculty */}
        <div className="flex gap-4 m-6 md:mb-0">
          <select
            className="border border-gray-400 p-2 rounded bg-white text-black"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select Course</option>
            {courses.map((courses) => (
              <option key={courses._id} value={courses.shortName}>
                {courses.shortName}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-400 p-2 rounded bg-white text-black"
            value={selectedFaculty1}
            onChange={(e) => setSelectedFaculty1(e.target.value)}
          >
            <option value="">Select Faculty 1</option>
            {faculty.map((faculty) => (
              <option key={faculty._id} value={faculty.name}>
                {faculty.name}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-400 p-2 rounded bg-white text-black"
            value={selectedFaculty2}
            onChange={(e) => setSelectedFaculty2(e.target.value)}
          >
            <option value="">Select Faculty 2</option>
            {faculty.map((faculty) => (
              <option key={faculty._id} value={faculty.name}>
                {faculty.name}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-400 p-2 rounded bg-white text-black"
            value={selectedFaculty3}
            onChange={(e) => setSelectedFaculty3(e.target.value)}
          >
            <option value="">Select Faculty 3</option>
            {faculty.map((faculty) => (
              <option key={faculty._id} value={faculty.name}>
                {faculty.name}
              </option>
            ))}
          </select>
          <button
            className="bg-black text-white px-4 py-2 rounded-full hover:bg-green-600 hover:text-white transition-colors"
            onClick={assignFaculty}
          >
            Save{" "}
          </button>
        </div>
        {/* Assigned Faculty table*/}
        <div className="p-6">
          {assigned.length > 0 ? (
            <table className="w-full table-auto bg-white shadow-md rounded-md">
              <thead className="bg-[#F6F1E6] text-black">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Faculty 1t</th>
                  <th className="p-2 border">Faculty 2</th>
                  <th className="p-2 border">Faculty 3</th>
                </tr>
              </thead>
              <tbody>
                {assigned.map((assigned) => (
                  <tr
                    // key={faculty._id}
                    className="text-center hover:bg-gray-100"
                  >
                    <td className="p-2 border">{assigned.course}</td>
                    <td className="p-2 border">
                      {assigned.faculty1
                        ? assigned.faculty1
                        : "No faculty assigned"}
                    </td>
                    <td className="p-2 border">
                      {assigned.faculty2
                        ? assigned.faculty2
                        : "No faculty assigned"}
                    </td>
                    <td className="p-2 border">
                      {assigned.faculty3
                        ? assigned.faculty3
                        : "No faculty assigned"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">No Faculty to display</p>
          )}
        </div>

        {/* Add Course Modal */}
        {showModal && <div></div>}
      </div>
    </>
  );
};

export default AssignFaculty;
