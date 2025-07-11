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
import ListaCitas from "../../components/cliente/ListaCitas";

function Reservar() {
  // (aquí va toda la lógica y estados original)

  const [servicios, setServicios] = useState([]);
  const [citas, setCitas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [horarios, setHorarios] = useState([]);

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

  // Funciones setError y clearError igual...

  const setError = (campo, mensaje) => {
    setErrores((prev) => ({ ...prev, [campo]: mensaje }));
  };
  const clearError = (campo) => {
    setErrores((prev) => ({ ...prev, [campo]: null }));
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-EC", {
      timeZone: "America/Guayaquil",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // useEffects y lógica original sin cambios

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

    getHorariosDisponibles({ empleadoId: 1, fecha: "2025-07-01", servicios: [1] })
      .then((data) => {
        setHorarios(data);
        clearError("horarios");
      })
      .catch(() => setError("horarios", "Error al cargar horarios"));
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
        setError("fecha", "No se puede seleccionar una fecha pasada");
        setHorarios([]);
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

          const ocupadas = citas
            .filter((c) => c.fecha_hora_inicio.startsWith(formFecha))
            .map((c) => new Date(c.fecha_hora_inicio).toTimeString().slice(0, 5));

          const finalDisponibles = disponibles.filter((h) => !ocupadas.includes(h.inicio));
          setHorarios(finalDisponibles);
          clearError("horarios");
        })
        .catch(() => setError("horarios", "Error al cargar horarios"));
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
    <div className=" p-6 bg-black  shadow-lg">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">GOD MEETS 2.0 BARBERSHOP</h2>
  

      {mensaje && <Alerta tipo={tipoMensaje} mensaje={mensaje} />}

      <FormularioReservacion
        servicios={servicios}
        empleados={empleados}
        horarios={horarios}
        errores={errores}
        formServicioId={formServicioId}
        setFormServicioId={setFormServicioId}
        formEmpleadoId={formEmpleadoId}
        setFormEmpleadoId={setFormEmpleadoId}
        formFecha={formFecha}
        setFormFecha={setFormFecha}
        formHorario={formHorario}
        setFormHorario={setFormHorario}
        formTotal={formTotal}
        handleSubmit={handleSubmit}
      />

 
    </div>
  );
}

export default Reservar; 