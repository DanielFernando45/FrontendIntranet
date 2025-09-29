import React, { useState } from "react";
import LayoutApp from "../../layout/LayoutApp";
import ContratoNuevo from "../ContPago/Contrato/ContratoNuevo";
import ContratoAsignado from "../ContPago/Contrato/ContratoAsignado";
import { useSearchParams } from "react-router-dom";

const Contrato = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Valor actual del tab desde la URL (?tab=nuevo / asignado)
  const tab = searchParams.get("tab") || "nuevo";

  const handleTabChange = (value) => {
    setSearchParams({ tab: value });
  };
  return (
    <LayoutApp>
      <div className="flex flex-col gap-11 m-5 items-start overflow-auto">
        <div className="flex flex-col gap-[10px] px-[40px] py-5 w-full bg-white rounded-[10px]">
          <div className="flex flex-col gap-[12px]">
            <div className="flex border-b border-gray-300 gap-3 font-medium">
              <button
                onClick={() => handleTabChange("nuevo")}
                className={`px-5 py-1 w-[200px] text-center transition-all duration-200
                ${
                  tab === "nuevo"
                    ? "bg-[#17162E] text-white rounded-t-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Nuevo Contrato
              </button>
              <button
                onClick={() => handleTabChange("asignado")}
                className={`px-5 py-1 w-[220px] text-center transition-all duration-200
                ${
                  tab === "asignado"
                    ? "bg-[#17162E] text-white rounded-t-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Contratos Asignados
              </button>
            </div>
          </div>

          {/* Tabs Content */}
          <div>
            {tab === "nuevo" ? <ContratoNuevo /> : <ContratoAsignado />}
          </div>
        </div>
      </div>
    </LayoutApp>
  );
};

export default Contrato;
