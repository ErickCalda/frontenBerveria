import React from "react";

export default function ReservaHistorial({ reservas, peluqueros, servicios, onEditarReserva }) {
  const getPeluqueroNombre = id => peluqueros.find(p => p.id === id)?.nombre || "Desconocido";
  const getServicio = id => servicios.find(s => s.id === id) || { nombre: "Desconocido", costo: 0 };

  return (
    <section className="mt-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">Historial de Reservas</h2>
      {reservas.length === 0 && <p className="text-white">No hay reservas.</p>}
      <ul className="space-y-4">
        {reservas.map(reserva => {
          const servicio = getServicio(reserva.servicioId);
          return (
            <li
              key={reserva.id}
              className="flex items-center gap-4 bg-gray-800 p-4 rounded shadow"
            >
              <div className="flex-shrink-0 w-24 h-24 cursor-pointer">
                {reserva.voucherUrl ? (
                  <img
                    src={reserva.voucherUrl}
                    alt="Voucher"
                    className="w-full h-full object-contain rounded"
                    onClick={() => window.open(reserva.voucherUrl, "_blank")}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-600 rounded text-white">
                    Sin voucher
                  </div>
                )}
              </div>

              <div className="flex-grow text-white">
                <p><strong>Peluquero:</strong> {getPeluqueroNombre(reserva.peluqueroId)}</p>
                <p><strong>Servicio:</strong> {servicio.nombre} - ${servicio.costo.toFixed(2)}</p>
                <p><strong>Fecha:</strong> {reserva.fecha}</p>
                <p><strong>Hora:</strong> {reserva.hora}</p>
                <p><strong>Total pagado:</strong> ${reserva.totalPagar.toFixed(2)}</p>
                <p><strong>Estado:</strong> {reserva.estado}</p>
              </div>

              <button
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                onClick={() => onEditarReserva(reserva)}
              >
                Reagendar
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
