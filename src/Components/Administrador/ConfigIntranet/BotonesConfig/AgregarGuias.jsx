import React, { useState } from "react";
import toast from "react-hot-toast";

const AgregarGuias = ({ close }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    url_imagen: null,
    doc_url: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [pdfName, setPdfName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "titulo" || name === "descripcion") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    if (name === "url_imagen") {
      if (!file.type.match("image.*")) {
        setError(
          "Por favor, selecciona un archivo de imagen válido (JPG, PNG, GIF)"
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);

      setFormData((prev) => ({ ...prev, [name]: file }));
      setError(null);
    }

    if (name === "doc_url") {
      if (file.type !== "application/pdf") {
        setError("Por favor, selecciona un archivo PDF válido");
        return;
      }
      setPdfName(file.name);
      setFormData((prev) => ({ ...prev, [name]: file }));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("titulo", formData.titulo);
      formDataToSend.append("descripcion", formData.descripcion);
      if (formData.url_imagen)
        formDataToSend.append("url_imagen", formData.url_imagen);
      if (formData.doc_url) formDataToSend.append("doc_url", formData.doc_url);

      const response = await fetch(
        `${import.meta.env.VITE_API_PORT_ENV}/recursos/guias/add`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) throw new Error("Error al agregar la guía");

      toast.success("Guía agregada correctamente");
      close();
    } catch (err) {
      console.error("Error al agregar la guía:", err);
      setError(err.message);
      toast.error(`❌ ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-[#F0EFEF] p-6 rounded-lg w-full max-w-md overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-medium mb-4 text-[#2B2829]">Añadir Guía</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ej: Guía de Normas APA"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Ej: Instrucciones para citar y referenciar..."
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen
            </label>
            <input
              type="file"
              name="url_imagen"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {imagePreview && (
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Vista previa:
                </h3>
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="max-h-40 rounded object-cover"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatos aceptados: JPG, PNG, GIF
                </p>
              </div>
            )}
          </div>

          {/* PDF */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Documento PDF
            </label>
            <input
              type="file"
              name="doc_url"
              onChange={handleFileChange}
              accept="application/pdf"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {pdfName && (
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Documento seleccionado:
                </h3>
                <p className="text-sm text-gray-700 truncate">{pdfName}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Solo se aceptan archivos PDF
                </p>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-between gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-2 bg-[#1C1C34] text-white rounded hover:bg-[#2a2a4a] disabled:opacity-50"
            >
              {isSubmitting ? "Añadiendo..." : "Añadir"}
            </button>
            <button
              onClick={close}
              type="button"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-2 border border-[#1C1C34] rounded text-[#1C1C34] hover:bg-gray-100 disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarGuias;
