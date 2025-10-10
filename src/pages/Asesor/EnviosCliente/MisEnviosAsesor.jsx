import React, { useState, useEffect } from "react";
import arrowIcon from "../../../assets/icons/IconEstudiante/arriba.svg";
import descargar from "../../../assets/icons/Descargas.svg";
import documentosVacios from "../../../assets/icons/documentosVacios.png";
import axios from "axios";

const MisEnvios = ({ idAsesoramiento }) => {
  const [misEnvios, setMisEnvios] = useState([]);
  const [openItems, setOpenItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idAsesoramiento) {
      setLoading(true);
      axios
        .get(
          `${
            import.meta.env.VITE_API_PORT_ENV
          }/documentos/asesor/list/${idAsesoramiento}`
        )
        .then((response) => {
          setMisEnvios(response.data);
          const initialOpenState = {};
          response.data.forEach((_, index) => {
            initialOpenState[index] = false;
          });
          setOpenItems(initialOpenState);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [idAsesoramiento]);

  const toggleOpen = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("es-PE", options);
  };

  const formatearTextoArchivoConGuion = (texto) => {
    // Buscar el primer guion
    const index = texto.indexOf("-");

    // Si hay un guion, tomar la parte después de él
    const textoDespuésDelGuion =
      index !== -1 ? texto.substring(index + 1) : texto;

    // Extraer la extensión del archivo
    const extension = textoDespuésDelGuion.substring(
      textoDespuésDelGuion.lastIndexOf(".")
    );

    // Obtener el nombre del archivo sin la extensión
    const nombreArchivo = textoDespuésDelGuion.substring(
      0,
      textoDespuésDelGuion.lastIndexOf(".")
    );

    // Verificar si el nombre antes de la extensión es mayor a 20 caracteres
    if (nombreArchivo.length > 20) {
      // Si es mayor, recortar a 20 caracteres y agregar "..."
      return nombreArchivo.substring(0, 20) + "..." + extension;
    }

    // Si no es mayor a 20, devolver el nombre completo con su extensión
    return textoDespuésDelGuion;
  };

  const getDocuments = (envio) => {
    const documents = [];
    let i = 1;
    while (envio[`nombreDoc${i}`] && envio[`ruta${i}`]) {
      const urlParts = envio[`ruta${i}`].split("/");
      const pathFile = urlParts[urlParts.length - 1];
      documents.push({
        name: envio[`nombreDoc${i}`],
        url: envio[`ruta${i}`],
        pathFile,
      });
      i++;
    }
    return documents;
  };

  const handleDownload = (url, filename) => {
    try {
      // ✅ Si la URL no es completa, la reconstruimos manualmente
      const fullUrl = url?.startsWith("http")
        ? url
        : `https://f004.backblazeb2.com/file/IntranetAlejandria/documentos/${filename}`;

      // ✅ Escapamos caracteres raros (espacios, paréntesis, acentos)
      const safeUrl = encodeURI(fullUrl);

      console.log("🌐 Redirigiendo descarga externa:", safeUrl);

      // ✅ Abre en nueva pestaña (más seguro)
      window.open(safeUrl, "_blank", "noopener,noreferrer");

      // 🧩 Fallback: si el router intenta redirigir a localhost, forzamos la navegación
      setTimeout(() => {
        if (
          window.location.href.includes("localhost") ||
          window.location.href.includes("asesor/entrega")
        ) {
          window.location.replace(safeUrl);
        }
      }, 500);
    } catch (error) {
      console.error("❌ Error al abrir el archivo:", error);
      alert("No se pudo abrir el archivo, intenta nuevamente.");
    }
  };

  const SkeletonRow = () => (
    <div className="flex justify-between bg-[#E9E7E7] p-[6px] rounded-md items-center animate-pulse">
      <div className="w-[160px] h-4 sm:h-5 lg:h-6 bg-gray-300 rounded text-[8px] sm:text-[12px] lg:text-[14px]"></div>
      <div className="w-[102px] h-4 sm:h-5 lg:h-6 bg-gray-300 rounded hidden lg:flex"></div>
      <div className="w-[100px] h-4 sm:h-5 lg:h-6 bg-gray-300 rounded text-[8px] sm:text-[12px] lg:text-[14px]"></div>
      <div className="w-[250px] h-4 sm:h-5 lg:h-6 bg-gray-300 rounded hidden md:flex"></div>
      <div className="w-[100px] h-4 sm:h-5 lg:h-6 bg-gray-300 rounded"></div>
    </div>
  );

  const SkeletonExpandedRow = () => (
    <div className="bg-white shadow-md rounded-md p-1 my-1 animate-pulse">
      <div className="flex justify-between items-center py-1 border-b">
        <div className="w-[160px] h-4 sm:h-5 bg-gray-300 rounded text-[8px] sm:text-[10px]"></div>
        <div className="w-[102px] h-4 sm:h-5 bg-gray-300 rounded hidden 1xl:flex"></div>
        <div className="w-[100px] h-4 sm:h-5 bg-gray-300 rounded text-[8px] sm:text-[10px]"></div>
        <div className="w-[250px] h-4 sm:h-5 bg-gray-300 rounded hidden md:flex"></div>
        <div className="w-[100px] h-4 sm:h-5 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      {loading ? (
        // Mostrar skeletons durante la carga
        <>
          <SkeletonRow />
          <SkeletonExpandedRow />
          <SkeletonRow />
          <SkeletonRow />
        </>
      ) : misEnvios.length > 0 ? (
        // Mostrar datos cuando están cargados
        <>
          {/* Cabecera SOLO si hay datos */}
          <div className="flex justify-between text-[#495D72] font-medium p-[6px] rounded-md">
            <div className="w-[200px] flex text-[8px] sm:text-[12px] lg:text-[17px]">
              Titulo
            </div>
            <div className="w-[102px] justify-center hidden lg:text-[17px] 1xl:flex">
              Estado
            </div>
            <div className="w-[100px] flex justify-center text-[8px] sm:text-[12px] lg:text-[17px]">
              Fecha
            </div>
            <div className="w-[250px] justify-center hidden md:flex md:text-[12px] lg:text-[17px]">
              Archivo
            </div>
            <div className="w-[100px] rounded-md px-3 flex justify-center text-[8px] sm:text-[12px] lg:text-[17px]">
              Descargas
            </div>
          </div>

          <div className="max-h-[280px] overflow-auto">
            {misEnvios.map((envio, index) => {
              const documents = getDocuments(envio);
              const hasDocuments = documents.length > 0;

              return (
                <React.Fragment key={envio.id_asunto || index}>
                  <div className="flex justify-between text-[#2B2829] font-normal bg-[#E9E7E7] p-[6px] rounded-md items-center mt-2">
                    <div className="w-[200px] flex text-[8px] sm:text-[12px] lg:text-[14px]">
                      {envio.asunto.asesor}
                    </div>
                    <div className="text-white bg-[#353563] rounded px-3 hidden lg:text-[14px] 1xl:flex">
                      {envio.estado}
                    </div>
                    <div className="w-[100px] flex justify-center text-[8px] sm:text-[12px] lg:text-[14px]">
                      {formatDate(envio.fecha)}
                    </div>
                    <div className="w-[250px] justify-center hidden md:flex md:text-[10px] lg:text-[14px]">
                      {hasDocuments
                        ? formatearTextoArchivoConGuion(documents[0].name)
                        : "No hay archivos"}
                    </div>
                    <div className="w-[100px] flex justify-center">
                      {hasDocuments && (
                        <button
                          onClick={() => toggleOpen(index)}
                          className="transition-transform duration-300"
                        >
                          <img
                            src={arrowIcon}
                            alt="toggle"
                            className={`w-[10px] sm:w-[14px] transform transition-transform duration-300 ${
                              openItems[index] ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {openItems[index] && hasDocuments && (
                    <div className="flex flex-col md:flex-row justify-between text-[#2B2829] font-normal items-center py-2 border-b text-xs md:text-base">
                      <div className="flex-1 flex">{envio.asunto.cliente}</div>
                      <div className="hidden lg:block text-white bg-[#353563] rounded px-3">
                        {envio.estado}
                      </div>
                      <div className="flex-1 flex justify-center">
                        {formatDate(envio.fecha)}
                      </div>
                      <div className="flex-1 flex flex-col gap-1 justify-center  font-semibold text-[#495D72]">
                        {documents.map((doc, docIndex) => (
                          <div
                            key={docIndex}
                            className=" flex justify-between items-center py-[6px] border-b last:border-b-0"
                          >
                            <div className="flex justify-start">
                              {formatearTextoArchivoConGuion(doc.name)}
                            </div>
                            <div className="w-[65px] flex justify-center">
                              <button
                                onClick={() =>
                                  handleDownload(doc.pathFile, doc.name)
                                }
                                className="transition-transform duration-300 hover:scale-110"
                              >
                                <img src={descargar} alt="Descargar" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </>
      ) : (
        // Mostrar cuando no hay datos
        <div className="flex justify-center">
          <div className="flex flex-col rounded-[12px] text-[12px] justify-center items-center w-[280px] sm:w-[370px] mn:w-[335px] lg:w-full h-[120px] sm:h-[190px] gap-5 text-[#82777A]">
            <img src={documentosVacios} alt="" />
            No hay envíos realizados
          </div>
        </div>
      )}
    </div>
  );
};

export default MisEnvios;
