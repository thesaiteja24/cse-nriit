import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";

const ViewFaculty = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const location = useLocation();
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [regulation, setRegulation] = useState("");
  const [faculty, setFaculty] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [flashMessage, setFlashMessage] = useState({ type: "", message: "" });

  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [availableBranches, setAvailableBranches] = useState([]);
  const [availableRegulations, setAvailableRegulations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newFaculty, setNewFaculty] = useState({
    name: "",
    department: "",
    contact: "",
  });

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setFlashMessage({
        type: location.state.type || "success",
        message: location.state.message,
      });

      const timer = setTimeout(() => {
        setFlashMessage({ type: "", message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

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
      setFlashMessage({
        type: "error",
        message: "Failed to load dropdown options.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFaculty = async () => {
    if (!branch || !semester || !regulation) {
      let missingFields = [];
      if (!branch) missingFields.push("Branch");
      if (!semester) missingFields.push("Semester");
      if (!regulation) missingFields.push("Regulation");

      setFlashMessage({
        type: "error",
        message: `Please select: ${missingFields.join(", ")}.`,
      });
      return;
    }
    try {
      const response = await axios.get(`${backend_url}api/faculty`, {
        params: { department: branch, semester, regulation },
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
      setFlashMessage({
        type: "error",
        message: error.message || "Failed to fetch faculty.",
      });
    }
  };

  const saveFaculty = async () => {
    try {
      const url = selectedFaculty
        ? `${backend_url}faculty/${selectedFaculty._id}`
        : `${backend_url}faculty`;
      const method = selectedFaculty ? "put" : "post";

      const response = await axios[method](url, selectedFaculty || newFaculty);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to save Faculty");
      }

      setShowModal(false);
      setSelectedFaculty(null);
      fetchFaculty();

      setFlashMessage({
        type: "success",
        message: response.data.message || "Faculty saved successfully!",
      });
    } catch (error) {
      setFlashMessage({
        type: "error",
        message: error.message || "Failed to save Faculty.",
      });
    }
  };

  const deleteFaculty = async (facultyId) => {
    if (!window.confirm("Are you sure you want to delete this Faculty?"))
      return;

    try {
      const response = await axios.delete(`${backend_url}faculty/${facultyId}`);

      if (!response.data.success) {
        throw new Error("Failed to delete Faculty");
      }

      fetchFaculty();

      setFlashMessage({
        type: "success",
        message: response.data.message || "Faculty deleted successfully!",
      });
    } catch (error) {
      setFlashMessage({
        type: "error",
        message: error.message || "Failed to delete Faculty.",
      });
    }
  };

  const openEditModal = (faculty) => {
    setSelectedFaculty(faculty);
    setShowModal(true);
  };

  const handleInputChange = (key, value) => {
    const updated = selectedFaculty
      ? { ...selectedFaculty }
      : { ...newFaculty };
    updated[key] = value;
    if (selectedFaculty) setSelectedFaculty(updated);
    else setNewFaculty(updated);
  };

  return (
    <>
      <Helmet>
        <title>Faculty</title>
        <meta name="description" content="Meet our faculty members" />
      </Helmet>
      <div className="bg-[#EDE6DA] min-h-screen font-sans relative">
        <div className="bg-[#F6F1E6] px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-md">
          <div className="flex gap-4 mb-2 md:mb-0">
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
              onClick={fetchFaculty}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              View
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Add
            </button>
          </div>
        </div>

        {flashMessage.message && (
          <div
            className={`fixed bottom-4 left-4 z-50 p-4 rounded-lg text-white ${
              flashMessage.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {flashMessage.message}
          </div>
        )}

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {faculty.length > 0 ? (
            faculty.map((fac) => (
              <div
                key={fac._id}
                className="flex justify-between w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-200 dark:border-gray-700 p-4 m-2"
              >
                <div className="flex flex-col items-start">
                  <h5 className="mb-1 text-lg font-medium text-gray-900 dark:text-black">
                    {fac.name}
                  </h5>
                  <span className="text-sm text-gray-500 dark:text-black">
                    Contact: {fac.contact.length === 2 ? `${fac.contact[0]}, ${fac.contact[1]}` : fac.contact[0]}
                  </span>
                </div>
                <button
                  onClick={() => openEditModal(fac)}
                  className="text-gray-500 dark:text-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg"
                  type="button"
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
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No Faculty to display</p>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#F6F1E6] p-6 rounded shadow-md w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-black">
                {selectedFaculty ? "Edit Faculty" : "Add Faculty"}
              </h2>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={
                    selectedFaculty ? selectedFaculty.name : newFaculty.name
                  }
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border border-gray-400 p-2 rounded text-black"
                />
                <select
                  value={
                    selectedFaculty
                      ? selectedFaculty.department
                      : newFaculty.department
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
                <input
                  type="tel"
                  placeholder="Contact Number"
                  value={
                    selectedFaculty
                      ? selectedFaculty.contact
                      : newFaculty.contact
                  }
                  onChange={(e) =>
                    handleInputChange("contact", e.target.value)
                  }
                  className="border border-gray-400 p-2 rounded text-black"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedFaculty(null);
                  }}
                  className="bg-gray-400 px-4 py-2 rounded text-white hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveFaculty}
                  className="bg-black px-4 py-2 rounded text-white hover:bg-gray-800 transition-colors"
                >
                  {selectedFaculty ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewFaculty;
