const SharedSuccess = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
        <div className="md:w-1/2" data-aos="fade-up" data-aos-duration="1000">
          <h1 className="text-[#0a1a38] text-3xl md:text-4xl font-semibold leading-tight">
            Shared Success
          </h1>
        </div>
        <div className="md:w-1/2 md:pt-2" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
          <p className="text-sm md:text-base text-[#0a1a38]/90 leading-relaxed max-w-md">
            Explore our innovative approach to agricultural commerce, empowering farmers and buyers while ensuring sustainability for a greener future.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Farmer card */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg min-h-[500px]" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
          <img 
            alt="Farmer's hands holding grains" 
            className="w-full h-2/3 object-cover"
            src="/grain.png"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-[#4f8a1e] p-4 md:p-6 rounded-b-3 xl rounded-t-none md:rounded-t-3xl">
            <h2 className="text-white font-serif font-semibold text-lg md:text-2xl mb-2">
              Empowering Farmers
            </h2>
            <p className="text-white text-sm md:text-base leading-tight md:leading-relaxed">
              Our platform supports farmers in listing their agricultural products, providing detailed information to buyers. We guide farmers in adopting sustainable practices that enhance productivity and earn carbon credits.
            </p>
          </div>
        </div>

        {/* Rancher card */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg min-h-[500px]" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
          <img 
            alt="Aerial view of field" 
            className="w-full h-2/3 object-cover"
            src="/field.png"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-[#c07a0a] p-4 md:p-6 rounded-b-3xl rounded-t-none md:rounded-t-3xl">
            <h2 className="text-white font-serif font-semibold text-lg md:text-2xl mb-2">
              Supporting Sustainable Ranching
            </h2>
            <p className="text-white text-sm md:text-base leading-tight md:leading-relaxed">
              We empower ranchers to implement regenerative practices that improve soil health and increase yields. Our platform helps unlock new income streams through verified carbon credits.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SharedSuccess;
