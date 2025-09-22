import React, { useState, useEffect } from 'react'
import Zoom from "../../../assets/icons/IconEstudiante/ZoomLink.svg";
import agregar from '../../../assets/icons/pluss.svg';
import CrearZoom from '../../../Components/Asesor/CrearZoom';
import eliminar from '../../../assets/icons/eliminarZoom.svg'
import { useOutletContext } from 'react-router-dom'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { reunionesService } from '../../../services/reunionesService';

const ReunionProximo = () => {
  const [crear, SetCrear] = useState(false);
  const [reuniones, setReuniones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);
  const { selectedAsesoriaId, asesorias } = useOutletContext();

  const [fechaFiltro, setFechaFiltro] = useState(null);


  // Obtener el ID del asesor del localStorage
  const userString = localStorage.getItem('user');
  const user = JSON.parse(userString);
  const idAsesor = user.id_asesor;

  // Obtener el delegado correspondiente al asesoramiento seleccionado
  const delegado = asesorias.find(a => a.id === selectedAsesoriaId)?.delegado || '';


  const { data: reunionesPorFecha, isLoading, isError } = useQuery({
    queryKey: ['reunionesPorFecha', fechaFiltro],
    queryFn: () => reunionesService.reunionesPorFecha(idAsesor, fechaFiltro)
  })

  useEffect(() => {
    const fetchReuniones = async () => {
      try {
        if (selectedAsesoriaId) {
          const response = await axios.get(`${import.meta.env.VITE_API_PORT_ENV}/reuniones/allReunionesProximas/${selectedAsesoriaId}`);
          setReuniones(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al obtener las reuniones:', error);
        setLoading(false);
      }
    };

    fetchReuniones();
  }, [selectedAsesoriaId, crear]);

  // Función para formatear la fecha
  const formatFecha = (fechaString) => {
    const date = new Date(fechaString);
    const options = { month: 'long' };
    // Extraer directamente la hora y minutos de la cadena ISO
    const timePart = fechaString.split('T')[1].substring(0, 5);

    return {
      month: new Intl.DateTimeFormat('es-ES', options).format(date),
      day: date.getUTCDate(),
      time: timePart
    };
  };

  const handleDeleteClick = (meetingId) => {
    setMeetingToDelete(meetingId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/reuniones/eliminar-reunion/${meetingToDelete}`, {
        data: {
          id_asesor: idAsesor
        }
      });

      // Actualizar la lista de reuniones después de eliminar
      setReuniones(reuniones.filter(reunion => reunion.id !== meetingToDelete));
      setShowConfirmModal(false);
    } catch (err) {
      console.error('Error al eliminar la reunión:', err);
      setShowConfirmModal(false);
    }
  };

  const cancelDelete = () => {
    setMeetingToDelete(null);
    setShowConfirmModal(false);
  };

  const parseTime = (fecha) => {
    console.log(fecha)
    const fechaISO = new Date(fecha);

    // 2. Formatear solo la hora en formato de 12 horas
    const horaFormateada = fechaISO.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC"
    });
    console.log(horaFormateada)

    return horaFormateada
  }

  if (loading) {
    return <div>Cargando reuniones...</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-8 flex-wrap">
        {/**BOTON CREAR */}
        <div className="flex gap-3 flex-col w-[310px]  items-center justify-center bg-[#F0EFEF] border-[#AAA3A5] rounded-xl">
          <h1>Añadir una nueva reunion</h1>
          <button
            onClick={() => { SetCrear(true) }}
          >
            <img className="w-8" src={agregar} alt="" />
          </button>
        </div>

        {/**REUNIONES PROXIMOS DE ASESOR CON EL DELDEGADO */}
        {reuniones.map((reunion, index) => {
          const fechaFormateada = formatFecha(reunion.fecha_reunion);

          return (
            <div key={index} className="flex w-[350px]  items-center">

              <div className="flex flex-col justify-center items-center rounded-l-xl h-full w-[104px] bg-[#1C1C34] p-4 text-white">
                <p>{fechaFormateada.month}</p>
                <h1 className="text-[30px]">{fechaFormateada.day}</h1>
                <p className="text-[12px]">{fechaFormateada.time}</p>
              </div>

              <div className="flex flex-col w-full h-full border bg-[#F0EFEF] border-[#AAA3A5] p-4 justify-between rounded-r-xl gap-5">
                <div className="flex flex-col gap-[6px]">
                  <div className='flex  items-start'>
                    <p className="font-medium">{reunion.delegado}</p>
                    <button
                      className='p-1'
                      onClick={() => handleDeleteClick(reunion.id)}
                    >
                      <img src={eliminar} className='w-12' alt="Eliminar reunión" />
                    </button>
                  </div>
                  <h1 className="text-[#666666]">CodigoID: {reunion.meetingId}</h1>
                </div>

                <button className="flex gap-4 justify-between px-1 h-12 items-center text-white rounded-2xl bg-[#1271ED]">
                  <a href={reunion.enlace} target="_blank" rel="noopener noreferrer" className="w-full flex justify-between items-center px-2">
                    <p className="font-medium">Enlace Zoom</p>
                    <img src={Zoom} alt="Zoom" className="w-6 h-6" />
                  </a>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <hr className='border border-[#ccc]' />

      {/* REUNIONES POR FILTRADOS POR FECHA */}
      <div className='bg-[#F8F7F7] p-3 rounded-md space-y-4 border border-gray-100'>
        <div className='flex gap-x-8'>
          {/* <h2>Pogramación Reuniones el dia de hoy</h2> */}
          <div className='space-x-3'>
            <label htmlFor="fecha_reuniones">Filtro por Fecha:</label>
            <input className='outline-none border border-gray-400 px-2 rounded-sm' value={fechaFiltro ?? ""} onChange={(event) => setFechaFiltro(event.target.value)} id="fecha_reuniones" type="date" name="fecha_reuniones" />
          </div>
        </div>
        {
          isLoading ? (
            'Cargando...'
          ) : isError ? (
            'Algo salió mal, no se pudo cargar las reuniones filtradas'
          ) : reunionesPorFecha.length > 0 ? (
            <div className='max-h-[300px] relative overflow-auto '>
              <table className='w-full min-w-[1500px]'>
                <thead className='sticky w-full top-0 z-10 '>
                  <tr className='text-center'>
                    <td className='border-gray-500 py-2'>Id Reuníon</td>
                    <td className='border-gray-500'>Titulo</td>
                    <td className='border-gray-500'>Asesor</td>
                    <td className='border-gray-500'>Fecha Reunión</td>
                    <td className='border-gray-500'>Horario</td>
                  </tr>
                </thead>
                <tbody className=''>
                  {
                    reunionesPorFecha.map((reunion, index) => (
                      <tr key={reunion.id} className={`text-center ${index % 2 == 0 ? 'bg-[#F0EFEF]' : 'bg-white'}`}>
                        <td className=' py-2'>{reunion.id}</td>
                        <td className=''>{reunion.titulo}</td>
                        <td className=''>{reunion.asesor}</td>
                        <td className=''>{(reunion.fecha_reunion.split('T')[0].split('-').reverse().join('-'))}</td>
                        <td className=''>{parseTime(reunion.fecha_reunion)}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          ) : (
            <div className='border border-gray-300 rounded-md max-h-[400px] h-[300px] flex justify-center items-center'>
              <p>No hay reuniones en esta fecha</p>
            </div>
          )
        }
      </div>
      {/* REUNIONES POR FILTRADOS POR FECHA */}


      {crear && (
        <CrearZoom
          Close={() => SetCrear(false)}
          idAsesoramiento={selectedAsesoriaId}
          delegado={delegado}
        />
      )}

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>
            <p className="mb-6">¿Estás seguro de que deseas eliminar esta reunión?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReunionProximo;