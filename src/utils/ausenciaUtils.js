/**
 * Utilidad para manejar ausencias de empleados en el frontend
 * Gestiona horarios disponibles, validaciones y formateo de fechas/horas
 */

// Configuración de zona horaria
const ZONA_HORARIA = 'America/Guayaquil';

/**
 * Genera los horarios disponibles para un día específico
 * @param {Date} fecha - Fecha para la cual generar horarios
 * @returns {Array} Array de objetos con horarios disponibles
 */
export const generarHorariosDisponibles = (fecha) => {
  // Asegurar que la fecha sea un objeto Date válido
  let fechaObj;
  if (typeof fecha === 'string') {
    // Crear fecha usando UTC para evitar problemas de zona horaria
    fechaObj = new Date(fecha + 'T12:00:00.000Z');
  } else {
    fechaObj = new Date(fecha);
  }
  
  // Validar que la fecha sea válida
  if (isNaN(fechaObj.getTime())) {
    console.error('❌ Fecha inválida:', fecha);
    return [];
  }
  
  // Usar getUTCDay() para obtener el día de la semana de manera consistente
  const diaSemana = fechaObj.getUTCDay(); // 0 = domingo, 1-6 = lunes a sábado
  
  console.log(`🕐 [HORARIOS] Generando horarios para día ${diaSemana} (${fechaObj.toDateString()})`);
  
  let horariosDisponibles = [];
  
  if (diaSemana === 0) {
    // Horarios de domingo
    horariosDisponibles = [
      { inicio: '09:30', fin: '10:00' },
      { inicio: '10:00', fin: '10:30' },
      { inicio: '10:30', fin: '11:00' },
      { inicio: '11:00', fin: '11:30' },
      { inicio: '11:30', fin: '12:00' },
      { inicio: '12:00', fin: '12:30' },
      { inicio: '12:30', fin: '13:00' },
      { inicio: '13:00', fin: '13:30' },
      { inicio: '13:30', fin: '14:00' }
    ];
    console.log('🕐 [HORARIOS] Domingo - horarios hasta 14:00');
  } else {
    // Horarios de lunes a sábado
    horariosDisponibles = [
      { inicio: '09:15', fin: '09:45' },
      { inicio: '09:45', fin: '10:15' },
      { inicio: '10:15', fin: '10:45' },
      { inicio: '10:45', fin: '11:15' },
      { inicio: '11:15', fin: '11:45' },
      { inicio: '11:45', fin: '12:15' },
      { inicio: '12:15', fin: '12:45' },
      { inicio: '14:15', fin: '14:45' },
      { inicio: '14:45', fin: '15:15' },
      { inicio: '15:15', fin: '15:45' },
      { inicio: '15:45', fin: '16:15' },
      { inicio: '16:15', fin: '16:45' },
      { inicio: '16:45', fin: '17:15' },
      { inicio: '17:15', fin: '17:45' },
      { inicio: '17:45', fin: '18:15' },
      { inicio: '18:15', fin: '18:45' }
    ];
    console.log('🕐 [HORARIOS] Lunes-Sábado - horarios hasta 18:45');
  }

  console.log(`🕐 [HORARIOS] Total de horarios generados: ${horariosDisponibles.length}`);
  return horariosDisponibles;
};

/**
 * Convierte un horario a objeto Date para una fecha específica
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {string} hora - Hora en formato HH:MM
 * @returns {Date} Objeto Date con fecha y hora
 */
export const convertirHorarioADate = (fecha, hora) => {
  const fechaHoraString = `${fecha}T${hora}:00`;
  return new Date(fechaHoraString);
};

/**
 * Extrae la hora de una fecha datetime
 * @param {string|Date} fechaHora - Fecha y hora
 * @returns {string} Hora en formato HH:MM
 */
export const extraerHoraDeFecha = (fechaHora) => {
  if (!fechaHora) return null;
  
  console.log("🕐 [EXTRAER] Entrada:", fechaHora);
  
  const fecha = new Date(fechaHora);
  if (isNaN(fecha.getTime())) return null;
  
  console.log("🕐 [EXTRAER] Fecha UTC parseada:", fecha);
  
  // La fecha ya está en hora local (JavaScript la convierte automáticamente)
  // Solo necesitamos extraer la hora sin restar 5 horas adicionales
  const fechaLocal = fecha;
  console.log("🕐 [EXTRAER] Fecha local (sin conversión adicional):", fechaLocal);
  
  // Formatear hora en HH:MM
  const hours = String(fechaLocal.getHours()).padStart(2, '0');
  const minutes = String(fechaLocal.getMinutes()).padStart(2, '0');
  
  const resultado = `${hours}:${minutes}`;
  console.log("🕐 [EXTRAER] Resultado final:", resultado);
  
  return resultado;
};

