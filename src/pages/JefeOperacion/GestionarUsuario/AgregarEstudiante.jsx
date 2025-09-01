import React, { useState } from 'react';
import LayoutApp from '../../../layout/LayoutApp';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AgregarEstudiante = () => {
    const navigate = useNavigate();

    // Definir el estado para almacenar los datos del formulario
    const [clienteData, setClienteData] = useState({
        dni: '',
        nombre: '',
        apellido: '',
        telefono: null,
        email: '',
        pais: '',
        gradoAcademico: null,
        universidad: '',
        carrera: ''
    });

    // Función para ir atrás
    const handlerAtras = () => {
        navigate('/admin/gestionar-usuarios/listar-estudiantes');
    };

    // Función que maneja los cambios en los campos de entrada
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Convertimos a número los campos que lo requieren
        const parsedValue = ["telefono", "gradoAcademico"].includes(name)
            ? parseInt(value) || ""
            : value;

        setClienteData(prev => ({ ...prev, [name]: parsedValue }));
    };

    // Función que maneja el envío del formulario para agregar el nuevo cliente
    const handleSubmit = async () => {
            try {
                await axios.post(`${import.meta.env.VITE_API_PORT_ENV}/cliente/add`, clienteData);
                alert("Cliente añadido exitosamente");
                navigate('/admin/gestionar-usuarios/listar-estudiantes');
            } catch (error) {
                console.error("Error al añadir asesor:", error);
                alert("Error al guardar asesor. Revisa los datos.");
            }
        };

    

    return (
        <LayoutApp>
            <main className="m-20">
                <div className='ml-8 fondo_login rounded-t-[20px] w-full h-14 '> </div>
                <div className="flex flex-col gap-[40px] ml-8 pb-12 pt-[38px] w-full h-full px-5 bg-white rounded-b-[20px] ">

                    <div className='flex flex-col gap-4'>

                        <div className='flex gap-10'>

                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Nombres</p>
                                <input
                                    name="nombre"
                                    value={clienteData.nombre}
                                    onChange={handleChange}
                                    placeholder='Ingrese nombres'
                                    className='flex bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] items-center p-4'
                                />
                            </div>

                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Apellidos</p>
                                <input
                                    name="apellido"
                                    value={clienteData.apellido}
                                    onChange={handleChange}
                                    placeholder='Ingrese apellidos'
                                    className='flex bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] items-center p-4'
                                />
                            </div>

                        </div>

                        <div className='flex gap-10 '>

                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Telefono</p>
                                <input
                                    name="telefono"
                                    value={clienteData.telefono}
                                    onChange={handleChange}
                                    placeholder='Agregar Telefono'
                                    className='flex bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] items-center p-4'
                                />
                            </div>
                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>DNI</p>
                                <input
                                    name="dni"
                                    value={clienteData.dni}
                                    onChange={handleChange}
                                    placeholder='Ingrese dni'
                                    className='flex bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] items-center p-4'
                                />
                            </div>

                        </div>

                        <div className='flex gap-10 '>

                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Universidad</p>
                                <input
                                    name="universidad"
                                    value={clienteData.universidad}
                                    onChange={handleChange}
                                    placeholder='Ingresar Universidad'
                                    className='flex bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] items-center p-4'
                                />
                            </div>
                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Grado Academico</p>
                                <select
                                    name="gradoAcademico"
                                    value={clienteData.gradoAcademico || ""}
                                    onChange={handleChange}
                                    className='flex bg-[#F9F9F9] w-full h-[55px] rounded-lg text-[#808080] items-center p-4'>
                                    <option value="">Seleccione nivel</option>
                                    <option value={1}>Estudiante Pregrado</option>
                                    <option value={2}>Bachiller</option>
                                    <option value={3}>Licenciado</option>
                                    <option value={4}>Maestría</option>
                                    <option value={5}>Doctorado</option>
                                </select>
                            </div>

                        </div>

                        <div className='flex gap-10 '>

                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Correo electrónico</p>
                                <input
                                    name="email"
                                    value={clienteData.email}
                                    onChange={handleChange}
                                    placeholder='Ingrese Correo'
                                    className='flex bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] items-center p-4'
                                />
                            </div>
                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Pais</p>
                                <input
                                    name="pais"
                                    value={clienteData.pais}
                                    onChange={handleChange}
                                    placeholder='Ingrese pais'
                                    className='flex bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] items-center p-4'
                                />
                            </div>

                        </div>

                        <div className='flex gap-10 items-end'>

                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Carrera</p>
                                <input
                                    name="carrera"
                                    value={clienteData.carrera}
                                    onChange={handleChange}
                                    placeholder='Ingrese la Carrera '
                                    className='flex bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] items-center p-4'
                                />
                            </div>

                            <div className='flex w-full h-full gap-[50px] justify-center'>
                                <button onClick={handlerAtras} className=' h-[46px] w-[180px] flex justify-center items-center p-4 rounded-lg border border-black'>
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className=' h-[46px] w-[180px] flex justify-center items-center fondo_login text-white p-4 rounded-lg'>
                                    Añadir
                                </button>
                            </div>

                        </div>

                    </div>

                </div>

            </main>
        </LayoutApp>
    );
}

export default AgregarEstudiante;
