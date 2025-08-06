# Utilidad de Ausencias - Frontend

Esta utilidad maneja la lógica de ausencias de empleados en el frontend, incluyendo la generación de horarios disponibles, validaciones y formateo de fechas/horas.

## Características Principales

- **Generación de horarios disponibles** basándose en los horarios de trabajo
- **Rangos de ausencias flexibles** que permiten seleccionar desde 30 minutos hasta 3 horas
- **Validación de horarios** para asegurar que las ausencias estén dentro del horario laboral
- **Formateo de fechas y horas** con zona horaria local (America/Guayaquil)
- **Filtrado de horarios** excluyendo ausencias existentes
- **Validación de conflictos** con reservas existentes

## Horarios de Trabajo

### Lunes a Sábado
- **09:15 - 12:45** (mañana)
- **14:15 - 18:45** (tarde)

### Domingo
- **09:30 - 14:00** (solo mañana)

## Rangos de Ausencias Flexibles

El sistema ahora permite seleccionar rangos de ausencias más amplios:

### Duración de Ausencias Disponibles
- **30 minutos** (rango mínimo)
- **1 hora** (60 minutos)
- **1.5 horas** (90 minutos)
- **2 horas** (120 minutos)
- **3 horas** (180 minutos)

### Ejemplos de Rangos
- **Mañana**: 09:15 - 10:15 (1 hora)
- **Tarde**: 14:15 - 16:15 (2 horas)
- **Completo**: 09:15 - 12:15 (3 horas)

**Nota**: Todos los rangos respetan los horarios laborales y no pueden extenderse más allá de las horas de trabajo.

## Funciones Disponibles

### `generarHorariosDisponibles(fecha)`
Genera los horarios disponibles para un día específico.

```javascript
import { generarHorariosDisponibles } from './ausenciaUtils';

const fecha = new Date('2024-01-15'); // Lunes
const horarios = generarHorariosDisponibles(fecha);
// Retorna array con horarios de 09:15 a 18:45
```

### `generarOpcionesHorarios(fecha)`
Genera opciones para un selector de horarios.

```javascript
import { generarOpcionesHorarios } from './ausenciaUtils';

const opciones = generarOpcionesHorarios('2024-01-15');
// Retorna array con objetos {id, value, label, inicio, fin}
```

### `generarOpcionesHorariosAmplios(fecha, duracionMinutos)`
Genera opciones de horarios con rangos más amplios para ausencias.

```javascript
import { generarOpcionesHorariosAmplios } from './ausenciaUtils';

const opciones = generarOpcionesHorariosAmplios('2024-01-15', 30);
// Retorna array con rangos de 30min, 1h, 1.5h, 2h, 3h
// Ejemplo: "09:15 - 10:15 (60 min)", "14:15 - 16:15 (120 min)"
```

### `convertirHorarioADate(fecha, hora)`
Convierte un horario a objeto Date para una fecha específica.

```javascript
import { convertirHorarioADate } from './ausenciaUtils';

const fecha = '2024-01-15';
const hora = '14:30';
const fechaHora = convertirHorarioADate(fecha, hora);
// Retorna objeto Date con fecha y hora combinadas
```

### `convertirHoraAMinutos(hora)`
Convierte hora en formato HH:MM a minutos totales.

```javascript
import { convertirHoraAMinutos } from './ausenciaUtils';

const minutos = convertirHoraAMinutos('14:30');
// Retorna 870 (14*60 + 30)
```

### `convertirMinutosAHora(minutos)`
Convierte minutos totales a formato HH:MM.

```javascript
import { convertirMinutosAHora } from './ausenciaUtils';

const hora = convertirMinutosAHora(870);
// Retorna "14:30"
```

### `extraerHoraDeFecha(fechaHora)`
Extrae la hora de una fecha datetime.

```javascript
import { extraerHoraDeFecha } from './ausenciaUtils';

const fechaHora = '2024-01-15T14:30:00';
const hora = extraerHoraDeFecha(fechaHora);
// Retorna "14:30"
```

### `formatearFechaHora(fechaHora, formato)`
Formatea una fecha y hora para mostrar en la interfaz.

```javascript
import { formatearFechaHora } from './ausenciaUtils';

const fechaHora = '2024-01-15T14:30:00';

// Formato corto
formatearFechaHora(fechaHora, 'corta'); // "15/01/2024, 14:30"

// Formato largo
formatearFechaHora(fechaHora, 'larga'); // "lunes, 15 de enero de 2024, 14:30"

// Solo hora
formatearFechaHora(fechaHora, 'solo_hora'); // "14:30"
```

### `validarHorarioTrabajo(fecha, horaInicio, horaFin)`
Valida si un horario está dentro de los horarios de trabajo.

```javascript
import { validarHorarioTrabajo } from './ausenciaUtils';

const esValido = validarHorarioTrabajo('2024-01-15', '14:15', '14:45');
// Retorna true si el horario es válido
```

### `filtrarHorariosDisponibles(fecha, ausenciasExistentes, empleadoId)`
Filtra horarios disponibles excluyendo los que ya están ocupados por ausencias.

```javascript
import { filtrarHorariosDisponibles } from './ausenciaUtils';

const horariosDisponibles = filtrarHorariosDisponibles(
  '2024-01-15', 
  ausenciasExistentes, 
  empleadoId
);
// Retorna horarios disponibles excluyendo ausencias
```

