import React, { useState } from "react";
import { Info } from "lucide-react";

export default function FormularioReservacion({
  servicios,
  empleados,
  horarios,
  horariosOcupados = [], // <-- Recibe horarios ocupados como array de strings "HH:mm-HH:mm"
  setHorarios,
  errores,
  formServicioId,
  setFormServicioId,
  formEmpleadoId,
  setFormEmpleadoId,
  formFecha,
  setFormFecha,
  formHorario,
  setFormHorario,
  handleSubmit,
  setError,
  clearError,
}) {
  // Orden personalizado de categorías
  const ordenCategorias = ["Adultos", "Niños", "Barba", "Cejas"];

  // Extraer categorías únicas y ordenar según ordenCategorias
  const categoriasUnicas = [...new Set(servicios.map(s => s.categoria_nombre.trim()))].sort(
    (a, b) => {
      const indexA = ordenCategorias.indexOf(a);
      const indexB = ordenCategorias.indexOf(b);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    }
  );

  // Añadimos "Todos" al inicio para mostrar todos sin filtro
  const categorias = ["Todos", ...categoriasUnicas];

  // Estado para la categoría seleccionada
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");

  // Normaliza para evitar problemas con mayúsculas, tildes y espacios
  const normalizar = (str) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Filtra servicios según categoría seleccionada
  const serviciosFiltrados =
    categoriaSeleccionada === "Todos"
      ? servicios
      : servicios.filter(
          (s) => normalizar(s.categoria_nombre.trim()) === normalizar(categoriaSeleccionada)
        );

  // Función para obtener días del mes
  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date).getDate());
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const weekdays = ["L", "M", "X", "J", "V", "S", "D"];
  const offset = (firstDayOfMonth + 6) % 7;

  // Manejadores para seleccionar fecha, empleado y servicio
  const handleDateSelection = (day) => {
    const isoDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setFormFecha(isoDate);
    setFormHorario("");
    setHorarios([]);
  };

  const selectEmpleado = (id) => {
    setFormEmpleadoId(id.toString());
    setFormHorario("");
    setHorarios([]);
  };

  const selectServicio = (id) => {
    setFormServicioId(id.toString());
    setFormHorario("");
    setHorarios([]);
  };

  // Para deshabilitar días pasados
  function isPastDay(day) {
    const today = new Date();
    const dateToCheck = new Date(currentYear, currentMonth, day);

    // Comparar sin horas
    dateToCheck.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return dateToCheck < today;
  }

  // Filtrar horarios para excluir los ocupados
  const horariosDisponibles = horarios.filter(h => {
    const rango = `${h.inicio}-${h.fin}`;
    return !horariosOcupados.includes(rango);
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-r bg-[#1C1C1C] text-white py-8 ">
      <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-screen-2xl mx-auto ">
        {/* SERVICIOS */}
        <div className=" w-full bg-[#1C1C1C] ">
          <div className="bg-[#1C1C1C] rounded-xl shadow-xl p-0 w-full">
            <h3 className="text-white text-xl mb-3 border-b border-zinc-600 pb-2">Servicios</h3>

            {/* Botones filtro categorías */}
            <div className="flex gap-3 mb-4 flex-wrap">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaSeleccionada(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition
                    ${
                      categoriaSeleccionada === cat
                        ? "bg-yellow-400 text-black"
                        : "bg-zinc-700 text-white hover:bg-yellow-500 hover:text-black"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Servicios filtrados */}
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 max-h-80 overflow-y-auto scrollbar-thin">
              {serviciosFiltrados.map((s) => (
                <button
                  key={s.id}
                  onClick={() => selectServicio(s.id)}
                  className={`relative p-4 rounded-lg border text-left transition text-base ${
                    formServicioId === s.id.toString()
                      ? "border-yellow-400 bg-yellow-100/10 text-yellow-300"
                      : "border-zinc-700 hover:border-yellow-500 text-white"
                  }`}
                >
                  <div className="font-bold text-white mb-1">{s.nombre}</div>
                  <div className="text-zinc-400 text-sm">{s.categoria_nombre}</div>
                  <div className="text-zinc-400 text-sm">
                    Tiempo: <span className="text-amber-400" style={{ fontSize: "13px" }}>30min</span>
                  </div>
                  <div className="mt-1 font-semibold text-yellow-300 text-lg">${s.precio}</div>
                </button>
              ))}
            </div>
          </div>

          {/* FECHA */}
          <div className="bg-zinc-800 rounded-xl p-6 shadow-xl w-full">
            <h3 className="text-white text-xl mb-4 border-b border-zinc-600 pb-2">Fecha</h3>
            <div className="grid grid-cols-7 text-base text-zinc-400 font-medium text-center mb-2">
              {weekdays.map((d, idx) => (
                <div key={idx}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array(offset).fill(null).map((_, i) => <div key={"empty-" + i}></div>)}
              {daysInCurrentMonth.map((day) => {
                const date = new Date(currentYear, currentMonth, day);
                const localISO = date.toLocaleDateString("sv-SE");
                const selected = formFecha === localISO;
                const past = isPastDay(day);

                return (
                  <button
                    key={day}
                    onClick={() => !past && handleDateSelection(day)}
                    disabled={past}
                    className={`w-12 h-12 rounded-full font-semibold text-base transition flex items-center justify-center
                      ${selected ? "bg-yellow-400 text-black shadow" : ""}
                      ${!selected && !past ? "hover:bg-zinc-700 text-white" : ""}
                      ${past ? "text-zinc-500 cursor-not-allowed" : ""}
                      ${day === today.getDate() && !past ? "border border-yellow-400" : ""}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            {errores.fecha && (
              <div className="mt-3 bg-red-100 border border-red-400 text-red-700 rounded-md px-3 py-2 text-base font-medium">
                {errores.fecha}
              </div>
            )}
          </div>
        </div>

        {/* BARBEROS Y HORARIOS */}
        <div className="space-y-6 w-full">
          <div className="bg-zinc-800 rounded-xl shadow-xl p-6 w-full">
            <h3 className="text-white text-xl mb-3 border-b border-zinc-600 pb-2">Barberos</h3>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
              <div className="flex gap-x-4 pb-2">
                {empleados.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => selectEmpleado(e.id)}
                    className={`min-w-[150px] bg-zinc-900 p-3 rounded-lg text-center border transition text-sm flex-shrink-0 ${
                      formEmpleadoId === e.id.toString()
                        ? "border-yellow-400 shadow-md"
                        : "border-zinc-700 hover:border-yellow-400"
                    }`}
                  >
                    <div className="w-14 h-14 mx-auto rounded-full bg-zinc-700 mb-2">
                      <img className="rounded-full" src={e.foto_perfil} alt="" />
                    </div>
                    <h4 className="font-semibold text-white truncate">{e.nombre}</h4>
                    <p className="text-xs text-zinc-400">{e.titulo}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 rounded-xl shadow-xl p-6 w-full">
            <h3 className="text-white text-xl mb-3 border-b border-zinc-600 pb-2">Horarios Disponibles</h3>
            <div className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }}>
              {horariosDisponibles.length > 0 ? (
                horariosDisponibles.map((h, idx) => {
                  const selected = formHorario === `${h.inicio}-${h.fin}`;
                  return (
                    <button
                      key={idx}
                      onClick={() => setFormHorario(`${h.inicio}-${h.fin}`)}
                      className={`
                        px-6 py-3 rounded-lg font-semibold text-base
                        transition duration-300 ease-in-out
                        border border-transparent shadow-sm
                        ${
                          selected
                            ? "bg-yellow-400 text-black shadow-lg border-yellow-300"
                            : "bg-white text-zinc-800 hover:bg-yellow-100 hover:shadow-md"
                        }
                        hover:-translate-y-0.5 active:translate-y-0
                        focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50
                      `}
                    >
                      {h.inicio} - {h.fin}
                    </button>
                  );
                })
              ) : (
                <p className="text-zinc-400 text-center col-span-2">No hay horarios disponibles.</p>
              )}
            </div>
            {errores.horarios && (
              <div className="mt-3 bg-red-100 border border-red-400 text-red-700 rounded-md px-3 py-2 text-base font-medium">
                {errores.horarios}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información pago y botón confirmar */}
      <div className="mt-6 text-center border-t border-zinc-600 pt-4">
        <div className="w-full text-center">
          <p className="inline-flex items-start justify-center gap-2 text-base text-amber-400 max-w-3xl mx-auto">
            <Info className="w-5 h-5 mt-1 text-yellow-400 flex-shrink-0" />
            Para que tu cita sea aprobada, debes notificar que ya realizaste el pago. Puedes hacerlo a través de WhatsApp.
          </p>
        </div>

        <a
          href="https://wa.me/593982945646?text=Hola,%20quiero%20realizar%20la%20verificaci%C3%B3n%20de%20mi%20pago%20y%20activar%20mi%20cita.%20Muchas%20gracias."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 px-6 py-3 text-black font-semibold shadow-lg text-base"
          style={{ borderRadius: "5px" }}
        >
          Notificar pago por WhatsApp
        </a>
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 px-12 py-4 text-black font-bold shadow-2xl text-xl"
          style={{ borderRadius: "5px" }}
        >
          Confirmar Cita
        </button>
      </div>

      {/* Mostrar errores generales */}
      {Object.entries(errores).map(
        ([key, errorMsg]) =>
          errorMsg && key !== "fecha" && (
            <div
              key={key}
              className="mt-6 bg-red-100 border border-red-400 text-red-700 rounded-md px-4 py-3 font-medium text-base max-w-3xl mx-auto"
            >
              {errorMsg}
            </div>
          )
      )}
    </div>
  );
}
