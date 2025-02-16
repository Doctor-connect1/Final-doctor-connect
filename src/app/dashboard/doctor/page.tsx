"use client";

import { useState, useEffect } from "react";
import PageContainer from "./components/PageContainer";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FiUsers,
  FiCalendar,
  FiTrendingUp,
  FiDollarSign,
} from "react-icons/fi";

interface VisitStats {
  total: number;
  newPatients: { count: number; growth: number };
  oldPatients: { count: number; growth: number };
  revenue: number;
}

interface ChartData {
  name: string;
  visits: number;
}

interface Appointment {
  id: number;
  patient: string;
  time: string;
  type: string;
}

const DoctorDashboard = () => {
  const [visitStats, setVisitStats] = useState<VisitStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch visit stats
        const statsResponse = await fetch("/api/doctor/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const statsData = await statsResponse.json();
        setVisitStats(statsData);

        // Fetch chart data
        const chartResponse = await fetch("/api/doctor/dashboard/visits", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!chartResponse.ok) {
          throw new Error("Failed to fetch chart data");
        }

        const chartData = await chartResponse.json();

        // Ensure data is in correct format for the chart
        const formattedChartData = chartData.map((item: any) => ({
          name: item.name,
          visits: Number(item.visits) || 0,
        }));

        // Sort data by day of the week
        const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        formattedChartData.sort(
          (a: any, b: any) =>
            daysOrder.indexOf(a.name) - daysOrder.indexOf(b.name)
        );

        setChartData(formattedChartData);

        // Fetch appointments
        const appointmentsResponse = await fetch(
          "/api/doctor/dashboard/appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const appointmentsData = await appointmentsResponse.json();
        setUpcomingAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <PageContainer title="Dashboard">
        <div>Loading...</div>
      </PageContainer>
    );
  }

  if (!visitStats) {
    return (
      <PageContainer title="Dashboard">
        <div>Error loading data</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FiUsers}
            title="Total Visits"
            value={visitStats.total}
            trend={"+12%"}
          />
          <StatCard
            icon={FiCalendar}
            title="New Patients"
            value={visitStats.newPatients.count}
            trend={`+${visitStats.newPatients.growth}%`}
          />
          <StatCard
            icon={FiTrendingUp}
            title="Old Patients"
            value={visitStats.oldPatients.count}
            trend={`${visitStats.oldPatients.growth}%`}
            trendDown
          />
          <StatCard
            icon={FiDollarSign}
            title="Revenue"
            value={`$${visitStats.revenue}`}
            trend={"+8%"}
          />
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Weekly Visits Overview</h3>
          <div className="h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6B7280" }}
                    axisLine={{ stroke: "#D1D5DB" }}
                  />
                  <YAxis
                    tick={{ fill: "#6B7280" }}
                    axisLine={{ stroke: "#D1D5DB" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    stroke="#007E85"
                    fill="#007E85"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Today's Appointments</h3>
          <div className="space-y-4">
            {upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h4 className="font-medium">{apt.patient}</h4>
                  <p className="text-sm text-gray-500">{apt.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#007E85] font-medium">{apt.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

interface StatCardProps {
  icon: any;
  title: string;
  value: string | number;
  trend: string;
  trendDown?: boolean;
}

const StatCard = ({
  icon: Icon,
  title,
  value,
  trend,
  trendDown,
}: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-[#007E85]/10 rounded-lg">
        <Icon className="text-[#007E85] text-xl" />
      </div>
      <span
        className={`text-sm font-medium ${
          trendDown ? "text-red-500" : "text-green-500"
        }`}
      >
        {trend}
      </span>
    </div>
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className="text-2xl font-semibold mt-1">{value}</p>
  </div>
);

export default DoctorDashboard;
