
import { Plus } from 'lucide-react';


const WhatIsOurPlatform = () => {


  return (
    <section className="bg-[#5a7a22] text-white px-6 py-10 md:py-16 md:px-20 relative overflow-visible">
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-8 md:gap-12">
        {/* Left Column */}
        <div
          className="flex flex-col md:w-1/2 lg:w-2/5 space-y-6"
          data-aos="fade-right"
        >
          <h2 className="text-lg md:text-xl font-semibold tracking-wider text-gray-100 uppercase">
            WHAT IS OUR PLATFORM?
          </h2>
          <div className="space-y-3" data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-sm md:text-base font-semibold text-gray-100">
              Secure Transactions
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-gray-300 max-w-[280px]">
              Our app ensures that payments are securely held in escrow until all transaction conditions are met, fostering trust between farmers and buyers.
            </p>
          </div>
          <div
            className="relative pl-10 pt-6 border-l-2 border-gray-400/30 space-y-3"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <p className="text-sm md:text-base font-semibold text-gray-100">Our Mission</p>
            <p className="text-sm md:text-base leading-relaxed text-gray-300">
              To empower farmers and buyers through innovative technology, creating a sustainable and transparent agricultural marketplace.
            </p>
            <button className="text-sm md:text-base font-semibold text-[#f1e2e0] hover:underline flex items-center gap-2 transition-all">
              Know more
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div
          className="flex flex-col md:w-1/2 lg:w-2/5 space-y-6 md:mt-12"
          data-aos="fade-left"
        >
          <div className="space-y-3" data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-sm md:text-base font-semibold text-gray-100">
              Dispute Resolution
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-gray-300 max-w-[280px]">
              Our escrow contract supports dispute resolution, allowing buyers to raise disputes within a specified period, ensuring fair outcomes.
            </p>
          </div>
          <div
            className="relative pl-10 pt-6 border-l-2 border-gray-400/30 space-y-3"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <p className="text-sm md:text-base font-semibold text-gray-100">Our Vision</p>
            <p className="text-sm md:text-base leading-relaxed text-gray-300">
              To create a thriving ecosystem for agricultural commerce that benefits farmers and buyers alike, promoting sustainability and accountability.
            </p>
            <button className="text-sm md:text-base font-semibold text-[#f3e4e1] hover:underline flex items-center gap-2 transition-all">
              Know more
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Large text background decoration */}
      <div
        className="absolute left-0 right-0 bottom-16 pointer-events-none select-none"
        data-aos="zoom-in"
        data-aos-delay="300"
      >
        <h1 className="text-[125px] font-extrabold text-[#77973f] leading-none tracking-[0.1em] uppercase opacity-8 select-none pointer-events-none">
          SUSTAINABLE AGRICULTURE
        </h1>
      </div>

      {/* Decorative "fc" text */}
      <div
        className="absolute top-[50%] left-[13%] w-[178px] h-[269px] flex items-center justify-center"
        data-aos="fade-in"
        data-aos-delay="400"
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 400,
          fontSize: '340.5px',
          lineHeight: '50%',
          letterSpacing: 0,
          textTransform: 'lowercase',
          color: '#77973f',
          opacity: 0.2,
        }}
      >
        fc
      </div>
    </section>
  );
};

export default WhatIsOurPlatform;
