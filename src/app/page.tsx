"use client";

import { useEffect } from "react";
import Navbar from "@/components/Home/Navbar";
import HeroSection from "@/components/Home/HeroSection";
import DoctorSearch from "@/components/Home/DoctorSearch";
import ServicesSection from "@/components/Home/ServicesSection";
import ReasonsSection from "@/components/Home/ReasonsSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import FAQSection from "@/components/Home/FAQSection";
import NewsletterSection from "@/components/Home/NewsletterSection";
import Footer from "@/components/Home/Footer";

export default function Home() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    function watchLocalStorageChanges() {
      let lastRole = localStorage.getItem("role");
      let lastToken = localStorage.getItem("token");

      window.addEventListener("storage", (event) => {
        if (event.key === "role" || event.key === "token") {
          console.log(`Storage changed: ${event.key} -> ${event.newValue}`);
          window.location.reload();
        }
      });


      const interval = setInterval(() => {
        const currentRole = localStorage.getItem("role");
        const currentToken = localStorage.getItem("token");

        if (currentRole !== lastRole || currentToken !== lastToken) {
          console.log(
            `Local change detected: role=${currentRole}, token=${currentToken}`
          );
          window.location.reload();
        }

        lastRole = currentRole;
        lastToken = currentToken;
      }, 500);

      return () => clearInterval(interval); 
    }

    watchLocalStorageChanges();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      <DoctorSearch />

      {/* Statistics Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center text-teal-600 mb-12">
          Our results in numbers
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "99%", label: "Customer satisfaction" },
            { value: "15k", label: "Online Patients" },
            { value: "12k", label: "Patients Recovered" },
            { value: "240%", label: "Company growth" },
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold text-teal-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
      <ReasonsSection />
      <ServicesSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
