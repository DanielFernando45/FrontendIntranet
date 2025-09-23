import React, { useEffect, useState } from "react";
import arrowIcon from "../../../assets/icons/IconEstudiante/arriba.svg";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import documentosVacios from "../../../assets/icons/documentosVacios.png";
import FechaEstimada from "../../../Components/Asesor/FechaEstimada";
import EnviarAvance from "../../../Components/Asesor/EnviarAvance";
import { FaRegEdit } from "react-icons/fa";
import ModalEditarFechaPendientes from "./components/ModalEditarFechaPendientes";

const DocPendientes = () => {
  const [pendientes, setPendientes] = useState([]);
  const [openItems, setOpenItems] = useState({});
  const [showFechaEstimada, setShowFechaEstimada] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [showEnviarAvance, setShowEnviarAvance] = useState(null);
  const [loading, setLoading] = useState(true);
  const idAsesoramiento = useOutletContext();

  const [showModalEdit, setShowModalEdit] = useState(false);
  const [idAsunto, setIdAsunto] = useState(null);

  useEffect(() => {
    if (idAsesoramiento) {
      fetchPendientes();
    } else {
      setLoading(false);
    }
  }, [idAsesoramiento]);

  const fetchPendientes = () => {
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_API_PORT_ENV}/asuntos/all/${idAsesoramiento}`
      )
      .then((response) => {
        setPendientes(response.data);
        const initialChecked = {};
        response.data.forEach((item) => {
          initialChecked[item.id_asunto] = !!item.fecha_terminado;
        });
        setCheckedItems(initialChecked);
      })
      .catch((error) => {
        console.error("Error al obtener los pendientes:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleOpen = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleEnviarAvance = (id) => {
    setShowEnviarAvance(id);
  };

  const handleCloseEnviarAvance = () => {
    setShowEnviarAvance(null);
  };

  const handleCheckboxClick = (id) => {
    if (!checkedItems[id]) {
      setShowFechaEstimada(id);
    }
  };

  const handleCloseFechaEstimada = () => {
    setShowFechaEstimada(null);
  };

  const handleSubmitFecha = (id, fecha) => {
    const now = new Date();
    const fechaCompleta = `${fecha} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    axios
      .patch(`${import.meta.env.VITE_API_PORT_ENV}/asuntos/en_proceso/${id}`, {
        fecha_terminado: fechaCompleta,
      })
      .then(() => {
        setCheckedItems((prev) => ({
          ...prev,
          [id]: true,
        }));
        setShowFechaEstimada(null);
        fetchPendientes();
      })
      .catch((error) => {
        console.error("Error al asignar fecha:", error);
      });
  };

  const formatHora = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    let horas = date.getUTCHours();
    const minutos = date.getUTCMinutes().toString().padStart(2, "0");
    const ampm = horas >= 12 ? "PM" : "AM";

    horas = horas % 12;
    horas = horas ? horas.toString().padStart(2, "0") : "12";

    return `${horas}:${minutos} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("es-PE", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} de ${year}`;
  };

  const handleSubmitAvance = async (id, titulo, files) => {
    try {
      const formData = new FormData();
      formData.append("titulo", titulo); // 👈 aquí debe ir "titulo"
      files.forEach((file) => {
        formData.append("files", file); // 👈 aquí debe ir "files"
      });

      console.log("FormData:", [...formData.entries()]); // debug para verificar

      await axios.patch(
        `${import.meta.env.VITE_API_PORT_ENV}/asuntos/finished/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      fetchPendientes();
      setShowEnviarAvance(null);
    } catch (error) {
      console.error("Error al enviar avance:", error.response?.data || error);
      alert("Error al enviar avance");
    }
  };

  const SkeletonItem = () => (
    <div className="flex flex-col gap-3 text-[#2B2829] font-normal bg-[#E9E7E7] p-[6px] rounded-md px-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="w-[300px] h-6 bg-gray-300 rounded"></div>
        <div className="w-[250px] h-6 bg-gray-300 rounded"></div>
        <div className="w-[180px] h-[30px] bg-gray-300 rounded-3xl"></div>
        <div className="w-6 h-6 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 relative text-[14px]">
      {loading ? (
        <>
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
        </>
      ) : pendientes.length > 0 ? (
        <div className="h-[200px] overflow-auto flex flex-col gap-2 ">
          {pendientes.map((pendiente) => (
            <div
              key={pendiente.id_asunto}
              className="flex flex-col text-[#2B2829] font-normal bg-[#E9E7E7] p-[6px] rounded-md px-6 transition-all duration-300"
            >
              <div className="flex justify-between items-center ">
                <div className="w-[300px] flex">{pendiente.titulo}</div>
                <div className="w-[250px] flex justify-center">
                  {formatDate(pendiente.fecha_entrega)}
                </div>
                <button
                  onClick={() => toggleEnviarAvance(pendiente.id_asunto)}
                  className="flex justify-center items-center w-[180px] h-[30px] font-medium rounded-3xl bg-[#0CB2D5] text-white"
                >
                  ENVIAR AVANCE
                </button>
                <button
                  onClick={() => toggleOpen(pendiente.id_asunto)}
                  className="transition-transform duration-300"
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
                <div className="flex flex-col transition-all duration-300 ease-in-out mt-5">
                  <div className="flex justify-between">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[15ch]">
                      {pendiente.documento_0}
                    </div>
                    <div className="flex w-[450px] justify-center gap-4">
                      <p>Enviado: {formatDate(pendiente.fecha_entrega)}</p>
                    </div>
                    <div>{formatHora(pendiente.fecha_entrega)}</div>
                    <div className="flex gap-5">
                      <div className="text-white bg-[#054755] rounded-md px-6 uppercase">
                        Entregado
                      </div>
                      <input
                        className="w-[25px]"
                        type="checkbox"
                        checked={checkedItems[pendiente.id_asunto] || false}
                        onChange={() =>
                          handleCheckboxClick(pendiente.id_asunto)
                        }
                        disabled={checkedItems[pendiente.id_asunto]}
                      />
                    </div>
                  </div>

                  {checkedItems[pendiente.id_asunto] &&
                    pendiente.fecha_terminado && (
                      <div className="flex justify-between mt-3">
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[15ch]">
                          {pendiente.documento_0}
                        </div>
                        <div className="flex w-[450px] gap-4">
                          <p>
                            Revisado: {formatDate(pendiente.fecha_revision)}
                          </p>
                          <p>
                            Estimado: {formatDate(pendiente.fecha_terminado)}
                          </p>
                        </div>
                        <div>{formatHora(pendiente.fecha_terminado)}</div>
                        <div className="flex gap-5">
                          <div className="text-white bg-[#0CB2D5] rounded-md px-8 items-center flex uppercase">
                            {pendiente.estado}
                          </div>
                          <input
                            className="w-[25px]"
                            type="checkbox"
                            checked={true}
                            disabled={true}
                          />
                          <button
                            onClick={() => {
                              setIdAsunto(pendiente.id_asunto),
                                setShowModalEdit(true);
                            }}
                            className="bg-slate-900 px-1 py-1 rounded-md "
                          >
                            <FaRegEdit color="white" size={20} />
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center ">
          <div className="flex flex-col  rounded-[12px] text-[12px] justify-center items-center w-[280px] sm:w-[370px] mn:w-[335px] lg:w-full h-[120px] sm:h-[190px] gap-5 text-[#82777A]">
            <img src={documentosVacios} alt="" />
            No hay envíos realizados
          </div>
        </div>
      )}

      {showFechaEstimada && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseFechaEstimada}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FechaEstimada
              onClose={handleCloseFechaEstimada}
              onSubmit={(fecha) => handleSubmitFecha(showFechaEstimada, fecha)}
            />
          </div>
        </div>
      )}

      {showEnviarAvance && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseEnviarAvance}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <EnviarAvance
              show={true}
              onClose={handleCloseEnviarAvance}
              onSubmit={(titulo, files) =>
                handleSubmitAvance(showEnviarAvance, titulo, files)
              }
            />
          </div>
        </div>
      )}

      {showModalEdit && (
        <ModalEditarFechaPendientes
          idAsunto={idAsunto}
          setShowModalEdit={setShowModalEdit}
        />
      )}
    </div>
  );
};

export default DocPendientes;
