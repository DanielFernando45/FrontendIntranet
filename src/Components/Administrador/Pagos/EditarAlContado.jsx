import React, { useState, useEffect } from "react";

const EditarAlContado = ({ cliente, onUpdate, cerrar }) => {
  const [monto, setMonto] = useState("");
  const [fechaPago, setFechaPago] = useState("");

  useEffect(() => {
    if (cliente) {
      setMonto(cliente.ultimo_monto.toString());

      if (cliente.fecha_ultimo_pago) {
        const date = new Date(cliente.fecha_ultimo_pago);
        const formattedDate = date.toISOString().split("T")[0];
        setFechaPago(formattedDate);
      }
    }
  }, [cliente]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fechaPagoFormatted = fechaPago ? `${fechaPago} 00:00:00` : null;

    onUpdate(cliente.id_infoPago, {
      pago_total: parseFloat(monto),
      fecha_pago: fechaPagoFormatted,
    });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4 bg-black bg-opacity-40">
      <div className="w-full max-w-[875px] bg-white rounded-lg border border-[#D2CECF] px-6 py-8 md:px-10 md:py-12">
        <h1 className="text-xl font-medium mb-6">Editar</h1>

        <div className="flex flex-col gap-6 mb-6">
          <div className="flex flex-col gap-2 w-full">
            <label className="font-medium">Alumno:</label>
            <input
              value={cliente?.delegado || ""}
              readOnly
              className="rounded-2xl text-[#1C1C34] bg-[#E9E7E7] px-4 py-2 font-medium w-full"
            />
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <div className="flex flex-col w-full gap-2">
              <label className="font-medium">Monto:</label>
              <input
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="Ingrese el monto"
                className="rounded-2xl text-[#1C1C34] bg-[#E9E7E7] px-4 py-2 font-medium w-full"
              />
            </div>

            <div className="flex flex-col w-full gap-2">
              <label className="font-medium">Fecha Pago:</label>
              <input
                type="date"
                value={fechaPago}
                onChange={(e) => setFechaPago(e.target.value)}
                className="rounded-2xl text-[#1C1C34] bg-[#E9E7E7] px-4 py-2 font-medium w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleSubmit}
            className="h-8 w-[100px] border border-black rounded-[4px] text-[12px] font-bold text-[#02242B]"
          >
            Editar
          </button>
          <button
            onClick={cerrar}
            className="h-8 w-[100px] bg-black rounded-[4px] text-[12px] font-bold text-white"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarAlContado;
