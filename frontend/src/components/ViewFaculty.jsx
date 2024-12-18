import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

const ViewFaculty = () => {
  const location = useLocation();
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [regulation, setRegulation] = useState("");
  const [faculty, setFaculty] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [flashMessage, setFlashMessage] = useState({ type: "", message: "" });

  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [availableBranches, setAvailableBranches] = useState([]);
  const [availableRegulations, setAvailableRegulations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newFaculty, setNewFaculty] = useState({
    name: "",
    department: "",
    contactNumber: "",
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
        fetch("/api/semesters"),
        fetch("/api/branches"),
        fetch("/api/regulations"),
      ]);

      const [semesters, branches, regulations] = await Promise.all([
        semestersRes.json(),
        branchesRes.json(),
        regulationsRes.json(),
      ]);

      setAvailableSemesters(semesters);
      setAvailableBranches(branches);
      setAvailableRegulations(regulations);
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
    if (!semester || !branch || !regulation) {
        setFlashMessage({
          type: "error",
          message: "Please select all filters before viewing Faculty.",
        });
        return;
      }
    try {
      const response = await fetch(
        `/faculty?semester=${semester}&branch=${branch}&regulation=${regulation}`
      );
      if (!response.ok) throw new Error("Failed to fetch faculty");
      const data = await response.json();
      setFaculty(data);
    } catch (error) {
      setFlashMessage({ type: "error", message: "Failed to fetch faculty." });
    }
  };

  const addFaculty = async () => {
    try {
      const response = await fetch("/faculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFaculty),
      });
      if (!response.ok) throw new Error("Failed to add faculty");

      setFaculty([...faculty, newFaculty]);
      setShowModal(false);
      setNewFaculty({ name: "", department: "", contactNumber: "" });

      setFlashMessage({
        type: "success",
        message: "Faculty added successfully!",
      });
      fetchFaculty();
    } catch (error) {
      setFlashMessage({ type: "error", message: "Failed to add faculty." });
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
      <div className="bg-[#F6F1E6] px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-md">
        <div className="flex gap-4 mb-2 md:mb-0">
          
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

          
        </div>
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
      <div className="flex gap-4 mb-2 md:mb-0 #EDE6DA p-6 rounded ">
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
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
  Load Courses
</button>

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
        <div className="bg-[#F6F1E6] p-6 rounded shadow-md w-full border border-black">
          <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            Load Courses
          </button>
        </div>

        <div className="p-6">
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
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#F6F1E6] p-6 rounded shadow-md w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-black">
                Add Faculty
              </h2>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={newFaculty.name}
                  onChange={(e) =>
                    setNewFaculty({ ...newFaculty, name: e.target.value })
                  }
                  className="border p-2 rounded text-black"
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={newFaculty.department}
                  onChange={(e) =>
                    setNewFaculty({ ...newFaculty, department: e.target.value })
                  }
                  className="border p-2 rounded text-black"
                />
                <input
                  type="text"
                  placeholder="Contact Number"
                  value={newFaculty.contactNumber}
                  onChange={(e) =>
                    setNewFaculty({
                      ...newFaculty,
                      contactNumber: e.target.value,
                    })
                  }
                  className="border p-2 rounded text-black"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 px-4 py-2 rounded text-white hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={addFaculty}
                  className="bg-black px-4 py-2 rounded text-white hover:bg-gray-800"
                >
                  Save
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
