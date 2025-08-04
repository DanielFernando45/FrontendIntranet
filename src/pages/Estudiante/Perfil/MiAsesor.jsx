import React, { useEffect, useState } from 'react';
import perfil from "../../../assets/icons/PerfilIcon.svg";
import LayoutApp from '../../../layout/LayoutApp';
import Diana from '../../../assets/PerfilAsesores/Diana.png';
import Victor from '../../../assets/PerfilAsesores/Victor.png';

const MiAsesor = () => {
  const [asesorias, setAsesorias] = useState([]);
  const [asesores, setAsesores] = useState(null);
  const [selectedAsesoriaId, setSelectedAsesoriaId] = useState(null);

  const verAsesor = [
    { id: 1, imagen: Diana },
    { id: 2, imagen: Victor }
  ];


  // Obtener asesorías al cargar el componente
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      const id = user.id;

      fetch(`${import.meta.env.VITE_API_PORT_ENV}/cliente/miAsesoramiento/${id}`)
        .then(res => res.json())
        .then(data => {
          const asesoriasArray = Object.values(data).map(item => ({
            id: item.id,
            profesion: item.profesion_asesoria
          }));
          setAsesorias(asesoriasArray);

          // Auto-seleccionar la primera asesoría si existe
          if (asesoriasArray.length > 0) {
            const primeraAsesoriaId = asesoriasArray[0].id;
            setSelectedAsesoriaId(primeraAsesoriaId);
            obtenerDatosAsesor(primeraAsesoriaId);
          }
        })
        .catch(error => console.error('Error al obtener asesorías:', error));
    }
  }, []);

  // Función para obtener los datos del asesor
  const obtenerDatosAsesor = (asesoriaId) => {
    fetch(`${import.meta.env.VITE_API_PORT_ENV}/asesor/datosbyAsesoramiento/${asesoriaId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Datos del asesor:', data);
        setAsesores(data);
      })
      .catch(error => console.error('Error al obtener datos del asesor:', error));
  };

  // Manejo de cambio de selección
  const handleChange = (e) => {
    const asesoriaId = e.target.value;
    setSelectedAsesoriaId(asesoriaId);
    obtenerDatosAsesor(asesoriaId);
  };

  return (
    <LayoutApp>
      <main className="lg:m-5">
        <div className=' fondo_login rounded-t-[20px] w-full h-14 shadow-xl'></div>
        <div className="shadow-xl flex flex-col items-center gap-[22px]   w-full h-full p-5 bg-white rounded-b-[20px]">
          <div className='flex justify-start w-full text-[15px]'>
            <select
              className='border-2 rounded-md px-2 border-black'
              onChange={handleChange}
              value={selectedAsesoriaId || ''}
            >

              {asesorias.map((asesoria, index) => (
                <option key={index} value={asesoria.id}>{asesoria.profesion}</option>
              ))}
            </select>
          </div>

          <h1 className='text-xl font-medium'>Mi asesor</h1>
          {verAsesor.map((asesor) => (
            asesor?.id === asesores?.id && (
              <img key={asesor.id} src={asesor.imagen} alt="Asesor" className='w-[240px] h-[240px]' />
            )
          ))}
          

          {asesores ? (
            <>
              <div className='text-center'>
                <h1 className='text-xl font-medium'>{asesores.nombre} {asesores.apellido}</h1>
                <h2>{asesores.areaNombre}</h2>
                <p>{asesores.gradoAcademico}</p>
              </div>
            </>

          ) : (
            <p className="text-gray-500">No hay Asesor disponible para esta asesoría.</p>
          )
          }

        </div>
      </main>
    </LayoutApp>
  );
};

export default MiAsesor;
