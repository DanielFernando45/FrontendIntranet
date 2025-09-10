import React, { useState } from 'react';
import LayoutApp from '../../../layout/LayoutApp';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AgregarAsesor = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        area: "",       
        especialidad: "",
        universidad: "",
        gradoAcademico: null,   // numérico
        email: "",
        url_imagen: "",
        telefono: null,         // numérico
        dni: ""
    });

    const handlerAtras = () => {
        navigate('/jefe-operaciones/gestionar-usuarios/listar-asesores');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Convertimos a número los campos que lo requieren
        const parsedValue = ["telefono", "gradoAcademico"].includes(name)
            ? parseInt(value) || ""
            : value;

        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_PORT_ENV}/asesor/add`, formData);
            alert("Asesor añadido exitosamente");
            navigate('/jefe-operaciones/gestionar-usuarios/listar-asesores');
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
                                <select name="area" value={formData.area || ""} onChange={handleChange} className='bg-[#F9F9F9] w-full h-[55px] rounded-lg text-[#808080] p-4'>
                                    <option value="">Seleccione Área</option>
                                    <option value="145b58f1-b41f-4eeb-a196-a01fa9f43aa7">Salud</option>
                                    <option value="58e1231d-180a-4c6c-add1-990af1dcf4f7">Negocio</option>
                                    <option value="d307e9b1-9f62-40ba-989e-e9f7d4344324">Social</option>
                                    <option value="daf3c634-7cc7-4a99-a002-dddf4f7864e8">Legal</option>
                                    <option value="f0551441-7c5d-4765-aa3d-35530497250d">Ingeneria</option>
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
