'use client';

import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { Cloudinary } from 'cloudinary-core';
import { useRouter } from 'next/navigation';

const doctorSpecialties = [
  "Allergist", "Anesthesiologist", "Cardiologist", "Dermatologist", "Endocrinologist", 
  "Gastroenterologist", "Geriatrician", "Hematologist", "Infectious Disease Specialist", 
  "Internist", "Nephrologist", "Neurologist", "Obstetrician", "Gynecologist", "Oncologist", 
  "Ophthalmologist", "Orthopedic Surgeon", "Otolaryngologist (ENT)", "Pathologist", 
  "Pediatrician", "Physiatrist", "Plastic Surgeon", "Podiatrist", "Psychiatrist", 
  "Pulmonologist", "Radiologist", "Rheumatologist", "Surgeon", "Urologist", 
  "Emergency Medicine Specialist", "Family Medicine Doctor", "General Surgeon", 
  "Neurosurgeon", "Thoracic Surgeon", "Vascular Surgeon", "Sports Medicine Specialist", 
  "Medical Geneticist", "Nuclear Medicine Specialist", "Pain Management Specialist", 
  "Preventive Medicine Specialist", "Sleep Medicine Specialist", "Critical Care Medicine Specialist"
];

const experienceOptions = Array.from({ length: 40 }, (_, i) => `${i + 1} year${i > 0 ? 's' : ''}`);

