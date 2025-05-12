const CallToAction = () => {
  return (
    <section className="bg-[#0a1a0a]">
      <div className="w-full mx-auto py-28 px-4 md:px-12">
        <div
          className="flex flex-col md:flex-row items-center bg-[#3a5200] w-full mx-auto rounded-none md:rounded-none overflow-hidden"
          data-aos="fade-up" // AOS animation
          data-aos-duration="1000" // Duration of the animation
        >
          <div className="md:flex-1 px-10 py-8 md:py-12 text-white">
            <h2 className="font-semibold text-3xl md:text-4xl leading-snug max-w-md">
              Ready to Elevate Your Agricultural Practices?
            </h2>
            <p className="text-lg md:text-xl mt-2 text-[#b7b7b7] max-w-xs">
              Join us in transforming agriculture for a sustainable future.
            </p>
            <button
              className="mt-4 bg-[#a3d55d] text-[#1a3a00] text-base font-semibold rounded-full px-4 py-2 hover:bg-[#8cc43a] transition-colors"
              type="button"
            >
              Explore
            </button>
          </div>
          <div className="md:flex-1 slant-left overflow-hidden">
            <img
              alt="Man watering plants in a garden"
              className="w-full h-full object-cover"
              height="180"
              src="/garden.jpg"
              width="400"
              data-aos="zoom-in" // AOS animation for the image
              data-aos-duration="1000" // Duration of the animation
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
