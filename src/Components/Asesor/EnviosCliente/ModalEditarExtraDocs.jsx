import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Upload, FileText, Save } from "lucide-react";

const ModalEditarExtraDocs = ({ idDocExtra, onClose }) => {
  const fileInputRef = useRef(null);
  const [titulo, setTitulo] = useState("");
  const [archivosExistentes, setArchivosExistentes] = useState([]);
  const [archivosNuevos, setArchivosNuevos] = useState([]);
  const [archivosAEliminar, setArchivosAEliminar] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [documentoOriginal, setDocumentoOriginal] = useState(null);

  useEffect(() => {
    const obtenerDocumento = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_PORT_ENV}/asesoramiento-documentos/obtener/${idDocExtra}`);
        setDocumentoOriginal(res.data);
        setTitulo(res.data.titulo || "");
        setArchivosExistentes(res.data.archivos || []);
      } catch (error) {
        toast.error("Error al cargar el documento");
      } finally {
        setCargandoInicial(false);
      }
    };

    if (idDocExtra) obtenerDocumento();
  }, [idDocExtra]);

  const handleFileChange = (e) => {
    const archivos = Array.from(e.target.files);

    const tiposPermitidos = [
      "application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain", "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "application/zip", "application/x-rar-compressed", "application/x-7z-compressed"
    ];

    const archivosValidos = archivos.filter(archivo => {
      if (!tiposPermitidos.includes(archivo.type)) {
        toast.error(`Tipo de archivo no permitido: ${archivo.name}`);
        return false;
      }
      return true;
    });

    setArchivosNuevos(prev => [...prev, ...archivosValidos]);

    // Limpiar el input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const eliminarArchivoExistente = (archivo) => {
    // En lugar de eliminar visualmente, marcamos para eliminar
    setArchivosAEliminar(prev => [...prev, archivo.id]);
    setArchivosExistentes(prev => prev.filter(a => a.id !== archivo.id));
  };

  const restaurarArchivoExistente = (archivoId) => {
    // Restauramos el archivo quitándolo de la lista de eliminados
    setArchivosAEliminar(prev => prev.filter(id => id !== archivoId));

    // Buscar el archivo en el documento original y restaurarlo
    if (documentoOriginal) {
      const archivoRestaurado = documentoOriginal.archivos.find(a => a.id === archivoId);
      if (archivoRestaurado) {
        setArchivosExistentes(prev => [...prev, archivoRestaurado]);
      }
    }
  };

  const eliminarArchivoNuevo = (index) => {
    setArchivosNuevos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!titulo.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    setCargando(true);

    try {
      const formData = new FormData();

      // Enviar título
      formData.append("titulo", titulo);

      // Enviar archivosConservar como JSON string
      const archivosConservar = archivosExistentes.map(a => a.id);
      formData.append("archivosConservar", JSON.stringify(archivosConservar));

      // Agregar archivos nuevos
      archivosNuevos.forEach((archivo) => {
        formData.append("files", archivo);
      });

      const response = await axios.patch(
        `${import.meta.env.VITE_API_PORT_ENV}/asesoramiento-documentos/editar/${idDocExtra}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Documento actualizado correctamente");
      window.location.reload();
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.message || "Error al actualizar");
    } finally {
      setCargando(false);
    }
  };

  const cortarTexto = (texto) => {
    if (!texto) return "";
    const filename = texto.split("/").pop();
    const index = filename.indexOf("-");
    let limpio = index !== -1 ? filename.substring(index + 1) : filename;
    return limpio.length > 40 ? limpio.slice(0, 40) + "..." : limpio;
  };

  const hayCambios = () => {
    if (!documentoOriginal) return false;

    const tituloCambio = titulo !== documentoOriginal.titulo;
    const hayNuevosArchivos = archivosNuevos.length > 0;
    const hayArchivosEliminados = archivosAEliminar.length > 0;

    return tituloCambio || hayNuevosArchivos || hayArchivosEliminados;
  };

  if (cargandoInicial) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <p className="text-gray-600">Cargando documento...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="modal-background"
      onClick={(e) => e.target.id === "modal-background" && onClose()}
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
    >
      <div className="bg-white p-6 rounded-xl max-w-2xl w-full shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Editar Documento</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el título del documento"
          />
        </div>

        {/* Archivos existentes */}
        {archivosExistentes.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Archivos actuales ({archivosExistentes.length})
            </label>
            <div className="space-y-2">
              {archivosExistentes.map((archivo) => (
                <div
                  key={archivo.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <FileText size={18} className="text-gray-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate" title={archivo.url}>
                      {cortarTexto(archivo.url)}
                    </span>
                  </div>
                  <button
                    onClick={() => eliminarArchivoExistente(archivo)}
                    className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors text-red-600 flex-shrink-0"
                    title="Eliminar archivo"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Archivos nuevos seleccionados */}
        {archivosNuevos.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Archivos nuevos para agregar ({archivosNuevos.length})
            </label>
            <div className="space-y-2">
              {archivosNuevos.map((archivo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <Upload size={18} className="text-green-600 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate" title={archivo.name}>
                      {archivo.name.length > 50 ? archivo.name.substring(0, 50) + "..." : archivo.name}
                    </span>
                  </div>
                  <button
                    onClick={() => eliminarArchivoNuevo(index)}
                    className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors text-red-600 flex-shrink-0"
                    title="Cancelar archivo"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Archivos marcados para eliminar */}
        {archivosAEliminar.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-red-600">
              Archivos a eliminar ({archivosAEliminar.length})
            </label>
            <div className="space-y-2">
              {archivosAEliminar.map((archivoId) => {
                // Buscar el archivo en el documento original
                const archivo = documentoOriginal?.archivos.find(a => a.id === archivoId);
                if (!archivo) return null;

                return (
                  <div
                    key={archivoId}
                    className="flex items-center justify-between p-2 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <FileText size={18} className="text-red-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700 line-through truncate" title={archivo.url}>
                        {cortarTexto(archivo.url)}
                      </span>
                    </div>
                    <button
                      onClick={() => restaurarArchivoExistente(archivoId)}
                      className="ml-2 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors flex-shrink-0"
                      title="Restaurar archivo"
                    >
                      Restaurar
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selector de archivos */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Agregar nuevos archivos</label>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors"
            >
              <Upload size={18} />
              Seleccionar archivos
            </label>
            <span className="text-sm text-gray-500">
              {archivosNuevos.length > 0
                ? `${archivosNuevos.length} archivo(s) seleccionado(s)`
                : "Ningún archivo seleccionado"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Formatos permitidos: PDF, Word, Excel, PowerPoint, imágenes, textos, comprimidos
          </p>
        </div>

        {/* Resumen de cambios */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
          <p className="font-medium mb-2">Resumen de cambios:</p>
          <ul className="space-y-1 text-gray-600">
            <li>📄 Título: {titulo !== documentoOriginal?.titulo ?
              <span className="text-yellow-600"> modificado</span> :
              <span className="text-gray-500"> sin cambios</span>}
            </li>
            <li>📁 Archivos actuales: {archivosExistentes.length}</li>
            {archivosNuevos.length > 0 &&
              <li className="text-green-600">➕ Archivos nuevos: {archivosNuevos.length}</li>
            }
            {archivosAEliminar.length > 0 &&
              <li className="text-red-600">➖ Archivos a eliminar: {archivosAEliminar.length}</li>
            }
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={cargando}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={cargando || !hayCambios()}
            className="flex-1 bg-[#0CB2D6] text-white py-2 px-4 rounded-lg hover:bg-[#17162E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {cargando ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarExtraDocs;