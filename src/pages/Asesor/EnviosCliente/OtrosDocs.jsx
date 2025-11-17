import React from 'react'
import plus from "../../../assets/icons/IconEstudiante/add.svg";
import EnviarDocs from '../../../Components/Asesor/EnviarDocs';

const OtrosDocs = () => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div>
      <div>
        <button
          className="flex justify-between p-3 rounded-lg bg-[#F0EFEF] w-[180px] items-center font-medium"
          onClick={() => setShowModal(true)}
        >
          <p>Enviar Docs</p>
          <img className="" src={plus} alt="" />
        </button>
      </div>
      <div className="flex justify-between text-[#495D72] font-medium p-[6px] rounded-md text-xs md:text-base">
        <div className="w-[300px] flex">Título</div>
        <div className="w-[102px] hidden lg:flex justify-center">Estado</div>
        <div className="w-[100px] flex justify-center">Fecha</div>
        <div className="w-[250px] justify-center hidden md:flex">Archivo</div>
        <div className="w-[65px] rounded-md px-3 flex justify-center">
          Descargas
        </div>
      </div>
      <EnviarDocs 
        showModal={showModal} 
        setShowModal={setShowModal} 
      />
    </div>
  )
}

export default OtrosDocs