import { useState } from 'react'
import LayoutApp from '../../layout/LayoutApp'
import Pendientes from '../../Components/Administrador/GestionSoporte/Pendientes';
import Hechos from '../../Components/Administrador/GestionSoporte/Hechos';


const GestionSoporte = () => {

    const [vista, setVista] = useState("pendientes");

    return (
        <LayoutApp>
            <main className="flex flex-col gap-11 m-5 items-start overflow-auto">
                <div className="flex flex-col gap-[10px] px-[40px] py-5  w-[1200px] xl:w-full  bg-white rounded-[10px]">
                    <div className="flex flex-col gap-[12px]">
                        <div className=" mt-5 flex justify-between">
                            <h2 className="text-2xl font-bold">Soporte</h2>
                        </div>

                        <div className="flex w-full border-b-2 gap-3 border-black font-normal">
                            <button
                                className={`px-3 rounded-t-[5px] w-[115px] ${vista === "pendientes" ? "bg-[#17162E] text-white" : ""
                                    }`}
                                onClick={() => setVista("pendientes")}
                            >
                                Pendientes
                            </button>
                            <button
                                className={`px-3 rounded-t-[5px] w-[105px] ${vista === "hechos" ? "bg-[#17162E] text-white" : ""
                                    }`}
                                onClick={() => setVista("hechos")}
                            >
                                Hechos
                            </button>
                        </div>
                    </div>
                    <div>
                        {vista === "pendientes" ? (
                            <Pendientes />
                        ) : (
                            <Hechos />
                        )}
                    </div>
                    
                </div>

            </main>
        </LayoutApp>
    )
}

export default GestionSoporte