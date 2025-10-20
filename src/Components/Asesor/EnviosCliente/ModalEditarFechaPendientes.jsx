import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { asuntosService } from "../../../services/asuntosServices";
import toast from "react-hot-toast";

const ModalEditarFechaPendientes = ({ idAsunto, setShowModalEdit }) => {
  const [fecha, setFecha] = useState("");

  const mutate = useMutation({
    mutationFn: ({ idAsunto, fecha_estimada }) =>
      asuntosService.editarFechaTerminadoAsuntoAsesor({
        idAsunto,
        fecha_estimada,
      }),
    onSuccess: () => {
      toast.success("Fecha actualizada correctamente");
      setShowModalEdit(false);
      setFecha("");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message || "Ocurrió un error inesperado"}`);
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fecha) {
      return toast.error("Por favor selecciona una fecha válida");
    }

    const fecha_estimada = fecha; // ✅ solo la fecha sin hora

    console.log("✅ Fecha Estimada a enviar:", fecha_estimada);

    mutate.mutate({ idAsunto, fecha_estimada });
  };

  return (
    <div
      onClick={() => setShowModalEdit(false)}
      className="bg-black/50 w-full h-screen fixed top-0 left-0 z-40 flex items-center justify-center"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="bg-white md:w-[500px] rounded-sm px-4 py-4 w-[95%] space-y-4"
      >
        <h2 className="text-center text-xl">Editar Fecha Estimada</h2>
        <div className="flex gap-x-4 items-center">
          <label htmlFor="">Fecha: </label>
          <input
            value={fecha}
            onChange={(event) => setFecha(event.target.value)}
            type="date"
            className="border border-gray-300 py-2 px-3 outline-border"
          />
        </div>

        <button
          type="submit"
          className="bg-[#0CB2D5] text-white block mx-auto px-8 py-2 rounded-sm mt-10 hover:bg-[#089dbb]"
        >
          Guardar
        </button>
      </form>
    </div>
  );
};

export default ModalEditarFechaPendientes;
