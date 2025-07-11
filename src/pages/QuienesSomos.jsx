import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function QuienesSomos() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    gsap.fromTo(
      textRef.current,
      { x: -100, opacity: 0, pointerEvents: 'none' },
      {
        x: 0,
        opacity: 1,
        pointerEvents: 'auto',
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    gsap.fromTo(
      imageRef.current,
      { x: 100, opacity: 0, pointerEvents: 'none' },
      {
        x: 0,
        opacity: 1,
        pointerEvents: 'auto',
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    ScrollTrigger.refresh();
  }, []);

  return (
    <section
      ref={containerRef}
      className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20  gap-10 bg-[#1C1C1C] text-white"
      style={{fontFamily: "var(--font-display)"}}
    >
      {/* Texto a la izquierda */}
      <div
        ref={textRef}
        className="md:w-1/2 text-center md:text-left space-y-4 opacity-0 -translate-x-10 pointer-events-none"
      >
        <h2 className="text-4xl font-bold text-[#ffcc66]">¿Quiénes Somos?</h2>
        <p className="text-lg text-gray-300">
          Somos una barbería dedicada a ofrecer cortes modernos, clásicos y personalizados,
          brindando una experiencia única con atención profesional, ambiente acogedor y estilo auténtico.
        </p>
        <p className="text-md text-gray-400">
          Nuestro equipo de barberos está altamente capacitado para ayudarte a verte y sentirte mejor.
        </p>
      </div>

      {/* Imagen a la derecha */}
      <div
        ref={imageRef}
        className="md:w-1/2 flex justify-center opacity-0 translate-x-10 pointer-events-none"
      >
        <img
          src="/assets/noto.png"
          alt="Logo o imagen representativa"
          className="w-64 h-64 object-contain rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
}
