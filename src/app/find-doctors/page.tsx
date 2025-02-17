'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Search, MapPin, Star, Phone } from 'lucide-react';
import Navbar from '@/components/Home/Navbar';
import Footer from '@/components/Home/Footer';
import { Decimal } from '@prisma/client/runtime/library';

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialty: string;
  phone: string;
  experience: number;
  isVerified: boolean;
  locationLatitude: Decimal | null;
  locationLongitude: Decimal | null;
  // Add other fields you need
}

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

export default function FindDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef<google.maps.Map | null>(null);
  const [center, setCenter] = useState({
    lat: 37.7749, // Default to San Francisco
    lng: -122.4194
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors');
        if (!response.ok) throw new Error('Failed to fetch doctors');
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    // Update center when doctors are loaded
    if (doctors.length > 0 && doctors[0].locationLatitude && doctors[0].locationLongitude) {
      setCenter({
        lat: parseFloat(doctors[0].locationLatitude.toString()),
        lng: parseFloat(doctors[0].locationLongitude.toString())
      });
    }
  }, [doctors]);

  if (isLoading) return <div>Loading doctors...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredDoctors = doctors.filter(doctor =>
    doctor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Doctors Near You</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, or location..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor List */}
          <div className="lg:col-span-1 space-y-4 h-[600px] overflow-y-auto">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
                onClick={() => {
                  setSelectedDoctor(doctor);
                  if (doctor.locationLatitude && doctor.locationLongitude) {
                    mapRef.current?.panTo({ 
                      lat: parseFloat(doctor.locationLatitude.toString()), 
                      lng: parseFloat(doctor.locationLongitude.toString()) 
                    });
                  }
                }}
              >
                <div className="flex items-start">
                  <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center text-blue-600 font-semibold shadow-sm">
                    {doctor.firstName[0]}{doctor.lastName[0]}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-lg text-black">{`${doctor.firstName} ${doctor.lastName}`}</h3>
                    <p className="text-blue-600">{doctor.specialty}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-black">Experience: {doctor.experience} years</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <LoadScript googleMapsApiKey="AIzaSyB5gnUWjb84t6klt5vcPjMOQylhQRFB5Wc">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={13}
                  onLoad={onLoad}
                >
                  {filteredDoctors.map((doctor) => (
                    doctor.locationLatitude && doctor.locationLongitude ? (
                      <Marker
                        key={doctor.id}
                        position={{
                          lat: parseFloat(doctor.locationLatitude.toString()),
                          lng: parseFloat(doctor.locationLongitude.toString())
                        }}
                        onClick={() => setSelectedDoctor(doctor)}
                      />
                    ) : null
                  ))}
                  {selectedDoctor && selectedDoctor.locationLatitude && selectedDoctor.locationLongitude && (
                    <InfoWindow
                      position={{
                        lat: parseFloat(selectedDoctor.locationLatitude.toString()),
                        lng: parseFloat(selectedDoctor.locationLongitude.toString())
                      }}
                      onCloseClick={() => setSelectedDoctor(null)}
                    >
                      <div className="p-2">
                        <h3 className="font-semibold">{`${selectedDoctor.firstName} ${selectedDoctor.lastName}`}</h3>
                        <p className="text-sm text-blue-600">{selectedDoctor.specialty}</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm">Experience: {selectedDoctor.experience} years</span>
                        </div>
                        <div className="flex items-center mt-2 text-sm">
                          <Phone className="h-4 w-4 mr-1" />
                          {selectedDoctor.phone}
                        </div>
                        <button className="mt-2 w-full bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">
                          Book Appointment
                        </button>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}