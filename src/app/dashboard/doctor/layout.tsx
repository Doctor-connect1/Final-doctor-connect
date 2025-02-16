"use client";

import { useState, useEffect } from "react";
import SideNavigation from "./components/SideNavigation";
import TopNavigation from "./components/TopNavigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    const fetchDoctorName = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/doctor/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setDoctorName(`${data.firstName} ${data.lastName}`);
      } catch (error) {
        console.error("Error fetching doctor name:", error);
      }
    };

    fetchDoctorName();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#007E85]">
      <SideNavigation />
      <div className="flex-1 ml-32">
        <div className="min-h-screen bg-gray-50 rounded-l-[40px] p-8">
          <TopNavigation doctorName={doctorName} />
          <main className="mt-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
