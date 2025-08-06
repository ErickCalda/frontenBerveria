/**
 * Ejemplos de uso de la utilidad de ausencias
 * Este archivo muestra cómo usar las funciones de ausenciaUtils.js
 */

import {
  generarHorariosDisponibles,
  generarOpcionesHorarios,
  generarOpcionesHorariosAmplios,
  convertirHoraAMinutos,
  convertirMinutosAHora,
  formatearFechaHora,
  validarHorarioTrabajo,
  filtrarHorariosDisponibles,
  validarConflictosReservas,
  obtenerFechaActual,
  convertirUTCALocal,
  convertirLocalAUTC,
  formatearRangoFechas,
  extraerHoraDeFecha
} from './ausenciaUtils';

// Ejemplo 1: Generar horarios disponibles para un día específico
const ejemploGenerarHorarios = () => {
  const fecha = new Date('2024-01-15'); // Lunes
  const horarios = generarHorariosDisponibles(fecha);
  
  console.log('Horarios disponibles para el lunes:', horarios);
  // Resultado: Array con horarios de 09:15 a 18:45
  
  const fechaDomingo = new Date('2024-01-14'); // Domingo
  const horariosDomingo = generarHorariosDisponibles(fechaDomingo);
  
  console.log('Horarios disponibles para el domingo:', horariosDomingo);
  // Resultado: Array con horarios de 09:30 a 14:00
};

// Ejemplo 2: Generar opciones para un selector de horarios
const ejemploGenerarOpciones = () => {
  const fecha = '2024-01-15';
  const opciones = generarOpcionesHorarios(fecha);
  
  console.log('Opciones para selector:', opciones);
  // Resultado: Array con objetos {id, value, label, inicio, fin}
};

// Ejemplo 2.1: Generar opciones con rangos amplios
const ejemploGenerarOpcionesAmplios = () => {
  const fecha = '2024-01-15';
  const opciones = generarOpcionesHorariosAmplios(fecha, 30);
  
  console.log('Opciones con rangos amplios:', opciones);
  // Resultado: Array con rangos de 30min, 1h, 1.5h, 2h, 3h
  // Ejemplo: "09:15 - 10:15 (60 min)", "14:15 - 16:15 (120 min)"
};

// Ejemplo 3: Formatear fechas y horas
const ejemploFormatearFechas = () => {
  const fechaHora = '2024-01-15T14:30:00';
  
  console.log('Formato corto:', formatearFechaHora(fechaHora, 'corta'));
  // Resultado: "15/01/2024, 14:30"
  
  console.log('Formato largo:', formatearFechaHora(fechaHora, 'larga'));
  // Resultado: "lunes, 15 de enero de 2024, 14:30"
  
  console.log('Solo hora:', formatearFechaHora(fechaHora, 'solo_hora'));
  // Resultado: "14:30"
};

// Ejemplo 4: Validar horarios de trabajo
const ejemploValidarHorario = () => {
  const fecha = '2024-01-15';
  const horaInicio = '14:15';
  const horaFin = '14:45';
  
  const esValido = validarHorarioTrabajo(fecha, horaInicio, horaFin);
  console.log('¿Es horario válido?', esValido); // true
  
  const horaInvalida = validarHorarioTrabajo(fecha, '20:00', '21:00');
  console.log('¿Es horario válido?', horaInvalida); // false
};

// Ejemplo 5: Filtrar horarios disponibles excluyendo ausencias
const ejemploFiltrarHorarios = () => {
  const fecha = '2024-01-15';
  const ausenciasExistentes = [
    {
      fecha_inicio: '2024-01-15',
      hora_inicio: '14:15',
      hora_fin: '14:45',
      empleado_id: 1,
      aprobada: 1
    }
  ];
  
  const horariosDisponibles = filtrarHorariosDisponibles(fecha, ausenciasExistentes, 1);
  console.log('Horarios disponibles (excluyendo ausencias):', horariosDisponibles);
  // El horario 14:15-14:45 no aparecerá en la lista
};

// Ejemplo 6: Validar conflictos con reservas
const ejemploValidarConflictos = () => {
  const fecha = '2024-01-15';
  const horaInicio = '14:15';
  const horaFin = '14:45';
  const empleadoId = 1;
  
  const reservasExistentes = [
    {
      empleado_id: 1,
      fecha_hora_inicio: '2024-01-15T14:00:00',
      fecha_hora_fin: '2024-01-15T14:30:00'
    }
  ];
  
  const sinConflictos = validarConflictosReservas(
    fecha, 
    horaInicio, 
    horaFin, 
    reservasExistentes, 
    empleadoId
  );
  
  console.log('¿Sin conflictos?', sinConflictos); // false (hay superposición)
};

