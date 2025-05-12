const HowItWorks = () => {
  return (
    <section className="bg-[#07303a] min-h-[50vh] flex items-center justify-center py-28 p-6">
      <div className="max-w-7xl w-full">
        <h2 className="text-center text-white text-5xl font-medium mb-10" data-aos="fade-up" data-aos-duration="1000">
          How It Works
        </h2>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center">
          <div className="bg-[#dccda7] rounded-lg p-6 mx-auto sm:mx-0 max-w-xs sm:max-w-[320px] flex flex-col justify-start shadow-lg" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
            <div className="flex items-start gap-3">
              <div className="w-1.5 bg-[#d9a12f] rounded-sm h-full"></div>
              <div>
                <p className="font-extrabold text-xl leading-7 text-black mb-1">
                  Plan & Adopt
                </p>
                <p className="text-base leading-6 text-black max-w-[270px]">
                  Start your journey with a personalized consultation. Collaborate with FarmCredit experts to create a tailored carbon farming plan, supported by the necessary inputs and knowledge.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#064a5e] rounded-lg p-6 mx-auto sm:mx-0 max-w-xs sm:max-w-[320px] flex flex-col justify-start shadow-lg" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
            <div className="flex items-start gap-3">
              <div className="w-1.5 bg-[#d9a12f] rounded-sm h-full"></div>
              <div>
                <p className="font-extrabold text-xl leading-7 text-white mb-1">
                  Certify
                </p>
                <p className="text-base leading-6 text-white max-w-[270px]">
                  As you implement sustainable methods, FarmCredit tracks and verifies your progress, ensuring compliance with standards for certified carbon credits.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#d9d9d9] rounded-lg p-6 mx-auto sm:mx-0 max-w-xs sm:max-w-[320px] flex flex-col justify-start shadow-lg" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
            <div className="flex items-start gap-3">
              <div className="w-1.5 bg-[#d9a12f] rounded-sm h-full"></div>
              <div>
                <p className="font-extrabold text-xl leading-7 text-black mb-1">
                  Get Paid
                </p>
                <p className="text-base leading-6 text-black max-w-[270px]">
                  Once your credits are certified, companies purchase them, and you receive payment. With FarmCredit, your commitment to sustainability is rewarded.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