### `validarConflictosReservas(fecha, horaInicio, horaFin, reservasExistentes, empleadoId)`
Valida que una ausencia no se superponga con reservas existentes.

```javascript
import { validarConflictosReservas } from './ausenciaUtils';

const sinConflictos = validarConflictosReservas(
  '2024-01-15',
  '14:15',
  '14:45',
  reservasExistentes,
  empleadoId
);
// Retorna true si no hay conflictos
```

### `obtenerFechaActual()`
Obtiene la fecha actual en formato YYYY-MM-DD.

```javascript
import { obtenerFechaActual } from './ausenciaUtils';

const fechaActual = obtenerFechaActual(); // "2024-01-15"
```

### `convertirUTCALocal(fechaUTC)`
Convierte una fecha UTC a hora local.

```javascript
import { convertirUTCALocal } from './ausenciaUtils';

const fechaLocal = convertirUTCALocal('2024-01-15T19:30:00Z');
// Retorna fecha ajustada a UTC-5
```

### `convertirLocalAUTC(fecha, horaLocal)`
Convierte una hora local a UTC para guardar en la base de datos.

```javascript
import { convertirLocalAUTC } from './ausenciaUtils';

const fecha = '2024-01-15';
const horaLocal = '17:15';
const fechaUTC = convertirLocalAUTC(fecha, horaLocal);
// Retorna "2024-01-15 22:15:00" (5 horas menos para compensar zona horaria)
```

### `formatearRangoFechas(fechaInicio, fechaFin)`
Formatea un rango de fechas para mostrar.

```javascript
import { formatearRangoFechas } from './ausenciaUtils';

const rango = formatearRangoFechas(
  '2024-01-15T14:15:00',
  '2024-01-15T14:45:00'
);
// "15/01/2024, 14:15 - 15/01/2024, 14:45"
```

## Uso en Componentes React

### Ejemplo de Componente de Selección de Ausencias

```javascript
import React, { useState, useEffect } from 'react';
import { 
  generarOpcionesHorarios, 
  validarHorarioTrabajo 
} from './ausenciaUtils';

const SeleccionarAusencia = () => {
  const [fecha, setFecha] = useState('');
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('');
  const [opcionesHorarios, setOpcionesHorarios] = useState([]);

  useEffect(() => {
    if (fecha) {
      const opciones = generarOpcionesHorarios(fecha);
      setOpcionesHorarios(opciones);
    }
  }, [fecha]);

  const handleSubmit = () => {
    if (!fecha || !horarioSeleccionado) {
      alert('Por favor selecciona fecha y horario');
      return;
    }

    const [horaInicio, horaFin] = horarioSeleccionado.split('-');
    
    if (!validarHorarioTrabajo(fecha, horaInicio, horaFin)) {
      alert('El horario seleccionado no es válido');
      return;
    }

    // Proceder con el envío
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />
      
      <select
        value={horarioSeleccionado}
        onChange={(e) => setHorarioSeleccionado(e.target.value)}
      >
        <option value="">Seleccionar horario</option>
        {opcionesHorarios.map((opcion) => (
          <option key={opcion.id} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
      
      <button type="submit">Crear Ausencia</button>
    </form>
  );
};
```

## Configuración de Zona Horaria

La utilidad está configurada para usar la zona horaria `America/Guayaquil` (UTC-5). Todas las fechas y horas se ajustan automáticamente a esta zona horaria.

## Validaciones

### Horarios de Trabajo
- Solo se permiten ausencias dentro de los horarios de trabajo definidos
- Los horarios varían entre domingo y días de semana

### Conflictos con Reservas
- Se valida que las ausencias no se superpongan con reservas existentes
- Se consideran las reservas del empleado específico

### Ausencias Existentes
- Se filtran los horarios ya ocupados por ausencias aprobadas
- Se puede filtrar por empleado específico

## Archivos Relacionados

- `ausenciaUtils.js` - Utilidad principal
- `ausenciaUtilsExample.js` - Ejemplos de uso
- `actualizarAusencia.jsx` - Componente actualizado para usar la utilidad
- `obtenerTodasLasAusencias.jsx` - Componente actualizado para mostrar información formateada

## Integración con Backend

La utilidad está diseñada para trabajar con los datos del backend que incluyen:
- `fecha_inicio` y `fecha_fin` (fechas de ausencia en formato datetime)
- `empleado_id` (identificador del empleado)
- `aprobada` (estado de aprobación)

### Manejo de Zona Horaria

El sistema maneja automáticamente la conversión de zona horaria:
- **Frontend**: Muestra horas en zona local (America/Guayaquil UTC-5)
- **Base de datos**: Almacena horas en UTC (5 horas menos que la hora local)
- **Conversión automática**: Al guardar, se resta 5 horas; al mostrar, se suman 5 horas

**Ejemplo:**
- Usuario selecciona: 17:15 - 17:45
- Se guarda en BD: 22:15 - 22:45 (UTC)
- Se muestra al usuario: 17:15 - 17:45 (hora local)

## Notas Importantes

1. **Zona Horaria**: Todas las fechas se manejan en UTC-5 (America/Guayaquil)
2. **Validaciones**: Las validaciones se realizan tanto en frontend como en backend
3. **Horarios**: Los horarios están hardcodeados según los requerimientos del negocio
4. **Conflictos**: Se valida automáticamente la superposición con reservas existentes 