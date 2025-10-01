import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
const EditarGuias = ({ close, guiaId }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    url_imagen: null,
    doc_url: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  useEffect(() => {
    const fetchGuia = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_PORT_ENV}/recursos/guias/list/${guiaId}`
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Error ${response.status}: ${response.statusText}`
          );
        }
        const data = await response.json();
        if (!data || typeof data !== "object")
          throw new Error("Formato de datos inválido recibido del servidor");

        setFormData({
          titulo: data.titulo || "",
          descripcion: data.descripcion || "",
          url_imagen: data.url_imagen || null,
          doc_url: data.doc_url || null,
        });

        if (data.imagen) setImagePreview(data.imagen);
        if (data.doc_url) setPdfPreview(data.doc_url);
      } catch (err) {
        console.error("Error al cargar la guía:", err);
        setError(`Error al cargar la guía: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuia();
  }, [guiaId]);

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
        setError("Por favor, selecciona un archivo de imagen válido");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, [name]: file }));
    }

    if (name === "doc_url") {
      if (file.type !== "application/pdf") {
        setError("Por favor, selecciona un archivo PDF válido");
        return;
      }
      setPdfPreview(file.name);
      setFormData((prev) => ({ ...prev, [name]: file }));
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

      if (formData.url_imagen instanceof File) {
        formDataToSend.append("url_imagen", formData.url_imagen);
      }
      if (formData.doc_url instanceof File) {
        formDataToSend.append("doc_url", formData.doc_url);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_PORT_ENV}/recursos/guias/update/${guiaId}`,
        {
          method: "PATCH",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      }

      toast.success("Guía actualizada correctamente");
      close();
    } catch (err) {
      console.error("Error al actualizar la guía:", err);
      setError(`Error al actualizar la guía: ${err.message}`);
      toast.error(`❌ ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className="bg-[#F0EFEF] p-6 rounded-lg w-full max-w-md text-center">
          Cargando datos de la guía...
        </div>
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className="bg-[#F0EFEF] p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-medium mb-4 text-[#2B2829]">Error</h2>
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
          <button
            onClick={close}
            className="w-full sm:w-auto px-8 py-2 border border-[#1C1C34] rounded text-[#1C1C34] hover:bg-gray-100"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-[#F0EFEF] p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-medium mb-4 text-[#2B2829]">Editar Guía</h2>

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
            />
            {imagePreview && (
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Vista previa:
                </h3>
                <img
                  src={imagePreview}
                  alt="Vista previa de la imagen"
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
            />
            {pdfPreview && (
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Documento seleccionado:
                </h3>
                {typeof pdfPreview === "string" &&
                pdfPreview.startsWith("http") ? (
                  <a
                    href={pdfPreview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver documento actual
                  </a>
                ) : (
                  <p className="text-sm text-gray-700 truncate">{pdfPreview}</p>
                )}
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
              {isSubmitting ? "Editando..." : "Editar"}
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

export default EditarGuias;
