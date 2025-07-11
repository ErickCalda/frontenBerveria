import { useEffect, useRef, useState } from "react";
import gsap from "gsap";


export default function Galeria() {
  const trackRef = useRef(null);
  const intervalRef = useRef(null);
  const isPaused = useRef(false);
  const itemWidthRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [contenido, setContenido] = useState([]); // Ahora contenido viene del backend

  useEffect(() => {
    async function cargarGaleria() {
      try {
        const res = await obtenerGaleriaDestacadas(); // Petición a backend
        setContenido(res.data); // Ajusta según la estructura que devuelva tu backend
      } catch (err) {
        console.error("Error al cargar galería:", err);
      }
    }

    cargarGaleria();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || contenido.length === 0) return; // Esperar a que contenido cargue

    const updateItemWidth = () => {
      const card = track?.children[0];
      if (card) {
        const style = window.getComputedStyle(card);
        const margin = parseFloat(style.marginRight || 0);
        itemWidthRef.current = card.offsetWidth + margin;
      }
    };

    updateItemWidth();
    window.addEventListener("resize", updateItemWidth);

    function animarCarrusel() {
      if (isPaused.current || !track) return;

      const lastIndex = contenido.length - 1;

      gsap.to(track, {
        x: -index * itemWidthRef.current,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          const media = track.children[index]?.querySelector("img, video");
          if (media) {
            gsap.fromTo(
              media,
              { opacity: 0, scale: 0.95 },
              { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }
            );
          }

          if (index >= lastIndex) {
            // Al llegar al último, reiniciamos suave al inicio
            gsap.to(track, {
              x: 0,
              duration: 1.2,
              ease: "power2.inOut",
            });
            setIndex(0);
          } else {
            setIndex((prev) => prev + 1);
          }
        },
      });
    }

    intervalRef.current = setInterval(animarCarrusel, 3000);

    function onMouseEnter() {
      isPaused.current = true;
      gsap.killTweensOf(track);
    }

    function onMouseLeave() {
      isPaused.current = false;
    }

    track.addEventListener("mouseenter", onMouseEnter);
    track.addEventListener("mouseleave", onMouseLeave);

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("resize", updateItemWidth);
      track.removeEventListener("mouseenter", onMouseEnter);
      track.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [index, contenido]);

  return (
    <section
      className="bg-[#1c1c1c] text-white py-8 px-4 overflow-hidden"
      style={{ height: "40rem", fontFamily: "var(--font-display)" }}
    >
      <h1
        className="text-center font-extrabold pb-16"
        style={{
          fontSize: "clamp(2.5rem, 6vw, 5rem)", // Responsive: desde 2.5rem hasta 6rem
          color: "var(--color-barber-gold)",
          textShadow: "0 0 15px var(--color-barber-gold)",
        }}
      >
        Galería
      </h1>

      <div
        className="flex w-max cursor-pointer transition-transform duration-700 ease-in-out"
        ref={trackRef}
        style={{
          height: "70%",
        }}
      >
        {contenido.map((item, i) => (
          <div
            key={item.id || i}
            className="flex-shrink-0 overflow-hidden shadow-lg w-[80vw] sm:w-[24rem] md:w-[28rem] h-full"
          >
            {/* Aquí asumimos que item.imagen_url es la URL del archivo */}
            {item.imagen_url && item.imagen_url.endsWith(".mp4") ? (
              <video
                src={item.imagen_url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={item.imagen_url || ""}
                alt={item.titulo || `imagen-${i}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
