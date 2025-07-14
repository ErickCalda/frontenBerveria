import React, { useEffect, useState } from "react";
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

  const [errores, setErrores] = useState({
    servicios: null,
    citas: null,
    empleados: null,
    horarios: null,
    fecha: null,
  });

  const [formServicioId, setFormServicioId] = useState("");
  const [formEmpleadoId, setFormEmpleadoId] = useState("");
  const [formFecha, setFormFecha] = useState("");
  const [formHorario, setFormHorario] = useState("");
  const [formTotal, setFormTotal] = useState(0);

  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState("info");

  const setError = (campo, mensaje) => {
    setErrores((prev) => ({ ...prev, [campo]: mensaje }));
  };
  const clearError = (campo) => {
    setErrores((prev) => ({ ...prev, [campo]: null }));
  };

  useEffect(() => {
    getServiciosDisponibles()
      .then((data) => {
        setServicios(data);
        clearError("servicios");
      })
      .catch(() => setError("servicios", "Error al cargar servicios"));

    getMisCitas()
      .then((data) => {
        setCitas(data);
        clearError("citas");
      })
      .catch(() => setError("citas", "Error al cargar citas"));

    getEmpleadosDisponibles([1])
      .then((data) => {
        setEmpleados(data);
        clearError("empleados");
      })
      .catch(() => setError("empleados", "Error al cargar empleados"));
  }, []);

  useEffect(() => {
    if (formServicioId) {
      getEmpleadosDisponibles([parseInt(formServicioId)])
        .then((data) => {
          setEmpleados(data);
          clearError("empleados");
        })
        .catch(() => setError("empleados", "Error al cargar empleados"));

      const servicio = servicios.find((s) => s.id === parseInt(formServicioId));
      if (servicio) setFormTotal(servicio.precio);
    }
  }, [formServicioId, servicios]);

  useEffect(() => {
    if (formEmpleadoId && formFecha && formServicioId) {
      const hoy = new Date();
      const fechaSeleccionada = new Date(formFecha);
      hoy.setHours(0, 0, 0, 0);
      fechaSeleccionada.setHours(0, 0, 0, 0);

      if (fechaSeleccionada < hoy) {
        setError("fecha", "Fuera de horario laboral los domingos después de las 14:00");
        setHorariosPorEmpleado((prev) => ({
          ...prev,
          [formEmpleadoId]: [],
        }));
        return;
      } else {
        clearError("fecha");
      }

      getHorariosDisponibles({
        empleadoId: parseInt(formEmpleadoId),
        fecha: formFecha,
        servicios: [parseInt(formServicioId)],
      })
        .then((data) => {
          const ahora = new Date();

          const disponibles = data.filter((h) => {
            const horaInicio = new Date(`${formFecha}T${h.inicio}`);
            if (formFecha === ahora.toISOString().slice(0, 10)) {
              return horaInicio > ahora;
            }
            return true;
          });

          // Filtra solo citas del empleado seleccionado en esa fecha
          const ocupadas = citas
            .filter(
              (c) =>
                c.fecha_hora_inicio.startsWith(formFecha) &&
                c.empleado_id === parseInt(formEmpleadoId)
            )
            .map((c) => new Date(c.fecha_hora_inicio).toTimeString().slice(0, 5));

          const finalDisponibles = disponibles.filter(
            (h) => !ocupadas.includes(h.inicio)
          );

          setHorariosPorEmpleado((prev) => ({
            ...prev,
            [formEmpleadoId]: finalDisponibles,
          }));

          clearError("horarios");
        })
        .catch(() => {
          setHorariosPorEmpleado((prev) => ({
            ...prev,
            [formEmpleadoId]: [],
          }));
          setError("horarios", "Error al cargar horarios");
        });
    }
  }, [formEmpleadoId, formFecha, formServicioId, citas]);

  const cancelarCitaCliente = async (id) => {
    try {
      await cancelarCita(id);
      setCitas((prev) => prev.filter((c) => c.id !== id));
      setTipoMensaje("success");
      setMensaje("Cita cancelada correctamente");
    } catch {
      setTipoMensaje("error");
      setMensaje("No se pudo cancelar la cita");
    }
  };

  const handleSubmit = async (e) => {
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
    } catch {
      setTipoMensaje("error");
      setMensaje("Error al crear cita");
    }
  };

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  return (
    <div className="p-6 bg-black shadow-lg">
      <h2 className="text-4xl font-bold text-white mb-4 text-center">
        GOD MEETS 2.0 BARBERSHOP
      </h2>

      {mensaje && <Alerta tipo={tipoMensaje} mensaje={mensaje} />}

      <FormularioReservacion
        key={formEmpleadoId} // clave para forzar re-render al cambiar empleado
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
      />
    </div>
  );
}

export default Reservar;
