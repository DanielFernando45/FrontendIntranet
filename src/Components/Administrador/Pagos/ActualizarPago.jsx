import React, { useState, useEffect } from "react";
import check from "../../../assets/icons/check.svg";
import toast from "react-hot-toast";

const ActualizarPago = ({ onClose, pagoData }) => {
  const [numeroCuotas, setNumeroCuotas] = useState(1);
  const [cuotas, setCuotas] = useState([]);
  const [totalPagar, setTotalPagar] = useState("");
  const [exito, setExito] = useState(false);

  useEffect(() => {
    if (pagoData) {
      setNumeroCuotas(pagoData.numero_cuotas);
      setTotalPagar(pagoData.total_pagar);
      setCuotas(pagoData.cuotas);
    }
  }, [pagoData]);

  const handleNumeroCuotasChange = (e) => {
    const value = Number(e.target.value);
    setNumeroCuotas(value);
    if (value < cuotas.length) {
      setCuotas(cuotas.slice(0, value));
    } else if (value > cuotas.length) {
      const nuevasCuotas = [...cuotas];
      for (let i = cuotas.length; i < value; i++) {
        nuevasCuotas.push({
          nombre: `Cuota ${i + 1}`,
          monto: "",
          fecha_pago: "",
          estado_pago: "por_pagar",
          id: null,
        });
      }
      setCuotas(nuevasCuotas);
    }
  };

  const handleCuotaChange = (index, field, value) => {
    const nuevasCuotas = [...cuotas];
    nuevasCuotas[index][field] = value;
    setCuotas(nuevasCuotas);
  };

  const handleSubmit = async () => {
    try {
      const payload = {};
      cuotas.forEach((cuota, index) => {
        payload[`monto${index + 1}`] = Number(cuota.monto);
        payload[`fecha_pago${index + 1}`] = cuota.fecha_pago
          ? `${cuota.fecha_pago} 00:00:00`
          : null;
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_PORT_ENV}/pagos/updateCuotas/${
          pagoData.id_infoPago
        }`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar los pagos");
      }

      setExito(true);
      toast.success("Servicio actualizado correctamente");

      setTimeout(() => {
        setExito(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar los pagos");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black bg-opacity-30">
      <div className="w-full max-w-4xl bg-white rounded-lg border border-[#D2CECF] px-6 py-8">
        <h1 className="text-2xl font-semibold mb-4">Actualizar pagos</h1>

        {exito && (
          <div className="flex items-center gap-2 text-green-600 font-semibold mb-4">
            <img src={check} alt="check" className="w-5 h-5" />
            Pagos actualizados correctamente
          </div>
        )}

        {/* Datos generales */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex flex-col w-full gap-2">
            <label className="font-medium">Alumno:</label>
            <input
              value={pagoData?.delegado || ""}
              disabled
              className="rounded-2xl text-[#1C1C34] bg-[#E9E7E7] px-4 py-2 font-medium w-full"
            />
          </div>
          <div className="flex flex-col w-full md:max-w-[160px] gap-2">
            <label className="font-medium">Número de cuotas:</label>
            <select
              onChange={handleNumeroCuotasChange}
              value={numeroCuotas}
              disabled
              className="rounded-2xl bg-[#E9E7E7] px-4 py-2 font-medium w-full"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          <div className="flex flex-col w-full md:max-w-[220px] gap-2">
            <label className="font-medium">Total a pagar:</label>
            <input
              disabled
              value={totalPagar}
              onChange={(e) => setTotalPagar(e.target.value)}
              placeholder="Ingrese un monto"
              className="rounded-2xl text-[#1C1C34] bg-[#E9E7E7] px-4 py-2 font-medium w-full"
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-4 mb-2">Cuotas</h2>

        {/* Cuotas dinámicas */}
        {cuotas.map((cuota, index) => (
          <div key={index} className="mt-4 border-t pt-4">
            <div className="font-medium text-lg mb-3">{cuota.nombre}</div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col w-full gap-2">
                <label className="font-medium">Monto:</label>
                <div className="flex items-center gap-2">
                  <span className="bg-[#1C1C34] text-white rounded-full w-12 h-10 flex items-center justify-center font-bold">
                    S/.
                  </span>
                  <input
                    value={cuota.monto}
                    onChange={(e) =>
                      handleCuotaChange(index, "monto", e.target.value)
                    }
                    placeholder="Ingrese un monto"
                    className="rounded-2xl text-[#1C1C34] bg-[#E9E7E7] px-4 py-2 font-medium w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col w-full gap-2">
                <label className="font-medium">Fecha Pago:</label>
                <input
                  type="date"
                  value={cuota.fecha_pago}
                  onChange={(e) =>
                    handleCuotaChange(index, "fecha_pago", e.target.value)
                  }
                  className="rounded-2xl text-[#1C1C34] bg-[#E9E7E7] px-4 py-2 font-medium w-full"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Botones */}
        <div className="flex justify-end mt-8 gap-4">
          <button
            onClick={handleSubmit}
            className="h-9 w-[100px] border border-black rounded-[4px] text-[13px] font-bold text-[#02242B]"
          >
            Actualizar
          </button>
          <button
            onClick={onClose}
            className="h-9 w-[100px] bg-black rounded-[4px] text-[13px] font-bold text-white"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActualizarPago;
