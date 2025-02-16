'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Patient');
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation (basic check to ensure fields are filled)
    if (!email || !username || !firstName || !lastName || !password) {
      setError('Please fill in all the fields');
      return;
    }

    // Create the form data object
    const formData = {
      email,
      username,
      firstName,
      lastName,
      password,
      role,
    };

    if (role === 'Doctor') {
      // For doctor, send a POST request to the API
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        console.log("result", result);
        if (response.ok) {
          // On success, store token and redirect to the dashboard
          localStorage.setItem('token', result.token);
          localStorage.setItem('role', "Doctor");
          console.log('Doctor Signup Successful');
          router.push('/'); // Redirect to home/dashboard
        } else {
          // On error, set error message
          setError(result.message || 'Error during signup');
        }
      } catch (error) {
        // Handle any other error
        setError('An error occurred during signup. Please try again.');
        console.error(error);
      }
    } else if (role === 'Patient') {
      // For patient, pass query params and go to the next form
      const queryParams = new URLSearchParams(formData).toString();
      router.push(`/signupfinish?${queryParams}`);
    }
  };

  // Handle input change for form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'username') {
      setUsername(value);
    } else if (name === 'firstName') {
      setFirstName(value);
    } else if (name === 'lastName') {
      setLastName(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'role') {
      setRole(value);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-6xl h-[600px]">
        {/* Left side with Image */}
        <div className="hidden lg:block w-1/2 rounded-l">
          <img
            src="https://images.pexels.com/photos/5207095/pexels-photo-5207095.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Medical Theme"
            className="w-full h-full h-25"
          />
        </div>

        {/* Right side with Form */}
        <div className="w-full lg:w-1/2 p-8 bg-white rounded-r-lg shadow-lg">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
            Sign up
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              {/* First Name */}
              <div>
                <input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={handleChange}
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00897B]"
                />
              </div>

              {/* Last Name */}
              <div>
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={handleChange}
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00897B]"
                />
              </div>

              {/* Username */}
              <div>
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={handleChange}
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00897B]"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={handleChange}
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00897B]"
                />
              </div>

              {/* Password */}
              <div>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handleChange}
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00897B]"
                />
              </div>

              {/* Role Selection */}
              <div>
                <select
                  name="role"
                  value={role}
                  onChange={handleChange}
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00897B]"
                >
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#00897B] hover:bg-[#007F6A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00897B]"
              >
                {role === 'Doctor' ? 'Sign Up' : 'Next'}
              </button>
            </div>
          </form>

          {/* Link to login page */}
          <div className="mt-4 text-center">
            <p>
              Already have an account?{' '}
              <a href="/login" className="text-[#00897B] hover:text-[#007F6A] font-medium">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
