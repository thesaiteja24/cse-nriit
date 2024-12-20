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

  const fetchFaculty = async () => {
    if (!branch) {
      setFlashMessage({
        type: "error",
        message: "Please select a valid branch.",
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
      console.error("Error saving Faculty:", error);
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
      console.error("Error deleting Faculty:", error);
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

        {/* Flash Message */}
        {flashMessage.message && (
          <div
            className={`fixed bottom-4 left-4 z-50 p-4 rounded-lg text-white ${
              flashMessage.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {flashMessage.message}
          </div>
        )}

        {/* Faculty Table */}
        <div className="p-6">
          {faculty.length > 0 ? (
            <table className="w-full table-auto bg-white shadow-md rounded-md">
              <thead className="bg-[#F6F1E6] text-black">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Department</th>
                  <th className="p-2 border">Contact Number</th>
                  <th className="p-2 border">Edit Faculty</th>
                  <th className="p-2 border">Delete Faculty</th>
                </tr>
              </thead>
              <tbody>
                {faculty.map((faculty) => (
                  <tr
                    key={faculty._id}
                    className="text-center hover:bg-gray-100"
                  >
                    <td className="p-2 border">{faculty.name}</td>
                    <td className="p-2 border">{faculty.department}</td>
                    <td className="p-2 border">{faculty.contact[0]}</td>

                    <td className="p-2 border">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                        onClick={() => openEditModal(faculty)}
                      >
                        Edit
                      </button>
                    </td>
                    <td className="p-2 border">
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => deleteFaculty(faculty._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">No Faculty to display</p>
          )}
        </div>

        {/* <div className="p-6">
          {faculty.length > 0 ? (
            <table className="w-full bg-white shadow-md rounded-md">
              <thead className="bg-[#F6F1E6] text-black">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Department</th>
                  <th className="p-2 border">Contact Number</th>
                </tr>
              </thead>
              <tbody>
                {faculty.map((fac, index) => (
                  <tr
                    key={index}
                    className="text-center hover:bg-gray-100 transition-colors"
                  >
                    <td className="p-2 border">{fac.name}</td>
                    <td className="p-2 border">{fac.department}</td>
                    <td className="p-2 border">{fac.contactNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">No faculty to display</p>
          )}
        </div> */}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#F6F1E6] p-6 rounded shadow-md w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-black">
                {selectedFaculty ? "Edit Faculty" : "Add Faculty"}
              </h2>
              <div className="flex flex-col gap-2">
                {/* name  */}
                <input
                  type="text"
                  placeholder="Name"
                  value={
                    selectedFaculty ? selectedFaculty.name : newFaculty.name
                  }
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border border-gray-400 p-2 rounded text-black"
                />

                {/* department */}
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

                {/* contact Number  */}
                <input
                  type="tel"
                  placeholder="Contact Number"
                  value={
                    selectedFaculty
                      ? selectedFaculty.contact
                      : newFaculty.contact
                  }
                  onChange={(e) => handleInputChange("contact", e.target.value)}
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
