import React, { useState, useEffect, useRef } from "react";
import PeluqueroSelect from "./PeluqueroSelect";
import ServicioSelect from "./ServicioSelect";

export default function ReservaForm({
  peluqueros,
  servicios,
  onCrearReserva,
  onActualizarReserva,
  reservaEditando,
  onCancelarEdicion,
}) {
  const [peluquero, setPeluquero] = useState(reservaEditando?.peluqueroId || "");
  const [servicio, setServicio] = useState(reservaEditando?.servicioId || "");
  const [fecha, setFecha] = useState(reservaEditando?.fecha || "");
  const [hora, setHora] = useState(reservaEditando?.hora || "");
  const [voucher, setVoucher] = useState(null);
  const [voucherPreview, setVoucherPreview] = useState(reservaEditando?.voucherUrl || "");
  const [totalPagar, setTotalPagar] = useState(0);
  const inputFileRef = useRef(null);

  useEffect(() => {
    const servicioSeleccionado = servicios.find(s => s.id === servicio);
    setTotalPagar(servicioSeleccionado ? servicioSeleccionado.costo : 0);
  }, [servicio, servicios]);

  function handleVoucherChange(e) {
    const file = e.target.files[0];
    if (file) {
      setVoucher(file);
      setVoucherPreview(URL.createObjectURL(file));
    }
  }

  function handleClickVoucher() {
    inputFileRef.current?.click();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!peluquero || !servicio || !fecha || !hora || !voucher) {
      alert("Completa todos los campos y sube el voucher.");
      return;
    }

    const nuevaReserva = {
      id: reservaEditando ? reservaEditando.id : Date.now(),
      peluqueroId: peluquero,
      servicioId: servicio,
      fecha,
      hora,
      voucherUrl: voucherPreview,
      totalPagar,
      estado: "Pendiente",
    };

    if (reservaEditando) {
      onActualizarReserva(nuevaReserva);
    } else {
      onCrearReserva(nuevaReserva);
    }

    // Reset
    setPeluquero("");
    setServicio("");
    setFecha("");
    setHora("");
    setVoucher(null);
    setVoucherPreview("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded space-y-6"
      style={{
        backgroundColor: "var(--color-barber-brown)",
        color: "var(--color-barber-white)",
        fontFamily: "var(--font-body)",
        boxShadow: "0 0 20px rgba(0,0,0,0.3)",
      }}
    >
      <h2
        className="text-2xl font-bold"
        style={{ fontFamily: "var(--font-heading)", color: "var(--color-barber-gold)" }}
      >
        {reservaEditando ? "Actualizar Reserva" : "Crear Reserva"}
      </h2>

      <PeluqueroSelect peluqueros={peluqueros} selected={peluquero} onChange={setPeluquero} />
      <ServicioSelect servicios={servicios} selected={servicio} onChange={setServicio} />

      {servicio && (
        <p className="font-semibold text-amber-300">
          Total a pagar: ${totalPagar.toFixed(2)}
        </p>
      )}

      <div>
        <label className="block font-semibold">Fecha:</label>
        <input
          type="date"
          className="w-full p-2 rounded bg-gray-100 text-black"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Hora:</label>
        <input
          type="time"
          className="w-full p-2 rounded bg-gray-100 text-black"
          value={hora}
          onChange={e => setHora(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Subir voucher:</label>
        <input
          type="file"
          accept="image/*"
          ref={inputFileRef}
          onChange={handleVoucherChange}
          style={{ display: "none" }}
        />
        <div
          onClick={handleClickVoucher}
          className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer text-3xl rounded bg-gray-100 text-black"
          title="Haz clic para subir voucher"
        >
          📷
        </div>
        {voucherPreview && (
          <img
            src={voucherPreview}
            alt="Voucher"
            className="mt-2 max-h-32 object-contain cursor-pointer"
            onClick={() => window.open(voucherPreview, "_blank")}
          />
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-4 py-2 rounded text-white"
          style={{ backgroundColor: "var(--color-barber-gold)" }}
        >
          {reservaEditando ? "Actualizar" : "Crear"}
        </button>

        {reservaEditando && (
          <button
            type="button"
            onClick={onCancelarEdicion}
            className="px-4 py-2 rounded bg-gray-600 text-white"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
