'use client';
import Appointments from './Appointments';
import TopNavigation from '../components/topnavigation';
import { useState } from 'react';
import Link from 'next/link';

export default function AppointmentsPage() {
  const [patientName, setPatientName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Container for TopNavigation and Button */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Top Navigation */}
        <TopNavigation patientName={patientName} avatarUrl={avatarUrl} />

        {/* Book Appointment Button with continuous animation */}
        <Link href="/find-doctors">
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg animate-pulse hover:bg-green-600 transition-all duration-300 transform hover:scale-105 ease-in-out">
            Book Appointment
          </button>
        </Link>
      </div>

      {/* Appointments Component */}
      <div className="container mx-auto px-4 py-8">
        <Appointments />
      </div>
    </div>
  );
}
