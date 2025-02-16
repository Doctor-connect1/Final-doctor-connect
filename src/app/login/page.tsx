"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            if (!response.ok) {
                throw new Error(data.message);
            }
            // Redirect to dashboard or home page
            router.push('/');

        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="flex min-h-screen justify-center items-center bg-gray-50">
            {/* Login Card */}
            <div className="w-full max-w-5xl h-[500px] bg-white rounded-lg shadow-md flex">
                {/* Left side - Login Form */}
                <div className="w-full lg:w-1/2 p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Login</h2>
                    {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                                Email:
                            </label>
                            <input
                                id="email"
                                type="email"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter your email"
                                className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#529F6D]"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                                Password:
                            </label>
                            <input
                                id="password"
                                type="password"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Enter your password"
                                className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#529F6D]"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 mt-4 bg-[#529F6D] text-white rounded-md hover:bg-[#478a5b] focus:outline-none"
                        >
                            Login
                        </button>
                    </form>

                    {/* Sign-up link */}
                    <div className="mt-4 text-center">
                        <p>
                            Don't have an account?{' '}
                            <a href="/signup" className="text-[#529F6D] hover:text-[#478a5b] font-medium">
                                Sign up here
                            </a>
                        </p>
                    </div>
                </div>

                {/* Right side - Medical-themed Image */}
                <div className="w-full lg:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/5207095/pexels-photo-5207095.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}>
                </div>
            </div>
        </div>

    );
};

export default LoginForm;
