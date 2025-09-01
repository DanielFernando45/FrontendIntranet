import React, { useState } from 'react'
import LayoutApp from '../../layout/LayoutApp'
import ContratoNuevo from '../ContPago/Contrato/ContratoNuevo'
import ContratoAsignado from '../ContPago/Contrato/ContratoAsignado'


const Contrato = () => {

    const [contratado, setContrato] = useState("ContratoNuevo");

    return (
        <LayoutApp>
            <div className="flex flex-col gap-11 m-5 items-start overflow-auto" >
                <div className="flex flex-col gap-[10px] px-[40px] py-5 w-full bg-white rounded-[10px]">
                    <div className="flex flex-col gap-[12px]">

                        <div className="flex w-full border-b-2 gap-3 border-black font-normal">
                            <button
                                className={`px-3 rounded-t-[5px] w-[200px] ${contratado === "ContratoNuevo" ? "bg-[#17162E] text-white" : ""}`}
                                onClick={() => setContrato("ContratoNuevo")}
                            >
                                Nuevo Contrato
                            </button>
                            <button
                                className={`px-3 rounded-t-[5px] w-[200px] ${contratado === "ContratoAsignado" ? "bg-[#17162E] text-white" : ""}`}
                                onClick={() => setContrato("ContratoAsignado")}
                            >
                                Contratos Asignados
                            </button>

                        </div>

                    </div>

                    <div>
                        {contratado === "ContratoNuevo" ? (
                            <ContratoNuevo />
                        ) : (
                            <ContratoAsignado />
                        )}
                    </div>


                </div>

            </div>
        </LayoutApp>
    )
}

export default Contrato