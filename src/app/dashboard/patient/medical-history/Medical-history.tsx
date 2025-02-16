'use client';

import { useState, useEffect } from 'react';
import { Calendar, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const medicalHistory = [
  {
    id: 1,
    condition: 'Hypertension',
    date: '2025-01-10',
    notes: 'Managed with medication.',
  },
  {
    id: 2,
    condition: 'Diabetes',
    date: '2025-02-15',
    notes: 'Regular monitoring required.',
  },
  {
    id: 3,
    condition: 'Asthma',
    date: '2025-03-05',
    notes: 'Use inhaler as needed.',
  },
];

interface PastAppointment {
  id: number;
  date: string;
  doctorName: string;
  diagnosis: string;
  healthStatus: 'improved' | 'unchanged' | 'deteriorated';
  followUpNeeded: boolean;
}

function MedicalHistory() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('history');
  const [pastAppointments, setPastAppointments] = useState<PastAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This would be replaced with your actual API call
    const fetchPastAppointments = async () => {
      try {
        const response = await fetch('/api/patient/medical-history');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPastAppointments(data);
      } catch (error) {
        console.error('Error fetching past appointments:', error);
        // Optionally, you can set an error state here to display a message in the UI
      } finally {
        setIsLoading(false);
      }
    };

    fetchPastAppointments();
  }, []);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'improved':
        return 'text-green-500';
      case 'deteriorated':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold">Medical History</h2>
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          Conditions
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'appointments' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          Past Visits
        </button>
      </div>
      {activeTab === 'history' ? (
        <div className="space-y-4">
          {medicalHistory.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <div className="ml-3 flex-1">
                  <p className="text-sm text-gray-500">Condition</p>
                  <p className="font-medium">{entry.condition}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4">Loading past appointments...</div>
          ) : (
            pastAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      Visit with Dr. {appointment.doctorName}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Date: {new Date(appointment.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    Diagnosis: {appointment.diagnosis}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm">Health Status:</span>
                    <span className={`text-sm font-medium ${getHealthStatusColor(appointment.healthStatus)}`}>
                      {appointment.healthStatus.charAt(0).toUpperCase() + appointment.healthStatus.slice(1)}
                    </span>
                    {appointment.followUpNeeded && (
                      <span className="text-sm text-orange-500 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Follow-up needed
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MedicalHistory;