"use client";

import { useEffect, useState } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

interface Doctor {
  id: number;
  specialty: {
    name: string;
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  profileMedia?: {
    url: string;
  };
}

interface Appointment {
  id: number;
  appointmentDate: string;
  durationMinutes: number;
  status: string;
  doctorID: number;
  patientID: number;
  doctor: {
    id: number;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      profileImage?: string;
    };
    specialty: {
      name: string;
    };
  };
}

interface CustomJwtPayload {
  patientId: string;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("Token:", token);
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        console.log("Decoded token:", decodedToken);
        if (!decodedToken.patientId) {
          setError('Invalid token format');
          return;
        }

        // Fetch doctors first
        const doctorsResponse = await fetch('/api/doctors');
        if (!doctorsResponse.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const doctorsData = await doctorsResponse.json();
        console.log('Doctors data:', doctorsData);

        // Then fetch appointments
        const appointmentsResponse = await fetch(`/api/patient/appointments/${decodedToken.patientId}`);
        console.log("Appointments response:", appointmentsResponse);
        if (!appointmentsResponse.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const appointmentsData = await appointmentsResponse.json();
        console.log('Appointments data:', appointmentsData);

        // Merge appointments with complete doctor information
        const enhancedAppointments = appointmentsData.map((appointment: Appointment) => {
          const doctor = doctorsData.find((d: Doctor) => d.id === appointment.doctorID);
          if (doctor) {
            return {
              ...appointment,
              doctor: {
                ...appointment.doctor,
                user: doctor.user
              }
            };
          }
          return appointment;
        });

        setAppointments(enhancedAppointments);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load appointments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No appointments found</p>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-shrink-0">
                  {appointment.doctor?.user?.profileImage ? (
                    <img
                      src={appointment.doctor.user.profileImage}
                      alt={`Dr. ${appointment.doctor.user.firstName}`}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">
                        {appointment.doctor.firstName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="ml-4 flex-1">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <h3 className="font-medium">
                        Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {appointment.doctor?.specialty?.name || 'General Practice'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right mr-4">
                  <p className="font-medium">
                    {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    Duration: {appointment.durationMinutes} min
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-sm ${appointment.status.toLowerCase() === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : appointment.status.toLowerCase() === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {appointment.status.toUpperCase()}
                  </span>
                </div>

                <ChevronRight className="h-5 w-5 text-gray-400 ml-4" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Appointments;
