import React, { useState, useEffect } from 'react';
import AgregarHerramientas from './BotonesConfig/AgregarHerramientas';
import EditarHerramientas from './BotonesConfig/EditarHerramientas';
import axios from "axios";

const Herramientas = () => {
    const [herramientas, setHerramientas] = useState([]);
    const [showAgregarHerramientas, setShowAgregarHerramientas] = useState(false);
    const [editHerramientas, setEditHerramientas] = useState(false);
    const [editId, setEditId] = useState(false);

    useEffect(() => {
        fetchHerramientas();
    }, []);

    // Función para extraer el nombre del archivo de una URL
    const extraerNombreArchivo = (url) => {
        if (!url) return '';
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            return pathParts[pathParts.length - 1];
        } catch (e) {
            const parts = url.split('/');
            return parts[parts.length - 1];
        }
    };

    const fetchHerramientas = () => {
        axios.get(`${import.meta.env.VITE_API_PORT_ENV}/recursos/herramientas/all`)
            .then((res) => {
                // Modificar las herramientas para incluir nombre de archivo
                const herramientasModificadas = res.data.map(herramienta => ({
                    ...herramienta,
                    nombre_imagen: extraerNombreArchivo(herramienta.url_imagen)
                }));
                setHerramientas(herramientasModificadas);
            })
            .catch((err) => console.error("Error al obtener herramientas:", err));
    };

    const handleEditar = (id) => {
        setEditHerramientas(true);
        setEditId(id);
    }

    const handleEliminar = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta herramienta?")) {
            axios.delete(`${import.meta.env.VITE_API_PORT_ENV}/recursos/herramientas/delete/${id}`)
                .then(() => {
                    setHerramientas(herramientas.filter(herramienta => herramienta.id !== id));
                    alert("Herramienta eliminada correctamente");
                })
                .catch((err) => {
                    console.error("Error al eliminar herramienta:", err);
                    alert("Error al eliminar herramienta");
                });
        }
    }

    return (
        <>
            <h1 className="ml-5 text-[20px] font-medium">Agregar Herramientas</h1>
            <div className="flex flex-col">
                <div className="flex justify-between text-[#495D72] font-normal p-[6px] rounded-md">
                    <div className="w-[50px] flex justify-center">ID</div>
                    <div className="w-[200px] flex justify-center">Nombre</div>
                    <div className="w-[400px] flex justify-center">Descripción</div>
                    <div className="w-[200px] flex justify-center">Imagen</div>
                    <div className="w-[200px] flex justify-center">Enlace</div>
                    <div className="w-[110px] flex justify-center">Editar</div>
                    <div className="w-[110px] flex justify-center">Eliminar</div>
                </div>
            </div>

            {herramientas.map((herramienta, index) => (
                <div className="flex flex-col" key={herramienta.id}>
                    <div
                        className={`flex justify-between text-[#2B2829] font-normal ${index % 2 === 0 ? "bg-[#E9E7E7]" : ""
                            } p-[6px] rounded-md`}
                    >
                        <div className="w-[50px] flex justify-center">{herramienta.id}</div>
                        <div className="w-[200px] flex justify-start">{herramienta.nombre}</div>
                        <div className="w-[400px] flex justify-start ">{herramienta.descripcion}</div>
                        <div className="w-[200px] flex justify-start  text-[10px]" title={herramienta.url_imagen}>
                            {herramienta.nombre_imagen}
                        </div>
                        <div className="w-[200px] flex justify-center">
                            <a 
                                href={herramienta.enlace} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-500 hover:underline"
                                title={herramienta.enlace}
                            >
                                Visitar sitio
                            </a>
                        </div>
                        <button
                            onClick={() => handleEditar(herramienta.id)}
                            className="w-[110px] rounded-md px-3 py-1 bg-[#1C1C34] flex justify-center items-center text-white"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => handleEliminar(herramienta.id)}
                            className="w-[110px] rounded-md px-3 py-1 bg-[#8F1313] flex justify-center items-center text-white"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            ))}

            <button
                onClick={() => setShowAgregarHerramientas(true)}
                className="mt-5 px-5 h-10 border rounded-xl text-[#5e98d3] border-[#5e98d3]"
            >
                Herramienta Nueva
            </button>

            {showAgregarHerramientas && (
                <AgregarHerramientas
                    close={() => {
                        setShowAgregarHerramientas(false);
                        fetchHerramientas();
                    }}
                />
            )}

            {editHerramientas && (
                <EditarHerramientas
                    close={() => {
                        setEditHerramientas(false);
                        fetchHerramientas();
                    }}
                    herramientaId={editId}
                />
            )}
        </>
    );
};

export default Herramientas;