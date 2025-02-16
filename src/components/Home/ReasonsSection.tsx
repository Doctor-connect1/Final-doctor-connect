import Image from 'next/image';

export default function ReasonsSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-teal-600 mb-4">
            You have lots of reasons<br />to choose us
          </h2>
          <p className="text-gray-600 mb-8">
            Lorem ipsum dolor sit amet consectetur adipisicing elit mattis sit phasellus mollis sit aliquam sit nullam.
          </p>
          <div className="flex gap-4">
            <button className="bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-700 transition-colors">
              Get started
            </button>
            <button className="bg-white text-teal-600 px-8 py-3 rounded-full border border-teal-600 hover:bg-teal-50 transition-colors">
              Talk to sales
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-2xl overflow-hidden">
            <Image
              src="https://images.pexels.com/photos/263337/pexels-photo-263337.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Medical Team in Surgery"
              width={300}
              height={400}
              className="object-cover w-full h-[400px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 