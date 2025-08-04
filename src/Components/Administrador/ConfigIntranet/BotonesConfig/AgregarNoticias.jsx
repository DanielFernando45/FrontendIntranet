import React, { useState } from 'react';

const AgregarNoticias = ({ close }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    url_imagen: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'url_imagen' && e.target.files) {
      const file = e.target.files[0];
      if (file) {
        // Crear preview de la imagen
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
        
        // Guardar el archivo en el estado
        setFormData(prev => ({
          ...prev,
          [name]: file
        }));
        return;
      }
    }
    
    // Manejo normal para otros campos
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('url_imagen', formData.url_imagen);

      const response = await fetch(`${import.meta.env.VITE_API_PORT_ENV}/recursos/noticias/add`, {
        method: 'POST',
        body: formDataToSend
        // No establezcas el header 'Content-Type', fetch lo hará automáticamente con el boundary correcto
      });

      if (!response.ok) {
        throw new Error('Error al agregar la noticia');
      }

      // Si todo sale bien, cerramos el modal
      close();
      location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#F0EFEF] p-6 rounded-lg w-1/4">
        <h2 className="text-xl font-medium mb-4 text-[#2B2829]">Añadir Noticia</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder='Ej: Nuevo convenio académico'
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder='Ej: Se ha firmado un acuerdo de colaboración...'
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
            <input
              type="file"
              name="url_imagen"
              onChange={handleChange}
              accept="image/*"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {previewImage && (
              <div className="mt-2">
                <img 
                  src={previewImage} 
                  alt="Vista previa" 
                  className="max-h-40 rounded"
                />
                <p className="text-xs text-gray-500 mt-1">Vista previa de la imagen</p>
              </div>
            )}
            <p className="mt-1 text-sm text-gray-500">Formatos aceptados: PNG, JPG, JPEG</p>
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-16 py-2 bg-[#1C1C34] text-white rounded hover:bg-[#2a2a4a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Añadiendo...' : 'Añadir'}
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

export default AgregarNoticias;