'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialty: string;
  experience: number;
  isVerified: boolean;
  profilePicture: string;
}

const TeamMemberCard = ({ doctor }: { doctor: Doctor }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 w-[300px] h-[500px]">
      <div className="relative w-full h-[350px] bg-gradient-to-b from-teal-50 to-white">
        <Image
          src={doctor.profilePicture}
          alt={`${doctor.firstName} ${doctor.lastName}`}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-t-lg"
        />
        <h3 className="absolute top-4 right-4 bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
          {doctor.isVerified ? 'Available' : 'Not Available'}
        </h3>
      </div>
      <div className="p-6 text-center flex flex-col justify-between h-full">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {doctor.firstName} {doctor.lastName}
          </h3>
          <p className="text-teal-600 font-medium mb-2">{doctor.specialty}</p>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          {doctor.experience} years of experience
        </p>
      </div>
    </div>
  );
};

const TeamSection = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/allDoctors');
        const result = await response.json();
        setDoctors(result.data);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Expert Doctors</h2>
          <div className="w-24 h-1 bg-teal-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our team of qualified medical professionals is here to provide you with the best healthcare services.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            <div className="flex gap-6 p-4">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="snap-center">
                  <TeamMemberCard doctor={doctor} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-3 rounded-full shadow-lg text-teal-600 hover:text-teal-700 hover:shadow-xl transition-all focus:outline-none"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-3 rounded-full shadow-lg text-teal-600 hover:text-teal-700 hover:shadow-xl transition-all focus:outline-none"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;