import React, { useState, useEffect } from 'react'

const EditarAlContado = ({ cliente, onUpdate, cerrar }) => {
    const [monto, setMonto] = useState('')
    const [fechaPago, setFechaPago] = useState('')

    useEffect(() => {
        if (cliente) {
            setMonto(cliente.ultimo_monto.toString())
            
            // Formatear la fecha para el input type="date"
            if (cliente.fecha_ultimo_pago) {
                const date = new Date(cliente.fecha_ultimo_pago)
                const formattedDate = date.toISOString().split('T')[0]
                setFechaPago(formattedDate)
            }
        }
    }, [cliente])

    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Convertir la fecha al formato esperado por el backend
        const fechaPagoFormatted = fechaPago ? `${fechaPago} 00:00:00` : null
        
        onUpdate(cliente.id_infoPago, {
            pago_total: parseFloat(monto),
            fecha_pago: fechaPagoFormatted
        })
    }

    return (
        <div className='flex flex-col absolute gap-[15px] top-80 left-[500px] px-10 py-12 w-[875px] rounded-lg bg-white border border-[#D2CECF]'>
            <h1 className='text-xl font-medium'>Editar</h1>

            <div className='flex justify-between'>
                <div className='flex flex-col w-[369px] h-[82px] gap-[15px]'>
                    <h2 className='font-medium'>Alumno:</h2>
                    <input 
                        value={cliente?.delegado || ''} 
                        readOnly
                        className='flex items-center rounded-2xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium' 
                    />
                </div>
            </div>

            <div className='flex justify-between gap-[15px]'>
                <div className='flex flex-col w-full h-[82px] gap-[15px]'>
                    <h2 className='font-medium'>Monto:</h2>
                    <input 
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        placeholder='Ingrese el monto' 
                        className='flex items-center rounded-2xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium' 
                    />
                </div>

                <div className='flex flex-col w-full h-[82px] gap-[15px]'>
                    <h2 className='font-medium'>Fecha Pago:</h2>
                    <input 
                        type='date' 
                        value={fechaPago}
                        onChange={(e) => setFechaPago(e.target.value)}
                        className='flex items-center rounded-2xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium' 
                    />
                </div>
            </div>

            <div className='flex w-full py-4 px-1 h-[68px] justify-end gap-4'>
                <button 
                    onClick={handleSubmit}
                    className='h-7 w-[100px] border border-black rounded-[4px] text-[11px] font-bold text-[#02242B]'
                >
                    Editar
                </button>
                <button 
                    onClick={cerrar} 
                    className='h-7 w-[100px] border bg-black rounded-[4px] text-[11px] font-bold text-white'
                >
                    Cancelar
                </button>
            </div>
        </div>
    )
}

export default EditarAlContado