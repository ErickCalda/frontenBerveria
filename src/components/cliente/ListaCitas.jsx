import React, { useState } from "react";

export default function ListaCitas({ citas, errores, cancelarCitaCliente, formatearFecha }) {
  const [mostrarPasadas, setMostrarPasadas] = useState(false);

  const estadoStyles = {
    Pendiente: "bg-[#FFA000] text-white",
    Confirmada: "bg-green-500 text-white",
    "En proceso": "bg-blue-500 text-white",
    Completada: "bg-lime-500 text-white",
    Cancelada: "bg-red-500 text-white",
    "No asistió": "bg-gray-500 text-white",
  };

  const upcomingStates = ["Pendiente", "Confirmada", "En proceso"];
  const pastStates = ["Completada", "Cancelada", "No asistió"];


  const now = new Date();
  const proximas = citas.filter(c =>
    upcomingStates.includes(c.estado_nombre) && new Date(c.fecha_hora_inicio) >= now
  );
  const pasadas = citas.filter(c =>
    pastStates.includes(c.estado_nombre) || new Date(c.fecha_hora_inicio) < now
  );

  const groupByEstado = (list, states) => {
    const grouped = {};
    states.forEach(e => grouped[e] = []);
    list.forEach(c => {
      if (grouped[c.estado_nombre]) grouped[c.estado_nombre].push(c);
    });
    return grouped;
  };

  const proximasPorEstado = groupByEstado(proximas, upcomingStates);
  const pasadasPorEstado = groupByEstado(pasadas, pastStates);

  const renderGroup = (grouped, states) => (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {states.map(estado => (
        <div key={estado} className="flex flex-col max-h-[75vh] overflow-y-auto bg-[#1F1F1F] rounded-lg ">
          <h2 className="text-white text-lg font-semibold mb-4 sticky top-0 bg-[#1F1F1F] z-10">{estado}</h2>
          {grouped[estado].length > 0 ? (
            <ul className="space-y-4">
              {grouped[estado].map(c => (
                <li key={c.id} className="bg-[#1A1A1A] border border-[#E0E0E0]/10 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Detalles */}
                  <div className="flex-1 w-full">
                    <h3 className="text-white text-lg font-bold mb-1 break-words">
                      {Array.isArray(c.servicios) ? c.servicios.join(', ') : c.servicios}
                    </h3>
                    <div className="flex items-center text-sm text-white mb-1">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatearFecha(c.fecha_hora_inicio)}
                    </div>
                    <div className="flex items-center text-sm text-white">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Barbero: {c.empleado_nombre}
                    </div>
                  </div>

                  {/* Estado y Cancelar al extremo derecho */}
                  <div className="flex flex-col items-end justify-center w-full lg:w-auto gap-2">
                    <div className={`w-full lg:w-auto flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-md ${estadoStyles[c.estado_nombre]}`}>
                      <span className="w-2 h-2 mr-2 rounded-full bg-white opacity-80"></span>
                      {c.estado_nombre}
                    </div>
             

                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No hay citas en este estado.</p>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <section
      className="min-h-screen  sm:px-6 lg:px-12 py-10"
      style={{
        backgroundImage: `url('/fondo-barberia-bokeh.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="w-full max-w-7xl mx-auto bg-[#202020] rounded-2xl p-6">
        <header className="text-center mb-6">
          <h1 className="font-oswald text-white text-3xl sm:text-4xl font-bold">Mis Citas</h1>
          <p className="text-gray-400">Administra tus reservas</p>
        </header>

        <div className="flex justify-center gap-6 mb-6">
          <button
            className={`text-white font-semibold ${!mostrarPasadas ? 'border-b-2 border-white' : 'text-gray-400'}`}
            onClick={() => setMostrarPasadas(false)}
          >
            Próximas
          </button>
          <button
            className={`text-white font-semibold ${mostrarPasadas ? 'border-b-2 border-white' : 'text-gray-400'}`}
            onClick={() => setMostrarPasadas(true)}
          >
            Pasadas
          </button>
        </div>

        {errores.citas ? (
          <div className="bg-red-100 text-red-700 border border-red-400 rounded-md px-6 py-4 text-center font-medium">
            {errores.citas}
          </div>
        ) : (
          mostrarPasadas ? renderGroup(pasadasPorEstado, pastStates) : renderGroup(proximasPorEstado, upcomingStates)
        )}
      </div>
    </section>
  );
}
