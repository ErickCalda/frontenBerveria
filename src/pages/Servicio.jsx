import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { obtenerServicios } from "../service/servicioAPI";
import ServicioCard from "../components/ServicioCard";
import { AuthContext } from "../contexts/AuthContext";

export default function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const tituloRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  

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

  // Orden personalizado
  const ordenCategorias = ["Adultos", "Niños", "Barba", "Cejas"];

  // Extraemos categorías únicas, limpiamos espacios y ordenamos según el array personalizado
  const categoriasUnicas = [...new Set(servicios.map(s => s.categoria_nombre.trim()))].sort(
    (a, b) => {
      const indexA = ordenCategorias.indexOf(a);
      const indexB = ordenCategorias.indexOf(b);
      // Si no están en la lista, ponerlos al final
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    }
  );

  const serviciosFiltrados = categoriaSeleccionada
    ? servicios.filter((s) => s.categoria_nombre.trim() === categoriaSeleccionada)
    : servicios;

  const handleReservar = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/Reservar");
    }
  };
  console.log(servicios);


return (
  <section className="bg-[#1c1c1c] text-white min-h-screen p-4 sm:p-6 flex flex-col" style={{ fontFamily: "var(--font-display)" }}>
    <h2
      ref={tituloRef}
      className="text-center font-extrabold mb-8 sm:mb-10"
      style={{
        fontSize: "clamp(2rem, 6vw, 4rem)",
        color: "var(--color-barber-gold)",
        textShadow: "0 0 12px var(--color-barber-gold)",
      }}
    >
      Servicios
    </h2>

    <nav className="flex justify-center mb-6 sm:mb-8">
      <ul className="flex gap-4 sm:gap-6 bg-[#2a2a2a] px-3 py-2 rounded-lg shadow-lg overflow-x-auto scroll-custom no-scrollbar">
        {categoriasUnicas.map((cat) => (
          <li
            key={cat}
            onClick={() =>
              setCategoriaSeleccionada(
                categoriaSeleccionada === cat ? null : cat
              )
            }
            className={`relative whitespace-nowrap cursor-pointer text-base sm:text-lg font-semibold transition ${
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

    <div className="w-full flex justify-center">
      <div
        className="max-w-screen-xl w-full overflow-x-auto px-2 sm:px-4 scroll-custom no-scrollbar"
        style={{ maxHeight: "60vh" }}
      >
        <div className="flex gap-4 sm:gap-6 min-w-max">
          {serviciosFiltrados.map((serv) => (
            <div
              key={serv.id}
              className="flex-shrink-0 w-64 sm:w-72 md:w-80"
            >
              <ServicioCard servicio={serv} onReservar={handleReservar} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);



}
