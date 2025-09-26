  import React, { useEffect, useState } from "react";
  import arrowIcon from "../../../assets/icons/IconEstudiante/arriba.svg";
  import documentosVacios from "../../../assets/icons/documentosVacios.png";
  import axios from "axios";
  import { useOutletContext } from "react-router-dom";
  import { FaRegEdit } from "react-icons/fa";
  import { IoTrash } from "react-icons/io5";
  import ModalEditarAsunto from "../../../Components/Cliente/ModalEditarAsunto";
  import { useMutation } from "@tanstack/react-query";
  import { asuntosService } from "../../../services/asuntosServices";

  const Pendientes = () => {
    const [pendientes, setPendientes] = useState([]);
    const [openItems, setOpenItems] = useState({});
    const [loading, setLoading] = useState(true);

    const { selectedAsesoriaId: idAsesoramiento, showNewAdvanceButton } =
      useOutletContext();

    const [showEditarModal, setShowEditarModal] = useState(false);
    const [idAsunto, setIdAsunto] = useState(null);

    const mutate = useMutation({
      mutationFn: (idAsunto) => asuntosService.eliminarAsunto(idAsunto),
    });

    const handleDeleteAsunto = async (id) => {
      const confirmacion = confirm(
        "¿Estás de acuerdo con eliminar este documento?"
      );
      if (confirmacion) {
        // Acción si el usuario presiona "Sí"
        mutate.mutate(id);
        alert("El documento ha sido eliminado.");
      } else {
        // Acción si el usuario presiona "No"
        alert("El documento no ha sido eliminado.");
      }
    };

    useEffect(() => {
      if (idAsesoramiento) {
        setLoading(true);
        axios
          .get(
            `${import.meta.env.VITE_API_PORT_ENV}/asuntos/all/${idAsesoramiento}`
          )
          .then((response) => {
            setPendientes(response.data);
            // Inicializar estado de apertura
            const initialOpenState = {};
            response.data.forEach((item) => {
              initialOpenState[item.id_asunto] = false;
            });
            setOpenItems(initialOpenState);
          })
          .catch((error) => {
            console.error("Error al obtener los pendientes:", error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }, [idAsesoramiento]);

    const toggleOpen = (id) => {
      setOpenItems((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    };

    const formatDateExpan = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const options = { month: "short", day: "numeric" };
      return date.toLocaleDateString("es-PE", options);
    };

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const options = { month: "short", day: "numeric", year: "numeric" };
      return date.toLocaleDateString("es-PE", options);
    };

    const formatTime = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);

      // Obtener hora y minutos en UTC
      let horas = date.getUTCHours();
      const minutos = date.getUTCMinutes().toString().padStart(2, "0");

      // Determinar AM/PM
      const ampm = horas >= 12 ? "PM" : "AM";

      // Convertir a formato de 12 horas con dos dígitos
      horas = horas % 12;
      horas = horas ? horas.toString().padStart(2, "0") : "12"; // La hora 0 se convierte en 12

      // Concatenar
      const hora12ConAmPm = `${horas}:${minutos} ${ampm}`;

      return hora12ConAmPm;
    };

    const cortarTexto = (texto) => {
      const index = texto.indexOf("-");
      if (index !== -1) {
        return texto.substring(index + 1);
      }
      return texto;
    };

    // Componente Skeleton para la fila principal
    const SkeletonRow = () => (
      <div className="flex flex-col bg-[#E9E7E7] p-[6px] rounded-md px-6 animate-pulse">
        <div className="flex justify-between items-center py-1">
          <div className="w-[300px] h-6 bg-gray-300 rounded"></div>
          <div className="w-[250px] h-6 bg-gray-300 rounded"></div>
          <div className="w-[100px] h-6 bg-gray-300 rounded"></div>
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
    );

    // Componente Skeleton para el contenido expandido
    const SkeletonExpandedContent = () => (
      <div className="flex flex-col gap-2 mt-5 animate-pulse">
        <div className="flex justify-between">
          <div className="w-[200px] h-6 bg-gray-300 rounded"></div>
          <div className="flex w-[450px] gap-4">
            <div className="w-[150px] h-6 bg-gray-300 rounded"></div>
            <div className="w-[150px] h-6 bg-gray-300 rounded"></div>
          </div>
          <div className="w-[80px] h-6 bg-gray-300 rounded"></div>
          <div className="w-[100px] h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
    );

    return (
      <div className="flex flex-col gap-3 max-h-[280px] overflow-auto">
        {loading ? (
          // Mostrar skeletons durante la carga
          <>
            <div className="flex flex-col gap-3">
              <SkeletonRow />
              <SkeletonExpandedContent />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          </>
        ) : pendientes.length > 0 ? (
          // Mostrar datos reales cuando están cargados
          pendientes.map((pendiente) => (
            <div
              key={pendiente.id_asunto}
              className="flex flex-col text-[#2B2829] font-normal bg-[#E9E7E7] p-[6px] rounded-md md:px-6 transition-all duration-300"
            >
              <div className="flex justify-between items-center py-1">
                <div className="mn:w-[300px] text-xs md:text-base flex">
                  {pendiente.titulo}
                </div>
                <div className="w-[250px] text-xs md:text-base flex justify-center">
                  {formatDate(pendiente.fecha_entrega)}
                </div>
                <div
                  className={`hidden md:block text-white ${
                    pendiente.estado === "entregado"
                      ? "bg-[#054755] "
                      : "bg-[#353563] "
                  } bg-[#054755] rounded-md px-4 min-w-[150px] text-center`}
                >
                  {pendiente.estado === "entregado" ? "Entregado" : "En Proceso"}
                </div>
                {showNewAdvanceButton && (
                  <div
                    className={`text-white flex gap-x-4 rounded-md px-4 min-w-[150px] text-center`}
                  >
                    <button
                      onClick={() => {
                        setIdAsunto(pendiente.id_asunto);
                        setShowEditarModal(true);
                      }}
                      className="p-2 bg-[#353563] rounded-md"
                    >
                      <FaRegEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteAsunto(pendiente.id_asunto)}
                      className="p-2 bg-[#353563] rounded-md"
                    >
                      <IoTrash size={20} className="bg-[#353563]" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => toggleOpen(pendiente.id_asunto)}
                  className="transition-transform duration-300 mn:w-[65px] flex justify-center"
                >
                  <img
                    src={arrowIcon}
                    alt="toggle"
                    className={`transform transition-transform duration-300 ${
                      openItems[pendiente.id_asunto] ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
              </div>

              {openItems[pendiente.id_asunto] && (
                <>
                  {pendiente.estado === "entregado" ? (
                    <div className="flex flex-col gap-2 transition-all duration-300 ease-in-out mt-5">
                      <div className="flex flex-col lg:flex-row justify-between text-xs md:text-sm xl:text-base gap-y-4 border border-gray-300 lg:border-none rounded-lg p-3 lg:p-0">
                        <div>{cortarTexto(pendiente.documento_0)}</div>
                        <div className="flex xl:w-[450px] gap-4">
                          <p>
                            Enviado: {formatDateExpan(pendiente.fecha_entrega)}
                          </p>
                          {pendiente.estado === "proceso" && (
                            <p>
                              Estimado:{" "}
                              {formatDateExpan(pendiente.fecha_terminado)}
                            </p>
                          )}
                        </div>
                        <div>
                          {pendiente.estado === "entregado"
                            ? formatTime(pendiente.fecha_entrega)
                            : formatTime(pendiente.fecha_revision)}
                        </div>
                        <div
                          className={`text-white ${
                            pendiente.estado === "entregado"
                              ? "bg-[#054755]"
                              : "bg-[#353563]"
                          }  rounded-md px-4`}
                        >
                          {pendiente.estado === "entregado"
                            ? "Entregado"
                            : "En Proceso"}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 transition-all duration-300 ease-in-out mt-5">
                      <div className="flex flex-col lg:flex-row justify-between text-xs md:text-sm xl:text-base gap-y-4 border border-gray-300 lg:border-none rounded-lg p-3 lg:p-0">
                        <div>{cortarTexto(pendiente.documento_0)}</div>
                        <div className="flex  gap-4">
                          <p>
                            Enviado: {formatDateExpan(pendiente.fecha_entrega)}
                          </p>
                        </div>
                        <div>{formatTime(pendiente.fecha_entrega)}</div>
                        <div className="text-white bg-[#054755]  rounded-md px-4">
                          <p>Entregado</p>
                        </div>
                      </div>
                      <div className="flex flex-col lg:flex-row justify-between text-xs md:text-sm xl:text-base gap-y-4 border border-gray-300 lg:border-none rounded-lg p-3 lg:p-0">
                        <div>{cortarTexto(pendiente.documento_0)}</div>
                        <div className="flex w-[450px] gap-4">
                          <p>
                            Enviado: {formatDateExpan(pendiente.fecha_revision)}
                          </p>
                          <p>
                            Estimado: {formatDateExpan(pendiente.fecha_terminado)}
                          </p>
                        </div>
                        <div>{formatTime(pendiente.fecha_revision)}</div>
                        <div className="text-white bg-[#353563]  rounded-md px-4">
                          {pendiente.estado === "entregado"
                            ? "Entregado"
                            : "En Proceso"}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          // Mostrar cuando no hay datos
          <div className="flex justify-center">
            <div className="flex flex-col  text-[12px] justify-center items-center w-[280px] sm:w-[370px] mn:w-[335px] lg:w-full h-[120px] sm:h-[190px] gap-5 text-[#82777A]">
              <img src={documentosVacios} alt="" />
              No hay envíos realizados
            </div>
          </div>
        )}

        {showEditarModal && (
          <ModalEditarAsunto
            onClose={() => setShowEditarModal(false)}
            idAsunto={idAsunto}
          />
        )}
      </div>
    );
  };

  export default Pendientes;
