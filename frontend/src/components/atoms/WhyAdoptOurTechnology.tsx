import { HandHelping, Accessibility, Plus } from "lucide-react";

const WhyAdoptOurTechnology = () => {


  return (
    <section className="bg-[#dfe0db] text-[#0f1f35] min-h-[50vh] flex items-center justify-center py-28 p-6">
      <div className="max-w-7xl w-full">
        <div className="max-w-xl mb-10" data-aos="fade-up">
          <h2 className="text-5xl font-medium leading-tight mb-4">
            Why Adopt Our Technology?
          </h2>
          <p className="text-base leading-6 text-[#0f1f35] max-w-xs">
            We combine proprietary blockchain infrastructure with industry expertise to deliver real value in a rapidly evolving agricultural landscape.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div
            className="bg-[#004a5a] rounded-xl p-6 flex-1 min-w-[250px] shadow-lg"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="text-sm mb-3 text-[#a9c6cc] flex items-center gap-2">
              <HandHelping className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Hands-on Support & Guidance
            </h3>
            <p className="text-base leading-6 text-[#a9c6cc]">
              Receive expert agronomy guidance and ongoing assistance to succeed in your carbon farming journey.
            </p>
          </div>

          <div
            className="bg-[#e1e2e1] rounded-xl p-6 flex-1 min-w-[250px] shadow-lg"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="text-sm mb-3 text-[#0f1f35] flex items-center gap-2">
              <Accessibility className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#0f1f35]">
              Access to Resources & Inputs
            </h3>
            <p className="text-base leading-6 text-[#0f1f35]">
              Gain access to essential tools and unlock new income through certified carbon credits, ensuring trust and accountability in every transaction.
            </p>
          </div>

          <div
            className="bg-[#e3d6aa] rounded-xl p-6 flex-1 min-w-[250px] shadow-lg"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="text-sm mb-3 text-[#0f1f35] flex items-center gap-2">
              <Plus className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#0f1f35]">
              Additional Revenue Stream
            </h3>
            <p className="text-base leading-6 text-[#0f1f35]">
              Unlock an additional revenue stream through transparent and farmer-first carbon credits designed to reward sustainable practices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyAdoptOurTechnology;
