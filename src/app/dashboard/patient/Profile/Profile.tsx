'use client';

import { useState, useEffect } from 'react';
import { User, Activity } from 'lucide-react';

interface ProfileProps {
  updateProfile: (data: {
    firstName?: string;
    lastName?: string;
    height?: string;
    weight?: string;
    profilePhoto?: string;
  }) => void;
  initialData: {
    firstName: string;
    lastName: string;
    height: string;
    weight: string;
    profilePhoto: string;
  };
  updateNavbarName: (name: string) => void;
}

export default function Profile({ updateProfile, initialData, updateNavbarName }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    height: initialData?.height || '',
    weight: initialData?.weight || '',
    profilePhoto: initialData?.profilePhoto || '',
  });

  const handleSave = () => {
    updateProfile(formData);
    updateNavbarName(`${formData.firstName} ${formData.lastName}`);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          {isEditing ? (
            <button 
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600" />
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">First Name</p>
              {isEditing ? (
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border rounded p-2 w-full mt-1"
                />
              ) : (
                <p className="font-medium">{formData.firstName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600" />
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">Last Name</p>
              {isEditing ? (
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border rounded p-2 w-full mt-1"
                />
              ) : (
                <p className="font-medium">{formData.lastName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600" />
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">Height</p>
              {isEditing ? (
                <input
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="border rounded p-2 w-full mt-1"
                />
              ) : (
                <p className="font-medium">{formData.height}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600" />
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">Weight</p>
              {isEditing ? (
                <input
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="border rounded p-2 w-full mt-1"
                />
              ) : (
                <p className="font-medium">{formData.weight}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600" />
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">Profile Photo URL</p>
              {isEditing ? (
                <input
                  name="profilePhoto"
                  value={formData.profilePhoto}
                  onChange={handleChange}
                  className="border rounded p-2 w-full mt-1"
                />
              ) : (
                <img src={formData.profilePhoto} alt="Profile" className="h-10 w-10 rounded-full" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}