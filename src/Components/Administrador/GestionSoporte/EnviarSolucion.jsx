import React, { useState, useEffect } from 'react'

const EnviarSolucion = ({ close, idSoporte }) => {
    const [soporte, setSoporte] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSoporte = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PORT_ENV}/soporte/list/${idSoporte}`);
                if (!response.ok) {
                    throw new Error('No se pudo obtener los datos del soporte');
                }
                const data = await response.json();
                setSoporte(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSoporte();
    }, [idSoporte]);

    if (loading) {
        return (
            <div className='flex flex-col w-[28%] absolute top-60 left-[700px] px-10 py-5 bg-white rounded-xl p-5 gap-9 border'>
                <div className='flex justify-center'>
                    <p>Cargando datos del soporte...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex flex-col w-[28%] absolute top-60 left-[700px] px-10 py-5 bg-white rounded-xl p-5 gap-9 border'>
                <div className='flex justify-center text-red-500'>
                    <p>Error: {error}</p>
                </div>
                <button 
                    onClick={close}
                    className='w-full h-[50px] border border-[#1C1C34] text-[20px] font-semibold rounded-lg'
                >
                    Cerrar
                </button>
            </div>
        );
    }

    return (
        <div className='flex flex-col w-[28%] absolute top-60 left-[700px] px-10 py-5 bg-white rounded-xl p-5 gap-9 border'>
            <div className='flex w-full justify-center text-[20px] font-semibold'>
                <h1>Detalle de Soporte Técnico</h1>
            </div>
            <div className='flex flex-col gap-[10px]'>
                <h2 className='text-[15px] font-semibold'>Asunto</h2>
                <input 
                    type="text" 
                    className='border p-2 rounded-lg bg-gray-100' 
                    value={soporte.asunto || ''} 
                    readOnly
                />
                
                <h2 className='text-[15px] font-semibold'>Descripción</h2>
                <textarea 
                    className='border rounded-xl w-full h-[200px] p-2 bg-gray-100' 
                    value={soporte.descripcion || ''}
                    readOnly
                />
                
                <h2 className='text-[15px] font-semibold'>Estado</h2>
                <input 
                    type="text" 
                    className='border p-2 rounded-lg bg-gray-100' 
                    value={soporte.estado || ''} 
                    readOnly
                />
                
                <h2 className='text-[15px] font-semibold'>Fecha y Hora de Envio</h2>
                <input 
                    type="text" 
                    className='border p-2 rounded-lg bg-gray-100' 
                    value={new Date(soporte.fecha_envio).toLocaleString() || ''} 
                    readOnly
                />
                
                
                
                <button 
                    onClick={close}
                    className='w-full h-[50px] border border-[#1C1C34] text-[20px] font-semibold rounded-lg mt-4'
                >
                    Cerrar
                </button>
            </div>
        </div>
    )
}

export default EnviarSolucion