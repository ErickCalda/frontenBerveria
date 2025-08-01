import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function QuienesSomos() {
  const textRef = useRef(null);
  const imageRef = useRef(null);


  return (
    <section className="bg-[ #1C1C1C]py-20 text-center" id="quienes-somos">
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
<div ref={imageRef} className="w-full flex justify-center md:w-auto">
  <img
    src="/assets/propietario.jpeg"
    alt="Barbería God Meets 2.0"
    style={{ height: '400px', width: '300px', objectFit: 'cover' }}
    className="rounded-xl shadow-xl w-full md:w-auto"
  />
</div>



      </div>
    </section>
  );
}
