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

  cambiarEstadoCita: (id, estado) =>
    axiosInstance.patch(`/citas/${id}/estado`, { estado }),

  obtenerHorariosDisponibles: (fecha, empleado_id, servicio_id) =>
    axiosInstance.get('/citas/horarios-disponibles', {
      params: { fecha, empleado_id, servicio_id },
    }),

  obtenerDisponibilidadEmpleado: (empleado_id, fecha) =>
    axiosInstance.get(`/citas/disponibilidad/${empleado_id}`, { params: { fecha } }),

  obtenerStatsCitas: (filtros = {}) =>
    axiosInstance.get('/citas/stats', { params: filtros }),

  // ✅ NUEVA FUNCIÓN PARA USAR EN SelectorEstado
  obtenerEstadosCitas: () => axiosInstance.get('/citas/estados'),
};

export default citaService;
