/**
 * Archivo de prueba para verificar horarios de ausencias
 * Ejecutar con: node test_horarios.js
 */

// Simular las funciones de ausenciaUtils
const generarHorariosDisponibles = (fecha) => {
  // Asegurar que la fecha sea un objeto Date válido
  let fechaObj;
  if (typeof fecha === 'string') {
    // Si es string, agregar tiempo para evitar problemas de zona horaria
    fechaObj = new Date(fecha + 'T00:00:00');
  } else {
    fechaObj = new Date(fecha);
  }
  
  // Validar que la fecha sea válida
  if (isNaN(fechaObj.getTime())) {
    console.error('❌ Fecha inválida:', fecha);
    return [];
  }
  
  const diaSemana = fechaObj.getDay(); // 0 = domingo, 1-6 = lunes a sábado
  
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

const probarHorarios = (fecha) => {
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

// Función para probar diferentes fechas
const probarFechas = () => {
  console.log('🧪 ===== PRUEBAS DE HORARIOS =====');
  
  // Probar diferentes fechas
  const fechasPrueba = [
    '2024-01-15', // Lunes
    '2024-01-16', // Martes
    '2024-01-17', // Miércoles
    '2024-01-18', // Jueves
    '2024-01-19', // Viernes
    '2024-01-20', // Sábado
    '2024-01-21', // Domingo
  ];
  
  fechasPrueba.forEach(fecha => {
    console.log('\n' + '='.repeat(50));
    const resultado = probarHorarios(fecha);
    console.log(`✅ ${resultado.nombreDia}: ${resultado.total} horarios disponibles`);
    
    if (resultado.horarios.length > 0) {
      const primerHorario = resultado.horarios[0];
      const ultimoHorario = resultado.horarios[resultado.horarios.length - 1];
      console.log(`   Primer horario: ${primerHorario.inicio} - ${primerHorario.fin}`);
      console.log(`   Último horario: ${ultimoHorario.inicio} - ${ultimoHorario.fin}`);
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log('🧪 ===== FIN DE PRUEBAS =====');
};

// Ejecutar pruebas
probarFechas(); 