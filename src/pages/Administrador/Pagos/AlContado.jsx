import React from 'react'
import { useState } from "react";
import AlContadoNuevo from './AlContado/AlContadoNuevo';
import EnActividad from './AlContado/EnActividad';
const AlContado = () => {
  const [contado, setContado] = useState("nuevo");  

  return (
    <div className="flex flex-col gap-[10px] min-w-[1100px]  p-[30px]   w-full  bg-white  rounded-b-[10px] shadow-lg">
      <h1 className='text-[20px] font-semibold'>Al Contado</h1>
      <div className=" flex w-full border-b-2 gap-3 border-black font-normal">
        <button
          className={`px-3 rounded-t-[5px] w-[150px] ${contado === "nuevo" ? "bg-[#17162E] text-white" : ""}`}
          onClick={() => setContado("nuevo")}
        >
          Clientes nuevo
        </button>
        <button
          className={`px-3 rounded-t-[5px] w-[150px] ${contado === "actividad" ? "bg-[#17162E] text-white" : ""}`}
          onClick={() => setContado("actividad")}
        >
          En actividad
        </button>
      </div>

      <div>
        {contado === "nuevo" ? (
          <>
            <AlContadoNuevo></AlContadoNuevo>
          </>
        ) : (
            <EnActividad></EnActividad>
        )}
      </div>




    </div>
  )
}

export default AlContado