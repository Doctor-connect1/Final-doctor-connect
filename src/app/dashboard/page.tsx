"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const userIsDoctor = useRef<boolean>(false);

  useEffect(() => {
    const pathNavigate = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found in local storage.");
        }
        const response = await fetch(
          "http://localhost:3000/api/auth/verify-doctor",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        userIsDoctor.current = data.isDoctor;
        console.log("Server Response: userIsDoctor", userIsDoctor);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    pathNavigate();
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Check the role in localStorage after animation
      const role = localStorage.getItem("role"); // Assuming role is stored in localStorage
      if (role === "Patient") {
        router.push("/dashboard/patient");
      } else if (role === "Doctor" && userIsDoctor.current === true) {
        router.push("/dashboard/doctor");
      } else if (role === "Doctor" && userIsDoctor.current === false) {
        router.push("/dashboard/form");
      } else {
        router.push("/");
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-white z-50 flex items-center justify-center"
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
            exit={{
              scale: 2,
              opacity: 0,
              transition: {
                duration: 0.8,
                ease: [0.87, 0, 0.13, 1],
              },
            }}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="relative w-32 h-32 mx-auto mb-8"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-teal-50 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
                <motion.div
                  className="absolute inset-4 bg-teal-100 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: 0.2,
                  }}
                />
                <motion.div
                  className="absolute inset-8 bg-teal-200 rounded-full"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: 0.4,
                  }}
                />
              </motion.div>

              <motion.h1
                className="text-3xl font-semibold text-teal-600"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                Preparing Your Dashboard
              </motion.h1>
              <motion.p
                className="mt-2 text-gray-600"
                animate={{
                  scale: [0.95, 1, 0.95],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                Just a moment...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {/* Content */}
      </motion.div>
    </div>
  );
}
