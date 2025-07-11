import React from "react";

export default function PeluqueroSelect({ peluqueros, selected, onChange }) {
  return (
    <div>
      <label className="block mb-2 font-semibold">Elige un peluquero:</label>
      <select
        className="w-full p-2 border rounded bg-cyan-800 text-amber-500"
        value={selected || ""}
        onChange={e => onChange(e.target.value)}
      >
        <option value="" disabled>Selecciona un peluquero</option>
        {peluqueros?.map(peluquero => (
          <option key={peluquero.id} value={peluquero.id}>
            {peluquero.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
