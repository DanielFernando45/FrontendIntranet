import React, { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CuotasNuevos from "./Cuotas/CuotasNuevo";
import GestionPago from "./Cuotas/GestionPagos";

const Cuotas = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const vistaParam = searchParams.get("vista");
  const [vista, setVista] = useState(vistaParam || "ClientesNuevo");

  // Actualiza el search param cuando cambia la vista
  const cambiarVista = (nuevaVista) => {
    setVista(nuevaVista);
    setSearchParams({ vista: nuevaVista });
  };

  // Sync con el search param si cambia externamente
  useEffect(() => {
    if (vistaParam && vistaParam !== vista) {
      setVista(vistaParam);
    }
  }, [vistaParam]);

  return (
    <div className="flex flex-col gap-[10px] p-[30px] bg-white rounded-b-[10px] min-w-[1100px]">
      <h1 className="text-[20px] font-semibold">Cuotas</h1>
      <div className="flex xl:w-full border-b-2 gap-3 border-black font-normal">
        <button
          className={`px-3 rounded-t-[5px] w-[150px] ${
            vista === "ClientesNuevo" ? "bg-[#17162E] text-white" : ""
          }`}
          onClick={() => cambiarVista("ClientesNuevo")}
        >
          Clientes nuevo
        </button>
        <button
          className={`px-3 rounded-t-[5px] w-[150px] ${
            vista === "GestionPagos" ? "bg-[#17162E] text-white" : ""
          }`}
          onClick={() => cambiarVista("GestionPagos")}
        >
          Gestión pagos
        </button>
      </div>

      <div>
        {vista === "ClientesNuevo" ? <CuotasNuevos /> : <GestionPago />}
      </div>
    </div>
  );
};

export default Cuotas;
