import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  getServiciosDisponibles,
  getMisCitas,
  getEmpleadosDisponibles,
  getHorariosDisponibles,
  procesarReservacion,
  cancelarCita,
} from "../../service/reservacionService";
import Alerta from "../../components/alertas/Alerta";
import FormularioReservacion from "../../components/cliente/FormularioReservacion";

function Reservar() {
  const [servicios, setServicios] = useState([]);
  const [citas, setCitas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [horariosPorEmpleado, setHorariosPorEmpleado] = useState({});
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState("info");

  const [formServicioId, setFormServicioId] = useState("");
  const [formEmpleadoId, setFormEmpleadoId] = useState("");
  const [formFecha, setFormFecha] = useState("");
  const [formHorario, setFormHorario] = useState("");
  const [formTotal, setFormTotal] = useState(0);

  // Función para setear error
  const setError = useCallback((campo, mensaje) => {
    setErrores((prev) => ({ ...prev, [campo]: mensaje }));
  }, []);

  const clearError = useCallback((campo) => {
    setErrores((prev) => {
      if (!prev[campo]) return prev;
      const nuevo = { ...prev };
      delete nuevo[campo];
      return nuevo;
    });
  }, []);

  // Carga inicial paralela
  useEffect(() => {
    Promise.all([
      getServiciosDisponibles(),
      getMisCitas(),
      getEmpleadosDisponibles([1]),
    ])
      .then(([serviciosData, citasData, empleadosData]) => {
        setServicios(serviciosData);
        setCitas(citasData);
        setEmpleados(empleadosData);
        setErrores({});
      })
      .catch(() => {
        setErrores({
          servicios: "Error al cargar servicios",
          citas: "Error al cargar citas",
          empleados: "Error al cargar empleados",
        });
      });
  }, []);

  // Actualizar empleados y total cuando cambia servicio
  useEffect(() => {
    if (!formServicioId) return;

    getEmpleadosDisponibles([parseInt(formServicioId)])
      .then((data) => {
        setEmpleados(data);
        clearError("empleados");
      })
      .catch(() => setError("empleados", "Error al cargar empleados"));

    const servicio = servicios.find((s) => s.id === parseInt(formServicioId));
    setFormTotal(servicio ? servicio.precio : 0);
  }, [formServicioId, servicios, clearError, setError]);

  // Obtener horarios disponibles memorizando datos filtrados para evitar cálculos redundantes
  const cargarHorariosDisponibles = useCallback(async () => {
    if (!formEmpleadoId || !formFecha || !formServicioId) {
      setHorariosPorEmpleado((prev) => ({ ...prev, [formEmpleadoId]: [] }));
      return;
    }

    const ahora = new Date();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const isoHoy = hoy.toISOString().slice(0, 10);

    if (formFecha < isoHoy) {
      setError("fecha", "No se pueden reservar fechas anteriores");
      setHorariosPorEmpleado((prev) => ({ ...prev, [formEmpleadoId]: [] }));
      return;
    }

    if (
      formFecha === isoHoy &&
      ahora.getDay() === 0 &&
      ahora.getHours() >= 14
    ) {
      setError(
        "fecha",
        "Fuera de horario laboral los domingos después de las 14:00"
      );
      setHorariosPorEmpleado((prev) => ({ ...prev, [formEmpleadoId]: [] }));
      return;
    }

    clearError("fecha");

    try {
      const data = await getHorariosDisponibles({
        empleadoId: parseInt(formEmpleadoId),
        fecha: formFecha,
        servicios: [parseInt(formServicioId)],
      });

      // Filtrar horarios que ya pasaron para hoy
      const disponibles = data.filter((h) => {
        const horaInicio = new Date(`${formFecha}T${h.inicio}`);
        if (formFecha === isoHoy) {
          return horaInicio > ahora;
        }
        return true;
      });

      setHorariosPorEmpleado((prev) => ({
        ...prev,
        [formEmpleadoId]: disponibles,
      }));

      clearError("horarios");
    } catch {
      setHorariosPorEmpleado((prev) => ({
        ...prev,
        [formEmpleadoId]: [],
      }));
      setError("horarios", "Error al cargar horarios");
    }
  }, [formEmpleadoId, formFecha, formServicioId, citas, setError, clearError]);

  useEffect(() => {
    cargarHorariosDisponibles();
  }, [cargarHorariosDisponibles]);

  // Cancelar cita con memoizado callback
  const cancelarCitaCliente = useCallback(
    async (id) => {
      try {
        await cancelarCita(id);
        setCitas((prev) => prev.filter((c) => c.id !== id));
        setTipoMensaje("success");
        setMensaje("Cita cancelada correctamente");
      } catch {
        setTipoMensaje("error");
        setMensaje("No se pudo cancelar la cita");
      }
    },
    []
  );

  // Manejo de submit con useCallback
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const [inicio, fin] = formHorario.split("-");
      try {
        await procesarReservacion({
          empleadoId: parseInt(formEmpleadoId),
          servicios: [{ id: parseInt(formServicioId), cantidad: 1 }],
          fecha: formFecha,
          horario: { inicio, fin },
          total: formTotal,
        });

        setTipoMensaje("success");
        setMensaje("Cita creada correctamente");

        const nuevas = await getMisCitas();
        setCitas(nuevas);
      }catch (error) {
  setTipoMensaje("error");
  if (error.response?.data?.mensaje) {
    setMensaje(error.response.data.mensaje);
  } else {
    setMensaje("Error al crear cita");
  }
  throw error; 
}

    },
    [formEmpleadoId, formServicioId, formFecha, formHorario, formTotal]
  );

  // Limpiar mensaje automáticamente
  useEffect(() => {
    if (!mensaje) return;
    const timer = setTimeout(() => setMensaje(null), 3000);
    return () => clearTimeout(timer);
  }, [mensaje]);

  return (
    <div className="p-6 bg-[#1C1C1C] shadow-lg">
      <h2 className="text-4xl font-bold text-white mb-4 text-center">
        GOD MEETS 2.0 BARBERSHOP
      </h2>

      {mensaje && <Alerta tipo={tipoMensaje} mensaje={mensaje} />}

      <FormularioReservacion
        key={formEmpleadoId}
        servicios={servicios}
        empleados={empleados}
        horarios={horariosPorEmpleado[formEmpleadoId] || []}
        setHorarios={(newHorarios) =>
          setHorariosPorEmpleado((prev) => ({
            ...prev,
            [formEmpleadoId]: newHorarios,
          }))
        }
        errores={errores}
        formServicioId={formServicioId}
        setFormServicioId={setFormServicioId}
        formEmpleadoId={formEmpleadoId}
        setFormEmpleadoId={setFormEmpleadoId}
        formFecha={formFecha}
        setFormFecha={setFormFecha}
        formHorario={formHorario}
        setFormHorario={setFormHorario}
        handleSubmit={handleSubmit}
        setError={setError}
        clearError={clearError}
        getHorariosDisponibles={getHorariosDisponibles}
        cancelarCitaCliente={cancelarCitaCliente}
      />
    </div>
  );
}

export default Reservar;