/**
 * Formatea una fecha y hora para mostrar en la interfaz
 * @param {string|Date} fechaHora - Fecha y hora a formatear
 * @param {string} formato - Formato deseado ('corta', 'larga', 'solo_hora')
 * @returns {string} Fecha formateada
 */
export const formatearFechaHora = (fechaHora, formato = 'corta') => {
  if (!fechaHora) return "N/A";

  let fecha;
  if (typeof fechaHora === 'string') {
    // Convertir string a Date
    const fechaIso = fechaHora.includes(" ") 
      ? fechaHora.replace(" ", "T") 
      : fechaHora;
    fecha = new Date(fechaIso);
  } else {
    fecha = new Date(fechaHora);
  }

  if (isNaN(fecha.getTime())) return "N/A";

  // Ajustar a zona horaria local (UTC-5 para Guayaquil)
  const fechaLocal = new Date(fecha.getTime() - 5 * 60 * 60 * 1000);

  switch (formato) {
    case 'corta':
      return fechaLocal.toLocaleString("es-EC", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: ZONA_HORARIA
      });
    
    case 'larga':
      return fechaLocal.toLocaleString("es-EC", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: ZONA_HORARIA
      });
    
    case 'solo_hora':
      return fechaLocal.toLocaleTimeString("es-EC", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: ZONA_HORARIA
      });
    
    default:
      return fechaLocal.toLocaleString("es-EC", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: ZONA_HORARIA
      });
  }
};

/**
 * Valida si un horario está dentro de los horarios de trabajo
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {string} horaInicio - Hora de inicio en formato HH:MM
 * @param {string} horaFin - Hora de fin en formato HH:MM
 * @returns {boolean} True si el horario es válido
 */
export const validarHorarioTrabajo = (fecha, horaInicio, horaFin) => {
  console.log("🕐 [HORARIO] Validando horario:", { fecha, horaInicio, horaFin });
  
  const horariosDisponibles = generarHorariosDisponibles(new Date(fecha));
  console.log("🕐 [HORARIO] Horarios disponibles:", horariosDisponibles);
  
  // Convertir horas a minutos para comparación
  const inicioMinutos = convertirHoraAMinutos(horaInicio);
  const finMinutos = convertirHoraAMinutos(horaFin);
  console.log("🕐 [HORARIO] Minutos:", { inicioMinutos, finMinutos });
  
  // Convertir horarios a minutos para facilitar cálculos
  const horariosEnMinutos = horariosDisponibles.map(horario => ({
    inicio: convertirHoraAMinutos(horario.inicio),
    fin: convertirHoraAMinutos(horario.fin),
    inicioStr: horario.inicio,
    finStr: horario.fin
  }));
  
  console.log("🕐 [HORARIO] Horarios en minutos:", horariosEnMinutos);
  
  // Verificar si el rango completo está dentro de algún horario laboral
  // o si se extiende a través de múltiples horarios consecutivos
  let horarioValido = false;
  
  // Primero verificar si está completamente dentro de un horario
  horarioValido = horariosEnMinutos.some(horario => {
    const dentroDeHorario = inicioMinutos >= horario.inicio && finMinutos <= horario.fin;
    console.log(`🕐 [HORARIO] Verificando ${horaInicio}-${horaFin} dentro de ${horario.inicioStr}-${horario.finStr}:`, dentroDeHorario);
    return dentroDeHorario;
  });
  
  console.log("🕐 [HORARIO] ¿Está dentro de un horario?:", horarioValido);
  
  // Si no está dentro de un horario, verificar si se extiende a través de múltiples
  if (!horarioValido) {
    console.log("🕐 [HORARIO] Verificando horarios consecutivos...");
    // Verificar si todos los horarios necesarios están disponibles
    const horariosNecesarios = [];
    let horaActual = inicioMinutos;
    
    while (horaActual < finMinutos) {
      const horarioEncontrado = horariosEnMinutos.find(horario => 
        horaActual >= horario.inicio && horaActual < horario.fin
      );
      
      if (horarioEncontrado) {
        horariosNecesarios.push(horarioEncontrado);
        horaActual = horarioEncontrado.fin;
        console.log(`🕐 [HORARIO] Encontrado horario: ${horarioEncontrado.inicioStr}-${horarioEncontrado.finStr}`);
      } else {
        console.log(`🕐 [HORARIO] No se encontró horario para ${convertirMinutosAHora(horaActual)}`);
        break;
      }
    }
    
    // Si encontramos todos los horarios necesarios y cubren todo el rango
    if (horaActual >= finMinutos) {
      horarioValido = true;
      console.log("🕐 [HORARIO] Horarios consecutivos válidos");
    } else {
      console.log("🕐 [HORARIO] Horarios consecutivos inválidos");
    }
  }
  
  console.log("🕐 [HORARIO] Resultado final:", horarioValido);
  return horarioValido;
};



