// servicioAPI.js
import axiosInstance from '../api/axiosInstance';

export async function obtenerServicios() {
  const response = await axiosInstance.get('/servicios');
  console.log('Respuesta completa:', response.data);
  return response.data.data;
}

