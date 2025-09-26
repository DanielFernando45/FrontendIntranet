import React, { useState } from "react";

const FechaEstimada = ({ onClose, onSubmit }) => {
  const [fecha, setFecha] = useState("");

  const handleSubmit = () => {
    if (!fecha) return;
    const now = new Date();
    const [year, month, day] = fecha.split("-");
    const fechaCompleta = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );
    onSubmit(fechaCompleta.toISOString()); // 👈 ISO válido
  };

  return (
    <div className="flex flex-col justify-center items-center bg-[#F8F7F7] rounded-xl w-[440px] gap-5 p-5 relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
      <div className="text-lg font-medium">Fecha de Entrega Estimada</div>
      <div className="w-full flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <p className="w-[80px]">Fecha:</p>
          <input
            className="bg-white rounded w-full p-2 border border-gray-300"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            min={new Date().toISOString().split("T")[0]} // No permite fechas anteriores a hoy
          />
        </div>
        <div className="text-sm text-gray-500">
          La hora de envío será automáticamente la hora actual
        </div>
      </div>
      <div className="flex gap-4">
        <button onClick={onClose} className="bg-[#DAD6D7] rounded-md px-5 py-1">
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#0CB2D5] text-white rounded-md px-5 py-1"
          disabled={!fecha}
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default FechaEstimada;
