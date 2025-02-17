'use client';
import Appointments from './Appointments';
import TopNavigation from '../components/topnavigation';
import { useState } from 'react';

export default function AppointmentsPage() {
  const [patientName, setPatientName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavigation patientName={patientName} avatarUrl={avatarUrl} />
      <div className="container mx-auto px-4 py-8">
        <Appointments />
      </div>
    </div>
  );
}
