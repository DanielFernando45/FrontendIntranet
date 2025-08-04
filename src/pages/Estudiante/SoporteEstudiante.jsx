import React, { useState, useEffect } from 'react';
import LayoutApp from '../../layout/LayoutApp';
import PreguntasFrecuentes from '../../Components/Cliente/PreguntasFrecuentes';

const SoporteEstudiante = () => {
  const [formData, setFormData] = useState({
    asunto: '',
    descripcion: '',
    id_cliente: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const usuario = localStorage.getItem('user');
    if (usuario) {
      try {
        const user = JSON.parse(usuario);
        setFormData(prev => ({
          ...prev,
          id_cliente: user.id
        }));
        setUserLoaded(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setSubmitStatus({ success: false, message: 'Error al cargar datos del usuario' });
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.id_cliente) {
      setSubmitStatus({ success: false, message: 'No se pudo identificar al usuario. Por favor, inicie sesión nuevamente.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_PORT_ENV}/soporte/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // Primero verificar si hay contenido en la respuesta
      const responseText = await response.text();
      
      let responseData;
      try {
        // Intentar parsear como JSON solo si hay contenido
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        // Si falla el parseo JSON, usar el texto plano como mensaje
        responseData = { message: responseText };
      }

      if (!response.ok) {
        throw new Error(responseData.message || 'Error en la solicitud');
      }

      setSubmitStatus({ 
        success: true, 
        message: responseData.message || 'Solicitud enviada con éxito' 
      });
      
      // Resetear el formulario
      setFormData(prev => ({
        asunto: '',
        descripcion: '',
        id_cliente: prev.id_cliente
      }));
    } catch (error) {
      setSubmitStatus({ 
        success: false, 
        message: error.message || 'Error al procesar la respuesta del servidor' 
      });
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userLoaded) {
    return (
      <LayoutApp>
        <div className="flex justify-center items-center h-screen">
          <p>Cargando información del usuario...</p>
        </div>
      </LayoutApp>
    );
  }

  return (
    <LayoutApp>
      <main className='flex xl:mx-5 gap-8 justify-center lg:flex-row flex-col'>
        <div className='flex flex-col flex-1 bg-white rounded-xl p-5 gap-10 lg:gap-24'>
          <div className='flex w-full justify-center text-[20px] lg:text-[30px] font-semibold'>
            <h1>Formulario de soporte</h1>
          </div>
          <form onSubmit={handleSubmit} className='flex flex-col gap-[31px]'>
            <h2 className='lg:text-[20px]'>Asunto</h2>
            <select 
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              className='border p-5 rounded-lg'
              required
            >
              <option value="">Seleccione un asunto</option>
              <option value="Error_en_entrega_y_revision">Error en entrega y revisión</option>
              <option value="Error_en_reuniones">Error en reuniones</option>
              <option value="Error_en_calendario">Error en calendario</option>
              <option value="Error_en_recursos">Error en recursos</option>
              <option value="Otro">Otro</option>
            </select>
            
            <h2 className='lg:text-[20px]'>Descripción</h2>
            <textarea 
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className='border rounded-xl w-full h-[150px] lg:h-[318px] p-6 outline-none' 
              placeholder='Ingrese una descripción'
              required
            ></textarea>
            
            <button 
              type="submit"
              className='w-full h-[50px] lg:h-[79px] bg-[#1C1C34] text-white lg:text-[20px] font-semibold rounded-sm hover:bg-[#2d2d4a] transition-colors'
              disabled={isSubmitting || !formData.id_cliente}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
            
            {submitStatus && (
              <div className={`p-4 rounded-lg ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {submitStatus.message}
              </div>
            )}
          </form>
        </div>

        <div className='flex flex-col gap-10 flex-1 h-[850px] overflow-auto bg-white rounded-xl p-10'>
          <h1 className='text-[20px] lg:text-[30px]'>Soluciones Frecuentes</h1>
          <PreguntasFrecuentes />
        </div>
      </main>
    </LayoutApp>
  );
};

export default SoporteEstudiante;