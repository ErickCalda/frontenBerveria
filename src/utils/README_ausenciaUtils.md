# Utilidades de Ausencias - Documentación

## Resumen de Cambios

Se han implementado mejoras significativas en el sistema de ausencias para permitir mayor flexibilidad:

### ✅ Problemas Resueltos

1. **Ausencias por períodos largos**: Ahora se pueden crear ausencias por días, semanas o meses completos
2. **Flexibilidad de horarios**: No es obligatorio definir horarios específicos para ausencias largas
3. **Validación inteligente**: El sistema detecta automáticamente el tipo de ausencia y valida según corresponda
4. **Mejor UX**: Interfaz más clara con opciones para diferentes tipos de ausencias

## Nuevas Funciones

### `esAusenciaPeriodoLargo(fechaInicio, fechaFin, horaInicio, horaFin)`
Detecta si una ausencia es por período largo (días completos) o por horas específicas.

**Parámetros:**
- `fechaInicio`: Fecha de inicio (YYYY-MM-DD)
- `fechaFin`: Fecha de fin (YYYY-MM-DD)
- `horaInicio`: Hora de inicio (HH:MM) - opcional
- `horaFin`: Hora de fin (HH:MM) - opcional

**Retorna:** `boolean` - true si es período largo

**Ejemplos:**
```javascript
// Ausencia por horas específicas
esAusenciaPeriodoLargo('2024-01-15', '2024-01-15', '14:15', '14:45') // false

// Ausencia por período
esAusenciaPeriodoLargo('2024-01-15', '2024-01-20') // true

// Ausencia por día completo
esAusenciaPeriodoLargo('2024-01-15', '2024-01-15', '00:00', '23:59') // true
```

### `validarAusencia(fechaInicio, fechaFin, horaInicio, horaFin)`
Valida una ausencia considerando su tipo (período largo o horas específicas).

**Parámetros:**
- `fechaInicio`: Fecha de inicio (YYYY-MM-DD)
- `fechaFin`: Fecha de fin (YYYY-MM-DD)
- `horaInicio`: Hora de inicio (HH:MM) - opcional
- `horaFin`: Hora de fin (HH:MM) - opcional

**Retorna:** `boolean` - true si la ausencia es válida

**Validaciones:**
- **Período largo**: Valida que las fechas sean válidas y que fecha fin ≥ fecha inicio
- **Horas específicas**: Valida que el horario esté dentro de los horarios de trabajo

### `convertirAusenciaAUTC(fechaInicio, fechaFin, horaInicio, horaFin)`
Convierte una ausencia a formato UTC para guardar en la base de datos.

**Parámetros:**
- `fechaInicio`: Fecha de inicio (YYYY-MM-DD)
- `fechaFin`: Fecha de fin (YYYY-MM-DD)
- `horaInicio`: Hora de inicio (HH:MM) - opcional
- `horaFin`: Hora de fin (HH:MM) - opcional

**Retorna:** `Object` con `fecha_inicio` y `fecha_fin` en UTC

**Comportamiento:**
- **Período largo**: Usa 00:00:00 para inicio y 23:59:59 para fin
- **Horas específicas**: Convierte usando las funciones de zona horaria existentes

### `formatearAusencia(ausencia)`
Formatea una ausencia para mostrar en la interfaz de usuario.

**Parámetros:**
- `ausencia`: Objeto de ausencia con `fecha_inicio` y `fecha_fin`

**Retorna:** `string` - Texto formateado de la ausencia

**Ejemplos:**
```javascript
// Ausencia por horas
formatearAusencia({
  fecha_inicio: '2024-01-15T22:15:00',
  fecha_fin: '2024-01-15T22:45:00'
})
// Resultado: "15/01/2024, 17:15 - 17:15 a 17:45"

// Ausencia por período
formatearAusencia({
  fecha_inicio: '2024-01-15T00:00:00',
  fecha_fin: '2024-01-20T23:59:59'
})
// Resultado: "15/01/2024, 00:00 - 20/01/2024, 23:59"
```

## Tipos de Ausencias

### 1. Ausencia por Horas Específicas
- **Uso**: Para ausencias cortas dentro del horario de trabajo
- **Ejemplo**: Ausentarse de 14:15 a 14:45
- **Validación**: Debe estar dentro de los horarios de trabajo predefinidos
- **Almacenamiento**: Convierte horas locales a UTC

### 2. Ausencia por Período Largo
- **Uso**: Para ausencias por días, semanas o meses completos
- **Ejemplo**: Vacaciones, licencias médicas, ausencias personales
- **Validación**: Solo valida que las fechas sean válidas y coherentes
- **Almacenamiento**: Usa 00:00:00 para inicio y 23:59:59 para fin

## Componentes Actualizados

### `actualizarAusencia.jsx`
- ✅ Selector de tipo de ausencia (horas/período)
- ✅ Campos condicionales según el tipo
- ✅ Validación inteligente
- ✅ Conversión automática a UTC

### `obtenerTodasLasAusencias.jsx`
- ✅ Mejor visualización de períodos
- ✅ Botón de edición separado
- ✅ Formateo automático de ausencias

## Ejemplos de Uso

### Crear Ausencia por Horas
```javascript
const ausenciaHoras = {
  fechaInicio: '2024-01-15',
  fechaFin: '2024-01-15',
  horaInicio: '17:15',
  horaFin: '17:45',
  motivo: 'Cita médica'
};

// Validar
const esValida = validarAusencia(
  ausenciaHoras.fechaInicio,
  ausenciaHoras.fechaFin,
  ausenciaHoras.horaInicio,
  ausenciaHoras.horaFin
);

// Convertir a UTC
const fechasUTC = convertirAusenciaAUTC(
  ausenciaHoras.fechaInicio,
  ausenciaHoras.fechaFin,
  ausenciaHoras.horaInicio,
  ausenciaHoras.horaFin
);
```

### Crear Ausencia por Período
```javascript
const ausenciaPeriodo = {
  fechaInicio: '2024-01-15',
  fechaFin: '2024-01-20',
  motivo: 'Vacaciones'
};

// Validar
const esValida = validarAusencia(
  ausenciaPeriodo.fechaInicio,
  ausenciaPeriodo.fechaFin
);

// Convertir a UTC
const fechasUTC = convertirAusenciaAUTC(
  ausenciaPeriodo.fechaInicio,
  ausenciaPeriodo.fechaFin
);
```

## Consideraciones Técnicas

### Zona Horaria
- El sistema maneja automáticamente la conversión UTC-5 (Guayaquil)
- Las fechas se almacenan en UTC en la base de datos
- Se muestran en hora local en la interfaz

### Validaciones
- **Períodos largos**: No requieren validación de horarios de trabajo
- **Horas específicas**: Deben estar dentro de los horarios predefinidos
- **Fechas**: Siempre se valida que fecha fin ≥ fecha inicio

### Base de Datos
- Las ausencias por período se almacenan con 00:00:00 y 23:59:59
- Las ausencias por horas se almacenan con las horas convertidas a UTC
- El campo `motivo` es opcional pero recomendado

## Próximas Mejoras

1. **Notificaciones**: Integrar con el sistema de notificaciones push
2. **Calendario**: Mostrar ausencias en un calendario visual
3. **Reportes**: Generar reportes de ausencias por empleado/período
4. **Aprobación**: Sistema de aprobación de ausencias por supervisores 