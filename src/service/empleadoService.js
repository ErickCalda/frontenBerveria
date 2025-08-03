// src/services/empleadoService.js
import axiosInstance from './axiosInstance';

export const getEmpleados = (params = {}) => {
  return axiosInstance.get('/empleados', { params });
};

export const getEmpleadoById = (id) => {
  return axiosInstance.get(`/empleados/${id}`);
};

export const crearEmpleado = (data) => {
  return axiosInstance.post('/empleados', data);
};

export const actualizarEmpleado = (id, data) => {
  return axiosInstance.put(`/empleados/${id}`, data);
};

export const eliminarEmpleado = (id) => {
  return axiosInstance.delete(`/empleados/${id}`);
};

// Extras
export const getHorariosEmpleado = (id, fecha) => {
  return axiosInstance.get(`/empleados/${id}/horarios`, { params: { fecha } });
};

export const getAusenciasEmpleado = (id, params = {}) => {
  return axiosInstance.get(`/empleados/${id}/ausencias`, { params });
};
