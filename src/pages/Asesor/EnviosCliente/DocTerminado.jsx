import React, { useEffect, useState } from "react";
import axios from "axios";
import documentosVacios from "../../../assets/icons/documentosVacios.png";
import { useOutletContext } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import ModalEditarDoc from "./components/ModalEditarDoc";

const DocTerminado = () => {
  const [terminados, setTerminado] = useState([]);
  const [loading, setLoading] = useState(true);
  const idAsesoramiento = useOutletContext();

  const [idAsunto, setIdAsunto] = useState(null);
  const [showEditarModal, setShowEditarModal] = useState(false);

  useEffect(() => {
    if (idAsesoramiento) {
      setLoading(true);
      axios
        .get(
          `${
            import.meta.env.VITE_API_PORT_ENV
          }/asuntos/terminados/${idAsesoramiento}`
        )
        .then((response) => setTerminado(response.data))
        .catch((error) => {
          console.error("Error al obtener los terminados:", error);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [idAsesoramiento]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("es-PE", options);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    let horas = date.getUTCHours();
    const minutos = date.getUTCMinutes().toString().padStart(2, "0");
    const ampm = horas >= 12 ? "PM" : "AM";
    horas = horas % 12 || 12;
    return `${horas.toString().padStart(2, "0")}:${minutos} ${ampm}`;
  };

  const SkeletonRow = () => (
    <div className="grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-7 gap-2 bg-[#E9E7E7] p-2 rounded-md animate-pulse">
      <div className="h-6 bg-gray-300 rounded"></div>
      <div className="h-6 bg-gray-300 rounded"></div>
      <div className="hidden sm:block h-6 bg-gray-300 rounded"></div>
      <div className="hidden sm:block lg:hidden h-6 bg-gray-300 rounded"></div>
      <div className="hidden lg:block h-6 bg-gray-300 rounded"></div>
      <div className="hidden lg:block h-6 bg-gray-300 rounded"></div>
      <div className="h-6 bg-gray-300 rounded"></div>
    </div>
  );

  return (
    <>
      {/* Encabezado grande (solo en desktop) */}
      <div className="hidden lg:grid grid-cols-7 font-medium text-[#495D72] text-[14px] gap-2 p-2 rounded-md">
        <div>Nombre Entregas</div>
        <div className="text-center">Envio Tesista</div>
        <div className="text-center">En Desarrollo Asesor</div>
        <div className="text-center">Actividad Finalizada</div>
        <div className="text-center">Hora</div>
        <div className="text-center">Estado</div>
        <div className="text-center">Editar</div>
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-2 text-[14px] h-[180px] overflow-auto">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : terminados.length > 0 ? (
          terminados.map((terminado) => (
            <div
              key={terminado.id}
              className="grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-7 gap-2 text-[#2B2829] font-normal bg-[#E9E7E7] p-2 rounded-md items-center"
            >
              {/* Col 1: Título */}
              <div>{terminado.titulo}</div>

              {/* Col 2: Entrega */}
              <div className="text-center">
                {formatDate(terminado.fecha_entregado)}
              </div>

              {/* Col 3: Proceso (tablet y +) */}
              <div className="hidden sm:block text-center">
                {formatDate(terminado.fecha_proceso)}
              </div>

              {/* Col 4: Terminado (desktop) */}
              <div className="hidden lg:block text-center">
                {formatDate(terminado.fecha_terminado)}
              </div>

              {/* Col 5: Hora (desktop) */}
              <div className="hidden lg:block text-center">
                {formatTime(terminado.fecha_terminado)}
              </div>

              {/* Col 6: Estado */}
              <div className="rounded-md px-3 bg-[#353563] flex justify-center text-white">
                {terminado.estado}
              </div>

              {/* Col 7: Botón Editar */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setIdAsunto(terminado.id);
                    setShowEditarModal(true);
                  }}
                  className="p-2 bg-[#353563] rounded-md text-white"
                >
                  <FaRegEdit size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center">
            <div className="flex flex-col border rounded-[12px] text-[12px] justify-center items-center w-[280px] sm:w-[370px] lg:w-full h-[120px] sm:h-[190px] gap-5 text-[#82777A] shadow">
              <img src={documentosVacios} alt="" />
              No hay envíos realizados
            </div>
          </div>
        )}
      </div>

      {showEditarModal && (
        <ModalEditarDoc
          idAsunto={idAsunto}
          onClose={() => setShowEditarModal(false)}
        />
      )}
    </>
  );
};

export default DocTerminado;
