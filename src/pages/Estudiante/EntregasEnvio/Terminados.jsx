import React, { useEffect, useState } from "react";
import documentosVacios from "../../../assets/icons/documentosVacios.png";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const Terminados = () => {
  const [terminados, setTerminado] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedAsesoriaId: idAsesoramiento } = useOutletContext();

  useEffect(() => {
    if (idAsesoramiento) {
      setLoading(true);
      axios
        .get(
          `${
            import.meta.env.VITE_API_PORT_ENV
          }/asuntos/terminados/${idAsesoramiento}`
        )
        .then((response) => {
          setTerminado(() => {
            return response.data.map((item) => ({
              titulo: item.titulo || item.titulo_asesor || "Sin título",
              fecha_entregado: item.fecha_entregado,
              fecha_proceso: item.fecha_proceso,
              fecha_terminado: item.fecha_terminado,
              estado: item.estado,
            }));
          });
        })
        .finally(() => {
          setLoading(false);
        });
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

    return new Intl.DateTimeFormat("es-PE", {
      timeZone: "America/Lima",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  // Componente Skeleton para filas
  const SkeletonRow = () => (
    <div className="flex justify-between bg-[#E9E7E7] p-[6px] rounded-md animate-pulse">
      <div className="w-[300px] h-6 bg-gray-300 rounded"></div>
      <div className="w-[300px] h-6 bg-gray-300 rounded"></div>
      <div className="w-[300px] h-6 bg-gray-300 rounded"></div>
      <div className="w-[300px] h-6 bg-gray-300 rounded"></div>
      <div className="w-[102px] h-6 bg-gray-300 rounded"></div>
      <div className="w-[102px] h-6 bg-gray-300 rounded"></div>
    </div>
  );

  return (
    <>
      {/* Mostrar cabecera solo si hay datos y no está cargando */}
      {!loading && terminados.length > 0 && (
        <div className="flex justify-between text-[#495D72] font-normal p-[6px] rounded-md">
          <div className="mn:w-[300px] text-xs md:text-base flex">
            Nombre Entregas
          </div>
          <div className="w-[300px] text-xs md:text-base hidden md:flex justify-center">
            Envio Tesista
          </div>
          <div className="w-[300px] text-xs md:text-base hidden md:flex justify-center">
            En Desarrollo Asesor
          </div>
          <div className="w-[300px] text-xs md:text-base hidden md:flex justify-center">
            Actividad Finalizada
          </div>
          <div className="w-[100px] mn:w-[102px] text-xs md:text-base flex ">
            Hora
          </div>
          <div className="w-[102px] px-3 flex text-xs md:text-base justify-center">
            Estado
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 max-h-[280px] overflow-auto">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : terminados.length > 0 ? (
          terminados.map((terminado, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-[#2B2829] font-normal bg-[#E9E7E7] p-[6px] rounded-md text-xs lg:text-base"
            >
              <div className="mn:w-[300px] flex">{terminado.titulo}</div>
              <div className="w-[300px] hidden md:flex justify-center">
                Entregado: {formatDate(terminado.fecha_entregado)}
              </div>
              <div className="w-[300px] hidden md:flex justify-center">
                Proceso: {formatDate(terminado.fecha_proceso)}
              </div>
              <div className="w-[300px] hidden md:flex justify-center">
                Terminado: {formatDate(terminado.fecha_terminado)}
              </div>
              <div className="w-[102px] justify-center">
                {formatTime(terminado.fecha_terminado)}
              </div>
              <div className="rounded-md px-3 bg-[#353563] flex justify-center text-white">
                {terminado.estado}
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center">
            <div className="flex flex-col text-[12px] justify-center items-center w-[280px] sm:w-[370px] mn:w-[335px] lg:w-full h-[120px] sm:h-[190px] gap-5 text-[#82777A]">
              <img src={documentosVacios} alt="" />
              No hay envíos realizados
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Terminados;
