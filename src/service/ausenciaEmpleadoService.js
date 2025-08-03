// src/services/ausenciaEmpleadoService.js
import axiosInstance from "../api/axiosInstance";

// Obtener todas las ausencias (puedes filtrar por query params si lo necesitas)
export const obtenerTodasLasAusencias = (params = {}) => {
  return axiosInstance.get("/ausencias-empleado", { params });
};

// Crear una nueva ausencia
export const crearAusencia = (datos) => {
  return axiosInstance.post("/ausencias-empleado", datos);
};

// Obtener ausencia por ID
export const obtenerAusenciaPorId = (id) => {
  return axiosInstance.get(`/ausencias-empleado/${id}`);
};

// Actualizar una ausencia
export const actualizarAusencia = (id, datos) => {
  return axiosInstance.put(`/ausencias-empleado/${id}`, datos);
};

// Eliminar una ausencia
export const eliminarAusencia = (id) => {
  return axiosInstance.delete(`/ausencias-empleado/${id}`);
};

// Obtener ausencias por empleado
export const obtenerAusenciasPorEmpleado = (empleadoId, params = {}) => {
  return axiosInstance.get(`/ausencias-empleado/empleado/${empleadoId}`, { params });
};

// Obtener ausencias por fecha exacta
export const obtenerAusenciasPorFecha = (fecha) => {
  return axiosInstance.get(`/ausencias-empleado/fecha/${fecha}`);
};

// Obtener ausencias por rango de fechas
export const obtenerAusenciasPorRango = (fecha_inicio, fecha_fin) => {
  return axiosInstance.get(`/ausencias-empleado/rango`, {
    params: { fecha_inicio, fecha_fin },
  });
};
