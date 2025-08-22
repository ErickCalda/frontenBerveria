/**
 * Prueba para verificar que rangos amplios se traten como períodos largos
 */

const convertirHoraAMinutos = (hora) => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

const esAusenciaPeriodoLargo = (fechaInicio, fechaFin, horaInicio = null, horaFin = null) => {
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

const validarAusencia = (fechaInicio, fechaFin, horaInicio = null, horaFin = null) => {
  console.log("🕐 [VALIDAR] Entrada:", { fechaInicio, fechaFin, horaInicio, horaFin });
  
  if (!fechaInicio || !fechaFin) {
    console.log("❌ [VALIDAR] Fechas faltantes");
    return false;
  }
  
  const esPeriodoLargo = esAusenciaPeriodoLargo(fechaInicio, fechaFin, horaInicio, horaFin);
  console.log("🕐 [VALIDAR] Es período largo:", esPeriodoLargo);
  
  if (esPeriodoLargo) {
    console.log("✅ [VALIDAR] Período largo válido");
    return true;
  } else {
    console.log("❌ [VALIDAR] Debe validar horarios específicos");
    return false;
  }
};

// Pruebas
console.log('🧪 ===== PRUEBAS DE RANGO AMPLIO =====');

// Prueba 1: Rango de 9.5 horas (09:15-18:45)
console.log('\n📅 Prueba 1: Rango de 9.5 horas (09:15-18:45)');
const resultado1 = validarAusencia('2025-08-25', '2025-08-25', '09:15', '18:45');
console.log('Resultado:', resultado1);

// Prueba 2: Rango de 3 horas (14:15-17:15)
console.log('\n📅 Prueba 2: Rango de 3 horas (14:15-17:15)');
const resultado2 = validarAusencia('2025-08-25', '2025-08-25', '14:15', '17:15');
console.log('Resultado:', resultado2);

// Prueba 3: Rango de 6 horas exactas (09:15-15:15)
console.log('\n📅 Prueba 3: Rango de 6 horas exactas (09:15-15:15)');
const resultado3 = validarAusencia('2025-08-25', '2025-08-25', '09:15', '15:15');
console.log('Resultado:', resultado3);

// Prueba 4: Rango de 5.5 horas (09:15-14:45)
console.log('\n📅 Prueba 4: Rango de 5.5 horas (09:15-14:45)');
const resultado4 = validarAusencia('2025-08-25', '2025-08-25', '09:15', '14:45');
console.log('Resultado:', resultado4);

console.log('\n🧪 ===== FIN DE PRUEBAS ====='); 