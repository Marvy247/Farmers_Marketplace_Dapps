

const WhyChooseUs = () => {


  return (
    <section
      className="relative min-h-1/3 bg-cover bg-center grid place-items-center p-20"
      style={{ backgroundImage: "url('/Vector.png')" }}
    >
      <img
        src="/boxlines.jpg"
        alt="Boxlines overlay"
        className="absolute w-full h-full object-cover pointer-events-none"
        style={{ top: "25%", position: "absolute" }}
        aria-hidden="true"
      />

      <div
        className="relative z-10 text-center max-w-xl mx-auto py-8 min-h-[300px]"
        data-aos="zoom-in"
        data-aos-delay="100"
      >
        <h1 className="text-[#6B8E23] text-4xl sm:text-5xl font-semibold mb-4">
          Why Choose Our Platform?
        </h1>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
          Our platform leverages blockchain technology to provide transparency, security, and automation in agricultural commerce. Farmers can list their products, and buyers can create orders with confidence, knowing that payments are securely held in escrow.
        </p>
      </div>
    </section>
  );
};

export default WhyChooseUs;
