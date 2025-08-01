import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function QuienesSomos() {
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const textAnim = gsap.fromTo(
      textRef.current,
      { opacity: 0, x: -100 },
      {
        opacity: 1,
        x: 0,
        
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "bottom bottom",
          end: "top center",
          toggleActions: "play reverse play reverse",
       
          scrub: true,
          
        },
      }
    );

    const imageAnim = gsap.fromTo(
      imageRef.current,
      { opacity: 0, x: 100 },
      {
        opacity: 1,
        x: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "bottom bottom",
          end: "top center",
          toggleActions: "play reverse play reverse",
        
          scrub: true,
        },
      }
    );

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      textAnim.scrollTrigger.kill();
      imageAnim.scrollTrigger.kill();
      textAnim.kill();
      imageAnim.kill();
    };
  }, []);

  return (
    <section className="bg-[ #1C1C1C]py-20" id="quienes-somos">
      <div className="container mx-auto px-4 md:flex items-center justify-between gap-8">
        <div ref={textRef} className="md:w-1/2 mb-12 md:mb-0">
          <h2 className="text-4xl md:text-5xl font-extrabold text-amber-50 mb-6">
            God Meets 2.0 Barbershop
          </h2>
          <p className="text-lg text-amber-50 mb-4">
            Somos una barbería apasionada por el estilo y el cuidado personal.
            Nuestro equipo de profesionales está dedicado a ofrecerte la mejor
            experiencia en corte y arreglo personal. ¡Bienvenido a nuestra casa!
          </p>
          <p className="text-lg text-gray-300 italic">
            Fundada en el corazón de Esmeraldas, God Meets 2.0 Barbershop nació con
            la visión de redefinir el arte de la barbería en la región. Comenzamos como
            un pequeño sueño entre amigos, y hoy somos un símbolo de identidad, cultura
            y estilo urbano.
          </p>
        </div>
        <div ref={imageRef} className="md:w-1/2">
          <img
            src="/assets/propietario.jpeg"
            alt="Barbería God Meets 2.0"
            className="rounded-xl shadow-xl w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
