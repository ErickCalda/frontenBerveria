import React, { useRef } from "react";

export default function ReservaModal({ visible, onClose, onSubmit }) {
  const fileInput = useRef();

  const handleSubmit = () => {
    const file = fileInput.current?.files?.[0];
    if (file) onSubmit(file);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg w-full max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Subir baucher de reserva</h2>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="mb-4 w-full p-2 bg-[#2a2a2a] text-white"
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
