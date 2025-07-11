import React, { useState, useEffect } from "react";
import citaService from "../../service/citaService";

export default function SelectorEstado({ citaId, estadoActual, onActualizar }) {
  const [estados, setEstados] = useState([]);
  const [nuevoEstado, setNuevoEstado] = useState(estadoActual);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    citaService
      .obtenerEstadosCitas()
      .then((res) => {
        setEstados(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar estados:", err);
      });
  }, []);

  const handleCambiarEstado = () => {
    if (!nuevoEstado) return;

    setCargando(true);
    setMensaje("");

    citaService
      .cambiarEstadoCita(citaId, nuevoEstado)
      .then(() => {
        setMensaje("Estado actualizado correctamente.");
        if (onActualizar) onActualizar();
      })
      .catch((err) => {
        console.error("Error al actualizar estado:", err);
        setMensaje("Error al actualizar el estado.");
      })
      .finally(() => {
        setCargando(false);
        setTimeout(() => setMensaje(""), 3000);
      });
  };

  return (
    <div className="flex flex-col gap-2">
      <select
        className="bg-zinc-800 text-white p-2 rounded"
        value={nuevoEstado}
        onChange={(e) => setNuevoEstado(e.target.value)}
        disabled={cargando}
      >
        <option value="" disabled>Seleccione un estado</option>
        {estados.map((estado) => (
          <option key={estado.id} value={estado.id}>
            {estado.nombre}
          </option>
        ))}
      </select>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded disabled:opacity-50"
        onClick={handleCambiarEstado}
        disabled={cargando || !nuevoEstado}
      >
        {cargando ? "Guardando..." : "Actualizar Estado"}
      </button>

      {mensaje && <span className="text-sm text-green-400">{mensaje}</span>}
    </div>
  );
}
