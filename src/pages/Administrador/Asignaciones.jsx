import React, { useState, useRef } from 'react';
import LayoutApp from '../../layout/LayoutApp';


import { useNavigate,Outlet, useLocation  } from "react-router-dom";
import LayoutAppV2 from '../../layout/LayoutAppV2';


const Asignaciones = () => {
  
  const navigate = useNavigate();
  const location = useLocation();

  const isSinAsignar = location.pathname.includes("listar-asignar");
  const isAsignado =location.pathname.includes("listar-asignado")


  return (
    <LayoutAppV2>
      <main className="flex flex-col items-start overflow-auto">

        <div className="flex w-full border-b-2 gap-3 border-black font-normal">
          <button
            className={`px-3 rounded-t-[5px] w-[115px] ${isSinAsignar  ? "bg-[#17162E] text-white" : ""}`}
            onClick={() => navigate("listar-asignar")}
          >
            Sin Asignar
          </button>
          <button
            className={`px-3 rounded-t-[5px] w-[105px] ${isAsignado  ? "bg-[#17162E] text-white" : ""}`}
            onClick={() => navigate("listar-asignado")}
          >
            Asignados
          </button>
        </div>

        <div className="flex flex-col gap-[10px]  pt-3 p-[30px] w-[1200px]  xl:w-full bg-white rounded-b-[10px] drop-shadow-lg border-3 ">
           
           <Outlet />

        </div>



      </main>
    </LayoutAppV2>
  );
};

export default Asignaciones;
