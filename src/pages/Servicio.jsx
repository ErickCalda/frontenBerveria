import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { obtenerServicios } from "../service/servicioAPI";
import ServicioCard from "../components/ServicioCard";

export default function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const tituloRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.getAll().forEach((t) => t.kill());

    gsap.fromTo(
      tituloRef.current,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: tituloRef.current,
          start: "top 80%",
          end: "top 60%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const data = await obtenerServicios();
        setServicios(data);
      } catch (err) {
        console.error("Error cargando servicios:", err);
      }
    };

    cargarServicios();
  }, []);

  // Categorías únicas para filtro
  const categoriasUnicas = [...new Set(servicios.map((s) => s.categoria_nombre))];

  // Servicios filtrados según categoría seleccionada
  const serviciosFiltrados = categoriaSeleccionada
    ? servicios.filter((s) => s.categoria_nombre === categoriaSeleccionada)
    : servicios;

  // Función para manejar la reserva - redirige a la ruta /Reservar
  const handleReservar = () => {
    navigate("/Reservar");
  };

  return (
    <section
      className="bg-[#1c1c1c] text-white h-auto p-6 flex flex-col"
      style={{ fontFamily: "var(--font-display)" }}
    >
      <h2
        ref={tituloRef}
        className="text-center font-extrabold mb-10"
        style={{
          fontSize: "clamp(2.5rem, 5vw, 4rem)",
          color: "var(--color-barber-gold)",
          textShadow: "0 0 12px var(--color-barber-gold)",
        }}
      >
        Servicios
      </h2>

      {/* Menú dinámico de categorías */}
      <nav className="flex justify-center mb-8">
        <ul className="flex gap-6 bg-[#2a2a2a] px-4 py-2 rounded-lg shadow-lg overflow-x-auto scroll-custom">
          {categoriasUnicas.map((cat) => (
            <li
              key={cat}
              onClick={() =>
                setCategoriaSeleccionada(
                  categoriaSeleccionada === cat ? null : cat
                )
              }
              className={`relative group cursor-pointer text-lg font-semibold transition ${
                categoriaSeleccionada === cat
                  ? "text-yellow-400"
                  : "text-white hover:text-yellow-400"
              }`}
            >
              {cat}
              <span
                className={`absolute left-0 -bottom-1 w-full h-0.5 bg-yellow-400 transform transition-transform origin-left duration-300 ${
                  categoriaSeleccionada === cat
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              ></span>
            </li>
          ))}
        </ul>
      </nav>

      {/* Cards de servicios */}
      <div className="w-full flex justify-center">
        <div
          className="max-w-screen-xl w-full overflow-x-auto px-4 scroll-custom"
          style={{ maxHeight: "60vh" }}
        >
          <div className="flex gap-6">
            {serviciosFiltrados.map((serv) => (
              <div key={serv.id} className="flex-shrink-0">
                {/* Pasamos la función handleReservar para que el botón reserve */}
                <ServicioCard servicio={serv} onReservar={handleReservar} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
