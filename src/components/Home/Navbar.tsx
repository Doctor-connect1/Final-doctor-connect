"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const isActiveLink = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white py-4 px-6 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="https://i.pinimg.com/originals/2a/35/b1/2a35b15e65c10785fb21d0f7a63e1a72.jpg"
            alt="Healthcare Logo"
            width={100}
            height={100}
          />
          <span className="text-xl font-semibold">Healthcare</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`relative ${isActiveLink("/") ? "text-teal-600" : "text-gray-600 hover:text-teal-600"}`}
          >
            Home
            <span
              className={`absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 transform origin-left transition-transform duration-300 ${isActiveLink("/") ? "scale-x-100" : "scale-x-0"}`}
            ></span>
          </Link>

          <Link
            href="/service"
            className={`relative ${isActiveLink("/service") ? "text-teal-600" : "text-gray-600 hover:text-teal-600"}`}
          >
            Service
            <span
              className={`absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 transform origin-left transition-transform duration-300 ${isActiveLink("/service") ? "scale-x-100" : "scale-x-0"}`}
            ></span>
          </Link>

          <Link
            href="/contact"
            className={`relative ${isActiveLink("/contact") ? "text-teal-600" : "text-gray-600 hover:text-teal-600"}`}
          >
            Contact Us
            <span
              className={`absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 transform origin-left transition-transform duration-300 ${isActiveLink("/contact") ? "scale-x-100" : "scale-x-0"}`}
            ></span>
          </Link>

          <Link
            href="/help"
            className={`relative ${isActiveLink("/help") ? "text-teal-600" : "text-gray-600 hover:text-teal-600"}`}
          >
            Help
            <span
              className={`absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 transform origin-left transition-transform duration-300 ${isActiveLink("/help") ? "scale-x-100" : "scale-x-0"}`}
            ></span>
          </Link>

          <Link
            href="/blogs"
            className={`relative ${isActiveLink("/blogs") ? "text-teal-600" : "text-gray-600 hover:text-teal-600"}`}
          >
            Blogs
            <span
              className={`absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 transform origin-left transition-transform duration-300 ${isActiveLink("/blogs") ? "scale-x-100" : "scale-x-0"}`}
            ></span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {role === null ? (
            <>
              <Link
                href="/firstsign"
                className="relative px-6 py-2 font-medium text-teal-600 rounded-lg group overflow-hidden"
              >
                <span className="relative z-10">Sign Up</span>
                <span className="absolute inset-0 w-0 h-full bg-teal-50 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/login"
                className="relative px-6 py-2 font-medium text-white bg-teal-600 rounded-lg group overflow-hidden hover:bg-teal-700 transition-all duration-300"
              >
                <span className="relative z-10">Log In</span>
                <span className="absolute inset-0 w-0 h-full bg-teal-700 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </>
          ) : role === "Doctor" ? (
            <Link
              href="/dashboard"
              className="relative px-6 py-2 font-medium text-teal-600 rounded-lg group overflow-hidden"
            >
              <span className="relative z-10">Work</span>
              <span className="absolute inset-0 w-0 h-full bg-teal-50 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ) : role === "Patient" ? (
            <Link
              href="/dashboard"
              className="relative px-6 py-2 font-medium text-teal-600 rounded-lg group overflow-hidden"
            >
              <span className="relative z-10">Find Doctor</span>
              <span className="absolute inset-0 w-0 h-full bg-teal-50 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
