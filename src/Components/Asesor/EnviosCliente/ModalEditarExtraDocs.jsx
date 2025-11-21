import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ModalEditarExtraDocs = ({ idDocExtra, onClose }) => {
  const fileInputRef = useRef(null);
  const [titulo, setTitulo] = useState("");
  const [archivoNuevo, setArchivoNuevo] = useState(null);

  useEffect(() => {
    const obtenerDocumento = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/asesoramiento-documentos/obtener/${idDocExtra}`);
        setTitulo(res.data.titulo || "");
      } catch (error) {
        toast.error("Error al cargar el documento");
      }
    };

    if (idDocExtra) obtenerDocumento();
  }, [idDocExtra]);

  const handleFileChange = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

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

    if (!tiposPermitidos.includes(archivo.type)) {
      toast.error("Tipo de archivo no permitido");
      return;
    }

    setArchivoNuevo(archivo);
  };

  const handleSubmit = async () => {
    if (!titulo.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    if (!archivoNuevo) {
      toast.error("Debe seleccionar un archivo");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("files", archivoNuevo); // 👈 solo un archivo, como en Postman

      await axios.patch(
        `http://localhost:3001/asesoramiento-documentos/editar/${idDocExtra}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Documento actualizado");
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar");
    }
  };

  return (
    <div
      id="modal-background"
      onClick={(e) => e.target.id === "modal-background" && onClose()}
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
    >
      <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-4">Editar Documento</h2>

        <label className="block text-sm font-medium">Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full border rounded px-3 py-1 mb-4"
        />

        <label className="block text-sm font-medium">Archivo nuevo</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="w-full mb-4"
        />

        {archivoNuevo && <p className="text-green-600 mb-2">Archivo: {archivoNuevo.name}</p>}

        <button
          onClick={handleSubmit}
          className="bg-[#0CB2D6] text-white py-2 px-4 rounded w-full hover:bg-[#17162E]"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default ModalEditarExtraDocs;
