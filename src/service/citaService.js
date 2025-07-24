import axiosInstance from '../api/axiosInstance';

const citaService = {
  crearCita: (datos) => axiosInstance.post('/citas', datos),

  obtenerCitas: (filtros = {}) => axiosInstance.get('/citas', { params: filtros }),

  obtenerCitaPorId: (id) => axiosInstance.get(`/citas/${id}`),

  actualizarCita: (id, datos) => axiosInstance.put(`/citas/${id}`, datos),

  eliminarCita: (id) => axiosInstance.delete(`/citas/${id}`),

  obtenerCitasPorCliente: (cliente_id, filtros = {}) =>
    axiosInstance.get(`/citas/cliente/${cliente_id}`, { params: filtros }),

  obtenerCitasPorEmpleado: (empleado_id, filtros = {}) =>
    axiosInstance.get(`/citas/empleado/${empleado_id}`, { params: filtros }),

  obtenerCitasPorFecha: (fecha, filtros = {}) =>
    axiosInstance.get(`/citas/fecha/${fecha}`, { params: filtros }),

  obtenerCitasPorEstado: (estado, filtros = {}) =>
    axiosInstance.get(`/citas/estado/${estado}`, { params: filtros }),

  cambiarEstadoCita: (id, estadoId) => {
    console.log('🚀 Enviando PATCH para cambiar estado');
    console.log('ID cita:', id);
    console.log('Estado ID:', estadoId);
    return axiosInstance.patch(`/citas/${id}/estado`, { estado_id: estadoId })
      .then(response => {
        console.log('✅ Respuesta recibida:', response.data);
        return response;
      })
      .catch(error => {
        console.error('❌ Error en cambiarEstadoCita:', error);
        throw error;
      });
  },
  
  obtenerHorariosDisponibles: (fecha, empleado_id, servicio_id) =>
    axiosInstance.get('/citas/horarios-disponibles', {
      params: { fecha, empleado_id, servicio_id },
    }),

  obtenerDisponibilidadEmpleado: (empleado_id, fecha) =>
    axiosInstance.get(`/citas/disponibilidad/${empleado_id}`, { params: { fecha } }),

  obtenerStatsCitas: (filtros = {}) =>
    axiosInstance.get('/citas/estadisticas', { params: filtros }),

  obtenerEstadosCitas: async () => {
    try {
      const response = await axiosInstance.get('/citas/estados');
      return response.data;  // devuelve directamente los datos
    } catch (error) {
      console.error('Error en obtenerEstadosCitas:', error);
      throw error;
    }
  },
};

export default citaService;
