import React, { useState } from "react";
import ReservaForm from "../components/ReservaForm";
import ReservaHistorial from "../components/ReservaHistorial";

const peluqueros = [
  { id: "1", nombre: "Juan" },
  { id: "2", nombre: "María" },
  { id: "3", nombre: "Luis" },
];

const servicios = [
  { id: "a", nombre: "Corte de cabello", costo: 10.0 },
  { id: "b", nombre: "Afeitado", costo: 8.0 },
  { id: "c", nombre: "Peinado", costo: 15.0 },
];

export default function App() {
  const [reservas, setReservas] = useState([]);
  const [reservaEditando, setReservaEditando] = useState(null);

  function crearReserva(reserva) {
    setReservas(prev => [...prev, reserva]);
    setReservaEditando(null);
  }

  function actualizarReserva(reservaActualizada) {
    setReservas(prev =>
      prev.map(r => (r.id === reservaActualizada.id ? reservaActualizada : r))
    );
    setReservaEditando(null);
  }

  function editarReserva(reserva) {
    setReservaEditando(reserva);
  }

  function cancelarEdicion() {
    setReservaEditando(null);
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "var(--color-barber-dark)", fontFamily: "var(--font-display)" }}>
      <ReservaForm
        peluqueros={peluqueros}
        servicios={servicios}
        onCrearReserva={crearReserva}
        onActualizarReserva={actualizarReserva}
        reservaEditando={reservaEditando}
        onCancelarEdicion={cancelarEdicion}
      />
      <ReservaHistorial
        reservas={reservas}
        peluqueros={peluqueros}
        servicios={servicios}
        onEditarReserva={editarReserva}
      />
    </div>
  );
}
