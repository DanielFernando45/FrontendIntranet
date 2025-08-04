import React, { useState, useEffect } from 'react';
import AgregarTutoriales from './BotonesConfig/AgregarTutoriales';
import EditarTutoriales from './BotonesConfig/EditarTutoriales';
import axios from "axios";

const Tutoriales = () => {
    const [tutoriales, setTutoriales] = useState([]);
    const [showAgregarTutoriales, setShowAgregarTutoriales] = useState(false);
    const [editTutoriales, setEditTutoriales] = useState(false);
    const [editId, setEditId] = useState(false);

    useEffect(() => {
        fetchTutoriales();
    }, []);

    const fetchTutoriales = () => {
        axios.get(`${import.meta.env.VITE_API_PORT_ENV}/recursos/tutoriales/all`)
            .then((res) => {
                setTutoriales(res.data);
            })
            .catch((err) => console.error("Error al obtener tutoriales:", err));
    };

    const handleEditar = (id) => {
        setEditTutoriales(true);
        setEditId(id);
    }

    const handleEliminar = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este tutorial?")) {
            axios.delete(`${import.meta.env.VITE_API_PORT_ENV}/recursos/tutoriales/delete/${id}`)
                .then(() => {
                    // Actualizar el estado eliminando el tutorial
                    setTutoriales(tutoriales.filter(tutorial => tutorial.id !== id));
                    alert("Tutorial eliminado correctamente");
                })
                .catch((err) => {
                    console.error("Error al eliminar tutorial:", err);
                    alert("Error al eliminar tutorial");
                });
        }
    }

    return (
        <>
            <h1 className="ml-5 text-[20px] font-medium">Agregar Tutoriales</h1>
            <div className="flex flex-col">
                <div className="flex justify-between text-[#495D72] font-normal p-[6px] rounded-md">
                    <div className="w-[50px] flex justify-center">ID</div>
                    <div className="w-[400px] flex justify-center">Título</div>
                    <div className="w-[550px] flex justify-center">Enlace</div>
                    <div className="w-[110px] flex justify-center">Editar</div>
                    <div className="w-[110px] flex justify-center">Eliminar</div>
                </div>
            </div>

            {tutoriales.map((tutorial, index) => (
                <div className="flex flex-col" key={tutorial.id}>
                    <div
                        className={`flex justify-between text-[#2B2829] font-normal ${index % 2 === 0 ? "bg-[#E9E7E7]" : ""
                            } p-[6px] rounded-md`}
                    >
                        <div className="w-[50px] flex justify-center">{tutorial.id}</div>
                        <div className="w-[400px] flex justify-start">{tutorial.titulo}</div>
                        <div className="w-[550px] flex justify-start truncate">{tutorial.enlace}</div>
                        <button
                            onClick={() => handleEditar(tutorial.id)}
                            className="w-[110px] rounded-md px-3 py-1 bg-[#1C1C34] flex justify-center items-center text-white"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => handleEliminar(tutorial.id)}
                            className="w-[110px] rounded-md px-3 py-1 bg-[#8F1313] flex justify-center items-center text-white"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            ))}

            <button
                onClick={() => setShowAgregarTutoriales(true)}
                className="mt-5 w-40 h-10 border rounded-xl text-[#5e98d3] border-[#5e98d3]"
            >
                Tutorial Nuevo
            </button>

            {/* Modal para agregar nuevo tutorial */}
            {showAgregarTutoriales && (
                <AgregarTutoriales
                    close={() => {
                        setShowAgregarTutoriales(false);
                        fetchTutoriales(); // Recargar tutoriales después de agregar
                    }}
                />
            )}

            {editTutoriales && (
                <EditarTutoriales
                    close={() => {
                        setEditTutoriales(false);
                        fetchTutoriales(); // Recargar tutoriales después de editar
                    }}
                    tutorialId={editId}
                />
            )}
        </>
    );
};

export default Tutoriales;