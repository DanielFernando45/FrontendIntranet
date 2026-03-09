import React, { useState, useEffect } from "react";
import editar from "../../../assets/icons/editar.svg";
import descargar from "../../../assets/icons/Descargas.svg";
import eliminar from "../../../assets/icons/eliminar.svg";
import { FileWarning } from "lucide-react";
import axios from "axios";
import ModalEditarExtraDocs from "../../../Components/Asesor/EnviosCliente/ModalEditarExtraDocs";

const OtrosDocs = ({ idAsesoramiento }) => {
  const [DocExtra, setDocExtra] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editarDoc, setEditarDoc] = useState(false);
  const [idDocsExtra, setIdDocsExtra] = useState(null);

  // Estados del modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [idEliminar, setIdEliminar] = useState(null);

  useEffect(() => {
    cargarDocs();
  }, [idAsesoramiento]);

  const cargarDocs = () => {
    if (!idAsesoramiento) return setLoading(false);

    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_API_PORT_ENV}/asesoramiento-documentos/listar/${idAsesoramiento}`
      )
      .then((response) => {
        setDocExtra(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener documentos:", error);
      })
      .finally(() => setLoading(false));
  };

  const eliminarDocumento = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_PORT_ENV}/asesoramiento-documentos/eliminar/${idEliminar}`
      );

      alert("Documento eliminado correctamente");
      setShowConfirm(false);
      setIdEliminar(null);
      cargarDocs();
    } catch (error) {
      console.error("Error al eliminar documento:", error);
      alert("Ocurrió un error al eliminar el documento");
    }
  };

  // Función para descargar archivos individuales
  const descargarArchivo = async (archivo) => {
    try {
      const response = await fetch(archivo.signedUrl);
      const blob = await response.blob();

      // Crear un enlace temporal para descargar
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Obtener el nombre del archivo desde la URL
      const nombreArchivo = archivo.url.split('/').pop();
      a.download = nombreArchivo;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Liberar el objeto URL
      window.URL.revokeObjectURL(url);

      alert("Archivo descargado correctamente");
    } catch (error) {
      console.error("Error al descargar archivo:", error);
      alert("Ocurrió un error al descargar el archivo");
    }
  };

  // Función para descargar todos los archivos del documento
  const descargarTodosLosArchivos = async (archivos) => {
    try {
      for (const archivo of archivos) {
        const response = await fetch(archivo.signedUrl);
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const nombreArchivo = archivo.url.split('/').pop();
        a.download = nombreArchivo;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
      }

      alert(`${archivos.length} archivos descargados correctamente`);
    } catch (error) {
      console.error("Error al descargar archivos:", error);
      alert("Ocurrió un error al descargar los archivos");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("es-PE", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const cortarTexto = (texto) => {
    if (!texto) return "";
    const filename = texto.split("/").pop();
    const index = filename.indexOf("-");
    let limpio = index !== -1 ? filename.substring(index + 1) : filename;
    return limpio.length > 30 ? limpio.slice(0, 30) + "..." : limpio;
  };

  const ConfirmDeleteModal = ({ open, onClose, onConfirm }) => {
    if (!open) return null;

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm animate-fadeIn">

          <h2 className="text-lg font-semibold text-gray-800 text-center">
            ¿Estás seguro de eliminar este documento?
          </h2>

          <p className="text-sm text-gray-600 mt-2 text-center">
            Esta acción no se puede deshacer.
          </p>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>

            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              Eliminar
            </button>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="max-h-[340px] overflow-auto">
      {/* ENCABEZADO */}
      <div className="flex justify-between text-[#495D72] font-medium p-[6px] rounded-md text-xs md:text-base mb-2">
        <div className="w-[300px] flex">Nombre del Docs</div>
        <div className="w-[100px] flex justify-center">Fecha</div>
        <div className="w-[350px] justify-center hidden md:flex">Archivos</div>
        <div className="w-[65px] flex justify-center">Editar</div>
        <div className="w-[65px] flex justify-center">Eliminar</div>
      </div>

      {loading ? (
        <div className="flex justify-center p-4 ">Cargando...</div>
      ) : DocExtra.length > 0 ? (
        DocExtra.map((doc) => (
          <div key={doc.id} className="mb-4 border rounded-lg overflow-hidden " >
            {/* Cabecera del documento */}
            <div className="flex justify-between text-black p-3 bg-gray-50 border-b text-xs md:text-base ">
              <div className="w-[300px] font-medium">{doc.titulo}</div>
              <div className="w-[100px] flex justify-center">{formatDate(doc.fecha)}</div>
              <div className="w-[350px] hidden md:flex justify-center">
                {doc.archivos && doc.archivos.length > 0 ? (
                  <span className="text-blue-600">{doc.archivos.length} archivo(s)</span>
                ) : (
                  "Sin archivos"
                )}
              </div>
              <div className="w-[65px] flex justify-center">
                <button
                  className="hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setEditarDoc(true);
                    setIdDocsExtra(doc.id);
                  }}
                  title="Editar documento"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                    <path d="M8.70703 1.6665H7.1237C3.16536 1.6665 1.58203 3.33317 1.58203 7.49984V12.4998C1.58203 16.6665 3.16536 18.3332 7.1237 18.3332H11.8737C15.832 18.3332 17.4154 16.6665 17.4154 12.4998V10.8332" stroke="#F2AB27" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.6999 2.51688L6.46161 9.08354C6.22411 9.33354 5.98661 9.82521 5.93911 10.1835L5.5987 12.6919C5.47203 13.6002 6.08161 14.2335 6.94453 14.1085L9.32745 13.7502C9.65995 13.7002 10.127 13.4502 10.3724 13.2002L16.6108 6.63354C17.6874 5.50021 18.1941 4.18354 16.6108 2.51688C15.0274 0.850211 13.7766 1.38354 12.6999 2.51688Z" stroke="#F2AB27" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M11.8047 3.4585C12.3351 5.45016 13.8155 7.0085 15.7155 7.57516" stroke="#F2AB27" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="w-[65px] flex justify-center">
                <button
                  className="hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setShowConfirm(true);
                    setIdEliminar(doc.id);
                  }}
                  title="Eliminar documento"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                    <path d="M16.625 4.98356C13.9888 4.70856 11.3367 4.56689 8.6925 4.56689C7.125 4.56689 5.5575 4.65023 3.99 4.81689L2.375 4.98356" stroke="red" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6.73047 4.1415L6.90464 3.04984C7.0313 2.25817 7.1263 1.6665 8.46422 1.6665H10.5384C11.8763 1.6665 11.9792 2.2915 12.098 3.05817L12.2721 4.1415" stroke="red" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M14.924 7.6167L14.4094 16.0084C14.3223 17.3167 14.251 18.3334 12.0423 18.3334H6.95979C4.75104 18.3334 4.67979 17.3167 4.59271 16.0084L4.07812 7.6167" stroke="red" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8.17969 13.75H10.8159" stroke="red" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7.51953 10.4165H11.4779" stroke="red" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Lista de archivos del documento */}
            {doc.archivos && doc.archivos.length > 0 && (
              <div className="bg-gray-50 p-2">
                {doc.archivos.map((archivo, index) => (
                  <div
                    key={archivo.id}
                    className="flex items-center justify-between p-2 mb-1 last:mb-0 bg-white rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center flex-1">
                      <span className="text-xs text-gray-500 mr-2">{index + 1}.</span>
                      <span className="text-sm text-gray-700 truncate max-w-md">
                        {cortarTexto(archivo.url)}
                      </span>
                    </div>
                    <button
                      className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                      onClick={() => descargarArchivo(archivo)}
                      title="Descargar archivo"
                    >
                      <img src={descargar} alt="Descargar" className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                {/* Botón para descargar todos los archivos (si hay más de 1) */}
                {doc.archivos.length > 1 && (
                  <div className="flex justify-end mt-2 pt-2 border-t border-gray-300">
                    <button
                      className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                      onClick={() => descargarTodosLosArchivos(doc.archivos)}
                    >
                      <img src={descargar} alt="Descargar" className="w-4 h-4 filter brightness-0 invert" />
                      <span>Descargar todos ({doc.archivos.length} archivos)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="flex justify-center">
          <div className="flex flex-col border rounded-[12px] text-[12px] justify-center items-center w-[280px] sm:w-[370px] h-[120px] gap-5 text-[#82777A] shadow">
            <FileWarning size={50} className="text-gray-400" />
            No hay envíos realizados
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN */}
      {editarDoc && (
        <ModalEditarExtraDocs
          idDocExtra={idDocsExtra}
          onClose={() => setEditarDoc(false)}
        />
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      <ConfirmDeleteModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={eliminarDocumento}
      />
    </div>
  );
};

export default OtrosDocs;