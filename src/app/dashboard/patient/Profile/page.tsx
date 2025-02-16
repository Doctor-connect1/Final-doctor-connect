'use client';
import Profile from './Profile';
import { useState } from 'react';
import TopNavigation from '../components/topnavigation';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    firstName: 'Sarah',
    lastName: 'Anderson',
    height: "5'6\"",
    weight: '130 lbs',
    profilePhoto: '',
  });

  const [navbarName, setNavbarName] = useState(`${profileData.firstName} ${profileData.lastName}`);

  const updateProfile = (data: { firstName?: string; lastName?: string; height?: string; weight?: string; profilePhoto?: string }) => {
    setProfileData(prev => {
      const updatedProfile = { ...prev, ...data };
      setNavbarName(`${updatedProfile.firstName} ${updatedProfile.lastName}`);
      return updatedProfile;
    });
  };

  return (
    <>
      <TopNavigation patientName={navbarName} avatarUrl={profileData.profilePhoto} />
      <Profile 
        initialData={profileData}
        updateProfile={updateProfile}
        updateNavbarName={setNavbarName}
      />
    </>
  );
}

