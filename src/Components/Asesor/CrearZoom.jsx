import React, { useRef, useEffect, useState } from 'react'

const CrearZoom = ({ Close, idAsesoramiento, delegado }) => {
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    titulo: '',
    fecha: '',
    hora: ''
  });
  const [error, setError] = useState('');

  // Cerrar al hacer click fuera del modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        Close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [Close]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.fecha || !formData.hora) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const idAsesor = user.id;

      // Combinar fecha y hora en el formato requerido
      const fecha_reunion = `${formData.fecha}T${formData.hora}:00`;

      const reunionData = {
        titulo: formData.titulo,
        fecha_reunion,
        id_asesoramiento: idAsesoramiento,
        id_asesor: idAsesor
      };

      const response = await fetch(`${import.meta.env.VITE_API_PORT_ENV}/reuniones/crear-reunion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reunionData)
      });
      alert("Zoom Creardo Correctamente");
      
      if (!response.ok) {
        throw new Error('Error al crear la reunión');
      }

      const data = await response.json();
      console.log('Reunión creada:', data);
      Close(); // Cerrar el modal después de crear la reunión
      // Aquí podrías añadir una notificación de éxito o redirigir
      
    } catch (err) {
      console.error('Error:', err);
      setError('Error al crear la reunión. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div 
      ref={modalRef}
      className='top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-xl flex flex-col gap-5 p-4 py-10 items-center justify-center w-[600px] rounded-xl bg-[#F8F7F7] relative'
    >
      <button 
        onClick={Close}
        className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold p-1'
        aria-label="Cerrar"
      >
        ×
      </button>
      
      <h1 className='font-medium'>Agregar reunion</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className='flex flex-col gap-5 mb-10 w-full px-10'>
        <div className='flex justify-between gap-14 font-medium'>
          <p>Tema: </p>
          <input 
            type='text' 
            name='titulo'
            placeholder='Inserte el Tema' 
            className='w-[350px] p-1 rounded-lg px-3' 
            value={formData.titulo}
            onChange={handleChange}
          />
        </div>
        <div className='flex justify-between gap-14 font-medium'>
          <p>Delegado: </p>
          <input 
            type='text' 
            placeholder={delegado} 
            className='w-[350px] p-1 rounded-lg px-3 bg-gray-100' 
            disabled
          />
        </div>
        <div className='flex justify-between gap-14 font-medium '>
          <p>Fecha: </p>
          <input 
            type="date" 
            name='fecha'
            placeholder='Elijer Fecha' 
            className='w-[350px] rounded-lg px-3 p-1'
            value={formData.fecha}
            onChange={handleChange}
          />
        </div>
        <div className='flex justify-between gap-14 font-medium'>
          <p>Hora: </p>
          <input 
            type="time" 
            name='hora'
            placeholder='Inserte Hora' 
            className='w-[350px] rounded-lg px-3 p-1'
            value={formData.hora}
            onChange={handleChange}
          />
        </div>
        <button 
          type='submit'
          className='px-6 rounded-md p-1 bg-[#E9E7E7] hover:bg-[#D1CFCF] self-center'
        >
          Agregar Zoom
        </button>
      </form>
    </div>
  )
}

export default CrearZoom;