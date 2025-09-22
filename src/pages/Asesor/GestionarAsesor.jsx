import React, { useState } from "react";
import LayoutApp from "../../layout/LayoutApp";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const GestionarAsesor = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActivos = location.pathname.includes("activos");
  const isDesactivados = location.pathname.includes("desactivados");

  return (
    <LayoutApp>
      <main className="flex flex-col m-5 gap-5">
        <h1 className="text-[20px] font-medium">Asesorias</h1>

        <div className="w-[250px] h-[30px] flex justify-between items-center rounded-lg border bg-[#E9E7E7] px-5">
          <button
            className={`${isActivos ? "text-black" : "text-[#AAA3A5]"}`}
            onClick={() => navigate("activos")}
          >
            Activos
          </button>
          <div className="h-[40px] w-[2px] bg-white rotate-45"></div>
          <button
            className={` ${isDesactivados ? "text-black" : "text-[#AAA3A5]"}`}
            onClick={() => navigate("desactivados")}
          >
            Desactivados
          </button>
        </div>

        <div>
          <Outlet />
        </div>
      </main>
    </LayoutApp>
  );
};

export default GestionarAsesor;
