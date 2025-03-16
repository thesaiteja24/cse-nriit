import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const CreateBatch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [assignFacultyDropdown, setAssignFacultyDropdown] = useState(false);
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [regulation, setRegulation] = useState("");
  const [batchName, setBatchName] = useState("");

  // Dropdown options state
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [availableBranches, setAvailableBranches] = useState([]);
  const [availableRegulations, setAvailableRegulations] = useState([]);

  const fetchDropdownOptions = async () => {
    setIsLoading(true);
    try {
      const [semestersRes, branchesRes, regulationsRes] = await Promise.all([
        axios.get(`${backend_url}courses/api/semesters`),
        axios.get(`${backend_url}courses/api/branches`),
        axios.get(`${backend_url}courses/api/regulations`),
      ]);

      setAvailableSemesters(semestersRes.data);
      setAvailableBranches(branchesRes.data);
      setAvailableRegulations(regulationsRes.data);
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
      toast.error("Failed to load dropdown options");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreateBatch = async () => {
    setIsLoading(true);
    try {
      console.log(
        "Sem",
        semester,
        "Brach",
        branch,
        "Reg",
        regulation,
        "Batch Name",
        batchName
      );
    } catch (error) {}
  };
  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  return (
    <div className="bg-[#EDE6DA] min-h-screen  relative">
      {/* Create Batch */}
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={
          assignFacultyDropdown ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }
        }
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`bg-[#F6F1E6] p-4 md:p-6 flex flex-col justify-between gap-5 lg:flex-row shadow-md ${
          assignFacultyDropdown ? "hidden" : "flex"
        }`}
      >
        <div className="flex flex-col gap-3 md:flex-row">
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
          <input
            className="w-full border border-gray-400 p-2 rounded bg-white text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            placeholder="Enter Batch Name"
            value={batchName}
            onChange={(e) => {
              setBatchName(e.target.value);
            }}
          ></input>
        </div>

        <div className="flex flex-col gap-3 justify-end md:flex-row">
          <button
            className="flex-1 sm:flex-none bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-black"
            onClick={handleCreateBatch}
          >
            Create Batch
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateBatch;
