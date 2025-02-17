'use client';

import { useState, useEffect } from 'react';
import { User, Activity } from 'lucide-react';

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

interface ProfileProps {
  updateProfile: (data: Partial<ProfileData>) => void;
  initialData: ProfileData;
  updateNavbarName: (name: string) => void;
}

export default function Profile({ updateProfile, initialData, updateNavbarName }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        medicalHistory: formData.medicalHistory,
        bio: formData.bio
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Update local form data when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
              disabled={isSaving}
              className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
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
          {/* Profile Image */}
          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600" />
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">Profile Photo</p>
              {formData.profileMedia?.url && (
                <img 
                  src={formData.profileMedia.url} 
                  alt="Profile" 
                  className="h-20 w-20 rounded-full object-cover mt-2"
                />
              )}
            </div>
          </div>

          {/* Basic Information */}
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
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{formData.email}</p>
            </div>
          </div>

          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600" />
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">Phone</p>
              {isEditing ? (
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border rounded p-2 w-full mt-1"
                />
              ) : (
                <p className="font-medium">{formData.phone}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <Activity className="h-6 w-6 text-blue-600" />
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">Medical History</p>
              {isEditing ? (
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  className="border rounded p-2 w-full mt-1"
                  rows={4}
                />
              ) : (
                <p className="font-medium">{formData.medicalHistory}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600" />
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">Bio</p>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="border rounded p-2 w-full mt-1"
                  rows={4}
                />
              ) : (
                <p className="font-medium">{formData.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}