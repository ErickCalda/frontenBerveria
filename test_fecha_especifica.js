/**
 * Prueba específica para la fecha 2025-08-25
 */

const generarHorariosDisponibles = (fecha) => {
  let fechaObj;
  if (typeof fecha === 'string') {
    // Crear fecha usando UTC para evitar problemas de zona horaria
    fechaObj = new Date(fecha + 'T12:00:00.000Z');
  } else {
    fechaObj = new Date(fecha);
  }
  
  if (isNaN(fechaObj.getTime())) {
    console.error('❌ Fecha inválida:', fecha);
    return [];
  }
  
  // Usar getUTCDay() para obtener el día de la semana de manera consistente
  const diaSemana = fechaObj.getUTCDay(); // 0 = domingo, 1-6 = lunes a sábado
  
  console.log(`🕐 [HORARIOS] Generando horarios para día ${diaSemana} (${fechaObj.toDateString()})`);
  console.log(`🕐 [HORARIOS] Fecha UTC: ${fechaObj.toISOString()}`);
  console.log(`🕐 [HORARIOS] Día de la semana: ${diaSemana}`);
  
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
    console.log('🕐 [HORARIOS] Domingo - horarios hasta 14:00');
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
    console.log('🕐 [HORARIOS] Lunes-Sábado - horarios hasta 18:45');
  }
  
  return horariosDisponibles;
};

// Prueba específica para la fecha problemática
console.log('🧪 ===== PRUEBA FECHA ESPECÍFICA =====');

const fechaProblema = '2025-08-25';
console.log(`📅 Probando fecha: ${fechaProblema}`);

const horarios = generarHorariosDisponibles(fechaProblema);
console.log(`📅 Horarios generados: ${horarios.length}`);
console.log(`📅 Primer horario: ${horarios[0]?.inicio} - ${horarios[0]?.fin}`);
console.log(`📅 Último horario: ${horarios[horarios.length - 1]?.inicio} - ${horarios[horarios.length - 1]?.fin}`);

// Verificar si el horario 09:15-18:45 está disponible
const horarioBuscado = { inicio: '09:15', fin: '18:45' };
const horarioEncontrado = horarios.find(h => h.inicio === horarioBuscado.inicio && h.fin === horarioBuscado.fin);

console.log(`📅 ¿Horario 09:15-18:45 disponible?: ${horarioEncontrado ? 'SÍ' : 'NO'}`);

// Mostrar todos los horarios disponibles
console.log('📅 Todos los horarios disponibles:');
horarios.forEach((horario, index) => {
  console.log(`  ${index + 1}. ${horario.inicio} - ${horario.fin}`);
});

console.log('🧪 ===== FIN DE PRUEBA ====='); 