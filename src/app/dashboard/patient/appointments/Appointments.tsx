"use client";

import { useEffect, useState } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

// Add this interface at the top of the file
interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  image: string;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      setAppointments(data);
    };

    fetchAppointments();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
              <img
                src={appointment.image}
                alt={appointment.doctor}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="ml-4 flex-1">
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <div className="ml-3 flex-1">
                    <h3 className="font-medium">{appointment.doctor}</h3>
                    <p className="text-sm text-gray-500">{appointment.specialty}</p>
                  </div>
                </div>
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
    </div>
  );
}

export default Appointments;
