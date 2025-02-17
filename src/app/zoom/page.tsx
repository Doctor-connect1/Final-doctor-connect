'use client';
import WebRTCComponent from './WebRTCComponent';
import Navbar from '@/components/Home/Navbar';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <WebRTCComponent />
      </div>
    </div>
  );
} 