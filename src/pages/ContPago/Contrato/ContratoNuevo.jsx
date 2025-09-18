import React, { useState } from 'react'
import flechaabajo from "../../../assets/icons/Flecha.svg";
import flechaarriba from "../../../assets/icons/arrow-up.svg";

const Contratos = [
  {
    id_asesoramiento: 1,
    fechaAsignacion: "2025-05-11T09:00:00.000Z",
    asesor: "Diana Alexandra Solis Rios",
    delegado: "Juan Carlos Tinoco Ramírez",
    estudiantes: [] // Caso sin estudiantes, solo delegado
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
    ]
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
    ]
  },
];

const ContratoNuevo = () => {
  const [expandedIds, setExpandedIds] = useState([]);
  const [asigContrato, setAsigContrato] = useState(false);
  const [servicio, setServicio] = useState(false);

  const toggleExpand = (id) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter(item => item !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
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

  return (
    <div className='flex flex-col gap-5'>
      <h1 className='text-[25px] font-medium'>Asignar Contratos Nuevos </h1>
      <div className='flex flex-col gap-2'>
        <div className='flex justify-between px-1 text-[#495D72] font-medium'>
          <div className='w-[100px]'>IdAsesoria</div>
          <div className='w-[300px] text-center'>Delegado</div>
          <div className='w-[300px] text-center'>Alumnos </div>
          <div className='w-[300px] text-center'>Asesor</div>
          <div className='w-[200px] text-center'>Asig.Contrato</div>
        </div>
        <div className='flex flex-col gap-1 px-1'>
          {Contratos.map((contrato, index) => (
            <React.Fragment key={contrato.id_asesoramiento}>
              <div className={`flex justify-between px-1 rounded-md ${index % 2 === 0 ? 'bg-[#E9E7E7]' : ''} py-2`}>
                <div className='w-[100px]'>{contrato.id_asesoramiento.toString().padStart(4, '0')}</div>
                <div className='w-[300px]'>{contrato.delegado}</div>
                <div className='w-[300px]'>
                  {displayStudents(contrato.estudiantes)}
                </div>
                <div className='w-[300px]'>{contrato.asesor}</div>
                <div className='flex w-[200px] justify-between px-3'>
                  <button
                    className='bg-[#1C1C34] text-white font-medium px-7 rounded-md '
                    onClick={() => setAsigContrato(true)}
                  >
                    Contrato
                  </button>
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

      {asigContrato && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setAsigContrato(false)}
        >
          <div className="flex flex-col gap-8 w-[800px] bg-white shadow-md rounded-xl p-10 border border-[#E9E7E7]"
            onClick={(e) => e.stopPropagation()} >
            <h1 className='text-[25px] font-semibold'>Asignar Contrato</h1>
            <div className='flex flex-col gap-5'>
              <div className='flex justify-start gap-14'>
                <div className='flex flex-col gap-1 w-[200px] '>
                  <label className='text-[17px] font-medium'>Modalidad:</label>
                  <select className='bg-[#E9E7E7] rounded-2xl p-3 h-[50px]' name="" id="">
                    <option disabled>Seleccionar</option>
                    <option value="">Avance</option>
                    <option value="">Plazo</option>
                  </select>
                </div>
                <div className='flex flex-col gap-1 w-[200px]'>
                  <label className='text-[17px] font-medium'>Servicio:</label>
                  <select className='bg-[#E9E7E7] rounded-2xl p-3 h-[50px]' name="" id=""
                    onChange={(e) => setServicio(e.target.value === "Completo")}>
                    <option disabled>Seleccionar</option>
                    <option value="Proyecto">Proyecto</option>
                    <option value="Inf.Final">Inf.Final</option>
                    <option value="Completo">Completo</option>
                  </select>
                </div>
                {servicio && (
                  <div className='flex flex-col gap-1 w-[200px]'>
                    <label className='text-[17px] font-medium'>Categoría:</label>
                    <select className='bg-[#E9E7E7] rounded-2xl p-3 h-[50px]' name="" id="">
                      <option disabled>Seleccionar</option>
                      <option value="">Bronce</option>
                      <option value="">Plata</option>
                      <option value="">Oro</option>
                    </select>
                  </div>
                )}
              </div>
              <div className='flex  justify-start gap-20'>
                <div className='flex flex-col gap-1 w-[300px]'>
                  <label className='text-[17px] font-medium'>Tipo Trabajo:</label>
                  <select className='bg-[#E9E7E7] rounded-2xl p-3 h-[50px] ' name="" id="">
                    <option disabled>Seleccionar</option>
                    <option >Proyecto Bachillerato</option>
                    <option >Tesis Pregrado</option>
                    <option >Tesis Maestría</option>
                    <option >Tesis Doctorado</option>
                    <option >Plan de negocios</option>
                    <option >Revisión sistemática</option>
                    <option >Suficiencia profesional</option>
                    <option >Estudio de prefactibilidad</option>
                    <option >Articulo Cientifico</option>
                    <option >Tesis de segunda especialidad</option>
                  </select>
                </div>
                <div className='flex flex-col gap-1 w-[300px]'>
                  <label className='text-[17px] font-medium'>Tipo de Pago:</label>
                  <select className='bg-[#E9E7E7] rounded-2xl p-3 h-[50px]' name="" id="">
                    <option disabled>Seleccionar</option>
                    <option value="">Al Contado</option>
                    <option value="">Cuotas</option>
                  </select>
                </div>
              </div>
              <div className='flex  justify-start gap-20'>
                <div className='flex flex-col gap-1 w-[300px]'>
                  <label className='text-[17px] font-medium'>Fecha Inicio::</label>
                  <input className='bg-[#E9E7E7] rounded-2xl p-3 h-[50px]' type="date" />
                </div>
                <div className='flex flex-col gap-1 w-[300px]'>
                  <label className='text-[17px] font-medium'>Fecha Final:</label>
                  <input className='bg-[#E9E7E7] rounded-2xl p-3 h-[50px]' type="date" />
                </div>
              </div>
            </div>


            <div className='flex gap-5 justify-end'>
              <button className='border border-[#1C1C34] rounded-md px-10 py-2'
                onClick={() => setAsigContrato(false)}
              > Cancelar </button>
              <button className='bg-[#1C1C34] rounded-md px-14 py-2 text-white'> Asignar </button>
            </div>
          </div>
        </div>

      )}
    </div>
  )
}

export default ContratoNuevo