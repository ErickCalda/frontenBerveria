import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Login from "./Login";

const MEDIA = [
  { src: "/assets/foto1.webp", type: "image" },
  { src: "/assets/6.mp4", type: "video" },
  { src: "/assets/foto2.webp", type: "image" },
  { src: "/assets/5.mp4", type: "video" },
  { src: "/assets/foto3.webp", type: "image" },
  { src: "/assets/1.mp4", type: "video" },
  { src: "/assets/foto4.webp", type: "image" },
  { src: "/assets/2.mp4", type: "video" },
  { src: "/assets/foto5.webp", type: "image" },
  { src: "/assets/3.mp4", type: "video" },
  { src: "/assets/foto6.webp", type: "image" },
  { src: "/assets/4.mp4", type: "video" },
];

const COLS = 4;
const ROWS = 3;

export default function Fondo() {
  const containerRef = useRef(null);
  const [items, setItems] = useState(MEDIA);

  const shuffleItems = () => {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setItems(shuffled);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray(".media-item");

      gsap.set(elements, {
        position: "absolute",
        top: 0,
        left: 0,
        transformOrigin: "center center",
      });

      const layout = () => {
        elements.forEach((el, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          gsap.fromTo(
            el,
            {
              x: `${col * 100}%`,
              y: `${row * 100}%`,
              opacity: 0,
              scale: 0.95,
            },
            {
              opacity: 1,
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
              delay: 0.1,
            }
          );
        });
      };

      layout();

      const interval = setInterval(() => {
        gsap.to(elements, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.in",
          onComplete: () => {
            shuffleItems();
            setTimeout(() => layout(), 50);
          },
        });
      }, 4000);

      return () => clearInterval(interval);
    }, containerRef);

    return () => ctx.revert();
  }, [items]);

  return (
    <div
      className="w-screen h-screen relative overflow-hidden"
      ref={containerRef}
    >
      {/* Fondo invisible con grid */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          pointerEvents: "none",
        }}
      />

      {/* Items (imágenes y videos) */}
      {items.map((media, i) => (
        <div
          key={i}
          className="media-item"
          style={{
            width: `${100 / COLS}%`,
            height: `${100 / ROWS}%`,
            transformOrigin: "center center",
            willChange: "transform, opacity",
            contain: "layout style",
            opacity: 0,
          }}
        >
          {media.type === "image" ? (
            <img
              src={media.src}
              alt={`media-${i}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <video
              src={media.src}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}

      {/* Capa oscura encima */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.8)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Contenedor de Login centrado */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 20,
          pointerEvents: "auto",
          width: "90vw",
          maxWidth: "500px",
          padding: "1rem",
          boxSizing: "border-box",
        }}
      >
        <Login />
      </div>
    </div>
  );
}
