import React, { useState } from 'react'
import LayoutApp from '../../layout/LayoutApp';
import Asignados from '../Administrador/SupervisorAsignar/Asignados';
import SinAsignados from '../Administrador/SupervisorAsignar/SinAsignar';

const SupervisorAsig = () => {

    const [asignado, setAsignado] = useState("SinAsignar");

    return (
        <LayoutApp>
            <div className="flex flex-col items-start overflow-auto ml-16 mt-5">

                <div className="flex w-full border-b-2 gap-3 border-black font-normal">
                    <button
                        className={`px-3 rounded-t-[5px] w-[115px] ${asignado === "SinAsignar" ? "bg-[#17162E] text-white" : ""}`}
                        onClick={() => setAsignado("SinAsignar")}
                    >
                        Sin Asignar
                    </button>
                    <button
                        className={`px-3 rounded-t-[5px] w-[105px] ${asignado === "Asignados" ? "bg-[#17162E] text-white" : ""}`}
                        onClick={() => setAsignado("Asignados")}
                    >
                        Asignados
                    </button>
                </div>

                <div className="flex flex-col gap-[10px]  pt-3 p-[30px] w-[1200px]  xl:w-full bg-white rounded-b-[10px] drop-shadow-lg border-3 ">
                    {asignado === "SinAsignar" ? (

                        <SinAsignados />
                    ): (
                        <Asignados />
                    )}


                </div>

            </div>
        </LayoutApp>

    )
}

export default SupervisorAsig