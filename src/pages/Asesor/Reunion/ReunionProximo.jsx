import React, { useState, useEffect } from 'react'
import Zoom from "../../../assets/icons/IconEstudiante/ZoomLink.svg";
import agregar from '../../../assets/icons/pluss.svg';
import CrearZoom from '../../../Components/Asesor/CrearZoom';
import eliminar from '../../../assets/icons/eliminarZoom.svg'
import { useOutletContext } from 'react-router-dom'
import axios from 'axios';

const ReunionProximo = () => {
  const [crear, SetCrear] = useState(false);
  const [reuniones, setReuniones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);
  const { selectedAsesoriaId, asesorias } = useOutletContext();

  // Obtener el ID del asesor del localStorage
  const userString = localStorage.getItem('user');
  const user = JSON.parse(userString);
  const idAsesor = user.id;

  // Obtener el delegado correspondiente al asesoramiento seleccionado
  const delegado = asesorias.find(a => a.id === selectedAsesoriaId)?.delegado || '';

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