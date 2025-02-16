import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Providing Quality <span className="text-teal-600">Healthcare</span> For A{' '}
            <span className="text-lime-600">Brighter</span> And{' '}
            <span className="text-lime-600">Healthy</span> Future
          </h1>
          <p className="text-gray-600 mb-8">
            At Our Hospital, We Are Dedicated To Providing Exceptional Medical Care 
            To Our Patients And Their Families. Our Experienced Team Of Medical 
            Professionals, Cutting-Edge Technology, And Compassionate Approach Make 
            Us A Leader In The Healthcare Industry
          </p>
          <div className="flex gap-4">
            <button className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700">
              Appointments
            </button>
            <button className="flex items-center gap-2 border border-teal-600 text-teal-600 px-6 py-3 rounded-md hover:bg-teal-50">
              <span>Watch Video</span>
              <span>▶</span>
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="bg-gradient-to-b from-teal-500 to-teal-600 rounded-[40px] p-4">
            <Image
              src="https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w="
              alt="Healthcare Professional"
              width={700}
              height={30}
              className="rounded-[32px]"
            />
            <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-full">
              <span className="text-teal-600 text-sm font-medium">24/7 Service</span>
            </div>
            {/* <div className="absolute bottom-4 left-4 flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Image
                  key={i}
                  src={`/professional-${i}.jpg`}
                  alt="Professional"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white"
                />
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