/**
 * Convierte hora en formato HH:MM a minutos totales
 * @param {string} hora - Hora en formato HH:MM
 * @returns {number} Minutos totales
 */
export const convertirHoraAMinutos = (hora) => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

/**
 * Convierte minutos totales a formato HH:MM
 * @param {number} minutos - Minutos totales
 * @returns {string} Hora en formato HH:MM
 */
export const convertirMinutosAHora = (minutos) => {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

/**
 * Filtra horarios disponibles excluyendo los que ya están ocupados por ausencias
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {Array} ausenciasExistentes - Array de ausencias existentes
 * @param {number} empleadoId - ID del empleado (opcional, para filtrar por empleado)
 * @returns {Array} Horarios disponibles filtrados
 */
export const filtrarHorariosDisponibles = (fecha, ausenciasExistentes = [], empleadoId = null) => {
  const horariosDisponibles = generarHorariosDisponibles(new Date(fecha));
  
  // Filtrar ausencias para la fecha específica y empleado (si se especifica)
  const ausenciasDelDia = ausenciasExistentes.filter(ausencia => {
    const fechaAusencia = ausencia.fecha_inicio?.slice(0, 10);
    const coincideFecha = fechaAusencia === fecha;
    const coincideEmpleado = empleadoId ? ausencia.empleado_id === empleadoId : true;
    const estaAprobada = parseInt(ausencia.aprobada, 10) === 1;
    
    return coincideFecha && coincideEmpleado && estaAprobada;
  });

  // Crear conjunto de horarios ocupados
  const horariosOcupados = new Set();
  ausenciasDelDia.forEach(ausencia => {
    if (ausencia.fecha_inicio && ausencia.fecha_fin) {
      const horaInicio = extraerHoraDeFecha(ausencia.fecha_inicio);
      const horaFin = extraerHoraDeFecha(ausencia.fecha_fin);
      if (horaInicio && horaFin) {
        horariosOcupados.add(`${horaInicio}-${horaFin}`);
      }
    }
  });

  // Filtrar horarios disponibles
  return horariosDisponibles.filter(horario => {
    const horarioKey = `${horario.inicio}-${horario.fin}`;
    return !horariosOcupados.has(horarioKey);
  });
};

/**
 * Valida que una ausencia no se superponga con reservas existentes
 * @param {string} fecha - Fecha de la ausencia
 * @param {string} horaInicio - Hora de inicio
 * @param {string} horaFin - Hora de fin
 * @param {Array} reservasExistentes - Array de reservas existentes
 * @param {number} empleadoId - ID del empleado
 * @returns {boolean} True si no hay conflictos
 */
export const validarConflictosReservas = (fecha, horaInicio, horaFin, reservasExistentes = [], empleadoId) => {
  const fechaInicioAusencia = convertirHorarioADate(fecha, horaInicio);
  const fechaFinAusencia = convertirHorarioADate(fecha, horaFin);

  // Filtrar reservas del empleado para esa fecha
  const reservasDelEmpleado = reservasExistentes.filter(reserva => {
    const fechaReserva = reserva.fecha_hora_inicio?.slice(0, 10);
    return reserva.empleado_id === empleadoId && fechaReserva === fecha;
  });

  // Verificar conflictos
  const hayConflictos = reservasDelEmpleado.some(reserva => {
    const fechaInicioReserva = new Date(reserva.fecha_hora_inicio);
    const fechaFinReserva = new Date(reserva.fecha_hora_fin);

    // Verificar si hay superposición
    return (
      (fechaInicioAusencia < fechaFinReserva && fechaFinAusencia > fechaInicioReserva) ||
      (fechaInicioReserva < fechaFinAusencia && fechaFinReserva > fechaInicioAusencia)
    );
  });

  return !hayConflictos;
};

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 * @returns {string} Fecha actual formateada
 */
export const obtenerFechaActual = () => {
  const fecha = new Date();
  // No necesitamos ajustar la fecha actual, ya está en hora local
  return fecha.toISOString().slice(0, 10);
};

/**
 * Convierte una fecha UTC a hora local
 * @param {string|Date} fechaUTC - Fecha en UTC
 * @returns {Date} Fecha en hora local
 */
export const convertirUTCALocal = (fechaUTC) => {
  if (!fechaUTC) return null;
  
  const fecha = new Date(fechaUTC);
  if (isNaN(fecha.getTime())) return null;
  
  // Restar 5 horas para convertir de UTC a hora local
  return new Date(fecha.getTime() - 5 * 60 * 60 * 1000);
};

/**
 * Convierte una hora local a UTC para guardar en la base de datos
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {string} horaLocal - Hora local en formato HH:MM
 * @returns {string} Fecha y hora en UTC para la base de datos
 */
export const convertirLocalAUTC = (fecha, horaLocal) => {
  if (!fecha || !horaLocal) return null;
  
  console.log("🕐 [CONVERTIR] Entrada:", { fecha, horaLocal });
  
  // Crear fecha local
  const fechaLocal = new Date(`${fecha}T${horaLocal}:00`);
  console.log("🕐 [CONVERTIR] Fecha local creada:", fechaLocal);
  
  // Sumar 5 horas para convertir a UTC (17:15 local -> 22:15 UTC)
  const fechaUTC = new Date(fechaLocal.getTime() + 5 * 60 * 60 * 1000);
  console.log("🕐 [CONVERTIR] Fecha UTC calculada:", fechaUTC);
  
  // Retornar en formato MySQL datetime (YYYY-MM-DD HH:MM:SS)
  // Usar getFullYear, getMonth, etc. en lugar de getUTCFullYear para evitar problemas de zona horaria
  const year = fechaUTC.getFullYear();
  const month = String(fechaUTC.getMonth() + 1).padStart(2, '0');
  const day = String(fechaUTC.getDate()).padStart(2, '0');
  const hours = String(fechaUTC.getHours()).padStart(2, '0');
  const minutes = String(fechaUTC.getMinutes()).padStart(2, '0');
  const seconds = String(fechaUTC.getSeconds()).padStart(2, '0');
  
  const resultado = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  console.log("🕐 [CONVERTIR] Resultado final:", resultado);
  
  return resultado;
};

/**
 * Formatea un rango de fechas para mostrar
 * @param {string|Date} fechaInicio - Fecha de inicio
 * @param {string|Date} fechaFin - Fecha de fin
 * @returns {string} Rango formateado
 */
export const formatearRangoFechas = (fechaInicio, fechaFin) => {
  const inicio = formatearFechaHora(fechaInicio, 'corta');
  const fin = formatearFechaHora(fechaFin, 'corta');
  
  return `${inicio} - ${fin}`;
};

/**
 * Genera opciones de horarios para un selector
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {Array} Array de opciones para selector
 */
export const generarOpcionesHorarios = (fecha) => {
  const horarios = generarHorariosDisponibles(new Date(fecha));
  
  return horarios.map((horario, index) => ({
    id: index,
    value: `${horario.inicio}-${horario.fin}`,
    label: `${horario.inicio} - ${horario.fin}`,
    inicio: horario.inicio,
    fin: horario.fin
  }));
};

/**
 * Genera opciones de horarios con rangos amplios
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {number} duracionMinima - Duración mínima en minutos
 * @returns {Array} Array de opciones con rangos amplios
 */
export const generarOpcionesHorariosAmplios = (fecha, duracionMinima = 30) => {
  const horarios = generarHorariosDisponibles(new Date(fecha));
  const opciones = [];
  
  // Generar rangos de diferentes duraciones
  const duraciones = [30, 60, 90, 120, 180].filter(d => d >= duracionMinima); // 30min, 1h, 1.5h, 2h, 3h
  
  horarios.forEach((horario, index) => {
    const inicioMinutos = convertirHoraAMinutos(horario.inicio);
    
    duraciones.forEach(duracion => {
      const finMinutos = inicioMinutos + duracion;
      const finHora = convertirMinutosAHora(finMinutos);
      
      // Verificar si el rango está dentro de los horarios disponibles
      const rangoValido = horarios.some(h => {
        const hInicio = convertirHoraAMinutos(h.inicio);
        const hFin = convertirHoraAMinutos(h.fin);
        return inicioMinutos >= hInicio && finMinutos <= hFin;
      });
      
      if (rangoValido) {
        opciones.push({
          id: `${index}-${duracion}`,
          value: `${horario.inicio}-${finHora}`,
          label: `${horario.inicio} - ${finHora} (${duracion} min)`,
          inicio: horario.inicio,
          fin: finHora,
          duracion
        });
      }
    });
  });
  
  return opciones;
};

/**
 * Valida si una ausencia es por período largo (días completos)
 * @param {string} fechaInicio - Fecha de inicio
 * @param {string} fechaFin - Fecha de fin
 * @param {string} horaInicio - Hora de inicio (opcional)
 * @param {string} horaFin - Hora de fin (opcional)
 * @returns {boolean} True si es ausencia por período largo
 */
export const esAusenciaPeriodoLargo = (fechaInicio, fechaFin, horaInicio = null, horaFin = null) => {
  // Si no hay horas específicas, es período largo
  if (!horaInicio || !horaFin) {
    return true;
  }
  
  // Si las fechas son diferentes, es período largo
  if (fechaInicio !== fechaFin) {
    return true;
  }
  
  // Si las horas son 00:00-23:59, es período largo
  if (horaInicio === '00:00' && horaFin === '23:59') {
    return true;
  }
  
  // Si las horas cubren un rango amplio (más de 6 horas), tratarlo como período largo
  const inicioMinutos = convertirHoraAMinutos(horaInicio);
  const finMinutos = convertirHoraAMinutos(horaFin);
  const duracionHoras = (finMinutos - inicioMinutos) / 60;
  
  if (duracionHoras >= 6) {
    console.log(`🕐 [PERIODO] Rango de ${duracionHoras} horas detectado como período largo`);
    return true;
  }
  
  return false;
};

/**
 * Valida ausencia considerando si es período largo o por horas específicas
 * @param {string} fechaInicio - Fecha de inicio
 * @param {string} fechaFin - Fecha de fin
 * @param {string} horaInicio - Hora de inicio (opcional)
 * @param {string} horaFin - Hora de fin (opcional)
 * @returns {boolean} True si la ausencia es válida
 */
export const validarAusencia = (fechaInicio, fechaFin, horaInicio = null, horaFin = null) => {
  console.log("🕐 [VALIDAR] Entrada:", { fechaInicio, fechaFin, horaInicio, horaFin });
  
  // Validar que las fechas básicas estén presentes
  if (!fechaInicio || !fechaFin) {
    console.log("❌ [VALIDAR] Fechas faltantes");
    return false;
  }
  
  // Determinar si es período largo
  const esPeriodoLargo = esAusenciaPeriodoLargo(fechaInicio, fechaFin, horaInicio, horaFin);
  console.log("🕐 [VALIDAR] Es período largo:", esPeriodoLargo);
  
  if (esPeriodoLargo) {
    // Validación para períodos largos
    const fechaInicioDate = new Date(fechaInicio + 'T12:00:00.000Z');
    const fechaFinDate = new Date(fechaFin + 'T12:00:00.000Z');
    
    console.log("🕐 [VALIDAR] Fechas parseadas:", { fechaInicioDate, fechaFinDate });
    
    // Validar que las fechas sean válidas
    if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
      console.log("❌ [VALIDAR] Fechas inválidas");
      return false;
    }
    
    // Validar que la fecha de fin no sea anterior a la de inicio
    if (fechaFinDate < fechaInicioDate) {
      console.log("❌ [VALIDAR] Fecha fin anterior a fecha inicio");
      return false;
    }
    
    console.log("✅ [VALIDAR] Período largo válido");
    return true;
  } else {
    // Validación para horas específicas
    if (!horaInicio || !horaFin) {
      console.log("❌ [VALIDAR] Horas faltantes para ausencia por horas");
      return false;
    }
    
    const esHorarioValido = validarHorarioTrabajo(fechaInicio, horaInicio, horaFin);
    console.log("🕐 [VALIDAR] Horario válido:", esHorarioValido);
    
    return esHorarioValido;
  }
};

