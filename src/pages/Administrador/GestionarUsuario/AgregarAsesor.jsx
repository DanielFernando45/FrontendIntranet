import React, { useState } from 'react';
import LayoutApp from '../../../layout/LayoutApp';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AgregarAsesor = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        areaAsesor: null,       // numérico
        especialidad: "",
        universidad: "",
        gradoAcademico: null,   // numérico
        email: "",
        url_imagen: "",
        telefono: null,         // numérico
        dni: ""
    });

    const handlerAtras = () => {
        navigate('/admin/gestionar-usuarios/listar-asesores');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Convertimos a número los campos que lo requieren
        const parsedValue = ["telefono", "areaAsesor", "gradoAcademico"].includes(name)
            ? parseInt(value) || ""
            : value;

        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_PORT_ENV}/asesor/add`, formData);
            alert("Asesor añadido exitosamente");
            navigate('/admin/gestionar-usuarios/listar-asesores');
        } catch (error) {
            console.error("Error al añadir asesor:", error);
            alert("Error al guardar asesor. Revisa los datos.");
        }
    };

    return (
        <LayoutApp>
            <main className="m-20">
                <div className='ml-8 fondo_login rounded-t-[20px] w-full h-14'></div>
                <div className="flex flex-col gap-[40px] ml-8 pb-12 pt-[38px] w-full h-full px-5 bg-white rounded-b-[20px]">
                    <div className='flex flex-col gap-4'>
                        <div className='flex gap-10'>
                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Nombres</p>
                                <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder='Ingrese nombres' className='bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4' />
                            </div>
                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Apellidos</p>
                                <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder='Ingrese apellidos' className='bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4' />
                            </div>
                        </div>

                        <div className='flex gap-10'>
                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Área</p>
                                <select name="areaAsesor" value={formData.areaAsesor || ""} onChange={handleChange} className='bg-[#F9F9F9] w-full h-[55px] rounded-lg text-[#808080] p-4'>
                                    <option value="">Seleccione Área</option>
                                    <option value={1}>Negocio</option>
                                    <option value={2}>Social</option>
                                    <option value={3}>Salud</option>
                                    <option value={4}>Ingeniería</option>
                                    <option value={5}>Legal</option>
                                </select>
                            </div>
                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Especialidad</p>
                                <input name="especialidad" value={formData.especialidad} onChange={handleChange} placeholder='Ingrese Especialidad' className='bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4' />
                            </div>
                        </div>

                        <div className='flex gap-10'>
                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Universidad</p>
                                <input name="universidad" value={formData.universidad} onChange={handleChange} placeholder='Ingresar Universidad' className='bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4' />
                            </div>
                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Grado Academico</p>
                                <select name="gradoAcademico" value={formData.gradoAcademico || ""} onChange={handleChange} className='bg-[#F9F9F9] w-full h-[55px] rounded-lg text-[#808080] p-4'>
                                    <option value="">Seleccione nivel</option>
                                    <option value={1}>Estudiante Pregrado</option>
                                    <option value={2}>Bachiller</option>
                                    <option value={3}>Licenciado</option>
                                    <option value={4}>Maestría</option>
                                    <option value={5}>Doctorado</option>
                                </select>
                            </div>
                        </div>

                        <div className='flex gap-10'>
                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Correo electrónico</p>
                                <input name="email" value={formData.email} onChange={handleChange} placeholder='Ingrese Correo' className='bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4' />
                            </div>
                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Teléfono</p>
                                <input name="telefono" type="number" value={formData.telefono || ""} onChange={handleChange} placeholder='Ingrese teléfono' className='bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4' />
                            </div>
                        </div>

                        <div className='flex gap-10 items-end'>
                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>DNI</p>
                                <input name="dni" value={formData.dni} onChange={handleChange} placeholder='Ingresa DNI' className='bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4' />
                            </div>
                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Perfil (URL imagen)</p>
                                <input name="url_imagen" value={formData.url_imagen} onChange={handleChange} placeholder='Ingresa Imagen Perfil' className='bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4' />
                            </div>

                            <div className='flex w-full h-full gap-[50px] justify-center'>
                                <button onClick={handlerAtras} className='h-[46px] w-[180px] flex justify-center items-center p-4 rounded-lg border border-black'>
                                    Cancelar
                                </button>
                                <button onClick={handleSubmit} className='h-[46px] w-[180px] flex justify-center items-center fondo_login text-white p-4 rounded-lg'>
                                    Añadir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </LayoutApp>
    );
};

export default AgregarAsesor;
