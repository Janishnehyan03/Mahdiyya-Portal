import React from "react";

function HeroSection() {
  return (
    <section className="slider" id="home">
      <div className="slide">
        <h2 className="font-bold text-3xl lg:text-7xl text-white">
          Centre for Public Education
          <br /> and Training <span className="text-3xl lg:text-5xl">(CPET)</span>
        </h2>
        <p className="lg:ml-[10px] text-white">
          Centre for Public Education and Training is an extension of the
          Darul Huda Islamic University devised for providing socio-educational empowerment
          programs <br /> for the public. CPET plans, designs and implements
          awareness programs aimed at different age groups of the public.
        </p>
      </div>
      <div className="colorOverlay" />
    </section>
  );
}

export default HeroSection;
