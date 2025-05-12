"use client";

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';


import HeroSection from '../atoms/HeroSection';
import WhyChooseUs from '../atoms/WhyChooseUs';
import WhatIsOurPlatform from '../atoms/WhatIsOurPlatform';
import SharedSuccess from '../atoms/SharedSuccess';
import CallToAction from '../atoms/CallToAction';
import WhyAdoptOurTechnology from '../atoms/WhyAdoptOurTechnology';
import HowItWorks from '../atoms/HowItWorks';
import FAQs from '../atoms/FAQs';

export default function LandingPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  return (
    <div className="bg-gray-100 overflow-hidden m-0 p-0 pt-6">

      <section data-aos="fade-up"><HeroSection /></section>
      <section data-aos="fade-up" data-aos-delay="100"><WhyChooseUs /></section>
      <section data-aos="fade-up" data-aos-delay="200"><WhatIsOurPlatform /></section>
      <section data-aos="fade-up" data-aos-delay="300"><SharedSuccess /></section>
      <section data-aos="fade-up" data-aos-delay="400"><CallToAction /></section>
      <section data-aos="fade-up" data-aos-delay="500"><WhyAdoptOurTechnology /></section>
      <section data-aos="fade-up" data-aos-delay="600"><HowItWorks /></section>
      <section data-aos="fade-up" data-aos-delay="700"><FAQs /></section>

    </div>
  );
}
