import React, { useState } from 'react'
import flechaabajo from "../../assets/icons/Flecha.svg";
import flechaarriba from "../../assets/icons/arrow-up.svg";
import LayoutApp from '../../layout/LayoutApp'
import activado from "../../assets/icons/check.svg"
import desactivado from "../../assets/icons/delete.svg"

const Contratos = [
  {
    id_asesoramiento: 1,
    fechaAsignacion: "2025-05-11T09:00:00.000Z",
    asesor: "Diana Alexandra Solis Rios",
    delegado: "Juan Carlos Tinoco Ramírez",
    estudiantes: [], // Caso sin estudiantes, solo delegado
    estado: true // Estado inicial
  },
  {
    id_asesoramiento: 2,
    fechaAsignacion: "2025-05-11T09:00:00.000Z",
    asesor: "Diana Alexandra Solis Rios",
    delegado: "JGabriel Alejandro Vargas León",
    estudiantes: [
      {
        id_estudiante: 1,
        estudiante: "Juan Carlos Tinoco Ramírez"
      },
      {
        id_estudiante: 2,
        estudiante: "Gabriel Alejandro Vargas León"
      },
      {
        id_estudiante: 4,
        estudiante: "Carlos Enrique Méndez Suárez"
      }
    ],
    estado: true // Estado inicial
  },
  {
    id_asesoramiento: 3,
    fechaAsignacion: "2025-05-11T09:00:00.000Z",
    asesor: "Diana Alexandra Solis Rios",
    delegado: "Carlos Enrique Méndez Suárez",
    estudiantes: [
      {
        id_estudiante: 5,
        estudiante: "Luis Fernando Ramírez"
      }
    ],
    estado: false // Estado inicial
  },
];

const JefeOpeAsignar = () => {
  const [expandedIds, setExpandedIds] = useState([]);
  const [contratos, setContratos] = useState(Contratos);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [contratoToChange, setContratoToChange] = useState(null);


  const toggleExpand = (id) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter(item => item !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const displayStudents = (estudiantes) => {
    if (estudiantes.length === 0) {
      return "----------";
    } else if (estudiantes.length === 1) {
      return estudiantes[0].estudiante;
    } else {
      return estudiantes[0].estudiante; // Muestra solo el primer estudiante
    }
  };

  const handleEstadoClick = (contrato) => {
    // Mostrar modal de confirmación
    setContratoToChange(contrato);
    setShowConfirmModal(true);
  };

  const confirmEstadoChange = () => {
    if (contratoToChange) {
      // Actualizar el estado del contrato
      const updatedContratos = contratos.map(contrato => 
        contrato.id_asesoramiento === contratoToChange.id_asesoramiento
          ? { ...contrato, estado: !contrato.estado }
          : contrato
      );
      
      setContratos(updatedContratos);
      setShowConfirmModal(false);
      setContratoToChange(null);
    }
  };

  const cancelEstadoChange = () => {
    setShowConfirmModal(false);
    setContratoToChange(null);
  };

  return (
    <LayoutApp>
      
      <div className='ml-10'>
        <div className='bg-[#1C1C34] rounded-t-lg w-40 py-1 text-white text-center'>Asignados</div>
        <div className='bg-white rounded-b-lg  rounded-tr-lg p-5'>
          <div className='flex flex-col gap-5'>
            <h1 className='text-[25px] font-medium'>Contratos Nuevos </h1>
            <div className='flex flex-col gap-2'>
              <div className='flex justify-between px-1 text-[#495D72] font-medium'>
                <div className='w-[100px]'>IdAsesoria</div>
                <div className='w-[300px] text-center'>Delegado</div>
                <div className='w-[200px]'>Fecha asignación </div>
                <div className='w-[300px] text-center'>Alumnos </div>
                <div className='w-[300px] text-center'>Asesor</div>
                <div className='w-[120px] text-center'>Estado</div>
              </div>
              <div className='flex flex-col gap-1 px-1'>
                {contratos.map((contrato, index) => (
                  <React.Fragment key={contrato.id_asesoramiento}>
                    <div className={`flex items-center justify-between px-1 rounded-md ${index % 2 === 0 ? 'bg-[#E9E7E7]' : ''} py-2`}>
                      <div className='w-[100px]'>{contrato.id_asesoramiento.toString().padStart(4, '0')}</div>
                      <div className='w-[300px]'>{contrato.delegado}</div>
                      <div className='w-[200px]'>{formatDate(contrato.fechaAsignacion)}</div>
                      <div className='w-[300px]'>
                        {displayStudents(contrato.estudiantes)}
                      </div>
                      <div className='w-[300px]'>{contrato.asesor}</div>
                      <div className='flex w-[120px] justify-between px-3 '>
                        <div className='text-[8px] flex flex-col items-center justify-center'>
                          <button
                            onClick={() => handleEstadoClick(contrato)}
                            className={`w-[60px] h-[25px] font-semibold rounded-3xl border border-black flex items-center transition-all duration-300 ease-in-out 
                              ${contrato.estado ? 'bg-green-100 justify-end' : 'bg-red-100 justify-start'}`}
                          >
                            <div className={`w-[20px] h-[20px] m-0.5 rounded-full transition-all duration-300 ease-in-out
                              ${contrato.estado ? 'bg-green-500' : 'bg-red-500'}`}>
                              <img
                                className='h-full w-full transition-transform duration-300 ease-in-out'
                                src={contrato.estado ? activado : desactivado}
                                alt="estado"
                              />
                            </div>
                          </button>
                          <label className="mt-1">{contrato.estado ? "Activado" : "Desactivado"}</label>
                        </div>

                        <button onClick={() => toggleExpand(contrato.id_asesoramiento)}>
                          <img
                            src={expandedIds.includes(contrato.id_asesoramiento) ? flechaarriba : flechaabajo}
                            alt={expandedIds.includes(contrato.id_asesoramiento) ? "Cerrar" : "Expandir"}
                          />
                        </button>
                      </div>
                    </div>

                    {expandedIds.includes(contrato.id_asesoramiento) && (
                      <div className={`px-4 py-2 rounded-b-md ${index % 2 === 0 ? 'bg-[#E9E7E7]' : 'bg-white'}`}>
                        <div className='font-medium mb-2'>Estudiantes :</div>
                        {contrato.estudiantes.length > 0 ? (
                          <ul className='list-disc pl-5'>
                            {contrato.estudiantes.map(estudiante => (
                              <li key={estudiante.id_estudiante}>{estudiante.estudiante}</li>
                            ))}
                          </ul>
                        ) : (
                          <div className='text-gray-500'>Solo tienes 1 estudiante</div>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
       {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Confirmar cambio de estado</h3>
            <p className="mb-6">
              ¿Estás seguro de que deseas cambiar el estado de este contrato a 
              {contratoToChange?.estado ? " DESACTIVADO" : " ACTIVADO"}?
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={cancelEstadoChange}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmEstadoChange}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </LayoutApp>
  )
}

export default JefeOpeAsignar