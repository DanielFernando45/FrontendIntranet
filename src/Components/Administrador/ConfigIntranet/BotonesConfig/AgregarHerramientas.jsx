import React, { useState } from "react";
import { marketingService } from "../../../../services/marketingService";

const AgregarHerramientas = ({ close }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    url_imagen: null,
    enlace: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [websitePreview, setWebsitePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "enlace") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Generar previsualización del enlace
      if (value) {
        try {
          const url = new URL(value);
          setWebsitePreview({
            domain: url.hostname,
            favicon: `https://www.google.com/s2/favicons?domain=${url.hostname}`,
          });
        } catch {
          setWebsitePreview(null);
        }
      } else {
        setWebsitePreview(null);
      }
      return;
    }

    // Manejo normal para otros campos de texto
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.match("image.*")) {
      setError(
        "Por favor, selecciona un archivo de imagen válido (JPEG, PNG, GIF)"
      );
      return;
    }

    // Crear previsualización de la imagen
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Actualizar el estado con el archivo
    setFormData((prev) => ({
      ...prev,
      url_imagen: file,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("descripcion", formData.descripcion);
      formDataToSend.append("enlace", formData.enlace);

      if (formData.url_imagen) {
        formDataToSend.append("url_imagen", formData.url_imagen);
      }

      // 👉 usar el service
      await marketingService.agregarHerramientas(formDataToSend);

      // Si todo salió bien
      location.reload();
      close();
    } catch (err) {
      setError(err.message || "Error al agregar la herramienta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#F0EFEF] p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-medium mb-4 text-[#2B2829]">
          Añadir Herramienta
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Python, Zotero, etc."
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción breve de la herramienta..."
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
            />
          </div>

          {/* Campo para subir imagen */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen
            </label>
            <input
              type="file"
              name="url_imagen"
              onChange={handleImageChange}
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
                  alt="Vista previa de la imagen"
                  className="max-h-40 rounded object-contain"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatos aceptados: JPEG, PNG, GIF
                </p>
              </div>
            )}
          </div>

          {/* Campo para enlace web */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enlace a la herramienta
            </label>
            <input
              type="url"
              name="enlace"
              value={formData.enlace}
              onChange={handleChange}
              placeholder="https://www.herramienta.com"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {websitePreview && (
              <div className="mt-2 flex items-center p-2 border rounded bg-gray-50">
                <img
                  src={websitePreview.favicon}
                  alt="Favicon"
                  className="w-4 h-4 mr-2"
                />
                <span className="text-sm text-gray-700">
                  {websitePreview.domain}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-16 py-2 bg-[#1C1C34] text-white rounded hover:bg-[#2a2a4a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Añadiendo..." : "Añadir"}
            </button>
            <button
              onClick={close}
              type="button"
              disabled={isSubmitting}
              className="px-16 py-2 border border-[#1C1C34] rounded text-[#1C1C34] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarHerramientas;
