import React from 'react'
import eliminar from "../../../assets/icons/delete.svg";
import LayoutApp from '../../../layout/LayoutApp';
import { useNavigate } from 'react-router-dom';
const NuevaAsesoria = () => {

    const navigate = useNavigate();

    return (
        <LayoutApp>
            <div className='ml-16 flex flex-col gap-[10px]  pt-3 p-[30px] w-[1200px]  xl:w-full bg-white rounded-[10px] drop-shadow-lg border-3 '>
                <h1 className='text-[20px] font-medium'>Nueva Asignacion</h1>
                <div className='mb-2'>

                    <div className="flex flex-row gap-1 mb-2 items-center">
                        <p className="font-medium">Delegado:</p>
                        <div className="flex w-52 items-center justify-between border gap-1 rounded px-2 py-[5px] bg-white shadow-sm">
                            <span className="text-sm">Juan Ramirez Garcia</span>
                            <button >
                                <img src={eliminar} alt="" />
                            </button>
                        </div>
                    </div>
                    <div className="flex w-52 items-center justify-between border gap-1 rounded px-2 py-[5px] bg-white shadow-sm">
                        <span className="text-sm">Juan Ramirez Garcia</span>
                        <button >
                            <img src={eliminar} alt="" />
                        </button>
                    </div>
                </div>


                <div className='rounded-md bg-[#E4E2E2] p-1 mb-4'>
                    <input className="bg-transparent w-full focus:outline-none text-black placeholder:text-[#888]" type="text" placeholder="Buscar por ID, DNI o nombre..." />
                </div>
                <div>
                    <div className="flex justify-between text-[#495D72] font-medium p-[6px] rounded-md">
                        <div className="w-[40px] flex justify-center">ID</div>
                        <div className="w-[300px] flex justify-center">Alumno</div>
                        <div className="w-[160px] flex justify-center">Fecha de Creacion</div>
                        <div className="w-[360px] flex justify-center">Carrera</div>
                        <div className="w-[180px] flex justify-center">Accion</div>
                    </div>

                    <div className="flex justify-between text-[#2B2829] font-normal bg-[#E9E7E7] p-[6px] rounded-md">
                        <div className="w-[40px] flex justify-center">001</div>
                        <div className="w-[300px] flex justify-center">Juan Mateo Pérez Vinlof</div>
                        <div className="w-[160px] flex justify-center">25/07/24</div>
                        <div className="w-[360px] flex justify-center">Administración de empresas</div>
                        <button className="w-[180px] rounded-md  bg-[#1C1C34] flex justify-center text-white">Elegir</button>
                    </div>

                    <div className="flex justify-between text-[#2B2829] font-normal  p-[6px] rounded-md">
                        <div className="w-[40px] flex justify-center">001</div>
                        <div className="w-[300px] flex justify-center">Juan Mateo Pérez Vinlof</div>
                        <div className="w-[160px] flex justify-center">25/07/24</div>
                        <div className="w-[360px] flex justify-center">Administración de empresas</div>
                        <button className="w-[180px] rounded-md  bg-[#1C1C34] flex justify-center text-white">Elegir</button>
                    </div>

                    <div className="flex justify-between text-[#2B2829] font-normal bg-[#E9E7E7] p-[6px] rounded-md">
                        <div className="w-[40px] flex justify-center">001</div>
                        <div className="w-[300px] flex justify-center">Juan Mateo Pérez Vinlof</div>
                        <div className="w-[160px] flex justify-center">25/07/24</div>
                        <div className="w-[360px] flex justify-center">Administración de empresas</div>
                        <button className="w-[180px] rounded-md  bg-[#1C1C34] flex justify-center text-white">Elegir</button>
                    </div>

                    <div className="flex justify-between text-[#2B2829] font-normal  p-[6px] rounded-md">
                        <div className="w-[40px] flex justify-center">001</div>
                        <div className="w-[300px] flex justify-center">Juan Mateo Pérez Vinlof</div>
                        <div className="w-[160px] flex justify-center">25/07/24</div>
                        <div className="w-[360px] flex justify-center">Administración de empresas</div>
                        <button className="w-[180px] rounded-md  bg-[#1C1C34] flex justify-center text-white">Elegir</button>
                    </div>

                </div>

                <div className='flex justify-between xl:flex-row flex-col gap-4 mt-5'>
                    <select

                        className='border border-black rounded-md px-[14px] xl:w-[275px] h-9'
                    >
                        <option value="" disabled>Áreas</option>
                        <option value={1}>Negocios</option>
                        <option value={2}>Social</option>
                        <option value={3}>Salud</option>
                        <option value={4}>Ingeniería</option>
                        <option value={5}>Legal</option>
                    </select>

                    <select

                        className='border border-black rounded-md px-[14px] xl:w-[555px] h-9'
                    >
                        <option value="" disabled>Asesor</option>
                        <option value={1}>Juan Ramirez Garcia</option>
                        <option value={2}>Maria Lopez</option>
                        <option value={3}>Carlos Perez</option>
                    </select>
                </div>

                <div className='flex gap-5 mt-4 items-center '>
                    <p>Referencia: </p>
                    <div className='rounded-md border border-black p-1 '>
                        <input className="bg-transparent w-full focus:outline-none text-black placeholder:text-[#888]" type="text" />
                    </div>

                </div>

                <div className='flex justify-end gap-10'>
                    <button
                        className='w-[200px] bg-[#1C1C34] text-white rounded-md  py-2 mt-4'
                        onClick={() => navigate('/supervisor/asignaciones')}
                    > Cancelar</button>
                    <button className='w-[200px] bg-[#1C1C34] text-white rounded-md  py-2 mt-4'>Asignar</button>
                </div>
            </div>
        </LayoutApp>

    )
}

export default NuevaAsesoria