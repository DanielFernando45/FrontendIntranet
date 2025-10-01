import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const EditarNoticias = ({ close, noticiaId }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    url_imagen: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_PORT_ENV
          }/recursos/noticias/list/${noticiaId}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Error ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();

        if (!data || typeof data !== "object") {
          throw new Error("Formato de datos inválido recibido del servidor");
        }

        setFormData({
          titulo: data.titulo || "",
          descripcion: data.descripcion || "",
          url_imagen: data.url_imagen || null,
        });

        if (data.url_imagen) {
          setImagePreview(data.imagen);
        }
      } catch (err) {
        console.error("Error al cargar la noticia:", err);
        setError(`Error al cargar la noticia: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoticia();
  }, [noticiaId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setError(
        "Por favor, selecciona un archivo de imagen válido (JPEG, PNG, GIF)"
      );
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

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
      formDataToSend.append("titulo", formData.titulo);
      formDataToSend.append("descripcion", formData.descripcion);

      if (formData.url_imagen instanceof File) {
        formDataToSend.append("url_imagen", formData.url_imagen);
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_API_PORT_ENV
        }/recursos/noticias/update/${noticiaId}`,
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

      toast.success("Noticia actualizada correctamente");
      close();
    } catch (err) {
      console.error("Error al actualizar la noticia:", err);
      setError(`Error al actualizar la noticia: ${err.message}`);
      toast.error("❌ Error al actualizar la noticia");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#F0EFEF] p-6 rounded-lg w-full max-w-lg text-center">
          Cargando datos de la noticia...
        </div>
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#F0EFEF] p-6 rounded-lg w-full max-w-lg">
          <h2 className="text-xl font-medium mb-4 text-[#2B2829]">Error</h2>
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
          <button
            onClick={close}
            className="w-full py-2 border border-[#1C1C34] rounded text-[#1C1C34] hover:bg-gray-100"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-[#F0EFEF] p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-medium mb-4 text-[#2B2829]">
          Editar Noticia
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              required
            />
          </div>
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
            />
            {imagePreview && (
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Vista previa:
                </h3>
                <img
                  src={imagePreview}
                  alt="Vista previa de la imagen"
                  className="max-h-48 rounded object-contain w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatos aceptados: JPEG, PNG, GIF
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2 bg-[#1C1C34] text-white rounded hover:bg-[#2a2a4a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Editando..." : "Editar"}
            </button>
            <button
              onClick={close}
              type="button"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2 border border-[#1C1C34] rounded text-[#1C1C34] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarNoticias;
