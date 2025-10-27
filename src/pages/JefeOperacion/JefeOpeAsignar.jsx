import React, { useState } from "react";
import flechaabajo from "../../assets/icons/Flecha.svg";
import flechaarriba from "../../assets/icons/arrow-up.svg";
import LayoutApp from "../../layout/LayoutApp";
import activado from "../../assets/icons/check.svg";
import desactivado from "../../assets/icons/delete.svg";
import { useQuery } from "@tanstack/react-query";
import { asesoriasService } from "../../services/asesoriasService";
import axios from "axios";

const safeFormatDate = (fecha) => {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-PE", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const JefeOpeAsignar = () => {
  const [expandedIds, setExpandedIds] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [contratoToChange, setContratoToChange] = useState(null);

  const { data: asesoria = [], refetch } = useQuery({
    queryKey: ["asesoria"],
    queryFn: async () => {
      const res = await asesoriasService.listarAsignadosJefeOpe();
      return res.map((c) => ({ ...c, estado: c.estado === "activo" }));
    },
    refetchOnWindowFocus: false,
    initialData: [],
  });

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const displayStudents = (estudiantes = []) => {
    if (!Array.isArray(estudiantes) || estudiantes.length === 0)
      return "----------";
    return estudiantes[0]?.estudiante ?? "----------";
  };

  const handleEstadoClick = (contrato) => {
    setContratoToChange(contrato);
    setShowConfirmModal(true);
  };

  const confirmEstadoChange = async () => {
    if (!contratoToChange) return;
    const nuevoEstado = contratoToChange.estado ? "desactivado" : "activo";
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_PORT_ENV}/asesoramiento/estado/${
          contratoToChange.id_asesoramiento
        }`,
        { estado: nuevoEstado }
      );
      await refetch();
      setShowConfirmModal(false);
      setContratoToChange(null);
    } catch (err) {
      console.error("Error al cambiar estado del asesoramiento:", err);
      setShowConfirmModal(false);
    }
  };

  const cancelEstadoChange = () => {
    setShowConfirmModal(false);
    setContratoToChange(null);
  };

  return (
    <LayoutApp>
      <div className="px-4 md:ml-10">
        <div className="bg-[#1C1C34] rounded-t-lg w-40 py-1 text-white text-center">
          Asignados
        </div>
        <div className="bg-white rounded-b-lg rounded-tr-lg p-5 overflow-x-auto">
          <div className="flex flex-col gap-5 min-w-[900px]">
            <h1 className="text-xl md:text-2xl font-medium">
              Asignaciones y Contratos Clientes
            </h1>

            {/* Encabezado */}
            <div className="flex justify-between px-1 text-[#495D72] text-center font-medium text-xs md:text-sm">
              <div className="min-w-[80px]">IdAsesoria</div>
              <div className="min-w-[200px]">Delegado</div>
              <div className="min-w-[160px]">Fin Contrato</div>
              <div className="min-w-[160px]">Tipo trabajo</div>
              <div className="min-w-[160px]">Área</div>
              <div className="min-w-[200px]">Alumnos</div>
              <div className="min-w-[200px]">Asesor</div>
              <div className="min-w-[100px]">Estado</div>
            </div>

            {/* Filas */}
            <div className="flex flex-col gap-1 px-1">
              {asesoria.map((contrato, index) => {
                const finContratoFmt =
                  safeFormatDate(contrato?.finContrato) ?? "Por Asignar";
                const tipoTrabajo =
                  contrato?.tipotrabajo ??
                  contrato?.tipoTrabajo ??
                  "Por Asignar";

                return (
                  <React.Fragment key={contrato.id_asesoramiento}>
                    <div
                      className={`flex items-center text-center justify-between px-1 rounded-md text-xs md:text-sm ${
                        index % 2 === 0 ? "bg-[#E9E7E7]" : ""
                      } py-2`}
                    >
                      <div className="min-w-[80px]">
                        {String(contrato.id_asesoramiento).padStart(4, "0")}
                      </div>
                      <div className="min-w-[200px]">
                        {contrato?.delegado ?? "—"}
                      </div>
                      <div className="min-w-[160px]">{finContratoFmt}</div>
                      <div className="min-w-[160px]">{tipoTrabajo}</div>
                      <div className="min-w-[160px]">
                        {contrato?.area ?? "—"}
                      </div>
                      <div className="min-w-[200px]">
                        {displayStudents(contrato?.cliente)}
                      </div>
                      <div className="min-w-[200px]">
                        {contrato?.asesor ?? "—"}
                      </div>

                      <div className="flex min-w-[100px] justify-between px-3">
                        <div className="text-[8px] flex flex-col items-center justify-center">
                          <button
                            onClick={() => handleEstadoClick(contrato)}
                            className={`w-[50px] h-[22px] font-semibold rounded-3xl border border-black flex items-center transition-all duration-300 ease-in-out 
                              ${
                                contrato.estado
                                  ? "bg-green-100 justify-end"
                                  : "bg-red-100 justify-start"
                              }`}
                          >
                            <div
                              className={`w-[18px] h-[18px] m-0.5 rounded-full transition-all duration-300 ease-in-out
                              ${
                                contrato.estado ? "bg-green-500" : "bg-red-500"
                              }`}
                            >
                              <img
                                className="h-full w-full transition-transform duration-300 ease-in-out"
                                src={contrato.estado ? activado : desactivado}
                                alt="estado"
                              />
                            </div>
                          </button>
                          <label className="mt-1 text-[10px]">
                            {contrato.estado ? "activado" : "desactivado"}
                          </label>
                        </div>

                        <button
                          onClick={() =>
                            toggleExpand(contrato.id_asesoramiento)
                          }
                        >
                          <img
                            src={
                              expandedIds.includes(contrato.id_asesoramiento)
                                ? flechaarriba
                                : flechaabajo
                            }
                            alt={
                              expandedIds.includes(contrato.id_asesoramiento)
                                ? "Cerrar"
                                : "Expandir"
                            }
                          />
                        </button>
                      </div>
                    </div>

                    {expandedIds.includes(contrato.id_asesoramiento) && (
                      <div
                        className={`px-4 py-2 rounded-b-md text-xs md:text-sm ${
                          index % 2 === 0 ? "bg-[#E9E7E7]" : "bg-white"
                        }`}
                      >
                        <div className="font-medium mb-2">Estudiantes :</div>
                        {Array.isArray(contrato?.cliente) &&
                        contrato.cliente.length > 0 ? (
                          <ul className="list-disc pl-5">
                            {contrato.cliente.map((estudiante) => (
                              <li key={estudiante.id_estudiante}>
                                {estudiante.estudiante}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-gray-500">
                            Solo tienes 1 estudiante
                          </div>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Confirmar cambio de estado
            </h3>
            <p className="mb-6">
              ¿Estás seguro de que deseas cambiar el estado de este contrato a
              {contratoToChange?.estado ? " DESACTIVADO" : " ACTIVADO"}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelEstadoChange}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmEstadoChange}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutApp>
  );
};

export default JefeOpeAsignar;
