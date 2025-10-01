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
        onClose(); // ✅ Cierra el modal después del toast
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar los pagos");
    }
  };

  return (
    <div className="flex flex-col absolute gap-[15px] top-20 left-[500px] px-10 py-5 w-[875px] rounded-lg bg-white border border-[#D2CECF]">
      <h1 className="text-[25px] font-semibold">Actualizar pagos</h1>

      {exito && (
        <div className="flex items-center gap-2 text-green-600 font-semibold">
          <img src={check} alt="check" className="w-5 h-5" />
          Pagos actualizados correctamente
        </div>
      )}

      <div className="flex justify-between">
        <div className="flex flex-col w-[369px] h-[82px] gap-[15px]">
          <h2 className="font-medium">Alumno:</h2>
          <input
            value={pagoData?.delegado || ""}
            disabled
            className="flex items-center rounded-2xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium"
          />
        </div>
        <div className="flex flex-col w-[169px] h-[82px] gap-[15px]">
          <h2 className="font-medium">Número de cuotas:</h2>
          <select
            onChange={handleNumeroCuotasChange}
            value={numeroCuotas}
            disabled
            className="flex items-center rounded-2xl w-full h-[43px] bg-[#E9E7E7] px-4 font-medium"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <div className="flex flex-col w-[222px] h-[82px] gap-[15px]">
          <h2 className="font-medium">Total a pagar:</h2>
          <input
            disabled
            value={totalPagar}
            onChange={(e) => setTotalPagar(e.target.value)}
            placeholder="Ingrese un monto"
            className="flex items-center rounded-2xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium"
          />
        </div>
      </div>

      <h1 className="text-[25px] font-semibold">Cuotas</h1>

      {cuotas.map((cuota, index) => (
        <div key={index} className="flex flex-col justify-start gap-5 mt-5">
          <div className="font-medium text-[20px]">{cuota.nombre}</div>
          <div className="flex justify-between">
            <div className="flex flex-col w-[390px] h-[82px] gap-[15px]">
              <h2 className="font-medium">Monto:</h2>
              <div className="flex items-center gap-1">
                <p className="flex items-center justify-center bg-[#1C1C34] text-white rounded-full w-12 h-10 ">
                  S/.
                </p>
                <input
                  value={cuota.monto}
                  onChange={(e) =>
                    handleCuotaChange(index, "monto", e.target.value)
                  }
                  placeholder="Ingrese un monto"
                  className="flex items-center rounded-2xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium"
                />
              </div>
            </div>
            <div className="flex flex-col w-[390px] h-[82px] gap-[15px]">
              <h2 className="font-medium">Fecha Pago:</h2>
              <input
                type="date"
                value={cuota.fecha_pago}
                onChange={(e) =>
                  handleCuotaChange(index, "fecha_pago", e.target.value)
                }
                className="flex justify-end rounded-2xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex w-full py-4 px-1 h-[68px] justify-end gap-4">
        <button
          onClick={handleSubmit}
          className="h-7 w-[100px] border border-black rounded-[4px] text-[11px] font-bold text-[#02242B]"
        >
          Actualizar
        </button>
        <button
          onClick={onClose}
          className="h-7 w-[100px] border bg-black rounded-[4px] text-[11px] font-bold text-white"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ActualizarPago;
