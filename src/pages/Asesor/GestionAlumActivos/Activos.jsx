import React, { useState, useEffect } from 'react';

const Activos = () => {
  const [asesorias, setAsesorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsesorias = async () => {
      try {
        // Obtener el ID del usuario del localStorage
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        const id = user.id;

        // Hacer la petición a la API
        const response = await fetch(`${import.meta.env.VITE_API_PORT_ENV}/asesoramiento/misAsesoriasActivas/${id}`);
        
        if (!response.ok) {
          throw new Error('No tienes  asesorías Activas');
        }

        const data = await response.json();
        setAsesorias(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAsesorias();
  }, []);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

   if (error) {
    return <div className="flex justify-center items-center h-64">{error}</div>;
  }

  if (asesorias.length === 0) {
    return <div className="flex justify-center items-center h-64">No tienes asesorías activas</div>;
  }

  return (
    <div className="flex flex-col bg-white rounded-xl p-2">
      <div className="flex justify-between text-[#495D72] font-medium p-[6px] rounded-md">
        <div className="w-[100px] flex justify-center">IDAsesoria</div>
        <div className="w-[300px] flex justify-center">Delegado</div>
        <div className="w-[250px] flex justify-center">Contrato Asesoria</div>
        <div className="w-[250px] flex justify-center">F.inicio</div>
        <div className="w-[250px] flex justify-center">F.vencimiento</div>
      </div>
      
      {asesorias.map((asesoria, index) => (
        <div 
          key={asesoria.id} 
          className={`flex justify-between text-[#2B2829] font-normal ${index % 2 === 0 ? 'bg-white' : 'bg-[#E9E7E7]'} p-[6px] rounded-md text-[14px]`}
        >
          <div className="w-[100px] flex justify-center">{asesoria.id}</div>
          <div className="w-[300px] flex justify-center">{asesoria.delegado}</div>
          <div className="w-[250px] flex justify-center">{asesoria.profesion_asesoria}</div>
          <div className="w-[250px] flex justify-center">{formatDate(asesoria.fecha_inicio)}</div>
          <div className="w-[250px] flex justify-center">{formatDate(asesoria.fecha_fin)}</div> {/* No hay fecha de vencimiento en la API */}
         
        </div>
      ))}
    </div>
  );
};

export default Activos;