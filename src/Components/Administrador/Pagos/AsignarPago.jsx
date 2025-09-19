import React from "react";
import { useState } from "react";

const AsignarPago = ({ Cerrar, asesoramiento }) => {
  const [numeroCuotas, setNumeroCuotas] = useState(1);
  const [pagoTotal, setPagoTotal] = useState("");
  const [montosCuotas, setMontosCuotas] = useState({});
  const [fechaPago, setFechaPago] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNumeroCuotasChange = (e) => {
    setNumeroCuotas(Number(e.target.value));
  };

  const handlePagoTotalChange = (e) => {
    setPagoTotal(e.target.value);
  };

  const handleMontoCuotaChange = (e, index) => {
    setMontosCuotas({
      ...montosCuotas,
      [`monto${index}`]: e.target.value,
    });
  };

  const handleFechaPagoChange = (e) => {
    setFechaPago(e.target.value);
  };

  const handleSubmit = async () => {
    if (!pagoTotal || !fechaPago) {
      setError("Por favor complete todos los campos obligatorios");
      return;
    }

    // Validar que todos los montos de cuotas estén completos
    for (let i = 1; i <= numeroCuotas; i++) {
      if (!montosCuotas[`monto${i}`]) {
        setError(`Por favor complete el monto para la cuota ${i}`);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      // Preparar el objeto cuotas según el formato requerido
      const cuotasData = {};
      for (let i = 1; i <= numeroCuotas; i++) {
        cuotasData[`monto${i}`] = parseFloat(montosCuotas[`monto${i}`]);
        if (i === 1) {
          cuotasData[`fecha_pago${i}`] = fechaPago;
        }
      }

      const requestBody = {
        createPagoPorCuotas: {
          pago_total: parseFloat(pagoTotal),
          numero_cuotas: numeroCuotas,
          id_asesoramiento: asesoramiento.id_asesoramiento,
        },
        cuotas: cuotasData,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_PORT_ENV}/pagos/porCuotas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Primero verificar si la respuesta tiene contenido
      const text = await response.text();

      if (!response.ok) {
        // Intentar parsear como JSON si hay contenido, sino mostrar el texto
        let errorData;
        try {
          errorData = text
            ? JSON.parse(text)
            : { message: "Error desconocido" };
        } catch {
          errorData = { message: text || "Error desconocido" };
        }
        throw new Error(errorData.message || "Error al asignar el pago");
      }

      // Si la respuesta es exitosa pero no es JSON válido
      if (!text) {
        console.log("Pago asignado con éxito (respuesta vacía)");
        Cerrar();
        return;
      }

      // Intentar parsear como JSON solo si hay contenido
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        console.log("Respuesta del servidor (no JSON):", text);
        // Si no es JSON válido pero la respuesta fue exitosa
        Cerrar();
        return;
      }

      console.log("Pago asignado con éxito:", data);
      Cerrar(); // Cerrar el modal después de éxito
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col absolute gap-[15px] top-60 left-96 px-10 py-5 w-[875px] rounded-lg bg-white border border-[#D2CECF]">
      <h1 className="text-[25px] font-semibold">Asignar por cuotas</h1>

      {error && (
        <div className="text-red-500 text-center p-2 bg-red-100 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <div className="flex flex-col w-[369px] h-[82px] gap-[15px]">
          <h2 className="font-medium">Alumno:</h2>
          <input
            value={asesoramiento.delegado}
            readOnly
            className="flex items-center rounded-2xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium"
          />
        </div>
        <div className="flex flex-col w-[169px] h-[82px] gap-[15px]">
          <h2 className="font-medium">Numero de cuotas:</h2>
          <select
            onChange={handleNumeroCuotasChange}
            value={numeroCuotas}
            className="flex items-center rounded-2xl w-full h-[43px] bg-[#E9E7E7] px-4 font-medium"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <div className="flex flex-col w-[222px] h-[82px] gap-[15px]">
          <h2 className="font-medium">Pago Total:</h2>
          <input
            type="number"
            value={pagoTotal}
            onChange={handlePagoTotalChange}
            placeholder="Ingrese un monto"
            className="flex items-center rounded-2xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium"
          />
        </div>
      </div>

      <div className="flex gap-5">
        <div className="flex flex-col w-[250px] h-[82px] gap-[15px]">
          <h2 className="font-medium">Monto de Cuota 1:</h2>
          <input
            type="number"
            value={montosCuotas.monto1 || ""}
            onChange={(e) => handleMontoCuotaChange(e, 1)}
            placeholder="Ingrese un monto"
            className="flex items-center rounded-2xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium"
          />
        </div>
        <div className="flex flex-col w-[260px] h-[82px] gap-[15px]">
          <h2 className="font-medium">Fecha Pago:</h2>
          <input
            type="date"
            value={fechaPago}
            onChange={handleFechaPagoChange}
            placeholder="Ingrese una fecha"
            className="flex items-center rounded-2xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium"
          />
        </div>
      </div>

      {numeroCuotas > 1 && (
        <div className="text-[25px] font-semibold">
          <h2>Fijar otras cuotas</h2>
        </div>
      )}

      <div className="flex gap-40">
        {numeroCuotas > 1 &&
          [...Array(numeroCuotas - 1)].map((_, index) => (
            <div key={index} className="flex flex-col justify-start gap-5 mt-5">
              <h1 className="font-medium">Cuota {index + 2}</h1>
              <div className="flex flex-col w-[250px] gap-[15px]">
                <h2 className="font-medium">Monto de Cuota:</h2>
                <input
                  type="number"
                  value={montosCuotas[`monto${index + 2}`] || ""}
                  onChange={(e) => handleMontoCuotaChange(e, index + 2)}
                  placeholder="Ingrese un monto"
                  className="rounded-xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium"
                />
              </div>
            </div>
          ))}
      </div>

      <div className="flex w-full py-4 px-1 h-[68px] justify-end gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`h-7 w-[100px] border border-black rounded-[4px] text-[11px] font-bold text-[#02242B] ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Procesando..." : "Agregar"}
        </button>
        <button
          onClick={Cerrar}
          disabled={loading}
          className={`h-7 w-[100px] border bg-black rounded-[4px] text-[11px] font-bold text-white ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default AsignarPago;
