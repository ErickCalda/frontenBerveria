import React from "react";
import { NavLink } from "react-router-dom";

export default function LogoSection() {
  return (
    <div className="flex items-center space-x-3">
      <NavLink to="/" className="block w-12 h-12" aria-label="Inicio">
        <img
          src="assets/logo.avif"
          alt="Logo God Meets 2.0"
          className="w-full h-full object-cover rounded-full shadow-sm border border-[#A07C1A]"
          loading="lazy"
        />
      </NavLink>
      <div
        className="text-xl md:text-2xl font-bold tracking-wide select-none"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        GOD MEETS 2.0
        <br className="block sm:hidden" /> BARBERSHOP
      </div>
    </div>
  );
}