/**
 * Convierte una ausencia a formato UTC considerando el tipo
 * @param {string} fechaInicio - Fecha de inicio
 * @param {string} fechaFin - Fecha de fin
 * @param {string} horaInicio - Hora de inicio (opcional)
 * @param {string} horaFin - Hora de fin (opcional)
 * @returns {Object} Objeto con fechas en UTC
 */
export const convertirAusenciaAUTC = (fechaInicio, fechaFin, horaInicio = null, horaFin = null) => {
  let fechaInicioUTC, fechaFinUTC;
  
  if (esAusenciaPeriodoLargo(fechaInicio, fechaFin, horaInicio, horaFin)) {
    // Para períodos largos, usar 00:00 para inicio y 23:59 para fin
    fechaInicioUTC = `${fechaInicio} 00:00:00`;
    fechaFinUTC = `${fechaFin} 23:59:59`;
  } else {
    // Para horas específicas, convertir usando las funciones existentes
    fechaInicioUTC = convertirLocalAUTC(fechaInicio, horaInicio);
    fechaFinUTC = convertirLocalAUTC(fechaFin, horaFin);
  }
  
  return {
    fecha_inicio: fechaInicioUTC,
    fecha_fin: fechaFinUTC
  };
};

/**
 * Formatea una ausencia para mostrar en la interfaz
 * @param {Object} ausencia - Objeto de ausencia
 * @returns {string} Texto formateado de la ausencia
 */
