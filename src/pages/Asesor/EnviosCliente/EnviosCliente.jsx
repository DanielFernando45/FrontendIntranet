import React, { useState, useEffect } from "react";
import arrowIcon from "../../../assets/icons/IconEstudiante/arriba.svg";
import descargar from "../../../assets/icons/Descargas.svg";
import documentosVacios from "../../../assets/icons/documentosVacios.png";
import axios from "axios";

const EnviosCliente = ({ idAsesoramiento }) => {
  const [envioCliente, setEnvioCliente] = useState([]);
  const [openItems, setOpenItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idAsesoramiento) {
      setLoading(true);
      axios
        .get(
          `${
            import.meta.env.VITE_API_PORT_ENV
          }/documentos/estudiante/list/${idAsesoramiento}`
        )
        .then((response) => {
          setEnvioCliente(response.data);
          const initialOpenState = {};
          response.data.forEach((_, index) => {
            initialOpenState[index] = false;
          });
          setOpenItems(initialOpenState);
        })
        .catch((error) => {
          console.error("Error al obtener los pendientes:", error);
        })
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

  const cortarTexto = (texto) => {
    const index = texto.indexOf("-");
    if (index !== -1) {
      return texto.substring(index + 1);
    }
    return texto;
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

  const handleDownload = async (url, filename) => {
    try {
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      alert("Error al descargar el archivo");
    }
  };

  const SkeletonRow = () => (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-[#E9E7E7] p-2 rounded-md animate-pulse mt-2">
      <div className="h-6 bg-gray-300 rounded"></div>
      <div className="hidden sm:block h-6 bg-gray-300 rounded"></div>
      <div className="hidden sm:block h-6 bg-gray-300 rounded"></div>
      <div className="hidden sm:block h-6 bg-gray-300 rounded"></div>
      <div className="h-6 bg-gray-300 rounded"></div>
    </div>
  );

  return (
    <div className="flex flex-col text-[14px]">
      {/* Encabezado: solo visible en sm+ */}
      <div className="hidden sm:grid grid-cols-5 text-[#495D72] font-medium p-2 rounded-md">
        <div>Título</div>
        <div className="text-center">Estado</div>
        <div className="text-center">Fecha</div>
        <div className="text-center">Archivo</div>
        <div className="text-center">Descargas</div>
      </div>

      {loading ? (
        <>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </>
      ) : envioCliente.length > 0 ? (
        <div className="h-[300px] overflow-auto flex flex-col gap-2">
          {envioCliente.map((envio, index) => {
            const documents = getDocuments(envio);
            const hasDocuments = documents.length > 0;

            return (
              <React.Fragment key={envio.id_asunto || index}>
                {/* Fila */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[#2B2829] text-xs md:text-sm font-normal bg-[#E9E7E7] p-2 rounded-md items-center">
                  <div>{envio.asunto.cliente}</div>
                  <div className="hidden sm:flex justify-center text-white bg-[#353563] rounded px-2">
                    {envio.estado}
                  </div>
                  <div className="hidden sm:flex justify-center">
                    {formatDate(envio.fecha)}
                  </div>
                  <div className="hidden sm:flex truncate">
                    {hasDocuments ? documents[0].name : "No hay archivos"}
                  </div>
                  <div className="flex justify-center">
                    {hasDocuments && (
                      <button
                        onClick={() => toggleOpen(index)}
                        className="transition-transform duration-300"
                      >
                        <img
                          src={arrowIcon}
                          alt="toggle"
                          className={`transform transition-transform duration-300 ${
                            openItems[index] ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expansible con documentos */}
                {openItems[index] && hasDocuments && (
                  <div className="bg-white shadow-md rounded-md px-3 py-2 my-2">
                    {documents.map((doc, docIndex) => (
                      <div
                        key={docIndex}
                        className="flex justify-between items-center py-1 border-b last:border-0"
                      >
                        <div className="truncate max-w-[60%]">
                          {cortarTexto(doc.name)}
                        </div>
                        <button
                          onClick={() => handleDownload(doc.url, doc.name)}
                          className="hover:scale-110 transition-transform"
                        >
                          <img
                            src={descargar}
                            alt="Descargar"
                            className="w-5 h-5"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="flex flex-col border rounded-[12px] text-[12px] justify-center items-center w-[280px] sm:w-[370px] lg:w-full h-[120px] sm:h-[190px] gap-5 text-[#82777A] shadow">
            <img src={documentosVacios} alt="" />
            No hay envíos realizados
          </div>
        </div>
      )}
    </div>
  );
};

export default EnviosCliente;
