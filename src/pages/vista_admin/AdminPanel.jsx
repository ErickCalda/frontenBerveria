import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { gsap } from "gsap";
import citaService from "../../service/citaService";
import AdminAusencias from './obtenerTodasLasAusencias';
export default function AdminPanel() {
  const [citas, setCitas] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(true);
  const [actualizandoEstado, setActualizandoEstado] = useState(null);
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [fechaFiltro, setFechaFiltro] = useState("");
  

  const obtenerFechaHoy = useCallback(() => new Date().toISOString().split("T")[0], []);

  const cargarCitas = useCallback(() => {
    setLoadingCitas(true);
    const filtros = !mostrarTodas && !fechaFiltro
      ? { fecha: obtenerFechaHoy() }
      : fechaFiltro ? { fecha: fechaFiltro } : {};

    citaService
      .obtenerCitas(filtros)
      .then((res) => setCitas(res.data?.data || []))
      .catch((err) => {
        console.error("Error al cargar citas:", err);
        setCitas([]);
      })
      .finally(() => setLoadingCitas(false));
  }, [mostrarTodas, fechaFiltro, obtenerFechaHoy]);

  useEffect(() => {
    cargarCitas();
  }, [cargarCitas]);

  useEffect(() => {
    citaService
      .obtenerEstadosCitas()
      .then((res) => setEstados(res.data || []))
      .catch((err) => {
        console.error("Error al cargar estados:", err);
        setEstados([]);
      });
  }, []);

  const actualizarEstado = useCallback((citaId, nuevoEstado) => {
    setActualizandoEstado(citaId);
    citaService
      .cambiarEstadoCita(citaId, Number(nuevoEstado))
      .then(() => cargarCitas())
      .catch((err) => {
        console.error("Error al actualizar estado:", err);
        alert("No se pudo actualizar el estado");
      })
      .finally(() => setActualizandoEstado(null));
  }, [cargarCitas]);


const cambiarEstadoDeTodasLasCitasPorFecha = async (fecha) => {
  if (!fecha) {
    alert("Por favor selecciona una fecha primero.");
    return;
  }

  try {
    // Obtener las citas filtradas por fecha
    const res = await citaService.obtenerCitas({ fecha });
    const citasPorFecha = res.data?.data || [];

    if (citasPorFecha.length === 0) {
      alert(`No hay citas para la fecha ${fecha}.`);
      return;
    }

    const confirmar = window.confirm(`¿Seguro que quieres cambiar el estado de ${citasPorFecha.length} cita(s) del ${fecha}?`);
    if (!confirmar) return;

    const estadoDestino = estados.find((e) => e.nombre.toLowerCase().includes("cancel"));
    if (!estadoDestino) {
      alert("No se encontró el estado 'Cancelada'");
      return;
    }

    // Cambiar estado en todas las citas encontradas
    for (const cita of citasPorFecha) {
      await citaService.cambiarEstadoCita(cita.id, estadoDestino.id);
    }

    alert(`✅ Se cambiaron ${citasPorFecha.length} cita(s) a "${estadoDestino.nombre}".`);
    cargarCitas();

  } catch (error) {
    console.error("Error cambiando estados:", error);
    alert("Error al actualizar las citas.");
  }
};


  const citasAgrupadas = useMemo(() => {
    return citas.reduce((grupos, cita) => {
      const estado = cita.estado_nombre || "Otro";
      if (estado.toLowerCase() === "cancelada") return grupos;
      if (!grupos[estado]) grupos[estado] = [];
      grupos[estado].push(cita);
      return grupos;
    }, {});
  }, [citas]);

  const seccionesRefs = useRef({});
  const flechasRefs = useRef({});

  // Estado para detectar si cada sección tiene scroll vertical
  const [hasScroll, setHasScroll] = useState({});
  // Estado para controlar si la flecha debe mostrarse (si no está al fondo)
  const [flechaVisible, setFlechaVisible] = useState({});

  useEffect(() => {
    const checksHasScroll = {};

    Object.entries(seccionesRefs.current).forEach(([key, el]) => {
      if (!el) return;

      const tieneScrollVertical = el.scrollHeight > el.clientHeight;
      checksHasScroll[key] = tieneScrollVertical;
    });

    setHasScroll(checksHasScroll);
  }, [citas]);

  // Efecto para agregar event listeners de scroll para controlar visibilidad de flechas
  useEffect(() => {
    const handlers = [];

    Object.entries(seccionesRefs.current).forEach(([key, el]) => {
      if (!el) return;

      const onScroll = () => {
        const scrollBottom = el.scrollTop + el.clientHeight;
        const atBottom = scrollBottom >= el.scrollHeight - 1; // tolerancia 1px
        setFlechaVisible((prev) => ({ ...prev, [key]: !atBottom }));
      };

      // Ejecutar al montar para estado inicial
      onScroll();

      el.addEventListener("scroll", onScroll);
      handlers.push(() => el.removeEventListener("scroll", onScroll));
    });

    return () => {
      handlers.forEach((remove) => remove());
    };
  }, [citas]);

  useEffect(() => {
    Object.entries(flechasRefs.current).forEach(([key, el]) => {
      if (el && hasScroll[key]) {
        gsap.to(el, {
          y: -8,
          // opacity: 0.6,  <--- comentar o eliminar esta línea
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          duration: 1.2,
          overwrite: "auto",
        });
      } else if (el) {
        gsap.killTweensOf(el);
        gsap.set(el, { y: 0, opacity: 0 });  // También ajustar para no forzar opacidad 0
      }
    });
  }, [hasScroll]);
  

  useEffect(() => {
    const ctx = gsap.context(() => {
      Object.values(seccionesRefs.current).forEach((el, i) => {
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 20, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: "power2.out",
              delay: i * 0.12,
              duration: 0.6,
            }
          );
        }
      });
    });
    return () => ctx.revert();
  }, [citasAgrupadas]);

  const scrollDown = (estado) => {
    const container = seccionesRefs.current[estado];
    if (container) {
      container.scrollBy({ top: 100, behavior: "smooth" });
    }
  };

  return (
    <div
      className="flex min-h-screen bg-[#0d0d0d] text-white font-serif"
      style={{
        fontFamily: "'Merriweather', serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <h2
          className="text-3xl font-bold text-[#d4af37] tracking-wide select-none"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Panel de Citas
        </h2>

<div>
      {/* ... demás contenido del panel */}
      <AdminAusencias />
    </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap border-2">
            <label
              htmlFor="fechaFiltro"
              className="text-sm font-medium select-none"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              Filtrar por fecha:
            </label>
            <input
              id="fechaFiltro"
              type="date"
              className="bg-[#1a1a1a] text-white px-3 py-1 rounded border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              style={{ fontFamily: "'Oswald', sans-serif" }}
            />
            {fechaFiltro && (
              <button
                onClick={() => setFechaFiltro("")}
                className="text-sm text-red-400 hover:text-red-300 ml-2 select-none transition-colors duration-200"
                type="button"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Limpiar
              </button>
            )}
          </div>

          <button
            onClick={() => setMostrarTodas((prev) => !prev)}
            className="bg-[#d4af37] text-black px-4 py-2 rounded hover:bg-[#c49c27] transition-all duration-200 text-sm font-semibold shadow select-none focus:outline-none focus:ring-2 focus:ring-[#c49c27]"
            type="button"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            {mostrarTodas ? "Ver solo citas de hoy" : "Ver todas las citas"}
          </button>

<button
  onClick={() => cambiarEstadoDeTodasLasCitasPorFecha(fechaFiltro)}
  disabled={!fechaFiltro}
  className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-all duration-200 text-sm font-semibold shadow select-none focus:outline-none focus:ring-2 focus:ring-red-500 ${!fechaFiltro ? 'opacity-50 cursor-not-allowed' : ''}`}
  type="button"
  style={{ fontFamily: "'Oswald', sans-serif" }}
>
  Cancelar todas las citas del día seleccionado
</button>


        </div>

        <Card
          title={
            fechaFiltro
              ? `Citas del ${fechaFiltro}`
              : mostrarTodas
                ? "Todas las Citas"
                : "Citas de Hoy"
          }
        >
        {loadingCitas ? (
  <div className="spinner-container" aria-label="Cargando citas" role="status">
    <div className="spinner" />
  </div>
) : Object.keys(citasAgrupadas).length === 0 ? (
  <p className="text-gray-400 select-none" style={{ fontFamily: "'Merriweather', serif" }}>
    No hay citas.
  </p>
          ) : Object.keys(citasAgrupadas).length === 0 ? (
            <p className="text-gray-400 select-none" style={{ fontFamily: "'Merriweather', serif" }}>
              No hay citas.
            </p>
          ) : (
            Object.entries(citasAgrupadas).map(([estado, citasPorEstado]) => (
              <div
                key={estado}
                ref={(el) => (seccionesRefs.current[estado] = el)}
                className="mb-6 rounded-xl border-2 relative"
                style={{
                  maxHeight: "320px",
                  overflowY: "auto",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: citasPorEstado[0]?.estado_color || "#d4af37",
                  boxShadow: `0 0 0 0.5px ${citasPorEstado[0]?.estado_color || "#d4af37"}aa`,
                  fontFamily: "'Merriweather', serif",
                }}
              >
                <h4
                  className="text-xl font-semibold capitalize mb-3 p-3"
                  style={{
                    color: citasPorEstado[0]?.estado_color || "#d4af37",
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {estado}
                </h4>
                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-3 pb-3">
                  {citasPorEstado.map((cita) => (
                    <CitaCard
                      key={cita.id}
                      cita={cita}
                      estados={estados}
                      actualizarEstado={actualizarEstado}
                      actualizando={actualizandoEstado === cita.id}
                    />
                  ))}
                </ul>

                {hasScroll[estado] && citasPorEstado.length > 1 && (
  <div
    ref={(el) => (flechasRefs.current[estado] = el)}
    onClick={() => scrollDown(estado)}
    className="cursor-pointer sticky bottom-2 select-none z-10 flex justify-center transition-opacity duration-500 ease-in-out"
    style={{
      width: "100%",
      fontSize: "28px",
      userSelect: "none",
      filter: "drop-shadow(0 0 4px rgba(255, 255, 255, 0.4)) blur(0.5px)",
      opacity: flechaVisible[estado] ? 0.9 : 0,
      pointerEvents: flechaVisible[estado] ? "auto" : "none",
      lineHeight: 1,
    }}
    aria-label={`Desplazar hacia abajo en sección ${estado}`}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        scrollDown(estado);
      }
    }}
  >
    ▼
  </div>
)}

              </div>
            ))
          )}
        </Card>
      </main>

      <style>{`
        div::-webkit-scrollbar {
          width: 0px;
          height: 0px;
        }
      `}</style>
    </div>
  );
}

const Card = React.memo(({ title, children }) => (
  <section
    className="bg-[#121212] p-6 rounded-xl shadow-lg border border-[#2a2a2a] animate-fadeIn"
    role="region"
    aria-label={title}
    style={{ fontFamily: "'Merriweather', serif" }}
  >
    <h3
      className="text-2xl font-semibold mb-4 text-[#d4af37] select-none"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {title}
    </h3>
    {children}
  </section>
));

const CitaCard = React.memo(({ cita, estados, actualizarEstado, actualizando }) => {
  const borderColor = cita.estado_color || "#555";

  return (
    <li
      className="rounded-lg p-4 shadow-md border-l-8 transition-all duration-300"
      style={{
        borderLeftColor: borderColor,
        backgroundColor: "#1a1a1a",
        border: `1px solid #2a2a2a`,
        fontFamily: "'Merriweather', serif",
      }}
    >
      <div className="flex items-center mb-3 gap-2">
        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: borderColor }} />
        <strong className="text-[#d4af37] text-lg select-none" style={{ fontFamily: "'Playfair Display', serif" }}>
          {cita.estado_nombre}
        </strong>
      </div>

      <p><strong className="text-[#d4af37] select-none">Cliente:</strong> {cita.cliente_nombre}</p>
      <p><strong className="text-[#d4af37] select-none">Barbero:</strong> {cita.empleado_nombre}</p>
      <p><strong className="text-[#d4af37] select-none">Servicios:</strong> {cita.servicios}</p>
      <p>
        <strong className="text-[#d4af37] select-none">Hora:</strong>{" "}
        {new Date(cita.fecha_hora_inicio).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>

      <select
        className="w-full bg-[#2a2a2a] text-white mt-4 p-2 rounded border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
        value={String(cita.estado_id)}
        disabled={actualizando}
        onChange={(e) => actualizarEstado(cita.id, e.target.value)}
        aria-label={`Cambiar estado de la cita con ${cita.cliente_nombre}`}
        style={{ fontFamily: "'Oswald', sans-serif" }}
      >
        {estados.map((estado) => (
          <option key={estado.id} value={estado.id}>
            {estado.nombre}
          </option>
        ))}
      </select>
    </li>
  );
});
