// src/components/Alerta.jsx
import React from "react";
import { toast } from "react-toastify";

export default function Alerta({ tipo = "info", mensaje }) {
  if (!mensaje) return null;

  React.useEffect(() => {
    switch (tipo) {
      case "success":
        toast.success(mensaje);
        break;
      case "error":
        toast.error(mensaje);
        break;
      case "warning":
        toast.warn(mensaje);
        break;
      default:
        toast.info(mensaje);
    }
  }, [mensaje, tipo]);

  // Este componente no renderiza nada visual, solo dispara la alerta toast
  return null;
}
