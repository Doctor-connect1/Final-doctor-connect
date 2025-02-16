'use client';

import { useState } from 'react';
import { Calendar, Clock, FileText, Activity, Pill as Pills, ChevronRight, Bell, User, Heart, Clipboard } from 'lucide-react';
import PageContainer from "./components/pagecontainer";
import Profile from './Profile/Profile';
import { useRouter } from 'next/navigation';

const upcomingAppointments = [
  {
    id: 1,
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    date: '2025-04-15',
    time: '10:00 AM',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 2,
    doctor: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    date: '2025-04-20',
    time: '02:30 PM',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
  }
];

const medications = [
  {
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    startDate: '2025-01-15',
    endDate: '2025-07-15'
  },
  {
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    startDate: '2025-02-01',
    endDate: '2025-08-01'
  }
];

const recentTests = [
  {
    name: 'Complete Blood Count',
    date: '2025-03-01',
    status: 'Completed',
    result: 'Normal'
  },
  {
    name: 'Lipid Panel',
    date: '2025-03-01',
    status: 'Completed',
    result: 'Review Required'
  },
  {
    name: 'Thyroid Function',
    date: '2025-02-15',
    status: 'Completed',
    result: 'Normal'
  }
];

export default function PatientProfile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    firstName: 'Sarah',
    lastName: 'Anderson',
    height: "5'6\"",
    weight: '130 lbs',
    profilePhoto: '',
  });
  const [navbarName, setNavbarName] = useState(`${profileData.firstName} ${profileData.lastName}`);

  const updateProfile = (data: { firstName?: string; lastName?: string; height?: string; weight?: string; profilePhoto?: string }) => {
    setProfileData(prev => ({
      ...prev,
      ...data
    }));
  };

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/dashboard/patient/appointments');//example besh nbadlou mbaaed 
      if (!response.ok) {
        throw new Error('thama eerroorrr');
      }
      const data = await response.json();
      // mezlt khedma
    } catch (error) {
      console.error('Fetch error:', error);
      // mezlt khedma 
    }
  };

  return (
    <PageContainer title="Patient Profile">
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
              <button 
                onClick={() => router.push('/appointments')} 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                  {appointment.image ? (
                    <img
                      src={appointment.image}
                      alt={appointment.doctor}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : null}
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{appointment.doctor}</h3>
                    <p className="text-sm text-gray-500">{appointment.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{appointment.date}</p>
                    <p className="text-sm text-gray-500">{appointment.time}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 ml-4" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Test Results */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Test Results</h2>
            <div className="space-y-4">
              {recentTests.map((test) => (
                <div key={test.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{test.name}</h3>
                    <p className="text-sm text-gray-500">Date: {test.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      test.result === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {test.result}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Current Medications */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Current Medications</h2>
              <Pills className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-4">
              {medications.map((medication) => (
                <div key={medication.name} className="p-4 border rounded-lg">
                  <h3 className="font-medium">{medication.name}</h3>
                  <p className="text-sm text-gray-500">Dosage: {medication.dosage}</p>
                  <p className="text-sm text-gray-500">Frequency: {medication.frequency}</p>
                  <div className="mt-2 text-xs text-gray-400">
                    {medication.startDate} - {medication.endDate}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="ml-3">Schedule Appointment</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="ml-3">Request Medical Records</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <Clipboard className="h-5 w-5 text-blue-600" />
                  <span className="ml-3">View Lab Results</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Profile 
        initialData={profileData}
        updateProfile={updateProfile}
        updateNavbarName={setNavbarName}
      />
    </PageContainer>
  );
}