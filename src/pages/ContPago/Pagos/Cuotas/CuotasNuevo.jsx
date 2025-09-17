import React from 'react'
import { useState, useEffect } from "react";
import AsignarPago from '../../../../Components/Administrador/Pagos/AsignarPago';

const CuotasNuevo = () => {
    const [asigPago, setAsigPago] = useState(false);
    const [selectedAsesoramiento, setSelectedAsesoramiento] = useState(null);
    const [cuotasSinPago, setCuotasSinPago] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCuotasSinPago = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PORT_ENV}/asesoramiento/cuotasSinPagos`,{ timeout: 5000 });
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
                const data = await response.json();
                setCuotasSinPago(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCuotasSinPago();
    }, []);

    const handleAsignarPago = (asesoramiento) => {
        setSelectedAsesoramiento(asesoramiento);
        setAsigPago(true);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Cargando...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">Error: {error}</div>;
    }

    return (
        <>
            <div className="flex flex-col">
                <div className="flex justify-between text-[#495D72] font-medium p-[6px] pr-10 rounded-md">
                    <div className="w-[100px] flex justify-center">IdContrato</div>
                    <div className="w-[300px] flex justify-center">Cliente(Delegado)</div>
                    <div className="w-[210px] flex justify-center">Contrato</div>
                    <div className="w-[360px] flex justify-center">Referencia</div>
                    <div className="w-[140px] flex justify-center ml-5">Acción</div>
                </div>

                {cuotasSinPago.length > 0 ? (
                    cuotasSinPago.map((item, index) => (
                        <div 
                            key={item.id_asesoramiento} 
                            className={`flex justify-between items-center text-[#2B2829] font-normal ${
                                index % 2 === 0 ? '' : 'bg-[#E9E7E7]'
                            } p-[6px] pr-10 rounded-md`}
                        >
                            <div className="w-[100px] flex justify-center">{item.id_asesoramiento}</div>
                            <div className="w-[300px] flex justify-center">{item.delegado}</div>
                            <div className="w-[210px] flex justify-center">{item.tipo_contrato}</div>
                            <div className="w-[360px] flex justify-center">{item.profesion_asesoria}</div>
                            <button 
                                onClick={() => handleAsignarPago(item)} 
                                className="w-[140px] font-medium rounded-md px-3 py-1 bg-[#1C1C34] ml-5 flex justify-center text-white text-[14px]"
                            >
                                Asignar Pago
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-4">No hay asesoramientos con cuotas sin pago</div>
                )}
            </div>

            {asigPago && (
                <AsignarPago 
                    Cerrar={() => setAsigPago(false)} 
                    asesoramiento={selectedAsesoramiento} 
                />
            )}
        </>
    );
};

export default CuotasNuevo;