// Ejemplo 7: Obtener fecha actual
const ejemploFechaActual = () => {
  const fechaActual = obtenerFechaActual();
  console.log('Fecha actual:', fechaActual); // "2024-01-15" (formato YYYY-MM-DD)
};

// Ejemplo 8: Convertir UTC a local
const ejemploConvertirUTC = () => {
  const fechaUTC = '2024-01-15T19:30:00Z';
  const fechaLocal = convertirUTCALocal(fechaUTC);
  
  console.log('Fecha UTC:', fechaUTC);
  console.log('Fecha local:', fechaLocal);
  // La fecha local será 5 horas después (UTC-5)
};

// Ejemplo 9: Formatear rango de fechas
const ejemploRangoFechas = () => {
  const fechaInicio = '2024-01-15T14:15:00';
  const fechaFin = '2024-01-15T14:45:00';
  
  const rango = formatearRangoFechas(fechaInicio, fechaFin);
  console.log('Rango de fechas:', rango);
  // Resultado: "15/01/2024, 14:15 - 15/01/2024, 14:45"
};

// Ejemplo 10: Extraer hora de fecha datetime
const ejemploExtraerHora = () => {
  const fechaHora = '2024-01-15T14:30:00';
  const hora = extraerHoraDeFecha(fechaHora);
  console.log('Hora extraída:', hora); // "14:30"
  
  const fechaHoraString = '2024-01-15 09:15:00';
  const hora2 = extraerHoraDeFecha(fechaHoraString);
  console.log('Hora extraída:', hora2); // "09:15"
};

// Ejemplo 11: Convertir hora local a UTC para base de datos
const ejemploConvertirLocalAUTC = () => {
  const fecha = '2024-01-15';
  const horaLocal = '17:15';
  
  const fechaUTC = convertirLocalAUTC(fecha, horaLocal);
  console.log('Hora local:', horaLocal); // "17:15"
  console.log('Fecha UTC para BD:', fechaUTC); // "2024-01-15 22:15:00"
  
  // Ejemplo con hora de fin
  const horaFinLocal = '17:45';
  const fechaFinUTC = convertirLocalAUTC(fecha, horaFinLocal);
  console.log('Hora fin local:', horaFinLocal); // "17:45"
  console.log('Fecha fin UTC para BD:', fechaFinUTC); // "2024-01-15 22:45:00"
};

// Ejemplo 12: Convertir horas a minutos y viceversa
const ejemploConvertirHoras = () => {
  const hora = '14:30';
  const minutos = convertirHoraAMinutos(hora);
  console.log('Hora a minutos:', minutos); // 870 (14*60 + 30)
  
  const horaConvertida = convertirMinutosAHora(minutos);
  console.log('Minutos a hora:', horaConvertida); // "14:30"
};

// Ejemplo de uso en un componente React
const ejemploUsoEnComponente = () => {
  // En un componente de selección de ausencias
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('');
  const [opcionesHorarios, setOpcionesHorarios] = useState([]);
  
  // Cuando cambia la fecha, generar opciones de horarios
  useEffect(() => {
    if (fechaSeleccionada) {
      const opciones = generarOpcionesHorarios(fechaSeleccionada);
      setOpcionesHorarios(opciones);
    }
  }, [fechaSeleccionada]);
  
  // Validar antes de enviar
  const handleSubmit = () => {
    if (!fechaSeleccionada || !horarioSeleccionado) {
      alert('Por favor selecciona fecha y horario');
      return;
    }
    
    const [horaInicio, horaFin] = horarioSeleccionado.split('-');
    
    if (!validarHorarioTrabajo(fechaSeleccionada, horaInicio, horaFin)) {
      alert('El horario seleccionado no es válido');
      return;
    }
    
    // Proceder con el envío
    console.log('Datos válidos, enviando...');
  };
  
  return {
    fechaSeleccionada,
    setFechaSeleccionada,
    horarioSeleccionado,
    setHorarioSeleccionado,
    opcionesHorarios,
    handleSubmit
  };
};

// Exportar ejemplos para uso en otros archivos
export {
  ejemploGenerarHorarios,
  ejemploGenerarOpciones,
  ejemploGenerarOpcionesAmplios,
  ejemploFormatearFechas,
  ejemploValidarHorario,
  ejemploFiltrarHorarios,
  ejemploValidarConflictos,
  ejemploFechaActual,
  ejemploConvertirUTC,
  ejemploRangoFechas,
  ejemploExtraerHora,
  ejemploConvertirLocalAUTC,
  ejemploConvertirHoras,
  ejemploUsoEnComponente
}; 