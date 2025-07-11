import React, { useEffect, useState } from "react";
import { getMisCitas, cancelarCita } from "../../service/reservacionService";
import Alerta from "../../components/alertas/Alerta";
import ListaCitas from "../../components/cliente/ListaCitas";

function MisCitas() {
  const [citas, setCitas] = useState([]);
  const [errores, setErrores] = useState({ citas: null });
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState("info");

  const setError = (campo, mensaje) => {
    setErrores((prev) => ({ ...prev, [campo]: mensaje }));
  };

  const clearError = (campo) => {
    setErrores((prev) => ({ ...prev, [campo]: null }));
  };

  // Función para convertir fecha UTC a hora de Ecuador (GMT-5) y formatear
  const formatearFecha = (fecha) => {
    const [fechaParte, horaParte] = fecha.split("T"); // ejemplo: "2025-07-05T09:15:00"
    const [año, mes, dia] = fechaParte.split("-");
    const [hora, minuto] = horaParte.split(":");
    return `${dia}/${mes}/${año}, ${hora}:${minuto}`;
  };
  
  useEffect(() => {
    getMisCitas()
      .then((data) => {
        setCitas(data);
        
        clearError("citas");
      })
      .catch(() => setError("citas", "Error al cargar citas"));
  }, []);

  const cancelarCitaCliente = async (id) => {
    try {
      await cancelarCita(id);
      setCitas((prev) => prev.filter((c) => c.id !== id));
      setTipoMensaje("success");
      setMensaje("Cita cancelada correctamente");
    } catch {
      setTipoMensaje("error");
      setMensaje("No se pudo cancelar la cita");
    }
  };

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);
  console.log('desde citas creadas', citas)

  return (
    <main
      className="min-h-screen w-full bg-[#1a1a1af3]"
      style={{
        backgroundImage: `url('/assets/FOTOPRINCIPAL.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="w-full rounded-[30px] shadow-2xl bg-[rgba(255,255,255,0)]"
        style={{
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {mensaje && <Alerta tipo={tipoMensaje} mensaje={mensaje} />}

        <ListaCitas
          citas={citas}
          errores={errores}
          cancelarCitaCliente={cancelarCitaCliente}
          formatearFecha={formatearFecha}
        />
      </div>
    </main>
  );
}

export default MisCitas;
