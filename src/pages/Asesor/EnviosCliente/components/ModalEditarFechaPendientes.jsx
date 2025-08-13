import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { asuntosService } from "../../../../services/asuntosServices"

const ModalEditarFechaPendientes = ({ idAsunto, setShowModalEdit }) => {

    const [fecha, setFecha] = useState("")
    const [hora, setHora] = useState("")
    console.log(idAsunto)

    const mutate = useMutation({
        mutationFn: ({idAsunto, horario}) => asuntosService.editarFechaTerminadoAsuntoAsesor({idAsunto, horario}),
        onSuccess: () => {
            alert('Fecha Actualizado correctamente')
            onclose()
            setFecha("")
            setHora("")
        }
    })

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (fecha.trim() == "") return alert("Ingrese la hora y fecha")
        if (hora.trim() == "") return alert("Ingrese la hora y fecha")
        const horario = `${fecha} ${hora}`

        mutate.mutate({idAsunto,horario})
    }

    return (
        <div onClick={() => { setShowModalEdit(false) }} className="bg-black/50 w-full h-screen fixed top-0 left-0 z-40 flex items-center justify-center">
            <form onSubmit={handleSubmit} onClick={(event) => event.stopPropagation()} className="bg-white md:w-[500px] rounded-sm px-4 py-4 w-[95%] space-y-4">
                <h2 className="text-center text-xl">Editar</h2>
                <div className="flex gap-x-4 items-center">
                    <label htmlFor="">Estimado: </label>
                    <input value={fecha} onChange={(event) => setFecha(event.target.value)} type="date" className="border border-gray-300 py-2 px-3 outline-border" />
                    <input value={hora} onChange={(event) => setHora(event.target.value)} type="time" className="border border-gray-300 py-2 px-3 outline-border" />
                </div>
                <button type="submit" className="bg-[#ccc] block mx-auto px-8 py-2 rounded-sm mt-10">Guardar</button>
            </form>
        </div>
    )
}

export default ModalEditarFechaPendientes