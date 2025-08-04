import React, { useState, useEffect } from 'react';
import AgregarNoticias from './BotonesConfig/AgregarNoticias';
import EditarNoticias from './BotonesConfig/EditarNoticias';
import axios from "axios";

const Noticias = () => {
    const [noticias, setNoticias] = useState([]);
    const [showAgregarNoticias, setShowAgregarNoticias] = useState(false);
    const [editNoticias, setEditNoticias] = useState(false);
    const [editId, setEditId] = useState(false);

    useEffect(() => {
        fetchNoticias();
    }, []);

    const fetchNoticias = () => {
        axios.get(`${import.meta.env.VITE_API_PORT_ENV}/recursos/noticias/all`)
            .then((res) => {
                // Modificar las noticias para extraer solo el nombre del archivo
                const noticiasModificadas = res.data.map(noticia => ({
                    ...noticia,
                    nombre_archivo: extraerNombreArchivo(noticia.url_imagen)
                }));
                setNoticias(noticiasModificadas);
            })
            .catch((err) => console.error("Error al obtener noticias:", err));
    };

    // Función para extraer el nombre del archivo de una URL
    const extraerNombreArchivo = (url) => {
        try {
            // Crear un objeto URL (maneja correctamente las URLs complejas)
            const urlObj = new URL(url);
            // Obtener el pathname y dividirlo por /
            const pathParts = urlObj.pathname.split('/');
            // Devolver el último segmento que contiene el nombre del archivo
            return pathParts[pathParts.length - 1];
        } catch (e) {
            // Si falla la creación del objeto URL (por ejemplo, URL malformada)
            // Intentar un enfoque más simple
            const parts = url.split('/');
            return parts[parts.length - 1];
        }
    };

    const handleEditar = (id) => {
        setEditNoticias(true);
        setEditId(id);
    }

    const handleEliminar = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta noticia?")) {
            axios.delete(`${import.meta.env.VITE_API_PORT_ENV}/recursos/noticias/delete/${id}`)
                .then(() => {
                    // Actualizar el estado eliminando la noticia
                    setNoticias(noticias.filter(noticia => noticia.id !== id));
                    alert("Noticia eliminada correctamente");
                    location.reload();
                })
                .catch((err) => {
                    console.error("Error al eliminar noticia:", err);
                    alert("Error al eliminar noticia");
                });
        }
    }

    return (
        <>
            <h1 className="ml-5 text-[20px] font-medium">Agregar Noticias</h1>
            <div className="flex flex-col">
                <div className="flex justify-between text-[#495D72] font-normal p-[6px] rounded-md">
                    <div className="w-[50px] flex justify-center">ID</div>
                    <div className="w-[400px] flex justify-center">Titulo</div>
                    <div className="w-[550px] flex justify-center">Descripcion</div>
                    <div className="w-[200px] flex justify-center">Archivo</div>
                    <div className="w-[110px] flex justify-center">Editar</div>
                    <div className="w-[110px] flex justify-center">Eliminar</div>
                </div>
            </div>

            {noticias.map((noticia, index) => (
                <div className="flex flex-col" key={noticia.id}>
                    <div
                        className={`flex justify-between text-[#2B2829] font-normal ${index % 2 === 0 ? "bg-[#E9E7E7]" : ""
                            } p-[6px] rounded-md`}
                    >
                        <div className="w-[50px] flex justify-center">{noticia.id}</div>
                        <div className="w-[400px] flex justify-start">{noticia.titulo}</div>
                        <div className="w-[550px] flex justify-start">{noticia.descripcion}</div>
                        <div className="w-[200px] flex justify-start  text-[11px]" title={noticia.url_imagen}>
                            {noticia.nombre_archivo}
                        </div>
                        <button
                            onClick={() => handleEditar(noticia.id)}
                            className="w-[110px] rounded-md px-3 py-1  bg-[#1C1C34] flex justify-center items-center text-white"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => handleEliminar(noticia.id)}
                            className="w-[110px] rounded-md px-3 py-1 bg-[#8F1313] flex justify-center items-center text-white"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            ))}

            <button
                onClick={() => setShowAgregarNoticias(true)}
                className="mt-5 w-40 h-10 border rounded-xl text-[#5e98d3] border-[#5e98d3]"
            >
                Noticia Nueva
            </button>

            {/* Modal para agregar nueva noticia */}
            {showAgregarNoticias && (
                <AgregarNoticias
                    close={() => {
                        setShowAgregarNoticias(false);
                        fetchNoticias(); // Recargar noticias después de agregar
                    }}
                />
            )}

            {editNoticias && (
                <EditarNoticias
                    close={() => {
                        setEditNoticias(false);
                        fetchNoticias(); // Recargar noticias después de editar
                    }}
                    noticiaId={editId}
                />
            )}
        </>
    );
};

export default Noticias;