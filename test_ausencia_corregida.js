// Test para verificar que la corrección de validación de horarios funciona
// Simula el horario 11:15-16:15 que estaba fallando

// Simular los horarios disponibles (como en ausenciaUtils.js)
const horariosDisponibles = [
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

// Función de conversión de hora a minutos
const convertirHoraAMinutos = (hora) => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

// Función de conversión de minutos a hora
const convertirMinutosAHora = (minutos) => {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

// Función corregida de validación (la que implementé)
const validarHorarioTrabajoCorregida = (fecha, horaInicio, horaFin) => {
  console.log("🕐 [TEST] Validando horario:", { fecha, horaInicio, horaFin });
  
  // Convertir horas a minutos para comparación
  const inicioMinutos = convertirHoraAMinutos(horaInicio);
  const finMinutos = convertirHoraAMinutos(horaFin);
  console.log("🕐 [TEST] Minutos:", { inicioMinutos, finMinutos });
  
  // Convertir horarios a minutos para facilitar cálculos
  const horariosEnMinutos = horariosDisponibles.map(horario => ({
    inicio: convertirHoraAMinutos(horario.inicio),
    fin: convertirHoraAMinutos(horario.fin),
    inicioStr: horario.inicio,
    finStr: horario.fin
  }));
  
  console.log("🕐 [TEST] Horarios en minutos:", horariosEnMinutos);
  
  // Verificar si el rango completo está dentro de algún horario laboral
  // o si se extiende a través de múltiples horarios consecutivos
  let horarioValido = false;
  
  // Primero verificar si está completamente dentro de un horario
  horarioValido = horariosEnMinutos.some(horario => {
    const dentroDeHorario = inicioMinutos >= horario.inicio && finMinutos <= horario.fin;
    console.log(`🕐 [TEST] Verificando ${horaInicio}-${horaFin} dentro de ${horario.inicioStr}-${horario.finStr}:`, dentroDeHorario);
    return dentroDeHorario;
  });
  
  console.log("🕐 [TEST] ¿Está dentro de un horario?:", horarioValido);
  
  // Si no está dentro de un horario, verificar si se extiende a través de múltiples
  if (!horarioValido) {
    console.log("🕐 [TEST] Verificando horarios consecutivos...");
    
    // Obtener el rango completo de horarios de trabajo del día
    const primerHorario = horariosEnMinutos[0];
    const ultimoHorario = horariosEnMinutos[horariosEnMinutos.length - 1];
    
    // Verificar si el horario solicitado está dentro del rango total de trabajo
    if (inicioMinutos >= primerHorario.inicio && finMinutos <= ultimoHorario.fin) {
      // Verificar que no haya gaps significativos en el rango solicitado
      // Un gap se considera significativo si es mayor a 1.5 horas (90 minutos)
      const GAP_MAXIMO = 90; // minutos
      
      let hayGapSignificativo = false;
      let horaActual = inicioMinutos;
      
      while (horaActual < finMinutos) {
        const horarioEncontrado = horariosEnMinutos.find(horario => 
          horaActual >= horario.inicio && horaActual < horario.fin
        );
        
        if (horarioEncontrado) {
          // Si encontramos un horario, avanzar al siguiente
          horaActual = horarioEncontrado.fin;
          console.log(`🕐 [TEST] Encontrado horario: ${horarioEncontrado.inicioStr}-${horarioEncontrado.finStr}`);
        } else {
          // Buscar el siguiente horario disponible
          const siguienteHorario = horariosEnMinutos.find(horario => 
            horario.inicio > horaActual
          );
          
          if (siguienteHorario) {
            const gap = siguienteHorario.inicio - horaActual;
            console.log(`🕐 [TEST] Gap encontrado: ${convertirMinutosAHora(horaActual)} a ${siguienteHorario.inicioStr} (${gap} minutos)`);
            
            if (gap > GAP_MAXIMO) {
              console.log(`🕐 [TEST] Gap demasiado grande: ${gap} minutos`);
              hayGapSignificativo = true;
              break;
            }
            
            // Avanzar al siguiente horario
            horaActual = siguienteHorario.inicio;
          } else {
            // No hay más horarios disponibles
            break;
          }
        }
      }
      
      if (!hayGapSignificativo && horaActual >= finMinutos) {
        horarioValido = true;
        console.log("🕐 [TEST] Horarios consecutivos válidos (con gaps permitidos)");
      } else {
        console.log("🕐 [TEST] Horarios consecutivos inválidos (gap demasiado grande)");
      }
    } else {
      console.log("🕐 [TEST] Horario fuera del rango de trabajo del día");
    }
  }
  
  console.log("🕐 [TEST] Resultado final:", horarioValido);
  return horarioValido;
};

// Función original que estaba fallando (para comparar)
const validarHorarioTrabajoOriginal = (fecha, horaInicio, horaFin) => {
  console.log("🕐 [TEST ORIGINAL] Validando horario:", { fecha, horaInicio, horaFin });
  
  const inicioMinutos = convertirHoraAMinutos(horaInicio);
  const finMinutos = convertirHoraAMinutos(horaFin);
  
  const horariosEnMinutos = horariosDisponibles.map(horario => ({
    inicio: convertirHoraAMinutos(horario.inicio),
    fin: convertirHoraAMinutos(horario.fin),
    inicioStr: horario.inicio,
    finStr: horario.fin
  }));
  
  let horarioValido = false;
  
  // Verificar si está completamente dentro de un horario
  horarioValido = horariosEnMinutos.some(horario => {
    const dentroDeHorario = inicioMinutos >= horario.inicio && finMinutos <= horario.fin;
    return dentroDeHorario;
  });
  
  // Si no está dentro de un horario, verificar horarios consecutivos
  if (!horarioValido) {
    const horariosNecesarios = [];
    let horaActual = inicioMinutos;
    
    while (horaActual < finMinutos) {
      const horarioEncontrado = horariosEnMinutos.find(horario => 
        horaActual >= horario.inicio && horaActual < horario.fin
      );
      
      if (horarioEncontrado) {
        horariosNecesarios.push(horarioEncontrado);
        horaActual = horarioEncontrado.fin;
      } else {
        break;
      }
    }
    
    if (horaActual >= finMinutos) {
      horarioValido = true;
    }
  }
  
  console.log("🕐 [TEST ORIGINAL] Resultado final:", horarioValido);
  return horarioValido;
};

// Ejecutar tests
console.log("=== TEST DE VALIDACIÓN DE HORARIOS ===");
console.log("Horario a probar: 11:15-16:15");
console.log("");

console.log("--- FUNCIÓN ORIGINAL (que fallaba) ---");
const resultadoOriginal = validarHorarioTrabajoOriginal("2025-08-26", "11:15", "16:15");
console.log("");

console.log("--- FUNCIÓN CORREGIDA ---");
const resultadoCorregido = validarHorarioTrabajoCorregida("2025-08-26", "11:15", "16:15");
console.log("");

console.log("=== RESUMEN ===");
console.log(`Función original: ${resultadoOriginal ? "✅ VÁLIDO" : "❌ INVÁLIDO"}`);
console.log(`Función corregida: ${resultadoCorregido ? "✅ VÁLIDO" : "❌ INVÁLIDO"}`);
console.log("");

if (resultadoCorregido && !resultadoOriginal) {
  console.log("🎉 ¡CORRECCIÓN EXITOSA! El horario 11:15-16:15 ahora es válido.");
} else if (resultadoCorregido && resultadoOriginal) {
  console.log("✅ Ambas funciones funcionan correctamente.");
} else {
  console.log("❌ La corrección no funcionó como se esperaba.");
}
