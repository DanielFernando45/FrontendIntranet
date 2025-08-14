import React, { useEffect, useState } from 'react'
import arrowIcon from '../../../assets/icons/IconEstudiante/arriba.svg'
import axios from 'axios'
import documentosVacios from '../../../assets/icons/documentosVacios.png'
import { useOutletContext } from 'react-router-dom';
import { FaRegEdit } from 'react-icons/fa';
import ModalEditarDoc from './components/ModalEditarDoc';

const DocTerminado = () => {
  const [terminados, setTerminado] = useState([]);
  const [loading, setLoading] = useState(true);
  const idAsesoramiento = useOutletContext();

  const [idAsunto, setIdAsunto] = useState(null);
  const [showEditarModal, setShowEditarModal] = useState(false);

  useEffect(() => {
    if (idAsesoramiento) {
      setLoading(true);
      axios.get(`${import.meta.env.VITE_API_PORT_ENV}/asuntos/terminados/${idAsesoramiento}`)
        .then(response => {
          setTerminado(() => {
            console.log(response.data)
            return response.data
          })
        })
        .catch(error => {
          console.error('Error al obtener los pendientes:', error)
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [idAsesoramiento])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const options = { month: 'short', day: 'numeric', year: 'numeric' }
    return date.toLocaleDateString('es-PE', options)
  }


  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);

    // Obtener hora y minutos en UTC
    let horas = date.getUTCHours();
    const minutos = date.getUTCMinutes().toString().padStart(2, "0");

    // Determinar AM/PM
    const ampm = horas >= 12 ? "PM" : "AM";

    // Convertir a formato de 12 horas con dos dígitos
    horas = horas % 12;
    horas = horas ? horas.toString().padStart(2, "0") : "12"; // La hora 0 se convierte en 12

    // Concatenar
    const hora12ConAmPm = `${horas}:${minutos} ${ampm}`;

    return hora12ConAmPm;
  };

  // Componente Skeleton para filas
  const SkeletonRow = () => (
    <div className="flex justify-between bg-[#E9E7E7] p-[6px] rounded-md animate-pulse">
      <div className="w-[300px] h-6 bg-gray-300 rounded"></div>
      <div className="w-[300px] h-6 bg-gray-300 rounded"></div>
      <div className="w-[300px] h-6 bg-gray-300 rounded"></div>
      <div className="w-[300px] h-6 bg-gray-300 rounded"></div>
      <div className="w-[102px] h-6 bg-gray-300 rounded"></div>
      <div className="w-[102px] h-6 bg-gray-300 rounded"></div>
    </div>
  );

  return (
    <>
      <div className="flex justify-between font-medium text-[#495D72] text-[14px]  gap-4  p-[6px] rounded-md">
        <div className="flex">Nombre Entregas</div>
        <div className="w-[300px] flex justify-center">Envio Tesista</div>
        <div className="w-[300px] flex justify-center">En Desarrollo Asesor</div>
        <div className="w-[300px] flex justify-center">Actividad Finalizada</div>
        <div className="w-[102px] flex justify-center">Hora</div>
        <div className="w-[138px] px-3  flex justify-center ">Estado</div>
        <div className="px-3  flex justify-center flex-1"></div>
      </div>
      <div className="flex flex-col gap-2 text-[14px] h-[180px] overflow-auto">
        {loading ? (
          // Mostrar skeletons mientras carga
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : terminados.length > 0 ? (
          // Mostrar datos cuando ya están cargados
          terminados.map((terminado, index) => (
            <div key={terminado.id} className="flex justify-between text-[#2B2829] gap-4 font-normal bg-[#E9E7E7] p-[6px] rounded-md">
              <div className="flex">{terminado.titulo}</div>
              <div className="w-[300px] flex justify-center">Entrega: {formatDate(terminado.fecha_entregado)}</div>
              <div className="w-[300px] flex justify-center">Proceso: {formatDate(terminado.fecha_proceso)}</div>
              <div className="w-[300px] flex justify-center">Terminado: {formatDate(terminado.fecha_terminado)}</div>
              <div className="w-[102px] flex justify-center">{formatTime(terminado.fecha_terminado)}</div>
              <div className="rounded-md px-3 bg-[#353563] flex justify-center text-white">{terminado.estado}</div>
              <div className="rounded-md px-3 flex flex-1 justify-center text-white">
                <button onClick={() => { setIdAsunto(terminado.id), setShowEditarModal(true) }} className='p-2 bg-[#353563] rounded-md'>
                  <FaRegEdit size={20} />
                </button>
              </div>
            </div>
          ))

        ) : (
          // Mostrar cuando no hay datos
          <div className="flex justify-center">
            <div className="flex flex-col border rounded-[12px] text-[12px] justify-center items-center w-[280px] sm:w-[370px] mn:w-[335px] lg:w-full h-[120px] sm:h-[190px] gap-5 text-[#82777A] shadow-[0px_4px_4px_4px_rgba(0,0,0,0.25)]">
              <img src={documentosVacios} alt="" />
              No hay envíos realizados
            </div>
          </div>
        )}
      </div>
      {
        showEditarModal &&
        <ModalEditarDoc idAsunto={idAsunto} onClose={() => setShowEditarModal(false)} />
      }
    </>

  )
}

export default DocTerminado