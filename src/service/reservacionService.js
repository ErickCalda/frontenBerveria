// src/service/reservacionService.js
import axiosInstance from "../api/axiosInstance"; // Revisa que esta ruta sea correcta según tu estructura

export const getServiciosDisponibles = async () => {
  const response = await axiosInstance.get("/reservacion/servicios");
  // Retorna solo el array de servicios (en data.data según tu backend)
  return response.data.data;
};

export const getEmpleadosDisponibles = async (serviciosIds) => {
  // serviciosIds debe ser un array de ids para enviar en query params
  const params = {};
  if (serviciosIds && serviciosIds.length > 0) {
    params.servicios = serviciosIds.join(",");
  }
  const response = await axiosInstance.get("/reservacion/empleados", { params });
  // Retorna solo el array de empleados
  console.log('desde reservacionServide',response.data.empleados)
  return response.data.empleados;
};

export const getHorariosDisponibles = async (params) => {
  // params debe contener: empleadoId, fecha y servicios (array o string)
  // Convierte servicios a string si es array para query
  if (params.servicios && Array.isArray(params.servicios)) {
    params.servicios = params.servicios.join(",");
  }
  const response = await axiosInstance.get("/reservacion/horarios", { params });
  return response.data.horarios;
};

export const procesarReservacion = async (data) => {
  const response = await axiosInstance.post("/reservacion/procesar", data);
  return response.data;
};

export const getMisCitas = async () => {
  const response = await axiosInstance.get("/reservacion/mis-citas");
  // Retornamos directamente el array citas para facilitar el consumo

  return response.data.citas;
};

export const cancelarCita = async (id) => {
  const response = await axiosInstance.put(`/reservacion/cancelar/${id}`);
  return response.data;
};
