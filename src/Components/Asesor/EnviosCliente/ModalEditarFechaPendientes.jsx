import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { asuntosService } from "../../../services/asuntosServices";

const ModalEditarFechaPendientes = ({ idAsunto, setShowModalEdit }) => {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("12"); // valor por defecto 12
  const [minuto, setMinuto] = useState("00"); // valor por defecto 00
  const [ampm, setAmpm] = useState("AM"); // AM o PM

  const mutate = useMutation({
    mutationFn: ({ idAsunto, fecha_estimada }) =>
      asuntosService.editarFechaTerminadoAsuntoAsesor({
        idAsunto,
        fecha_estimada,
      }),
    onSuccess: () => {
      alert("Fecha actualizada correctamente");
      setShowModalEdit(false);
      setFecha("");
      setHora("12");
      setMinuto("00");
      setAmpm("AM");
    },
    onError: (error) => {
      alert(`Error: ${error.message || "Ocurrió un error inesperado"}`);
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fecha || !hora || !minuto) {
      return alert("Por favor ingrese la fecha y hora correctamente");
    }

    let hora12 = parseInt(hora, 10);
    let minutos = parseInt(minuto, 10);

    if (isNaN(hora12) || isNaN(minutos)) {
      return alert("La hora o los minutos no son válidos");
    }

    // Convertir a formato 24h
    let hora24 = hora12;
    if (ampm === "PM" && hora12 !== 12) hora24 += 12;
    if (ampm === "AM" && hora12 === 12) hora24 = 0;

    const horaStr = hora24.toString().padStart(2, "0");
    const minStr = minutos.toString().padStart(2, "0");

    // ✅ Construir string exacto sin UTC
    const fecha_estimada = `${fecha} ${horaStr}:${minStr}:00`;

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

        <div className="flex gap-x-2 items-center">
          <label htmlFor="">Hora: </label>
          <select
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="border border-gray-300 py-2 px-2"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const h = (i + 1).toString();
              return (
                <option key={h} value={h}>
                  {h}
                </option>
              );
            })}
          </select>
          :
          <select
            value={minuto}
            onChange={(e) => setMinuto(e.target.value)}
            className="border border-gray-300 py-2 px-2"
          >
            {Array.from({ length: 60 }, (_, i) => {
              const m = i.toString().padStart(2, "0");
              return (
                <option key={m} value={m}>
                  {m}
                </option>
              );
            })}
          </select>
          <select
            value={ampm}
            onChange={(e) => setAmpm(e.target.value)}
            className="border border-gray-300 py-2 px-2"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
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
