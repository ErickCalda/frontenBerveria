// servicioAPI.js
import axiosInstance from '../api/axiosInstance';

export async function obtenerServicios() {
  const response = await axiosInstance.get('/servicios');
 
  return response.data.data;
}

