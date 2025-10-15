"use client";
import Image from 'next/image';

const logoData = [
  { name: 'Maersk', logo: '/partner/partner.png' },
  { name: 'Banff Sunshine', logo: '/partner/partner (2).png' },
  { name: 'Order.co', logo: '/partner/partner (3).png' },
  { name: 'Crumbl Cookies', logo: '/partner/partner (4).png' },
  { name: 'Hilton', logo: '/partner/partner (5).png' },
  { name: 'CorePower Yoga', logo: '/partner/partner (6).png' },
  { name: 'Rutgers', logo: '/partner/partner (7).png' },
  { name: 'NSD', logo: '/partner/partner (8).png' },
  { name: 'IntelyCare', logo: '/partner/partner (9).png' },
  { name: 'Oasis', logo: '/partner/logo.png' },
  { name: 'Ezviz', logo: '/partner/ezviz.png' },
];

export default function Brands() {
  return (
    <section className="bg-white py-16 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Leading <span className='text-blue-600'>Brands</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Partners with industry leaders, delivering excellence and<br />
            innovation in our services.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative overflow-hidden">
          {/* Slider Track */}
          <div
            className="flex space-x-12"
            style={{ animation: 'marquee 25s linear infinite' }}
          >
            {/* Double the logos for seamless loop */}
            {[...logoData, ...logoData].map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                className="flex-shrink-0 flex items-center justify-center min-w-[128px]"
              >
                <div className="relative w-32 h-16">
                  <Image
                    src={logo.logo}
                    alt={logo.name}
                    fill
                    className="object-contain"
                    sizes="128px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% - 3rem));
          }
        }
      `}</style>
    </section>
  );
}