import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import citaService from "../../service/citaService";
import FormularioCrearCita from "../../components/AdminMenu/FormularioCrearCita";
import SelectorEstado from "../../components/AdminMenu/SelectorEstado";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(true);
  const [showText, setShowText] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState("w-16");

  const [citasHoy, setCitasHoy] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(true);
  const [mostrarFormularioCrear, setMostrarFormularioCrear] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (collapsed) {
      setShowText(false);
      setSidebarWidth("w-16");
    } else {
      setSidebarWidth("w-64");
      const timeout = setTimeout(() => setShowText(true), 300);
      return () => clearTimeout(timeout);
    }
  }, [collapsed]);

  const obtenerFechaHoy = () => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const cargarCitasHoy = () => {
    setLoadingCitas(true);
    const fechaHoy = obtenerFechaHoy();

    citaService
      .obtenerCitas({ fecha: fechaHoy }, { headers: { "Cache-Control": "no-cache" } })
      .then((res) => {
        if (res.data && res.data.data) {
          setCitasHoy(res.data.data);
        } else {
          setCitasHoy([]);
        }
      })
      .catch((err) => {
        console.error("Error al cargar citas de hoy:", err);
        setCitasHoy([]);
      })
      .finally(() => setLoadingCitas(false));
  };

  useEffect(() => {
    cargarCitasHoy();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#121212] text-white font-sans">
      {/* Sidebar */}
      <aside className={`flex flex-col bg-[#1e1e1e] p-4 transition-all duration-300 ease-in-out ${sidebarWidth}`}>
        <button
          className="self-end mb-6 p-2 hover:bg-gray-700 rounded cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>

        {!collapsed && (
          <div className="flex flex-col items-center mb-8 transition-opacity duration-300 ease-in-out">
            <span className="font-bold text-lg">GOD MEETS 2.0</span>
            <span className="text-xs">BARBERSHOP</span>
          </div>
        )}

        <nav className="flex-1 flex flex-col gap-3">
          <NavItem
            icon={<FaCalendarAlt />}
            label="Citas"
            showText={showText}
            onClick={() => setMostrarFormularioCrear(true)}
          />
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        <h2 className="text-2xl font-bold">Dashboard</h2>

        {mostrarFormularioCrear ? (
          <FormularioCrearCita
            onClose={() => setMostrarFormularioCrear(false)}
            recargarCitas={cargarCitasHoy}
          />
        ) : (
          <Card title="Citas de Hoy">
            {loadingCitas ? (
              <p>Cargando citas...</p>
            ) : citasHoy.length === 0 ? (
              <p>No hay citas para hoy.</p>
            ) : (
              <ul className="max-h-[400px] overflow-auto space-y-4">
                {citasHoy.map((cita) => (
                  <li key={cita.id} className="border-b border-zinc-700 pb-2">
                    <p><strong>Cliente:</strong> {cita.cliente_nombre}</p>
                    <p><strong>Servicios:</strong> {cita.servicios}</p>
                    <p><strong>Hora:</strong> {new Date(cita.fecha_hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p>
                      <strong>Estado:</strong>{" "}
                      <span style={{ color: cita.estado_color }}>{cita.estado_nombre}</span>
                    </p>
                    <SelectorEstado
                      citaId={cita.id}
                      estadoActual={cita.estado_id}
                      onActualizar={cargarCitasHoy}
                    />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </main>
    </div>
  );
}

const NavItem = ({ icon, label, showText, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 p-2 hover:bg-[#2c2c2c] rounded cursor-pointer select-none"
  >
    <div className="text-lg">{icon}</div>
    <span className={`text-sm transition-opacity duration-300 ease-in-out ${showText ? "opacity-100" : "opacity-0"}`}>
      {label}
    </span>
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-[#1e1e1e] p-4 rounded shadow text-sm">
    <h3 className="text-lg font-semibold mb-3">{title}</h3>
    {children}
  </div>
);
