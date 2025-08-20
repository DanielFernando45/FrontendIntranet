import React, { useState } from 'react'
import editar from "../../../assets/icons/Flecha.svg";
import { FaRegEdit } from 'react-icons/fa';
import { IoTrash } from 'react-icons/io5';

const contrato = [
  {
    id_contrato: 1,
    id_asesoramiento: 1,
    trabajo_investigacion: "Tesis Pregrado",
    delegado: "Juan Carlos Tinoco Ramírez",
    fecha_registro: "2025-05-11T09:00:00.000Z",
    modalidad: "Avance",
    tipo_pago: "Al contado",
  },
  {
    id_contrato: 2,
    id_asesoramiento: 2,
    trabajo_investigacion: "Tesis Maestría",
    delegado: "Gabriel Alejandro Vargas León",
    fecha_registro: "2025-05-11T09:00:00.000Z",
    modalidad: "Avance",
    tipo_pago: "Cuotas",
  },
  {
    id_contrato: 3,
    id_asesoramiento: 3,
    trabajo_investigacion: "Tesis Maestría",
    delegado: "Carlos Enrique Méndez Suárez",
    fecha_registro: "2025-05-11T09:00:00.000Z",
    modalidad: "Plazo",
    tipo_pago: "Al contado",
  },
];

const ContratoAsignado = () => {
  const [editContrato, setEditContrato] = useState(false);
  const [eliminar, setEliminar] = useState(false);
  const [servicio, setServicio] = useState(false);

  return (
    <div className='flex flex-col gap-5'>
      <h1 className='text-[25px] font-medium'>Contratos Asignados </h1>
      <div className='flex flex-col gap-2'>
        <div className='flex justify-between px-1 text-[#495D72] font-medium'>
          <div className='w-[200px] text-center'>IdContrato</div>
          <div className='w-[200px] text-center'>IdAsesoramiento</div>
          <div className='w-[350px] text-center'>Trab.Investigacion</div>
          <div className='w-[300px] text-center'>Delegado</div>
          <div className='w-[200px] text-center'>FechaRegistro</div>
          <div className='w-[200px] text-center'>Modalidad</div>
          <div className='w-[200px] text-center'>Tipo de Pago</div>
          <div className='w-[100px] text-center'>Accion</div>
        </div>
        {contrato.map((contrato, index) => (
          <div key={index} className='flex justify-between px-1'>
            <div className='w-[200px] text-center'>{contrato.id_contrato}</div>
            <div className='w-[200px] text-center'>{contrato.id_asesoramiento}</div>
            <div className='w-[350px] text-center'>{contrato.trabajo_investigacion}</div>
            <div className='w-[300px] text-center'>{contrato.delegado}</div>
            <div className='w-[200px] text-center'>{new Date(contrato.fecha_registro).toLocaleDateString()}</div>
            <div className='w-[200px] text-center'>{contrato.modalidad}</div>
            <div className='w-[200px] text-center'>{contrato.tipo_pago}</div>
            <div className='w-[100px] flex justify-between px-2'>
              <button
                className='p-1 bg-[#353563] rounded-md text-white'
                onClick={() => setEditContrato(true)}
              >
                <FaRegEdit size={20} />
              </button>
              <button
                className='p-1 bg-[#353563] rounded-md text-white'
                onClick={() => setEliminar(true)}
              >
                <IoTrash size={20} className='bg-[#353563]' />
              </button>

            </div>
          </div>
        ))}
      </div>

      {editContrato && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
          onClick={() => setEditContrato(false)}
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
                onClick={() => setEditContrato(false)}
              > Cancelar </button>
              <button className='bg-[#1C1C34] rounded-md px-14 py-2 text-white'> Asignar </button>
            </div>
          </div>

        </div>
      )}

      {eliminar && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex  items-center justify-center z-50'
          onClick={() => setEliminar(false)}
        >
          <div className="flex flex-col gap-8 w-[500px] bg-white shadow-md rounded-xl p-10 border border-[#E9E7E7]"
            onClick={(e) => e.stopPropagation()} >
            <h1 className='text-[25px] font-semibold'>Eliminar Contrato</h1>
            <p className='text-[18px]'>¿Estás seguro de que deseas eliminar este contrato? Esta acción no se puede deshacer.</p>

            <div className='flex gap-5 justify-end'>
              <button className='border border-[#1C1C34] rounded-md px-10 py-2'
                onClick={() => setEliminar(false)}
              > Cancelar </button>
              <button className='bg-red-600 rounded-md px-14 py-2 text-white'> Eliminar </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ContratoAsignado