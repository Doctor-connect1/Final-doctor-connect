"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageContainer from "../components/PageContainer";

interface Appointment {
  id: number;
  patientName: string;
  date: string;
  status: "Completed" | "Cancelled";
}

export default function HistoryPage() {
  const [visits, setVisits] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/doctor/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch appointment history");
        }

        const data = await response.json();
        setVisits(data);
      } catch (error) {
        console.error("Error fetching appointment history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentHistory();
  }, []);

  if (loading) {
    return (
      <PageContainer title="Visit History">
        <div>Loading...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Visit History">
      <div className="space-y-4">
        {visits.map((visit, index) => (
          <motion.div
            key={visit.id}
            className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-[#1F2937]">
                  {visit.patientName}
                </h3>
                <p className="text-sm text-gray-600">
                  Date: {new Date(visit.date).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  visit.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {visit.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </PageContainer>
  );
}
