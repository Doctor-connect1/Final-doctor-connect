'use client';
import { useState } from 'react';

export default function DoctorSearch() {
  const [isAvailable, setIsAvailable] = useState(false);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Find A Doctor</h2>
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Name"
            className="flex-1 min-w-[200px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          <input
            type="text"
            placeholder="Speciality"
            className="flex-1 min-w-[200px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          <div className="flex items-center gap-2">
            <span>Available</span>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                isAvailable ? 'bg-teal-600' : 'bg-gray-200'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full transform transition-transform duration-200 ease-in-out ${
                  isAvailable ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <button className="bg-teal-600 text-white px-8 py-3 rounded-md hover:bg-teal-700">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
