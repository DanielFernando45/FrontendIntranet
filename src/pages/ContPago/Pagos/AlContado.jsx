import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AlContadoNuevo from "./AlContado/AlContadoNuevo";
import EnActividad from "./AlContado/EnActividad";

const AlContado = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  // Estado local sincronizado con searchParams
  const [contado, setContado] = useState(tabParam || "nuevo");

  // Efecto para actualizar el estado si cambia el tab en la URL
  useEffect(() => {
    if (tabParam && tabParam !== contado) {
      setContado(tabParam);
    }
  }, [tabParam]);

  // Manejador para cambiar pestañas y actualizar la URL
  const handleTabChange = (tab) => {
    setContado(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="flex flex-col gap-[10px] min-w-[1100px] p-[30px] w-full bg-white rounded-b-[10px] shadow-lg">
      <h1 className="text-[20px] font-semibold">Al Contado</h1>

      <div className="flex w-full border-b-2 gap-3 border-black font-normal">
        <button
          className={`px-3 rounded-t-[5px] w-[150px] ${
            contado === "nuevo" ? "bg-[#17162E] text-white" : ""
          }`}
          onClick={() => handleTabChange("nuevo")}
        >
          Clientes nuevo
        </button>
        <button
          className={`px-3 rounded-t-[5px] w-[150px] ${
            contado === "actividad" ? "bg-[#17162E] text-white" : ""
          }`}
          onClick={() => handleTabChange("actividad")}
        >
          En actividad
        </button>
      </div>

      <div>{contado === "nuevo" ? <AlContadoNuevo /> : <EnActividad />}</div>
    </div>
  );
};

export default AlContado;
