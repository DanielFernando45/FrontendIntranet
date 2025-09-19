import React, { useState, useEffect } from "react";

const AsignarAlContado = ({ close, asesoramiento }) => {
  const [formData, setFormData] = useState({
    pago_total: "",
    fecha_pago: "",
    id_asesoramiento: asesoramiento.id_asesoramiento,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    pago_total: "",
    fecha_pago: "",
  });

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fecha_pago: getCurrentDate(),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pago_total") {
      if (value === "" || /^\d+$/.test(value)) {
        setFieldErrors((prev) => ({ ...prev, pago_total: "" }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          pago_total: "Solo se permite enteros",
        }));
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage("");

    if (
      fieldErrors.pago_total ||
      !formData.pago_total ||
      isNaN(formData.pago_total) ||
      !Number.isInteger(Number(formData.pago_total))
    ) {
      setFieldErrors((prev) => ({
        ...prev,
        pago_total: "Solo se permite enteros",
      }));
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        pago_total: parseInt(formData.pago_total, 10),
        fecha_pago: formData.fecha_pago,
        id_asesoramiento: formData.id_asesoramiento,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_PORT_ENV}/pagos/alContado`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      // Manejar respuesta que podría no ser JSON
      let data;
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        // Si no es JSON válido, usar el texto plano como mensaje
        data = { message: text };
      }

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar el pago");
      }

      close(); // Cerrar el modal después de éxito
    } catch (error) {
      console.error("Error completo:", error);
      setErrorMessage(error.message || "Ocurrió un error al registrar el pago");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col absolute gap-[15px] top-60 left-96 px-10 py-12 w-[875px] h-[450px] rounded-lg bg-white border border-[#D2CECF]">
      <h1 className="text-lg font-bold">Asignar al Contado</h1>

      {errorMessage && (
        <div className="text-red-500 mb-4 p-2 bg-red-50 rounded">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex flex-col w-[369px] h-[82px] gap-[15px]">
            <h2 className="font-medium">Alumno:</h2>
            <input
              value={asesoramiento.delegado}
              readOnly
              className="flex items-center rounded-2xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium"
            />
          </div>
        </div>

        <div className="flex justify-between gap-[15px]">
          <div className="flex flex-col w-full h-[82px] gap-[15px]">
            <h2 className="font-medium">Monto Total:</h2>
            <input
              name="pago_total"
              type="number"
              value={formData.pago_total}
              onChange={handleChange}
              placeholder="Ingrese el monto (solo enteros)"
              className="flex items-center rounded-2xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium"
              required
              step="1"
            />
            {fieldErrors.pago_total && (
              <div className="text-red-500 text-sm mt-1">
                {fieldErrors.pago_total}
              </div>
            )}
          </div>

          <div className="flex flex-col w-full h-[82px] gap-[15px]">
            <h2 className="font-medium">Fecha Pago:</h2>
            <input
              type="date"
              name="fecha_pago"
              value={formData.fecha_pago}
              onChange={handleChange}
              className="flex items-center rounded-2xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium"
              required
            />
          </div>
        </div>

        <div className="flex w-full py-4 px-1 h-[68px] justify-end gap-4">
          <button
            onClick={handleSubmit}
            className={`h-7 w-[100px] border border-black rounded-[4px] text-[11px] font-bold text-[#02242B] ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting || !!fieldErrors.pago_total}
          >
            {isSubmitting ? "Enviando..." : "Agregar"}
          </button>
          <button
            onClick={close}
            className="h-7 w-[100px] border bg-black rounded-[4px] text-[11px] font-bold text-white"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignarAlContado;
