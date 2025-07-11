import React from "react";

export default function ServicioSelect({ servicios, selected, onChange }) {
  return (
    <div>
      <label className="block mb-2 font-semibold">Elige el tipo de servicio:</label>
      <select
        className="w-full p-2 border rounded bg-cyan-800 text-amber-500"
        value={selected || ""}
        onChange={e => onChange(e.target.value)}
      >
        <option value="" disabled>Selecciona un servicio</option>
        {servicios?.map(servicio => (
          <option key={servicio.id} value={servicio.id}>
            {servicio.nombre} - ${servicio.costo.toFixed(2)}
          </option>
        ))}
      </select>
    </div>
  );
}

