import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Servicios from "./Servicio";
import Galeria from "../components/Geleria";
import QuienesSomos from "./QuienesSomos";
import MediaCarousel from "./Clientes/MediaCarousel";
import Footer from "./Footer";
gsap.registerPlugin(ScrollTrigger);

const videos = ["/assets/1.mp4", "/assets/2.mp4", "/assets/3.mp4"];

function VideoContainer({ currentVideo }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [currentVideo]);

  return (
    <div
      className="bg-black rounded-xl overflow-hidden w-full aspect-[9/16] shadow-lg border border-gray-700"
      style={{
        maxWidth: "480px",
        width: "90vw",
        maxHeight: "clamp(40vh, 45vh, 65vh)",
        minWidth: "280px",
      }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        key={videos[currentVideo]}
        src={videos[currentVideo]}
        autoPlay
        muted
        loop={false}
        playsInline
        controls={false}
        preload="metadata"
      />
    </div>
  );
}

export default function Home() {
  const introRef = useRef(null);
  const overlayRef = useRef(null);
  const titleRef = useRef(null);
  const title2 = useRef(null);
  const videoContainerRef = useRef(null);
  const contAdicional = useRef(null);
  const videoAdicionalRef = useRef(null);

  const [currentVideo, setCurrentVideo] = useState(0);

  const navigate = useNavigate();

  // Animaciones GSAP
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: introRef.current,
          start: "top",
          end: "+=150%",
          scrub: true,
          pin: true,
        },
      });

      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, ease: "power1" });

      tl.fromTo(
        titleRef.current,
        {
          scale: isMobile ? 20 : 80,
          color: "transparent",
          WebkitTextStroke: "0px black",
          WebkitTextFillColor: "transparent",
          y: 0,
        },
        {
          scale: 1,
          color: "white",
          WebkitTextStroke: "0px transparent",
          WebkitTextFillColor: "white",
          y: isMobile ? -40 : -100,
          ease: "power1",
        },
        0
      );

      tl.fromTo(
        title2.current,
        {
          color: "transparent",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 0px transparent",
        },
        {
          color: "var(--color-barber-gold)",
          WebkitTextFillColor: "var(--color-barber-gold)",
          textShadow: "0 0 8px rgba(212, 175, 55, 0.6)",
          ease: "power2",
        },
        0.3
      );

      tl.fromTo(
        contAdicional.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, ease: "power2.out" },
        0.4
      );

      tl.fromTo(
        videoAdicionalRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, ease: "power2.out" },
        0.6
      );

      const heroTL = gsap.timeline({
        scrollTrigger: {
          trigger: introRef.current,
          start: "top center",
        },
      });

      heroTL.from(".hero-title", { opacity: 0, y: 40, duration: 1, ease: "power3.out" });

      heroTL.from(
        ".hero-list li",
        { opacity: 0, x: -20, stagger: 0.15, duration: 0.5 },
        "-=0.4"
      );

      heroTL.from(".hero-button", {
        opacity: 0,
        scale: 0.95,
        y: 10,
        duration: 0.6,
        ease: "back.out(1.4)",
      });

      gsap.fromTo(
        videoContainerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: "power1" }
      );
    }, introRef);

    return () => ctx.revert();
  }, []);

  // Cambiar video con fade
  useEffect(() => {
    const fadeVideo = () => {
      if (!videoContainerRef.current) return;

      return new Promise((resolve) => {
        gsap.to(videoContainerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power1.out",
          onComplete: () => resolve(),
        });
      });
    };

    const fadeInVideo = () => {
      if (!videoContainerRef.current) return;

      gsap.to(videoContainerRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power1.in",
      });
    };

    const interval = setInterval(async () => {
      await fadeVideo();
      setCurrentVideo((prev) => (prev + 1) % videos.length);
      fadeInVideo();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Navegar a /Reservar al click en botón
  const handleReservaClick = () => {
    navigate("/Reservar");
  };

  return (
    <main
      className="font-sans"
      style={{ fontFamily: "var(--font-heading)", marginTop: "1px" }}
    >
      <section
        ref={introRef}
        className="relative h-screen w-full overflow-hidden"
      >
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/assets/FOTOPRINCIPAL.webp')" }}
        >
          <div className="absolute inset-0 bg-[rgba(32,32,32,0.72)] z-10"></div>

          <div className="relative z-20 flex flex-col-reverse md:flex-row items-center justify-between h-full px-6 sm:px-10 md:px-14 max-w-screen-2xl mx-auto py-10 md:py-16 gap-8 md:gap-12">
            <div className="flex-1 w-full md:max-w-[55%] flex flex-col justify-center h-full text-center md:text-left space-y-5 md:space-y-6">
              <h1
                className="hero-title text-white font-serif font-bold leading-tight"
                style={{
                  fontSize: "clamp(2rem, 5vw, 4.5rem)",
                  fontFamily: "var(--font-display)",
                  lineHeight: 1.1,
                }}
              >
                Estilo y Elegancia en Cada Corte
              </h1>

             <ul
  className="hero-list text-white text-xs sm:text-sm md:text-base space-y-1.5 sm:space-y-2 pl-5 list-none"
  style={{ fontFamily: "var(--font-display)" }}
>
  <li>Barberos expertos con estilo único</li>
  <li>Ambiente cómodo y moderno</li>
  <li>Productos de alta calidad</li>
</ul>


            </div>

            <div
              ref={videoContainerRef}
              className="flex-1 w-full md:max-w-[45%] flex items-center justify-center"
              style={{ minWidth: 280 }}
            >
              <VideoContainer currentVideo={currentVideo} />
            </div>
          </div>
        </div>

        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black z-20"
          style={{ pointerEvents: "none", opacity: 0 }}
        ></div>

        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 leading-tight"
          style={{ fontFamily: "var(--font-body)", userSelect: "none" }}
        >
          <h1
            ref={titleRef}
            className="flex flex-col items-center font-extrabold pt-9 sm:mt-12"
            style={{
              fontSize: "clamp(2rem, 10vw, 5.5rem)",
              lineHeight: 1.05,
            }}
          >
            <span>God Meets 2.0</span>
            <span ref={title2}>BARBERSHOP</span>
          </h1>

          <div className="flex flex-col items-center gap-6 sm:gap-10 w-full max-w-5xl mx-auto px-4 opacity-100">
            <div
              ref={contAdicional}
              className="text-white text-center"
              style={{
                fontFamily: "var(--font-display)",
                maxWidth: "700px",
                fontSize: "clamp(1.3rem, 3.5vw, 1.5rem)",
              }}
            >
              <p className="mx-16">
                Vive la experiencia premium. Estilo, detalle y distinción te esperan
                en{" "}
                <span style={{ color: "var(--color-barber-gold)" }}>
                  God Meets 2.0.
                </span>
              </p>
            </div>

            <div
              className="w-full flex justify-center"
              ref={videoAdicionalRef}
            >
              <img
                src="/assets/foto3.webp"
                alt="Experiencia Barbería"
                className="rounded-xl shadow-xl w-64 h-64 sm:w-72 sm:h-72 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <section>
          <Servicios />
      </section>

      <section>
        <MediaCarousel />
      </section>

      <section>
       
        <QuienesSomos />
      </section>
     
      <Footer />
    </main>
  );
}
