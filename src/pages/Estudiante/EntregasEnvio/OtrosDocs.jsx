import React from 'react'

const OtrosDocs = () => {
  return (
    <div>
        OtrosDocs
        <div className="flex justify-between text-[#495D72] font-medium p-[6px] rounded-md text-xs md:text-base">
          <div className="w-[300px] flex">Título</div>
          <div className="w-[102px] hidden lg:flex justify-center">Estado</div>
          <div className="w-[100px] flex justify-center">Fecha</div>
          <div className="w-[250px] justify-center hidden md:flex">Archivo</div>
          <div className="w-[65px] rounded-md px-3 flex justify-center">
            Descargas
          </div>
        </div>
    </div>
  )
}

export default OtrosDocs