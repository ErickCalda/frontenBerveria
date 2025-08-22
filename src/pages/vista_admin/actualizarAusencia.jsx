import React, { useState, useEffect } from "react";
import { actualizarAusencia } from "../../service/ausenciaEmpleadoService";
import { 
  generarHorariosDisponibles,
  validarAusencia,
  extraerHoraDeFecha,
  convertirAusenciaAUTC,
  esAusenciaPeriodoLargo
} from "../../utils/ausenciaUtils";

const EditarAusencia = ({ ausencia, onActualizado }) => {
  const [motivo, setMotivo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [aprobada, setAprobada] = useState(0);
  const [tipoAusencia, setTipoAusencia] = useState("horas"); // "horas" o "periodo"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ausencia) {
      console.log("🕐 [CARGAR] Ausencia recibida:", ausencia);
      
      setMotivo(ausencia.motivo || "");
      setFechaInicio(ausencia.fecha_inicio?.slice(0, 10) || "");
      setFechaFin(ausencia.fecha_fin?.slice(0, 10) || "");
      
      // Determinar el tipo de ausencia
      const fechaInicioBD = ausencia.fecha_inicio?.slice(0, 10);
      const fechaFinBD = ausencia.fecha_fin?.slice(0, 10);
      const horaInicioBD = extraerHoraDeFecha(ausencia.fecha_inicio);
      const horaFinBD = extraerHoraDeFecha(ausencia.fecha_fin);
      
      if (esAusenciaPeriodoLargo(fechaInicioBD, fechaFinBD, horaInicioBD, horaFinBD)) {
        setTipoAusencia("periodo");
        setHoraInicio("");
        setHoraFin("");
      } else {
        setTipoAusencia("horas");
        setHoraInicio(horaInicioBD || "");
        setHoraFin(horaFinBD || "");
      }
      
      setAprobada(Number(ausencia.aprobada) || 0);
    }
  }, [ausencia]);

  if (!ausencia) return <p className="text-center text-gray-600">Cargando ausencia...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("🕐 [GUARDAR] Datos del formulario:", {
      tipoAusencia,
      fechaInicio,
      fechaFin,
      horaInicio,
      horaFin,
      motivo
    });

    // Validar campos requeridos
    if (!fechaInicio || !fechaFin) {
      setError("Las fechas de inicio y fin son obligatorias.");
      setLoading(false);
      return;
    }

    // Para ausencias por horas, validar que se seleccionen las horas
    if (tipoAusencia === "horas" && (!horaInicio || !horaFin)) {
      setError("Para ausencias por horas, debes seleccionar las horas de inicio y fin.");
      setLoading(false);
      return;
    }

    // Validar la ausencia según el tipo
    const esValida = validarAusencia(
      fechaInicio, 
      fechaFin, 
      tipoAusencia === "horas" ? horaInicio : null, 
      tipoAusencia === "horas" ? horaFin : null
    );

    console.log("🕐 [VALIDAR] Resultado de validación:", esValida);

    if (!esValida) {
      setError("Los datos de la ausencia no son válidos. Verifica las fechas y horarios.");
      setLoading(false);
      return;
    }

    // Convertir a UTC según el tipo de ausencia
    const fechasUTC = convertirAusenciaAUTC(
      fechaInicio, 
      fechaFin, 
      tipoAusencia === "horas" ? horaInicio : null, 
      tipoAusencia === "horas" ? horaFin : null
    );

    console.log("🕐 [GUARDAR] Conversión a UTC:", fechasUTC);

    const datosActualizados = {
      motivo,
      fecha_inicio: fechasUTC.fecha_inicio,
      fecha_fin: fechasUTC.fecha_fin,
      aprobada: aprobada === 1,
    };

    console.log("🕐 [GUARDAR] Datos a enviar a BD:", datosActualizados);

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
    <div>
      {/* Debug info */}
      <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
        <div><strong>Tipo de ausencia:</strong> {tipoAusencia}</div>
        <div><strong>Fecha inicio:</strong> {fechaInicio || 'No seleccionada'}</div>
        <div><strong>Fecha fin:</strong> {fechaFin || 'No seleccionada'}</div>
        {tipoAusencia === "horas" && (
          <>
            <div><strong>Hora inicio:</strong> {horaInicio || 'No seleccionada'}</div>
            <div><strong>Hora fin:</strong> {horaFin || 'No seleccionada'}</div>
          </>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-[#fffaf3] p-6 rounded-xl shadow-md space-y-5 border border-[#ffe0b2]"
      >
        <h3 className="text-xl font-semibold text-[#5d5fef] text-center mb-4">Editar Ausencia</h3>

        <div>
          <label className="block text-[#34495e] mb-1">Tipo de Ausencia:</label>
          <select
            value={tipoAusencia}
            onChange={(e) => setTipoAusencia(e.target.value)}
            className="w-full text-blue-600 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#cce7f6]"
          >
            <option value="horas">Por horas específicas</option>
            <option value="periodo">Por período (días/semanas/meses)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {tipoAusencia === "horas" 
              ? "Selecciona horas específicas dentro del horario de trabajo"
              : "Selecciona un rango de fechas para ausencia completa"
            }
          </p>
        </div>

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
            className="w-full p-2 text-blue-600 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#cce7f6]"
            required
          />
        </div>

        {tipoAusencia === "horas" && (
          <>
            <div>
              <label className="block text-[#34495e] mb-1">Hora de Inicio:</label>
              <select
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="w-full text-blue-600 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#cce7f6]"
                required
              >
                <option value="">Seleccionar hora inicio</option>
                              {fechaInicio && generarHorariosDisponibles(fechaInicio).map((horario, index) => (
                <option key={index} value={horario.inicio}>
                  {horario.inicio}
                </option>
              ))}
              </select>
            </div>

            <div>
              <label className="block text-[#34495e] mb-1">Hora de Fin:</label>
              <select
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                className="w-full text-blue-600 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#cce7f6]"
                required
              >
                <option value="">Seleccionar hora fin</option>
                              {fechaInicio && generarHorariosDisponibles(fechaInicio).map((horario, index) => (
                <option key={index} value={horario.fin}>
                  {horario.fin}
                </option>
              ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Selecciona las horas de inicio y fin de la ausencia
              </p>
            </div>
          </>
        )}

        <div>
          <label className="block text-[#34495e] mb-1">Motivo:</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full p-2 text-blue-600 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#cce7f6]"
            rows="3"
            placeholder="Describe el motivo de la ausencia..."
          />
        </div>

        <div>
          <label className="block text-[#34495e] mb-1">¿Desactivar?</label>
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
          className="w-full py-2 px-4 bg-[#fcd34d] text-[#1f2937] rounded hover:bg-[#fbbf24] transition"
        >
          {loading ? "Actualizando..." : "Actualizar Ausencia"}
        </button>
      </form>
    </div>
  );
};

export default EditarAusencia;
