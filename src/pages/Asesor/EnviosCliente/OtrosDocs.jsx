import React, { useState, useEffect } from "react";
import editar from "../../../assets/icons/editar.svg";
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
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
    return limpio.length > 20 ? limpio.slice(0, 20) + "..." : limpio;
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
    <div>
      {/* ENCABEZADO */}
      <div className="flex justify-between text-[#495D72] font-medium p-[6px] rounded-md text-xs md:text-base">
        <div className="w-[300px] flex">Nombre del Docs</div>
        <div className="w-[100px] flex justify-center">Fecha</div>
        <div className="w-[250px] justify-center hidden md:flex">Archivo</div>
        <div className="w-[65px] flex justify-center">Editar</div>
        <div className="w-[65px] flex justify-center">Eliminar</div>
      </div>

      {loading ? (
        <>Cargando...</>
      ) : DocExtra.length > 0 ? (
        DocExtra.map((doc) => (
          <div
            key={doc.id}
            className="flex justify-between text-black p-[6px] rounded-md text-xs md:text-base"
          >
            <div className="w-[300px]">{doc.titulo}</div>
            <div className="w-[100px] flex justify-center">{formatDate(doc.fecha)}</div>

            <div className="w-[250px] hidden md:flex justify-center">
              {cortarTexto(doc.archivos?.[0]?.url)}
            </div>

            <button
              className="w-[65px] flex justify-center"
              onClick={() => {
                setEditarDoc(true);
                setIdDocsExtra(doc.id);
              }}
            >
              <img src={editar} alt="" />
            </button>

            <button
              className="w-[65px] flex justify-center"
              onClick={() => {
                setShowConfirm(true);
                setIdEliminar(doc.id);
              }}
            >
              <img src={eliminar} alt="" />
            </button>
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
