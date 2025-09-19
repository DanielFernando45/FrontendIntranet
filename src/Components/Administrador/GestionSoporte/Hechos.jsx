import React, { useEffect, useState } from 'react'
import eliminar from '../../../assets/icons/eliminarZoom.svg'
import axios from 'axios'
const Hechos = () => {
    const [resuelto, setResuelto] = useState([]);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResolver = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PORT_ENV}/soporte/finalizado`)
                if (!response.ok) {
                    throw new Error('Error al obtener los datos')
                }
                const data = await response.json()
                setResuelto(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchResolver()
    }, [])

    const handlerEliminar = (id)=>{
        if(window.confirm("Estas Seguro de Eliminar")) {
            axios.delete(`${import.meta.env.VITE_API_PORT_ENV}/soporte/delete/${id}`)
                .then(()=>{
                    setResuelto(resuelto.filter(item => item.id !== id));
                    alert("Datos Eliminados Correctamente");
                    location.reload(); 
                })
                .catch((err)=>{
                    console.error("Error al eliminiar Datos de Soporte", err);
                    alert("Error al eliminar");
                });
        }
    }


    // Función para formatear la fecha
    const formatDate = (dateString) => {
        if (!dateString) return 'No resuelto';
        
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    }

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex flex-col">
            <div className="flex justify-between text-[#495D72] font-normal p-[6px] rounded-md">
                <div className="w-[40px] flex justify-center">ID</div>
                <div className="w-[300px] flex justify-center">Asunto</div>
                <div className="w-[250px] flex justify-center">Descripción</div>
                <div className="w-[180px] flex justify-center">Fecha Inicio</div>
                <div className="w-[180px] flex justify-center">Fecha Solución</div>
                <div className="w-[250px] rounded-md px-3 flex justify-center">Delegado</div>
                <div className="w-[100px] flex justify-center">Eliminar</div>
            </div>
            
            {resuelto.map((item, index) => (
                <div 
                    key={item.id_soporte} 
                    className={`flex justify-between text-[#2B2829] font-normal p-[6px] rounded-md ${index % 2 === 0 ? 'bg-[#E9E7E7]' : ''}`}
                >
                    <div className="w-[40px] flex justify-center">{item.id_soporte}</div>
                    <div className="w-[300px] flex justify-start">{item.asunto}</div>
                    <div className="w-[250px] flex justify-start truncate whitespace-nowrap overflow-hidden">{item.descripcion}</div>
                    <div className="w-[180px] flex justify-center">{formatDate(item.fecha_envio)}</div>
                    <div className="w-[180px] flex justify-center">{formatDate(item.fecha_revision)}</div>
                    <div className="w-[250px] rounded-md px-3 flex justify-center">{item.cliente}</div>
                    <button 
                        className='w-[100px] flex justify-center'
                        onClick={() => handlerEliminar(item.id_soporte)}
                    >
                        <img src={eliminar} alt="" />
                    </button>
                </div>
            ))}
        </div>
    )
}

export default Hechos