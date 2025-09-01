import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import LayoutApp from '../../../layout/LayoutApp'
import axios from 'axios';

const EditarEstudiante = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [estudianteData, setEstudianteData] = useState({
        nombre: "",
        apellido: "",
        telefono: null,
        dni: "",
        carrera: "",
        gradoAcademico: null,
        universidad: "",
        pais: "",
        email: ""
    });

    useEffect(() => {
        const fetchEstudiante = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_PORT_ENV}/cliente/${id}`)
                const estudiante = response.data;
                setEstudianteData({
                    ...estudiante,
                    gradoAcademico: estudiante.gradoAcademico?.id || ""
                });
            } catch (error) {
                console.log("Error al obtener datos del estudiante", error);
            }
        };

        fetchEstudiante();
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = ["gradoAcademico", "telefono"].includes(name)
            ? parseInt(value) || ""
            : value;
        setEstudianteData(prev => ({ ...prev, [name]: parsedValue }));
    }


    const handlerAtras = () => {
        navigate('/admin/gestionar-usuarios')
    }

    const handleGuardar = async () => {

        const payload = {
            nombre: estudianteData.nombre,
            apellido: estudianteData.apellido,
            telefono: estudianteData.telefono,
            dni: estudianteData.dni,
            carrera: estudianteData.carrera,
            gradoAcademico: estudianteData.gradoAcademico,
            universidad: estudianteData.universidad,
            pais: estudianteData.pais,
            email: estudianteData.email
        };

        try {
            await axios.patch(`${import.meta.env.VITE_API_PORT_ENV}/cliente/update/${id}`, payload);
            alert("Asesor actualizado correctamente");
            navigate('/admin/gestionar-usuarios');
        } catch (error) {
            console.error("Error al guardar cambios:", error);
            alert("Error al actualizar asesor.");
        }

    };



    return (
        <LayoutApp>
            <main className="m-20">

                <div className='ml-8 fondo_login rounded-t-[20px] w-full h-14 '>

                </div>
                <div className="flex flex-col  gap-[40px] ml-8  pb-12 pt-[38px] w-full h-full px-5 bg-white rounded-b-[20px] ">

                    <div className='flex flex-col gap-4'>

                        <div className='flex gap-10'>

                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Nombres</p>
                                <input
                                  name="nombre"
                                  placeholder='Nombre'
                                  className='flex bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] items-center p-4'
                                  value={estudianteData.nombre}
                                  onChange={handleChange}
                                />

                            </div>

                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Apellidos</p>
                                <input 
                                  name="apellido"
                                  placeholder='Apellido'
                                  className='flex bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] items-center p-4' 
                                  value={estudianteData.apellido}
                                  onChange={handleChange}  
                                 />

                            </div>

                        </div>

                        <div className='flex  gap-10 '>

                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Telefono</p>
                                <input 
                                  name="telefono"
                                  placeholder='Telefono'
                                  className='flex bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] items-center p-4' 
                                  value={estudianteData.telefono}
                                  onChange={handleChange}
                                />

                            </div>
                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>DNI</p>
                                <input 
                                  name="dni"
                                  placeholder='Dni'
                                  className='flex bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] items-center p-4' 
                                  value={estudianteData.dni}
                                  onChange={handleChange}  
                                />
                            </div>

                        </div>

                        <div className='flex  gap-10 '>

                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Carrera</p>
                                <input 
                                  name="carrera"
                                  placeholder='Carrera'
                                  className='flex bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] items-center p-4' 
                                  value={estudianteData.carrera}
                                  onChange={handleChange}
                                />
                            </div>
                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Actual nivel educativo</p>
                                <select 
                                  name="gradoAcademico"
                                  value={estudianteData.gradoAcademico || ""}
                                  onChange={handleChange}
                                  className='flex bg-[#F9F9F9] w-full h-[55px] rounded-lg text-[#808080] items-center p-4'  
                                >
                                  <option value="">Seleccine GradoAcademico</option>
                                  <option value={1}>Estudiante Pregrado</option>
                                  <option value={2}>Bachiller</option>
                                  <option value={3}>Titulado</option>
                                  <option value={4}>Maestria</option>
                                  <option value={5}>Doctorado</option>
                                </select>
                            </div>

                        </div>



                        <div className='flex  gap-10 '>

                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Universidad</p>
                                <input 
                                  name="universidad"
                                  placeholder="Universidad" 
                                  value={estudianteData.universidad}
                                  onChange={handleChange}
                                  className='flex bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] items-center p-4' 
                                />

                            </div>
                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Pais</p>
                                <input 
                                  name="pais"                                
                                  placeholder="Pais"
                                  value={estudianteData.pais}
                                  onChange={handleChange}
                                  className='flex bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] items-center p-4' 
                                  />
                            </div>

                        </div>

                        <div className='flex gap-10 items-end'>

                            <div className='flex flex-col gap-3 w-full'>
                                <p className='pl-[1px]'>Correo</p>
                                <input 
                                  name="correo"
                                  placeholder="Correo" 
                                  className='flex bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] items-center p-4' 
                                  value={estudianteData.email}
                                  onChange={handleChange}
                                />
                            </div>

                            <div className='flex w-full h-full gap-[50px] justify-center'>
                                <button onClick={handlerAtras}  className=' h-[46px] w-[180px] flex justify-center items-center p-4 rounded-lg border border-black'>
                                    Cancelar
                                </button>
                                <button onClick={handleGuardar} className=' h-[46px] w-[180px] flex justify-center items-center fondo_login text-white p-4 rounded-lg'>
                                    Modificar
                                </button>
                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </LayoutApp>
    )

}

export default EditarEstudiante