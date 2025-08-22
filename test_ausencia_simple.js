/**
 * Prueba simple de validación de ausencias
 */

// Simular las funciones necesarias
const convertirHoraAMinutos = (hora) => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

const convertirMinutosAHora = (minutos) => {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const generarHorariosDisponibles = (fecha) => {
  let fechaObj;
  if (typeof fecha === 'string') {
    // Crear fecha en zona horaria local para evitar problemas de UTC
    const [year, month, day] = fecha.split('-').map(Number);
    fechaObj = new Date(year, month - 1, day); // month - 1 porque los meses van de 0-11
  } else {
    fechaObj = new Date(fecha);
  }
  
  if (isNaN(fechaObj.getTime())) {
    console.error('❌ Fecha inválida:', fecha);
    return [];
  }
  
  const diaSemana = fechaObj.getDay();
  console.log(`🕐 Generando horarios para día ${diaSemana} (${fechaObj.toDateString()})`);
  
  let horariosDisponibles = [];
  
  if (diaSemana === 0) {
    // Domingo
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
  } else {
    // Lunes a sábado
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
  }
  
  return horariosDisponibles;
};

const validarHorarioTrabajo = (fecha, horaInicio, horaFin) => {
  console.log("🕐 [HORARIO] Validando horario:", { fecha, horaInicio, horaFin });
  
  const horariosDisponibles = generarHorariosDisponibles(new Date(fecha));
  console.log("🕐 [HORARIO] Horarios disponibles:", horariosDisponibles);
  
  const inicioMinutos = convertirHoraAMinutos(horaInicio);
  const finMinutos = convertirHoraAMinutos(horaFin);
  console.log("🕐 [HORARIO] Minutos:", { inicioMinutos, finMinutos });
  
  const horariosEnMinutos = horariosDisponibles.map(horario => ({
    inicio: convertirHoraAMinutos(horario.inicio),
    fin: convertirHoraAMinutos(horario.fin),
    inicioStr: horario.inicio,
    finStr: horario.fin
  }));
  
  console.log("🕐 [HORARIO] Horarios en minutos:", horariosEnMinutos);
  
  let horarioValido = false;
  
  horarioValido = horariosEnMinutos.some(horario => {
    const dentroDeHorario = inicioMinutos >= horario.inicio && finMinutos <= horario.fin;
    console.log(`🕐 [HORARIO] Verificando ${horaInicio}-${horaFin} dentro de ${horario.inicioStr}-${horario.finStr}:`, dentroDeHorario);
    return dentroDeHorario;
  });
  
  console.log("🕐 [HORARIO] ¿Está dentro de un horario?:", horarioValido);
  
  if (!horarioValido) {
    console.log("🕐 [HORARIO] Verificando horarios consecutivos...");
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

const esAusenciaPeriodoLargo = (fechaInicio, fechaFin, horaInicio = null, horaFin = null) => {
  if (!horaInicio || !horaFin) {
    return true;
  }
  
  if (fechaInicio !== fechaFin) {
    return true;
  }
  
  if (horaInicio === '00:00' && horaFin === '23:59') {
    return true;
  }
  
  return false;
};

const validarAusencia = (fechaInicio, fechaFin, horaInicio = null, horaFin = null) => {
  console.log("🕐 [VALIDAR] Entrada:", { fechaInicio, fechaFin, horaInicio, horaFin });
  
  if (!fechaInicio || !fechaFin) {
    console.log("❌ [VALIDAR] Fechas faltantes");
    return false;
  }
  
  const esPeriodoLargo = esAusenciaPeriodoLargo(fechaInicio, fechaFin, horaInicio, horaFin);
  console.log("🕐 [VALIDAR] Es período largo:", esPeriodoLargo);
  
  if (esPeriodoLargo) {
    const [yearInicio, monthInicio, dayInicio] = fechaInicio.split('-').map(Number);
    const [yearFin, monthFin, dayFin] = fechaFin.split('-').map(Number);
    const fechaInicioDate = new Date(yearInicio, monthInicio - 1, dayInicio);
    const fechaFinDate = new Date(yearFin, monthFin - 1, dayFin);
    
    console.log("🕐 [VALIDAR] Fechas parseadas:", { fechaInicioDate, fechaFinDate });
    
    if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
      console.log("❌ [VALIDAR] Fechas inválidas");
      return false;
    }
    
    if (fechaFinDate < fechaInicioDate) {
      console.log("❌ [VALIDAR] Fecha fin anterior a fecha inicio");
      return false;
    }
    
    console.log("✅ [VALIDAR] Período largo válido");
    return true;
  } else {
    if (!horaInicio || !horaFin) {
      console.log("❌ [VALIDAR] Horas faltantes para ausencia por horas");
      return false;
    }
    
    const esHorarioValido = validarHorarioTrabajo(fechaInicio, horaInicio, horaFin);
    console.log("🕐 [VALIDAR] Horario válido:", esHorarioValido);
    
    return esHorarioValido;
  }
};

// Pruebas
console.log('🧪 ===== PRUEBAS DE VALIDACIÓN =====');

// Prueba 1: Ausencia por período largo
console.log('\n📅 Prueba 1: Ausencia por período largo');
const resultado1 = validarAusencia('2024-01-15', '2024-01-20');
console.log('Resultado:', resultado1);

// Prueba 2: Ausencia por horas (lunes)
console.log('\n📅 Prueba 2: Ausencia por horas (lunes)');
const resultado2 = validarAusencia('2024-01-15', '2024-01-15', '14:15', '14:45');
console.log('Resultado:', resultado2);

// Prueba 3: Ausencia por horas (domingo)
console.log('\n📅 Prueba 3: Ausencia por horas (domingo)');
const resultado3 = validarAusencia('2024-01-21', '2024-01-21', '10:00', '10:30');
console.log('Resultado:', resultado3);

// Prueba 4: Horario inválido
console.log('\n📅 Prueba 4: Horario inválido');
const resultado4 = validarAusencia('2024-01-15', '2024-01-15', '20:00', '21:00');
console.log('Resultado:', resultado4);

console.log('\n🧪 ===== FIN DE PRUEBAS ====='); 