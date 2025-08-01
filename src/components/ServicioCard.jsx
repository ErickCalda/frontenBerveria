export default function ServicioCard({ servicio, onReservar }) {
  return (
    <div
      className="
        w-72 sm:w-80 md:w-96
        flex flex-col items-center gap-4
        bg-[#2a2a2a] rounded-lg p-4 shadow-lg flex-shrink-0
      "
    >
      {servicio.imagen ? (
        <img
          src={servicio.imagen}
          alt={servicio.nombre}
          className="w-full h-48 object-cover rounded-md shadow-md"
        />
      ) : (
        <div className="w-full h-48 bg-gray-700 flex items-center justify-center rounded-md text-gray-300">
          Imagen no disponible
        </div>
      )}

      <div className="flex flex-col gap-2 text-[#f1f1f1] px-2">
     

        <h3 className="text-xl font-bold text-[#ffcc66] text-center">
          {servicio.nombre}
        </h3>

        {servicio.descripcion && (
          <p className="text-sm text-center">{servicio.descripcion}</p>
        )}

        <p className="text-xs text-gray-400 text-center">
          Duración: {servicio.duracion} minutos
        </p>

        <p className="text-md font-semibold text-[#ffcc66] text-center">
          Precio: ${servicio.precio}
        </p>

        <button
          onClick={onReservar}
          className="mt-2 px-4 py-2 rounded-md font-semibold transition-transform hover:scale-105 bg-yellow-400 text-black shadow-md"
        >
          Reservar ahora
        </button>
      </div>
    </div>
  );
}
