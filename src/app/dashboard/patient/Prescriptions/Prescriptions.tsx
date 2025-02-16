'use client';

import { ChevronRight } from 'lucide-react';

const prescriptions = [
  {
    id: 1,
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    startDate: '2025-01-15',
    endDate: '2025-07-15',
  },
  {
    id: 2,
    medication: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    startDate: '2025-02-01',
    endDate: '2025-08-01',
  },
];

export default function Prescriptions() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold">Current Prescriptions</h2>
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div>
                <h3 className="font-medium">{prescription.medication}</h3>
                <p className="text-sm text-gray-500">Dosage: {prescription.dosage}</p>
                <p className="text-sm text-gray-500">Frequency: {prescription.frequency}</p>
                <p className="text-sm text-gray-500">Duration: {prescription.startDate} - {prescription.endDate}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}