'use client';
import Profile from './Profile';
import { useState, useEffect } from 'react';
import TopNavigation from '../components/topnavigation';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from 'jsonwebtoken';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  medicalHistory: string;
  bio: string;
  profileMedia?: {
    url: string;
  };
}

interface CustomJwtPayload {
  patientId: string;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    medicalHistory: '',
    bio: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [navbarName, setNavbarName] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('token:', token);
        if (!token) {
          throw new Error('No token found');
        }

        // Decode the token safely
        const decodedToken = jwtDecode<{ 
          patientId
          ?: string }>(token);
console.log('decodedToken:', decodedToken);
        if (!decodedToken.
          patientId
          ) {
          throw new Error('Invalid token: No ID found');
        }

        const res = await fetch(`/api/patient/${decodedToken.patientId}`);
        const data = await res.json();

        if (data.success && data.patient) {
          const { 
            firstName, 
            lastName, 
            email, 
            phone, 
            dateOfBirth, 
            gender, 
            medicalHistory, 
            bio, 
            profileMedia 
          } = data.patient;

          setProfileData({
            firstName: firstName || '',
            lastName: lastName || '',
            email: email || '',
            phone: phone || '',
            dateOfBirth: dateOfBirth || '',
            gender: gender || '',
            medicalHistory: medicalHistory || '',
            bio: bio || '',
            profileMedia,
          });
        } else {
          console.error('Patient data not found');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profileData.firstName && profileData.lastName) {
      setNavbarName(`${profileData.firstName} ${profileData.lastName}`);
    }
  }, [profileData.firstName, profileData.lastName]);

  const updateProfile = async (data: Partial<ProfileData>) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('No token found');
      }

      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      if (!decodedToken.patientId) {
        throw new Error('Invalid token');
      }

      const res = await fetch(`/api/patient/${decodedToken.patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await res.json();
      if (result.success) {
        setProfileData(prev => ({
          ...prev,
          ...result.patient
        }));
        setNavbarName(`${result.patient.firstName} ${result.patient.lastName}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <TopNavigation 
        patientName={navbarName} 
        avatarUrl={profileData.profileMedia?.url || ''} 
      />
      <Profile 
        initialData={profileData}
        updateProfile={updateProfile}
        updateNavbarName={setNavbarName}
      />
    </>
  );
}
