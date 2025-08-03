import React, { useState, useEffect } from "react";
import { actualizarAusencia } from "../../service/ausenciaEmpleadoService";

const EditarAusencia = ({ ausencia, onActualizado }) => {
  const [motivo, setMotivo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [aprobada, setAprobada] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ausencia) {
      setMotivo(ausencia.motivo || "");
      setFechaInicio(ausencia.fecha_inicio?.slice(0, 10) || "");
      setFechaFin(ausencia.fecha_fin?.slice(0, 10) || "");
      setAprobada(Number(ausencia.aprobada) || 0);
    }
  }, [ausencia]);

  if (!ausencia) return <p className="text-center text-gray-600">Cargando ausencia...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const datosActualizados = {
      motivo,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      aprobada: aprobada === 1,
    };

    try {
      await actualizarAusencia(ausencia.id, datosActualizados);
      if (onActualizado) onActualizado();
    } catch (err) {
      console.error("❌ Error al actualizar:", err);
      setError("Error al actualizar la ausencia. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-[#fffaf3] p-6 rounded-xl shadow-md space-y-5 border border-[#ffe0b2]"
    >
      <h3 className="text-xl font-semibold text-[#5d5fef] text-center mb-4">Editar Ausencia</h3>


      <div>
        <label className="block text-[#34495e] mb-1">Fecha Inicio:</label>
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="w-full p-2 text-blue-600 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#cce7f6]"
          required
        />
      </div>

      <div>
        <label className="block text-[#34495e] mb-1">Fecha Fin:</label>
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="w-full text-blue-600 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#cce7f6]"
          required
        />
      </div>

      <div>
        <label className="block text-[#34495e] mb-1">¿Aprobar?</label>
        <select
          value={aprobada}
          onChange={(e) => setAprobada(Number(e.target.value))}
          className="w-full text-blue-600 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#cce7f6]"
        >
          <option value={1}>Sí</option>
          <option value={0}>No</option>
        </select>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full  py-2 px-4 bg-[#fcd34d] text-[#1f2937] rounded hover:bg-[#fbbf24] transition"
      >
        {loading ? "Actualizando..." : "Actualizar Ausencia"}
      </button>
    </form>
  );
};

export default EditarAusencia;
