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
    console.log("role", role);
    console.log("email", email);

    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("2016-11-30T04:15:01.912Z");
    const [medicalHistory, setMedicalHistory] = useState("");
    const [gender, setGender] = useState("");
    const [profilePicture, setProfilePicture] = useState<string | null>(null)
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

        const userData = {
            email: email as string,
            username: username as string,
            firstName: firstName as string,
            lastName: lastName as string,
            password: password as string,
            role: role as string,
            phone,
            bio,
            gender,
            dateOfBirth,
            medicalHistory,
            profilePicture,
        };

        console.log("User Data: ", userData);

        try {
            const response = await fetch('/api/auth/finitousign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),  // Send the data as JSON
            });

            const result = await response.json();

            if (response.ok) {
                // Handle success (e.g., redirect to a success page)
                localStorage.setItem('token', result.token);
                localStorage.setItem('role', result.role);
                router.push("/");
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
                                onChange={(e) => setProfilePicture(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {role === "Patient" && (
                            <>
                                {/* Date of Birth */}
                                <div>
                                    <input
                                        name="dateOfBirth"
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}  // Ensure this updates the state correctly
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
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-green-500 text-white rounded-md font-medium shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Signup
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupFinishPage;