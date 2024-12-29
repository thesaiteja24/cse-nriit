import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";

const ViewFaculty = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  // Add this near the top of your ViewFaculty component
  const axiosInstance = axios.create({
    withCredentials: true, // Important for session cookies
    baseURL: backend_url,
  });

  const [validationError, setValidationError] = useState(false);
  const location = useLocation();
  const [branch, setBranch] = useState("");
  const [faculty, setFaculty] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [flashMessage, setFlashMessage] = useState({ type: "", message: "" });
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [visibleDropdown, setVisibleDropdown] = useState(null);

  const [availableBranches, setAvailableBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const validateContactNumber = (number) => {
    const regex = /^[6-9]\d{9}$/; // Validates Indian mobile numbers (10 digits starting with 6-9)
    setValidationError(!regex.test(number)); // If invalid, set validationError to true
  };
  

  const [newFaculty, setNewFaculty] = useState({
    name: "",
    department: "",
    contact: "",
  });

  useEffect(() => {
    fetchDropdownOptions();
    const handleClickOutside = () => setVisibleDropdown(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
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

  useEffect(() => {
    if (flashMessage.message) {
      const timer = setTimeout(() => {
        setFlashMessage({ type: "", message: "" });
      }, 3000);

      // Cleanup the timeout on component unmount or when flashMessage changes
      return () => clearTimeout(timer);
    }
  }, [flashMessage.message]);

  const fetchDropdownOptions = async () => {
    setIsLoading(true);
    try {
      const branchesRes = await axiosInstance.get(`${backend_url}api/branches`);
      setAvailableBranches(branchesRes.data);
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
    if (!branch) {
      setFlashMessage({
        type: "error",
        message: "Please select a branch.",
      });
      return;
    }
    try {
      const response = await axiosInstance.get(`${backend_url}api/faculty`, {
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
      setFlashMessage({
        type: "error",
        message: error.message || "Failed to fetch faculty.",
      });
    }
  };

  const saveFaculty = async () => {
    try {
      // Validate required fields
      const facultyData = selectedFaculty || newFaculty;
      const { name, contact, department } = facultyData;
  
      if (!name || !contact || !department) {
        setFlashMessage({
          type: "error",
          message: "Name, contact, and department are required",
        });
        return;
      }
  
      const url = selectedFaculty
        ? `${backend_url}faculty/${selectedFaculty._id}`
        : `${backend_url}faculty`;
      const method = selectedFaculty ? "put" : "post";
  
      const response = await axiosInstance[method](url, {
        name,
        contact,
        department
      });
  
      if (response.data.success) {
        // Reset form state
        setShowModal(false);
        setShowAddModal(false);
        setSelectedFaculty(null);
        setNewFaculty({ name: '', contact: '', department: '' });
        
        // Fetch updated faculty list
        await fetchFaculty();
  
        // Show success message
        setFlashMessage({
          type: "success",
          message: response.data.message
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setFlashMessage({
        type: "error",
        message: error.response?.data?.message || error.message || "Failed to save Faculty."
      });
    }
  };

  const deleteFaculty = async (facultyId) => {
    if (!window.confirm("Are you sure you want to delete this Faculty?"))
      return;

    try {
      const response = await axiosInstance.delete(
        `${backend_url}faculty/${facultyId}`
      );

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
        message: error.response?.data?.message || error.message || "Failed to save Faculty."
      });
    }
  };

  const openEditModal = (faculty) => {
    setSelectedFaculty(faculty);
    setShowModal(true);
  };

  const openAddModal = () => {
    setSelectedFaculty(null);
    setShowAddModal(true);
  };

  const handleInputChange = (key, value) => {
    const updated = selectedFaculty
      ? { ...selectedFaculty }
      : { ...newFaculty };
    updated[key] = value;
  
    if (key === "contact") validateContactNumber(value); // Validate contact number
  
    if (selectedFaculty) setSelectedFaculty(updated);
    else setNewFaculty(updated);
  };
  

  const toggleDropdown = (facultyId) => {
    setVisibleDropdown(visibleDropdown === facultyId ? null : facultyId);
  };

  return (
    <>
      <Helmet>
        <title>Faculty</title>
        <meta name="description" content="Meet our faculty members" />
      </Helmet>
      <div className="bg-[#EDE6DA] min-h-screen font-sans relative">
        {/* Responsive Navbar */}
        <div className="bg-[#F6F1E6] p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between shadow-md space-y-4 sm:space-y-0">
          {/* Filter Section */}
          <div className="w-full sm:w-auto m-1">
            <select
              className="w-full sm:w-64 border border-gray-400 p-2 rounded bg-white text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
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

          {/* Action Buttons */}
          <div className="flex gap-3 w-full sm:w-auto m-1">
            {!showModal && !showAddModal && (
              <button
                onClick={fetchFaculty}
                className="flex-1 sm:flex-none bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                View
              </button>
            )}
            <button
              onClick={openAddModal}
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

        {/* Faculty Grid */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {faculty.length > 0 ? (
              faculty.map((fac) => (
                <div
                  key={fac._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="text-xl font-semibold text-gray-900 mb-3">
                          {fac.name}
                        </h5>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Contact:</span>{" "}
                            {fac.contact.length === 2
                              ? `${fac.contact[0]}, ${fac.contact[1]}`
                              : fac.contact[0]}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Department:</span>{" "}
                            {availableBranches.find(
                              (b) => b.value === fac.department
                            )?.label || fac.department}
                          </p>
                        </div>
                      </div>

                      {/* Actions Dropdown */}
                      <div className="relative ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(fac._id);
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
                        {visibleDropdown === fac._id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10 overflow-hidden">
                            <button
                              onClick={() => openEditModal(fac)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-300 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteFaculty(fac._id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-300 transition-colors"
                            >
                              Delete
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
                <p className="text-gray-500 text-lg">
                  No faculty members to display
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-[#F6F1E6] rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6 text-black">Edit Faculty</h2>
        <div className="space-y-4">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Enter faculty name"
              value={selectedFaculty.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full border border-gray-400 p-3 rounded text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>

          {/* Department Select */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              value={selectedFaculty.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
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

          {/* Contact Number Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <div className="flex space-x-2">
              {/* Country Code */}
              <div className="flex items-center border border-gray-400 p-3 rounded bg-gray-100">+91</div>

              {/* Contact Input */}
              <input
                type="tel"
                placeholder="Enter contact number"
                value={selectedFaculty.contact}
                onChange={(e) => handleInputChange("contact", e.target.value)}
                className="flex-1 border border-gray-400 p-3 rounded text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <p className="text-red-500 text-sm mt-2">Please enter a valid 10-digit mobile number.</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={() => {
              setShowModal(false);
              setSelectedFaculty(null);
            }}
            className="w-full sm:w-auto bg-gray-400 px-6 py-2 rounded text-white hover:bg-gray-500 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={saveFaculty}
            className="w-full sm:w-auto bg-black px-6 py-2 rounded text-white hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        {/* Add Modal */}
        {showAddModal && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
    onClick={() => setShowAddModal(false)} // Hide modal on background click
  >
    <div
      className="bg-[#F6F1E6] rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()} // Prevent hiding when clicking inside the modal
    >
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6 text-black">Add Faculty</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Enter faculty name"
              value={newFaculty.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full border border-gray-400 p-3 rounded text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              value={newFaculty.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
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

         <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Contact Number</label>
          <div className="flex space-x-2">
            {/* Country Code Box */}
            <div className="flex items-center border border-gray-400 p-3 rounded bg-gray-100">
              +91
            </div>

            {/* Mobile Number Input */}
            <input
              type="tel"
              placeholder="Enter contact number"
              value={newFaculty.contact}
              onChange={(e) => handleInputChange("contact", e.target.value)}
              className="flex-1 border border-gray-400 p-3 rounded text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>

        {/* Error Message */}
        {validationError && (
          <p className="text-red-500 text-sm mt-2">Please enter a valid 10-digit mobile number.</p>
        )}
      </div>

        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={() => setShowAddModal(false)}
            className="w-full sm:w-auto bg-gray-400 px-6 py-2 rounded text-white hover:bg-gray-500 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={saveFaculty}
            className="w-full sm:w-auto bg-black px-6 py-2 rounded text-white hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </>
  );
};

export default ViewFaculty;
