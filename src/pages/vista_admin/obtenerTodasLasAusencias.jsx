import React, { useEffect, useState } from "react";
import { obtenerTodasLasAusencias } from "../../service/ausenciaEmpleadoService";
import EditarAusencia from "./actualizarAusencia";
import { formatearAusencia } from "../../utils/ausenciaUtils";

const AdminAusencias = () => {
  const [ausencias, setAusencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [ausenciaSeleccionada, setAusenciaSeleccionada] = useState(null);

  const cargarAusencias = async () => {
    setLoading(true);
    try {
      const response = await obtenerTodasLasAusencias();
      const ausenciasData = response.data.data?.ausencias || [];
      setAusencias(ausenciasData);
      setErrorMsg(null);
    } catch (error) {
      console.error("Error al cargar ausencias:", error);
      setAusencias([]);
      setErrorMsg("Error al cargar ausencias. Intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAusencias();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Cargando ausencias...</p>;
  if (errorMsg) return <p className="text-center text-red-500">{errorMsg}</p>;
  if (ausencias.length === 0) return <p className="text-center text-gray-500">No hay ausencias registradas.</p>;

  return (
    <div className="px-4 py-6 bg-[#fdf6f0]">
      <h2 className="text-2xl font-bold mb-4 text-[#5d5fef] text-center">Ausencias de Empleados</h2>

      {ausenciaSeleccionada ? (
        <>
          <button
            onClick={() => setAusenciaSeleccionada(null)}
            className="mb-4 px-3 py-1 bg-[#c9d6ff] text-[#2c3e50] rounded hover:bg-[#b0c4ff]"
          >
            ← Volver a la lista
          </button>
          <EditarAusencia
            ausencia={ausenciaSeleccionada}
            onActualizado={() => {
              setAusenciaSeleccionada(null);
              cargarAusencias();
            }}
          />
        </>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow-md">
            <thead className="bg-[#cce7f6] text-[#34495e] text-sm">
              <tr>
                <th className="px-4 py-2 text-left">Empleado</th>
                <th className="px-4 py-2 text-left">Período</th>
                <th className="px-4 py-2 text-left">Motivo</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {ausencias.map((ausencia) => (
                <tr
                  key={ausencia.id}
                  className="hover:bg-[#f0f9ff] transition"
                >
                  <td className="px-4 py-2 text-blue-600 border-b font-medium">
                    {ausencia.empleado_nombre || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-blue-600 border-b">
                    {formatearAusencia(ausencia)}
                  </td>
                  <td className="px-4 py-2 text-blue-600 border-b max-w-xs truncate">
                    {ausencia.motivo || "-"}
                  </td>
                  <td className={`px-4 py-2 border-b font-medium ${
                    parseInt(ausencia.aprobada, 10) === 1 ? "text-green-600" : "text-yellow-700"
                  }`}>
                    {parseInt(ausencia.aprobada, 10) === 1 ? "Aprobada" : "Desactivada"}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => setAusenciaSeleccionada(ausencia)}
                      className="px-3 py-1 bg-[#fcd34d] text-[#1f2937] rounded hover:bg-[#fbbf24] text-xs"
                      title="Editar ausencia"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAusencias;