export default function Form() {
  const { register, handleSubmit, formState: { errors }, trigger, watch } = useForm();
  const [profilePicture, setProfilePicture] = useState(null);
  const [resume, setResume] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(doctorSpecialties[0]);
  const [selectedExperience, setSelectedExperience] = useState(experienceOptions[0]);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state

  const password = watch('password', '');
  const router = useRouter();
  
  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    if (file) {
      setFile(URL.createObjectURL(file));
    }
  };
  
  const validatePassword = (value) => {
    const strength = [
      value.length > 7,
      /[A-Z]/.test(value),
      /[!@#$%^&*(),.?":{}|<>]/.test(value)
    ].filter(Boolean).length;
    setPasswordStrength(strength);
    return strength === 3;
  };
  
  const nextStep = async () => {
    const isValid = await trigger(['name', 'email', 'phone', 'bio']);
    if (isValid) {
      setStep(2);
    } else {
      alert('Please fill out all required fields.');
    }
  };

  const cloudinary = new Cloudinary({ cloud_name: "vqqsqsqsv", secure: true });

  const onSubmit = async (data) => {
    setLoading(true); // Set loading to true when the form is submitted

    const formData = new FormData();
    formData.append('file', profilePicture);
    formData.append('upload_preset', 'your_upload_preset');

    try {
      const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const cloudinaryData = await cloudinaryResponse.json();
      const profilePictureUrl = cloudinaryData.secure_url;

      const apiData = {
        firstName: data.name.split(' ')[0],
        lastName: data.name.split(' ')[1] || '',
        email: data.email,
        experience: parseInt(selectedExperience),
        password: data.password,
        phone: data.phone,
        specialty: selectedSpecialty,
        profilePicture: profilePictureUrl,
        locationLatitude: 10.2222254, // Replace with actual latitude
        locationLongitude: 10.225514, // Replace with actual longitude
      };

      const token = localStorage.getItem('token');
      const apiResponse = await fetch('http://localhost:3000/api/auth/become-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      });

      const apiResult = await apiResponse.json();
      console.log('API Response:', apiResult);
      router.push("/dashboard/doctor"); // Navigate to the dashboard
    } catch (error) {
      console.error('Error:', error);
      setLoading(false); // Reset loading state if an error occurs
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form 
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-2xl w-[676px] space-y-6 border border-gray-100"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Doctor Registration</h2>
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-gray-700 font-medium capitalize">Name</label>
                <motion.input 
                  id="name" 
                  type="text" 
                  {...register('name', { required: true })} 
                  placeholder="Enter your name"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400"
                  whileFocus={{ scale: 1.02, boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.5)' }}
                />
                {errors.name && <span className="text-red-500 text-sm">Name is required</span>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-gray-700 font-medium capitalize">Email</label>
                <motion.input 
                  id="email" 
                  type="email" 
                  {...register('email', { required: true })} 
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400"
                  whileFocus={{ scale: 1.02, boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.5)' }}
                />
                {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-gray-700 font-medium capitalize">Phone</label>
                <motion.input 
                  id="phone" 
                  type="tel" 
                  {...register('phone', { required: true })} 
                  placeholder="Enter your phone number"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400"
                  whileFocus={{ scale: 1.02, boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.5)' }}
                />
                {errors.phone && <span className="text-red-500 text-sm">Phone is required</span>}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label htmlFor="bio" className="text-gray-700 font-medium capitalize">Bio</label>
                <motion.textarea 
                  id="bio" 
                  {...register('bio', { required: true })} 
                  placeholder="Tell us about yourself"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400 resize-none"
                  whileFocus={{ scale: 1.02, boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.5)' }}
                />
                {errors.bio && <span className="text-red-500 text-sm">Bio is required</span>}
              </div>

              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center">
                <input type="file" accept="image/*" className="hidden" id="file-upload" onChange={(e) => handleFileChange(e, setProfilePicture)} />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <motion.div
                    className="relative w-32 h-32 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {profilePicture ? (
                      <motion.img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <motion.div
                        className="flex flex-col items-center gap-2"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Upload className="text-purple-500 w-10 h-10" />
                        <span className="text-xs text-gray-500">Max 2MB</span>
                      </motion.div>
                    )}
                  </motion.div>
                  <motion.span
                    className="text-purple-500 text-sm font-medium mt-2 hover:text-purple-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Upload Profile Picture
                  </motion.span>
                </label>
              </div>

              <motion.button 
                type="button" 
                onClick={nextStep}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Specialty Dropdown */}
              <div className="space-y-2">
                <label className="text-gray-700 font-medium capitalize">Specialty</label>
                <Listbox value={selectedSpecialty} onChange={setSelectedSpecialty}>
                  <div className="relative">
                    <Listbox.Button className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-left bg-white">
                      {selectedSpecialty}
                    </Listbox.Button>
                    <Transition
                      as={motion.div}
                      enter="transition ease-out duration-100"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Listbox.Options className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {doctorSpecialties.map((specialty, index) => (
                          <Listbox.Option
                            key={index}
                            value={specialty}
                            className={({ active }) => `p-3 cursor-pointer ${active ? 'bg-purple-50 text-purple-700' : 'text-gray-700'}`}
                          >
                            {specialty}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              {/* Experience Dropdown */}
              <div className="space-y-2">
                <label className="text-gray-700 font-medium capitalize">Experience</label>
                <Listbox value={selectedExperience} onChange={setSelectedExperience}>
                  <div className="relative">
                    <Listbox.Button className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-left bg-white">
                      {selectedExperience}
                    </Listbox.Button>
                    <Transition
                      as={motion.div}
                      enter="transition ease-out duration-100"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Listbox.Options className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {experienceOptions.map((experience, index) => (
                          <Listbox.Option
                            key={index}
                            value={experience}
                            className={({ active }) => `p-3 cursor-pointer ${active ? 'bg-purple-50 text-purple-700' : 'text-gray-700'}`}
                          >
                            {experience}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-gray-700 font-medium capitalize">Password</label>
                <motion.input 
                  id="password" 
                  type="password" 
                  {...register('password', { required: true, validate: validatePassword })} 
                  placeholder="Enter your password"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400"
                  whileFocus={{ scale: 1.02, boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.5)' }}
                  onChange={(e) => validatePassword(e.target.value)}
                />
                {errors.password && <span className="text-red-500 text-sm">Password is required and must be strong</span>}
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div 
                    className={`h-2.5 rounded-full ${passwordStrength === 3 ? 'bg-green-500' : passwordStrength === 2 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${(passwordStrength / 3) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Resume Upload */}
              <div className="flex flex-col items-center">
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" id="resume-upload" onChange={(e) => handleFileChange(e, setResume)} />
                <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <motion.div
                    className="relative w-32 h-32 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    {resume ? (
                      <motion.div 
                        className="flex flex-col items-center gap-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FileText className="text-purple-500 w-10 h-10" />
                        <span className="text-xs text-gray-500">Resume Uploaded</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="flex flex-col items-center gap-2"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Upload className="text-purple-500 w-10 h-10" />
                        <span className="text-xs text-gray-500">Max 5MB</span>
                      </motion.div>
                    )}
                  </motion.div>
                  <motion.span
                    className="text-purple-500 text-sm font-medium mt-2 hover:text-purple-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Upload Resume
                  </motion.span>
                </label>
              </div>

              <motion.button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading} // Disable the button when loading
              >
                {loading ? (
                  <motion.div
                    className="w-6 h-6 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                ) : (
                  'Submit'
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </motion.div>
  );
}