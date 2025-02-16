'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  company: string;
  imagePath: string;
  imageAlt: string;
}

function TestimonialCard({ quote, name, role, company, imagePath, imageAlt }: TestimonialCardProps) {
  return (
    <div className="bg-white p-8 rounded-[20px] shadow-sm">
      {/* Profile Image */}
      <div className="mb-6 relative w-14 h-14">
        <Image
          src={imagePath}
          alt={imageAlt}
          fill
          sizes="56px"
          className="object-cover rounded-full"
          loading="lazy"
        />
      </div>

      {/* Quote */}
      <h3 className="text-lg font-semibold text-[#101828] mb-4">
        "{quote}"
      </h3>

      {/* Description */}
      <p className="text-[#475467] text-sm mb-1">
        {name}
      </p>
      <p className="text-[#475467] text-sm">
        {role} at {company}
      </p>
    </div>
  );
}

interface CompanyLogo {
  name: string;
  path: string;
  width: number;
  height: number;
}

function CompanyLogos() {
  const [activeDot, setActiveDot] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const totalDots = 3;
  const scrollSpeed = 30;

  const logos = [
    {
      name: 'Google',
      icon: (
        <svg viewBox="0 0 272 92" className="w-[140px] h-[40px]">
          <path
            fill="#4285F4"
            d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
          />
          <path
            fill="#EA4335"
            d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
          />
          <path
            fill="#FBBC05"
            d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"
          />
          <path
            fill="#4285F4"
            d="M225 3v65h-9.5V3h9.5z"
          />
          <path
            fill="#34A853"
            d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
          />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      icon: (
        <svg viewBox="0 0 370 100" className="w-[140px] h-[40px]">
          <path
            fill="#444"
            d="M89.77 73.91V63.04h3.74l.56-4.34h-4.3V56.03c0-1.26.35-2.12 2.15-2.12h2.3v-3.87a31.14 31.14 0 0 0-3.31-.17c-3.41 0-5.74 2.08-5.74 5.9v3.29h-3.85v4.34h3.85v10.38h4.6zM117.87 50c-13.14 0-23.87 10.73-23.87 23.87 0 11.73 8.46 21.46 19.61 23.42v-16.6h-5.9v-6.82h5.9v-5.13c0-5.83 3.47-9.04 8.77-9.04 2.54 0 5.2.45 5.2.45v5.72h-2.93c-2.88 0-3.78 1.79-3.78 3.62v4.35h6.44l-1.03 6.82h-5.41v16.6c11.15-1.96 19.61-11.69 19.61-23.42 0-13.14-10.73-23.87-23.87-23.87z"
          />
          <text x="160" y="80" fill="#444" fontSize="50" fontFamily="Helvetica">facebook</text>
        </svg>
      ),
    },
    {
      name: 'YouTube',
      icon: (
        <svg viewBox="0 0 380 85" className="w-[140px] h-[40px]">
          <path
            fill="#FF0000"
            d="M60 42.5c0-11.04-8.96-20-20-20s-20 8.96-20 20 8.96 20 20 20 20-8.96 20-20zM35 55.51V29.49L50 42.5 35 55.51z"
          />
          <text x="90" y="55" fill="#444" fontSize="45" fontFamily="Helvetica">YouTube</text>
        </svg>
      ),
    },
    {
      name: 'Pinterest',
      icon: (
        <svg viewBox="0 0 380 100" className="w-[140px] h-[40px]">
          <path
            fill="#444"
            d="M60 50c0 16.57-13.43 30-30 30-1.8 0-3.6-.15-5.25-.45.75-1.2 1.8-3.15 2.25-4.65.15-.75 1.05-4.05 1.05-4.05.6 1.05 2.25 1.95 4.05 1.95 5.4 0 9.15-4.95 9.15-11.07 0-5.94-4.86-10.35-11.07-10.35-7.74 0-11.79 5.13-11.79 10.8 0 2.61 1.35 5.85 3.6 6.93.42.18.54.09.63-.27.09-.27.36-1.44.45-1.98 0-.18 0-.36-.09-.54-.72-.9-1.35-2.52-1.35-4.05 0-3.96 2.97-7.74 8.1-7.74 4.41 0 7.47 2.97 7.47 7.29 0 4.86-2.43 8.19-5.58 8.19-1.8 0-3.06-1.44-2.61-3.24.54-2.16 1.44-4.41 1.44-5.94 0-1.35-.72-2.52-2.25-2.52-1.8 0-3.24 1.89-3.24 4.32 0 1.62.54 2.61.54 2.61s-1.8 7.47-2.07 8.91c-.36 1.53-.18 3.69-.09 5.13C24.93 75.68 20 63.25 20 50c0-16.57 13.43-30 30-30s30 13.43 30 30z"
          />
          <text x="100" y="65" fill="#444" fontSize="45" fontFamily="Helvetica">Pinterest</text>
        </svg>
      ),
    },
    {
      name: 'Twitch',
      icon: (
        <svg viewBox="0 0 380 100" className="w-[140px] h-[40px]">
          <path
            fill="#444"
            d="M40 20L25 35v40h15v15l15-15h10l20-20V20H40zm35 32l-10 10h-10l-10 10v-10h-15V25h45v27zm-10-17v15h-5V35h5zm-15 0v15h-5V35h5z"
          />
          <text x="100" y="65" fill="#444" fontSize="45" fontFamily="Helvetica">Twitch</text>
        </svg>
      ),
    },
    {
      name: 'Webflow',
      icon: (
        <svg viewBox="0 0 380 100" className="w-[140px] h-[40px]">
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="#444"
            fontSize="45"
            fontStyle="italic"
            fontFamily="Helvetica"
          >
            webflow
          </text>
        </svg>
      ),
    },
  ];

  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp: number;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      
      setScrollPosition((prevPosition) => {
        const newPosition = prevPosition - (delta / scrollSpeed);
        // Reset position when all logos have scrolled
        const resetPoint = -(logos.length / 2) * 200; // Adjust based on logo width + gap
        return newPosition <= resetPoint ? 0 : newPosition;
      });

      lastTimestamp = timestamp;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Auto-advance dots
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % totalDots);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalDots]);

  return (
    <div className="mt-20 overflow-hidden bg-gray-50">
      <h3 className="text-[#0D7D7E] text-2xl font-semibold text-center mb-12">
        Trusted by 10,000+ companies around the world
      </h3>
      
      <div className="relative">
        <div 
          className="flex items-center justify-center gap-16 transition-transform duration-100 ease-linear"
          style={{ 
            transform: `translateX(${scrollPosition}px)`,
            width: 'fit-content'
          }}
        >
          {[...logos, ...logos].map((logo, index) => (
            <div 
              key={`${logo.name}-${index}`}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              {logo.icon}
            </div>
          ))}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {[...Array(totalDots)].map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveDot(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeDot === index ? 'bg-[#0D7D7E] w-4' : 'bg-[#D0D5DD]'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "An amazing service",
      name: "John Carter",
      role: "CEO",
      company: "Google",
      imagePath: "https://images.pexels.com/photos/4428045/pexels-photo-4428045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      imageAlt: "John Carter Profile"
    },
    {
      quote: "One of a kind service",
      name: "Sophie Moore",
      role: "MD",
      company: "Facebook",
      imagePath: "https://images.pexels.com/photos/7223001/pexels-photo-7223001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      imageAlt: "Sophie Moore Profile"
    },
    {
      quote: "The best service",
      name: "Andy Smith",
      role: "CEO",
      company: "Dot Austere",
      imagePath: "https://images.pexels.com/photos/8154428/pexels-photo-8154428.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      imageAlt: "Andy Smith Profile"
    }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#101828] mb-4">
          Testimonial
        </h2>
        <p className="text-[#667085] text-center max-w-2xl mx-auto mb-12">
          Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero accumsan.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              {...testimonial}
            />
          ))}
        </div>

        {/* Company Logos Section */}
        <CompanyLogos />
      </div>
    </section>
  );
}