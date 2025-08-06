import React, { useState, useEffect } from "react";
import { actualizarAusencia } from "../../service/ausenciaEmpleadoService";
import { 
  generarHorariosDisponibles,
  formatearFechaHora, 
  validarHorarioTrabajo,
  obtenerFechaActual,
  extraerHoraDeFecha,
  convertirLocalAUTC
} from "../../utils/ausenciaUtils";

const EditarAusencia = ({ ausencia, onActualizado }) => {
  const [motivo, setMotivo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [aprobada, setAprobada] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (ausencia) {
      console.log("🕐 [CARGAR] Ausencia recibida:", ausencia);
      
      setMotivo(ausencia.motivo || "");
      setFechaInicio(ausencia.fecha_inicio?.slice(0, 10) || "");
      setFechaFin(ausencia.fecha_fin?.slice(0, 10) || "");
      
      // Extraer horas de las fechas existentes (convertir de UTC a local)
      if (ausencia.fecha_inicio) {
        const horaInicioStr = extraerHoraDeFecha(ausencia.fecha_inicio);
        console.log("🕐 [CARGAR] Hora inicio convertida:", {
          fechaInicioBD: ausencia.fecha_inicio,
          horaInicioLocal: horaInicioStr
        });
        setHoraInicio(horaInicioStr || "");
      }
      
      if (ausencia.fecha_fin) {
        const horaFinStr = extraerHoraDeFecha(ausencia.fecha_fin);
        console.log("🕐 [CARGAR] Hora fin convertida:", {
          fechaFinBD: ausencia.fecha_fin,
          horaFinLocal: horaFinStr
        });
        setHoraFin(horaFinStr || "");
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
      fechaInicio,
      horaInicio,
      horaFin,
      motivo
    });

    // Validar que el horario esté dentro de los horarios de trabajo
    if (!validarHorarioTrabajo(fechaInicio, horaInicio, horaFin)) {
      setError("El horario seleccionado no está dentro de los horarios de trabajo.");
      setLoading(false);
      return;
    }

    // Convertir horas locales a UTC para guardar en la base de datos
    const fechaInicioUTC = convertirLocalAUTC(fechaInicio, horaInicio);
    const fechaFinUTC = convertirLocalAUTC(fechaInicio, horaFin);

    console.log("🕐 [GUARDAR] Conversión a UTC:", {
      horaLocalInicio: horaInicio,
      horaLocalFin: horaFin,
      fechaInicioUTC,
      fechaFinUTC
    });

    const datosActualizados = {
      motivo,
      fecha_inicio: fechaInicioUTC,
      fecha_fin: fechaFinUTC,
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
        <label className="block text-[#34495e] mb-1">Hora de Inicio:</label>
        <select
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
          className="w-full text-blue-600 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#cce7f6]"
          required
        >
          <option value="">Seleccionar hora inicio</option>
          {fechaInicio && generarHorariosDisponibles(new Date(fechaInicio)).map((horario, index) => (
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
          {fechaInicio && generarHorariosDisponibles(new Date(fechaInicio)).map((horario, index) => (
            <option key={index} value={horario.fin}>
              {horario.fin}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Selecciona las horas de inicio y fin de la ausencia
        </p>
      </div>

      <div>
        <label className="block text-[#34495e] mb-1">¿desactivar?</label>
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
