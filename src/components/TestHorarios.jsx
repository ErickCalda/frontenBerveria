import React, { useState } from 'react';
import { generarHorariosDisponibles, probarHorarios } from '../utils/ausenciaUtils';

const TestHorarios = () => {
  const [fecha, setFecha] = useState('');
  const [resultado, setResultado] = useState(null);

  const probarFecha = () => {
    if (!fecha) return;
    
    console.log('🧪 Probando fecha:', fecha);
    const resultado = probarHorarios(fecha);
    setResultado(resultado);
  };

  const fechasPrueba = [
    { fecha: '2024-01-15', nombre: 'Lunes' },
    { fecha: '2024-01-16', nombre: 'Martes' },
    { fecha: '2024-01-17', nombre: 'Miércoles' },
    { fecha: '2024-01-18', nombre: 'Jueves' },
    { fecha: '2024-01-19', nombre: 'Viernes' },
    { fecha: '2024-01-20', nombre: 'Sábado' },
    { fecha: '2024-01-21', nombre: 'Domingo' },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">🧪 Prueba de Horarios</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Fecha a probar:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border rounded px-3 py-2 mr-2"
        />
        <button
          onClick={probarFecha}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Probar
        </button>
      </div>

      {resultado && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">
            Resultado para {resultado.nombreDia} ({resultado.fecha})
          </h3>
          <p>Día de la semana: {resultado.diaSemana}</p>
          <p>Total de horarios: {resultado.total}</p>
          {resultado.horarios.length > 0 && (
            <>
              <p>Primer horario: {resultado.horarios[0].inicio} - {resultado.horarios[0].fin}</p>
              <p>Último horario: {resultado.horarios[resultado.horarios.length - 1].inicio} - {resultado.horarios[resultado.horarios.length - 1].fin}</p>
            </>
          )}
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-2">Pruebas rápidas:</h3>
        <div className="grid grid-cols-2 gap-2">
          {fechasPrueba.map(({ fecha, nombre }) => (
            <button
              key={fecha}
              onClick={() => {
                setFecha(fecha);
                setTimeout(() => probarFecha(), 100);
              }}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
            >
              {nombre}
            </button>
          ))}
        </div>
      </div>

      {resultado && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Todos los horarios:</h3>
          <div className="grid grid-cols-3 gap-1 text-sm">
            {resultado.horarios.map((horario, index) => (
              <div key={index} className="bg-blue-100 p-1 rounded text-center">
                {horario.inicio} - {horario.fin}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestHorarios; 