export const formatearAusencia = (ausencia) => {
  if (!ausencia.fecha_inicio || !ausencia.fecha_fin) {
    return "N/A";
  }
  
  const fechaInicio = new Date(ausencia.fecha_inicio);
  const fechaFin = new Date(ausencia.fecha_fin);
  
  // Si las fechas son diferentes, mostrar rango de fechas
  if (fechaInicio.toDateString() !== fechaFin.toDateString()) {
    return formatearRangoFechas(ausencia.fecha_inicio, ausencia.fecha_fin);
  }
  
  // Si es el mismo día, mostrar horario
  const horaInicio = extraerHoraDeFecha(ausencia.fecha_inicio);
  const horaFin = extraerHoraDeFecha(ausencia.fecha_fin);
  
  if (horaInicio && horaFin) {
    return `${formatearFechaHora(ausencia.fecha_inicio, 'corta')} - ${horaInicio} a ${horaFin}`;
  }
  
  return formatearFechaHora(ausencia.fecha_inicio, 'corta');
};

/**
 * Función de prueba para verificar horarios
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 */
export const probarHorarios = (fecha) => {
  console.log(`🧪 [PRUEBA] Probando horarios para: ${fecha}`);
  
  const fechaObj = new Date(fecha + 'T00:00:00');
  const diaSemana = fechaObj.getDay();
  const nombreDia = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][diaSemana];
  
  console.log(`🧪 [PRUEBA] Día de la semana: ${diaSemana} (${nombreDia})`);
  console.log(`🧪 [PRUEBA] Fecha objeto:`, fechaObj);
  
  const horarios = generarHorariosDisponibles(fecha);
  
  console.log(`🧪 [PRUEBA] Horarios generados:`, horarios);
  console.log(`🧪 [PRUEBA] Primer horario:`, horarios[0]);
  console.log(`🧪 [PRUEBA] Último horario:`, horarios[horarios.length - 1]);
  
  return {
    fecha,
    diaSemana,
    nombreDia,
    horarios,
    total: horarios.length
  };
};

export default {
  generarHorariosDisponibles,
  convertirHorarioADate,
  extraerHoraDeFecha,
  formatearFechaHora,
  validarHorarioTrabajo,
  convertirHoraAMinutos,
  convertirMinutosAHora,
  filtrarHorariosDisponibles,
  validarConflictosReservas,
  obtenerFechaActual,
  convertirUTCALocal,
  convertirLocalAUTC,
  formatearRangoFechas,
  generarOpcionesHorarios,
  generarOpcionesHorariosAmplios,
  esAusenciaPeriodoLargo,
  validarAusencia,
  convertirAusenciaAUTC,
  formatearAusencia,
  probarHorarios
}; 