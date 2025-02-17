import Image from 'next/image';
import Link from 'next/link';

interface ServiceCardProps {
  title: string;
  description: string;
  imagePath: string;
  imageAlt: string;
}

function ServiceCard({ title, description, imagePath, imageAlt }: ServiceCardProps) {
  return (
    <div className="bg-white p-6 rounded-[20px] shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6 rounded-[12px] overflow-hidden relative h-[200px]">
        <Image
          src={imagePath}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          loading="lazy"
        />
      </div>
      <h3 className="text-xl font-semibold text-[#101828] mb-2">{title}</h3>
      <p className="text-[#667085] text-base mb-4 line-clamp-3">{description}</p>
      <Link 
        href="#" 
        className="text-teal-600 font-medium inline-flex items-center hover:text-teal-700"
      >
        Learn more
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="ml-2"
        >
          <path 
            d="M4.16666 10H15.8333" 
            stroke="currentColor" 
            strokeWidth="1.67" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M10 4.16669L15.8333 10L10 15.8334" 
            stroke="currentColor" 
            strokeWidth="1.67" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
}

export default function ServicesSection() {
  const services = [
    {
      title: "Dental treatments",
      description: "Professional dental care services including cleaning, fillings, and advanced dental procedures.",
      imagePath: "https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg",
      imageAlt: "Dental Treatment Model"
    },
    {
      title: "Bones treatments",
      description: "Specialized orthopedic care for bone and joint conditions with advanced treatment options.",
      imagePath: "https://images.pexels.com/photos/8376285/pexels-photo-8376285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      imageAlt: "Bones Treatment"
    },
    {
      title: "Diagnosis",
      description: "Comprehensive diagnostic services using state-of-the-art medical equipment and expertise.",
      imagePath: "https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg?auto=compress&cs=tinysrgb&w=600",
      imageAlt: "Medical Diagnosis"
    },
    {
      title: "Cardiology",
      description: "Expert cardiac care with advanced heart disease diagnosis and treatment options.",
      imagePath: "https://images.pexels.com/photos/8460093/pexels-photo-8460093.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      imageAlt: "Cardiology Service"
    },
    {
      title: "Surgery",
      description: "State-of-the-art surgical procedures performed by experienced medical professionals.",
      imagePath: "https://images.pexels.com/photos/3259624/pexels-photo-3259624.jpeg?auto=compress&cs=tinysrgb&w=600",
      imageAlt: "Surgery Room"
    },
    {
      title: "Eye care",
      description: "Comprehensive eye care services including examinations and advanced treatments.",
      imagePath: "https://images.pexels.com/photos/15770389/pexels-photo-15770389/free-photo-of-femme-blond-debout-sourire.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      imageAlt: "Eye Care Service"
    }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#101828] mb-4">
          Services we provide
        </h2>
        <p className="text-[#667085] text-center max-w-2xl mx-auto mb-12">
          Comprehensive healthcare services delivered by experienced professionals using advanced medical technology.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              {...service}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 