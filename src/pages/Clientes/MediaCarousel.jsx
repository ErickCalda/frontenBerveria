import React, { useEffect, useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";

const mediaItems = [
  { src: "/assets/foto1.webp", type: "image" },
  { src: "/assets/1.mp4", type: "video" },
  { src: "/assets/foto2.webp", type: "image" },
  { src: "/assets/2.mp4", type: "video" },
  { src: "/assets/foto3.webp", type: "image" },
  { src: "/assets/foto4.webp", type: "image" },
];

export default function MediaCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const itemWidth = 300;
  const autoplaySpeed = 3500;

  const totalItems = mediaItems.length;
  const duplicatedItems = [...mediaItems, ...mediaItems, ...mediaItems];

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex((prev) => (prev + 1) % totalItems),
    onSwipedRight: () => setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems),
    trackMouse: true,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, autoplaySpeed);
    return () => clearInterval(timer);
  }, [totalItems]);

  // Para evitar el scroll, vamos a calcular el translateX usando el ancho del contenedor real
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    
    <div
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[400px] overflow-hidden bg-transparent mb-24"
      {...swipeHandlers}
    >
        <h1 className="font-bold text-7xl text-white mb-8 text-center">GALERIA</h1>
     
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${
            (currentIndex + totalItems) * itemWidth - containerWidth / 2 + itemWidth / 2
          }px)`,
          willChange: "transform",
          
        }}
      >
        {duplicatedItems.map((item, idx) => {
          const isCenter = (idx % totalItems) === currentIndex % totalItems;

          return (
            <div
              key={idx}
              className="relative shrink-0 transition-transform duration-500"
              style={{
                width: `${itemWidth}px`,
                height: "100%",
                transform: `scale(${isCenter ? 1.15 : 0.85})`,
                zIndex: isCenter ? 10 : 1,
              }}
            >
              {item.type === "image" ? (
                <img
                  src={item.src}
                  className="w-full h-full object-cover "
                  alt={`media-${idx}`}
                 
                />
              ) : (
                <video
                  src={item.src}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
