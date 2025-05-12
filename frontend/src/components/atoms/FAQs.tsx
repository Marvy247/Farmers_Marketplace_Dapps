import { Plus } from "lucide-react";


const FAQs = () => {
  return (
    <section className="bg-[#E3E4E3] min-h-[50vh] flex items-center justify-center py-28 px-28">
      <div className="w-full mx-auto">
        <h2 className="font-extrabold text-3xl leading-9 text-[#2B2B2B] mb-4" data-aos="fade-up" data-aos-duration="1000">
          FAQs
        </h2>
        <hr className="border-t border-[#8B8B8B] mb-4 w-full" />
        <div className="divide-y divide-[#8B8B8B] w-full">
          <div className="flex justify-between items-center py-4 text-xl leading-7 text-[#2B2B2B] w-full" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
            <span className="w-full">
              What types of products can farmers list?
            </span>
            <Plus className="w-7 h-7 text-[#2B2B2B]" />
          </div>
          <div className="flex justify-between items-center py-4 text-xl leading-7 text-[#2B2B2B] w-full" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
            <span className="w-full">
              How does the escrow payment system work?
            </span>
            <Plus className="w-7 h-7 text-[#2B2B2B]" />
          </div>
          <div className="flex justify-between items-center py-4 text-xl leading-7 text-[#2B2B2B] w-full" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
            <span className="w-full">
              What happens if a dispute arises?
            </span>
            <Plus className="w-7 h-7 text-[#2B2B2B]" />
          </div>
          <div className="flex justify-between items-center py-4 text-xl leading-7 text-[#2B2B2B] w-full" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
            <span className="w-full">
              How can I provide feedback on my experience?
            </span>
            <Plus className="w-7 h-7 text-[#2B2B2B]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
