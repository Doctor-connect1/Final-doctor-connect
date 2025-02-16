"use client";

import { useState, useEffect } from "react";
import PageContainer from "../components/PageContainer";
import { FiSearch, FiFilter, FiTrash2 } from "react-icons/fi";

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fix: Add type for patient
  interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    lastVisit: string;
  }

  // Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/doctor/patients/get-them", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch patients");
        const data = await response.json();
        setPatients(data as Patient[]); // Add type assertion
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // Filtered patients based on search term
  const filteredPatients = patients.filter((patient: Patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const email = patient.email.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())
    );
  });

  // Handle appointment deletion with confirmation
  const handleDelete = async (patientId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this patient's appointment?"
      )
    ) {
      return;
    }

    try {
      setDeletingId(patientId);
      const token = localStorage.getItem("token");

      // First, find the appointment ID for this patient
      const patient = patients.find((p) => p.id === patientId);
      if (!patient) throw new Error("Patient not found");

      const response = await fetch(`/api/doctor/patients/${patientId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete appointment");

      // Remove patient from local state
      setPatients((prev) => prev.filter((p) => p.id !== patientId));
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <PageContainer title="Patients">Loading...</PageContainer>;
  }

  return (
    <PageContainer title="Patients">
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85] text-gray-800 placeholder-gray-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiFilter />
            <span className="text-black hover:text-[#007E85] transition-colors duration-200">
              Filters
            </span>
          </button>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-[#007E85]/10 flex items-center justify-center">
                          <span className="text-[#007E85] font-medium">
                            {patient.firstName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[#1F2937]">
                          {patient.firstName} {patient.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-800">{patient.email}</div>
                    <div className="text-sm text-gray-600">{patient.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-800">
                      {new Date(patient.lastVisit).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDelete(patient.id)}
                        className="text-red-500 hover:text-red-600"
                        disabled={deletingId === patient.id}
                      >
                        {deletingId === patient.id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                        ) : (
                          <FiTrash2 />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};

export default PatientsPage;
