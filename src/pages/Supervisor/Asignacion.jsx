import React from "react";
import LayoutApp from "../../layout/LayoutApp";
import Asignados from "../Supervisor/SupervisorAsignar/Asignados";
import SinAsignados from "../Supervisor/SupervisorAsignar/SinAsignar";
import { useSearchParams } from "react-router-dom";

const Asignacion = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "sin-asignar";

  const handleTabClick = (nuevoTab) => {
    setSearchParams({ tab: nuevoTab });
  };

  return (
    <LayoutApp>
      <div className="flex flex-col items-start overflow-auto ml-1 mt-5">
        <div className="flex w-full border-b-2 gap-3 border-black font-normal">
          <button
            className={`px-3 rounded-t-[5px] w-[115px] ${
              tab === "sin-asignar" ? "bg-[#17162E] text-white" : ""
            }`}
            onClick={() => handleTabClick("sin-asignar")}
          >
            Sin Asignar
          </button>
          <button
            className={`px-3 rounded-t-[5px] w-[105px] ${
              tab === "asignados" ? "bg-[#17162E] text-white" : ""
            }`}
            onClick={() => handleTabClick("asignados")}
          >
            Asignados
          </button>
        </div>

        <div className="flex flex-col gap-[10px] pt-3 p-[30px] w-full xl:w-full bg-white rounded-b-[10px] drop-shadow-lg border-3">
          {tab === "asignados" ? <Asignados /> : <SinAsignados />}
        </div>
      </div>
    </LayoutApp>
  );
};

export default Asignacion;
