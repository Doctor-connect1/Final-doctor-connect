"use client";  // Ensure this is at the top of the file

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SignupFinishPage = () => {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get('email');
    const username = searchParams.get('username');
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');
    const password = searchParams.get('password');
    const role = searchParams.get('role');

    // Always call hooks in the same order
    const [phone, setPhone] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [experience, setExperience] = useState("");
    const [bio, setBio] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [medicalHistory, setMedicalHistory] = useState("");
    const [gender, setGender] = useState("");
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!role) {
            setError("Role is missing. Please go back to the signup page.");
        }
        setIsMounted(true);  // Set mounted to true after component is mounted
    }, [role]);

    if (!isMounted) {
        return null;  // Or you can return a loading spinner if desired
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (role === "doctor" && (!phone || !specialty || !experience || !bio || !gender || !profilePicture)) {
            setError("Please fill in all the fields for doctor.");
            return;
        }

        if (role === "patient" && (!dateOfBirth || !medicalHistory || !gender || !phone || !bio || !profilePicture)) {
            setError("Please fill in all the fields for patient.");
            return;
        }

        // Create a FormData object to send the form data and file
        const formData = new FormData();
        formData.append("email", email as string);
        formData.append("username", username as string);
        formData.append("firstName", firstName as string);
        formData.append("lastName", lastName as string);
        formData.append("password", password as string);
        formData.append("role", role as string);
        formData.append("phone", phone);
        formData.append("bio", bio);
        formData.append("gender", gender);

        if (role === "doctor") {
            formData.append("specialty", specialty);
            formData.append("experience", experience);
        } else if (role === "patient") {
            formData.append("dateOfBirth", dateOfBirth);
            formData.append("medicalHistory", medicalHistory);
        }

        if (profilePicture) {
            formData.append("profilePicture", profilePicture); // Append the file
        }

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                // Handle success (e.g., redirect to a success page)
                router.push("/success");
            } else {
                setError(result.message || "Error during signup");
            }
        } catch (error) {
            setError("An error occurred during signup. Please try again.");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 py-10">
            <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">Complete Your Signup</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Phone */}
                        <div>
                            <input
                                name="phone"
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Phone"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <textarea
                                name="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Bio"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Profile Picture */}
                        <div>
                            <input
                                type="file"
                                onChange={(e) => setProfilePicture(e.target.files![0])}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Conditional fields based on role */}
                        {role === "doctor" && (
                            <>
                                {/* Specialty */}
                                <div>
                                    <input
                                        name="specialty"
                                        type="text"
                                        value={specialty}
                                        onChange={(e) => setSpecialty(e.target.value)}
                                        placeholder="Specialty"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                {/* Experience */}
                                <div>
                                    <input
                                        name="experience"
                                        type="text"
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        placeholder="Experience"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </>
                        )}

                        {role === "patient" && (
                            <>
                                {/* Date of Birth */}
                                <div>
                                    <input
                                        name="dateOfBirth"
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                {/* Medical History */}
                                <div>
                                    <textarea
                                        name="medicalHistory"
                                        value={medicalHistory}
                                        onChange={(e) => setMedicalHistory(e.target.value)}
                                        placeholder="Medical History"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </>
                        )}

                        {/* Gender */}
                        <div>
                            <select
                                name="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-green-500 text-white rounded-md font-medium shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupFinishPage;

