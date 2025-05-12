import React from 'react';
import WalletConnection from '../molecules/WalletConnection';


const HeroSection = () => {
  return (
    <section className="relative rounded-[30px] overflow-hidden max-w-11/12 mx-auto bg-cover bg-center mt-8" style={{ backgroundImage: "url('/Vector.png')", minHeight: '800px' }}>
      <img src="/danmeyersfarm.png" alt="Background farm landscape" className="absolute inset-0 w-full h-full object-cover pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }} aria-hidden="true"></div>
      <div className="absolute inset-0 px-4 sm:px-6 md:px-10 lg:px-10 xl:px-2 flex flex-col justify-center mx-auto" style={{ maxWidth: '1200px' }}>
        <div className="max-w-5xl relative z-10 text-left px-4 sm:px-6">
          <span className="inline-block text-white/80 text-xs sm:text-sm font-normal rounded-full border border-white/30 px-4 py-1 mb-5 uppercase tracking-widest" data-aos="fade-up" data-aos-duration="1000">
            Agricultural Transparency
          </span>
          <h1 className="text-gray-100 font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
            Welcome To The Agricultural Marketplace <br />
            <span className="relative">
              <span className="absolute inset-0 bg-white/3 rounded-md -z-10"></span>
              <span className="text-white font-bold italic tracking-tight border-b-2 border-white/20 pb-1 text-5xl sm:text-86xl md:text-7xl">
                TrustFarm
              </span>
            </span>
          </h1>
          <p className="text-white/70 text-lg sm:text-xl mb-8 leading-relaxed max-w-2xl font-light" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
            A premium marketplace connecting farmers with buyers through transparency, security, and mutual trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <WalletConnection className="bg-white text-black font-medium text-lg rounded-sm px-8 py-3 hover:bg-white/90 transition-all duration-300 hover:shadow-md" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300" />
            <button className="border border-white/40 text-white text-lg rounded-sm px-8 py-3 hover:bg-white/5 hover:border-white/60 transition-all duration-300 font-light" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
              Marketplace
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-[280px] h-[280px] rounded-tl-[30px] rounded-bl-[30px] pointer-events-none" style={{ mixBlendMode: 'multiply', opacity: 0.15 }} aria-hidden="true"></div>
    </section>
  );
};

export default HeroSection;
