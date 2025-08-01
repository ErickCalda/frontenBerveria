import React, { forwardRef } from "react";

const HeroBackground = forwardRef(({ overlayStyle }, ref) => {
  return (
    <div className="relative h-screen w-full overflow-hidden" ref={ref}>
      {/* Imagen de fondo */}
      <img
        src="/assets/FOTOPRINCIPAL.webp"
        alt="Fondo barbería"
        className="absolute inset-0 w-full h-full object-cover z-40"
      />

      {/* Overlay negro */}
      <div
        className="absolute inset-0 bg-black z-70"
        style={{ pointerEvents: "none", ...overlayStyle }}
      ></div>
    </div>
  );
});

export default HeroBackground;
