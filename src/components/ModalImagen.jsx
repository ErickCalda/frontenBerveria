import React from "react";

export default function ModalImagen({ url, onClose }) {
  if (!url) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <img src={url} alt="Imagen grande" className="max-w-full max-h-full" />
    </div>
  );
}
