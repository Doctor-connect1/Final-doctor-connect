"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Home/Navbar";
import NewsletterSection from "@/components/Home/NewsletterSection";
import Footer from "@/components/Home/Footer";

export default function Service() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[600px]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2000&auto=format&fit=crop"
            alt="Hospital Building"
            fill
            className="object-cover brightness-75"
            priority
          />
        </div>
        <div className="relative h-full flex flex-col justify-center max-w-6xl mx-auto px-6">
          <div className="max-w-2xl text-white">
            <h1 className="text-6xl font-bold mb-6">
              Meet the Best
              <br />
              Hospital
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              We know how large objects will act,
              <br />
              but things on a small scale.
            </p>
            <div className="flex gap-4">
              <button className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition duration-300">
                Get Quote Now
              </button>
              <button className="bg-white text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Find A Doctor Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Find A Doctor</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Name"
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 flex-1"
            />
            <input
              type="text"
              placeholder="Speciality"
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 flex-1"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Available</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
            <button className="bg-teal-600 text-white px-8 py-2 rounded-lg hover:bg-teal-700 transition duration-300">
              Search
            </button>
          </div>
        </div>
      </div>


      {/* Services Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Services we provide</h2>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar
            elementum tempus hac tellus libero accumsan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Dental treatments",
              image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1000&auto=format&fit=crop"
            },
            {
              title: "Bones treatments",
              image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop"
            },
            {
              title: "Diagnosis",
              image: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?q=80&w=1000&auto=format&fit=crop"
            },
            {
              title: "Cardiology",
              image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop"
            },
            {
              title: "Surgery",
              image: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1000&auto=format&fit=crop"
            },
            {
              title: "Eye care",
              image: "https://s3-alpha-sig.figma.com/img/eb6a/abf7/45b970661ef876264f0eaf8d07c6a557?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=FECWk~CwCHwNLz8JNedHg2yiS-GDS5XXlnKsuEtt3PIDJkBispQO-CuusUR6C1~wDN6sZTq4TInFRJOnkctEWc-wTvjfJMfTsQorySedICKMiFsJeMTqdgBYRDo4UXxRk~L1l22jusSf7KFA-RcFM-SNgn26KRkd9EGCSjWOTJcXqTmCLpv~TaUmCKFh83LMlsEVhBn7a3lodewhjmCC6X~CJ-x7yRaFKQoGRAm4DMJcFPyscvGUQySDdSxBTHOQWozhE4hJWaOYY7SNHaGDQ~09l27aBvZY0gVNfXtyN9rGE3hhEz6W3e45OqNc2I5oIYhRL4otpZj~c~4Qi863LA__"
            }
          ].map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 relative">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalaracc lacus vel facilisis volutpat est velitm.
                </p>
                <Link 
                  href={`/services/${service.title.toLowerCase().replace(' ', '-')}`}
                  className="text-teal-600 hover:text-teal-700 font-medium flex items-center"
                >
                  Learn more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What our customers say</h2>
            <p className="text-gray-600">
              Problems trying to resolve the conflict between the two major realms of
              Classical physics: Newtonian mechanics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Regina Miles",
                role: "Designer",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
                rating: 4,
                review: "Slate helps you see how many more days you need to work to reach your financial goal."
              },
              {
                name: "John Smith",
                role: "Developer",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
                rating: 4,
                review: "Slate helps you see how many more days you need to work to reach your financial goal."
              },
              {
                name: "Sarah Johnson",
                role: "Architect",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
                rating: 4,
                review: "Slate helps you see how many more days you need to work to reach your financial goal."
              }
            ].map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{review.review}</p>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={review.image}
                      alt={review.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{review.name}</h4>
                    <p className="text-sm text-gray-600">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">FAQ</h2>
          <p className="text-gray-600">
            Problems trying to resolve the conflict between
            <br />
            the two major realms of Classical physics: Newtonian mechanics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(9)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-teal-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    the quick fox jumps over the lazy dog
                  </h3>
                  <p className="text-gray-600">
                    Things on a very small scale behave like nothing
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Footer Section */}
      <Footer />
    </div>
  );
} 