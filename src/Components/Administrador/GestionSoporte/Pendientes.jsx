import React, { useState, useEffect } from 'react';
import EnviarSolucion from './EnviarSolucion';

const Pendientes = () => {
    const [form, setSupport] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [currentTicketId, setCurrentTicketId] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PORT_ENV}/soporte/espera`);
                if (!response.ok) throw new Error('Error al obtener tickets');
                setTickets(await response.json());
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const handleResolveClick = (id) => {
        setSelectedId(id);
        setSupport(true);
    };

    const handleCheckboxClick = (id, e) => {
        e.preventDefault();
        setCurrentTicketId(id);
        setShowConfirm(true);
    };

    const confirmResolution = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PORT_ENV}/soporte/finish/${currentTicketId}`, {
                method: 'PATCH'
            });

            if (!response.ok) {
                throw new Error(await response.text() || 'Error al marcar como resuelto');
            }

            // Actualizar lista de tickets eliminando el resuelto
            setTickets(tickets.filter(ticket => ticket.id_soporte !== currentTicketId));
        } catch (err) {
            setError(err.message);
        } finally {
            setShowConfirm(false);
        }
    };

    if (loading) return <div className="flex justify-center p-4">Cargando...</div>;
    if (error) return <div className="flex justify-center p-4 text-red-500">Error: {error}</div>;

    return (
        <>
            <div className="flex flex-col">
                <div className="flex justify-between text-[#495D72] font-normal p-[6px] rounded-md">
                    <div className="w-[40px] flex justify-center">ID</div>
                    <div className="w-[300px] flex justify-center">Asunto</div>
                    <div className="w-[450px] flex justify-center">Descripción</div>
                    <div className="w-[180px] flex justify-center">Fecha</div>
                    <div className="w-[250px] flex justify-center">Cliente</div>
                    <div className="w-[350px] flex justify-center">Acción</div>
                </div>

                {tickets.map((ticket, index) => (
                    <div key={ticket.id_soporte} className={`flex justify-between ${index % 2 === 0 ? '' : 'bg-[#E9E7E7]'} p-[6px]`}>
                        <div className="w-[40px] flex justify-center">{ticket.id_soporte}</div>
                        <div className="w-[300px] flex justify-start">{ticket.asunto}</div>
                        <div className="w-[450px] flex justify-start truncate" title={ticket.descripcion}>
                            {ticket.descripcion}...
                        </div>
                        <div className="w-[180px] flex justify-center">
                            {ticket.fecha_envio ? new Date(ticket.fecha_envio).toLocaleDateString() : 'Pendiente'}
                        </div>
                        <div className="w-[250px] flex justify-center">{ticket.cliente}</div>
                        <div className="w-[350px] flex justify-center space-x-2">
                            <button
                                onClick={() => handleResolveClick(ticket.id_soporte)}
                                className="bg-[#1C1C34] text-white px-3 py-1 rounded text-sm"
                            >
                                Ver Problema
                            </button>
                            <input
                                type="checkbox"
                                onChange={(e) => handleCheckboxClick(ticket.id_soporte, e)}
                                className="w-5 h-5"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {form && <EnviarSolucion idSoporte={selectedId} close={() => setSupport(false)} />}

            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Confirmar</h3>
                        <p>¿Marcar ticket #{currentTicketId} como resuelto?</p>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmResolution}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Pendientes;