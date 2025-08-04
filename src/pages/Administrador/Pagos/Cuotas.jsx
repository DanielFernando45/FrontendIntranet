import React from 'react'
import { useState } from "react";
import CuotasNuevos from './Cuotas/CuotasNuevo';
import GestionPago from './Cuotas/GestionPagos';

const Cuotas = () => {
  const [vista,setVista]=useState("ClientesNuevo");

  return (
    <div className="flex flex-col gap-[10px] p-[30px]  bg-white  rounded-b-[10px] min-w-[1100px]">
      <h1 className='text-[20px] font-semibold'>Cuotas</h1>
      <div className=" flex xl:w-full border-b-2 gap-3 border-black font-normal">
        <button
          className={`px-3 rounded-t-[5px] w-[150px] ${vista === "ClientesNuevo" ? "bg-[#17162E] text-white" : ""}`}
          onClick={() => setVista("ClientesNuevo")}
        >
          Clientes nuevo
        </button>
        <button
          className={`px-3 rounded-t-[5px] w-[150px] ${vista === "GestionPagos" ? "bg-[#17162E] text-white" : ""}`}
          onClick={() => setVista("GestionPagos")}
        >
          Gestión pagos
        </button>
      </div>

      <div>
        {vista === "ClientesNuevo" ? (

          <CuotasNuevos></CuotasNuevos>
        ) : (
          <GestionPago></GestionPago>
        )}
      </div>



    </div>
  )
}

export default Cuotas