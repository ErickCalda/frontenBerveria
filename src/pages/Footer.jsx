import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const el = footerRef.current;

    gsap.fromTo(
      el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%", // cuando el 20% del footer entre a la vista
        },
      }
    );
  }, []);

  return (
    <footer
      ref={footerRef}
      className="bg-neutral-900 text-gray-200 py-10 px-6 md:px-20"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        <div>
          <h3 className="text-xl font-semibold mb-2">God Meets 2.0 Barbershop</h3>
          <p className="text-sm">Cortes clásicos y modernos con estilo y precisión.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contacto</h4>
          <p className="text-sm">📍 Esmeraldas</p>
          <p className="text-sm">📞 +593 999 123 456</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Horario</h4>
          <p className="text-sm">Lun - Dom: </p>
          
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} God Meets 2.0 Barbershop. Todos los derechos reservados.
      </div>
    </footer>
  );
}
