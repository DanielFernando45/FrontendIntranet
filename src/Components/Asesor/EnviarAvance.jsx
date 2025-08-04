import React, { useState, useRef } from 'react';
import agregar from "../../assets/icons/IconEstudiante/add.svg";
import eliminar from "../../assets/icons/delete.svg";

const EnviarAvance = ({ show, onClose, onSubmit }) => {
  const [titulo, setTitulo] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const tiposPermitidos = [
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'video/mp4', 'video/webm', 'video/ogg',
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'
  ];

  const handleFileChange = (e) => {
    const nuevosArchivos = Array.from(e.target.files);
    const archivosValidos = nuevosArchivos.filter(file => tiposPermitidos.includes(file.type));

    if (archivos.length + archivosValidos.length <= 7) {
      setArchivos(prev => [...prev, ...archivosValidos]);
    } else {
      alert('Solo puedes subir un máximo de 7 archivos.');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const eliminarArchivo = (index) => {
    setArchivos(prev => prev.filter((_, i) => i !== index));
  };

  const handleClickOutside = (e) => {
    if (e.target.id === 'modal-background') {
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (titulo.trim() === '' || archivos.length === 0) return;

    setIsSubmitting(true);
    
    try {
      await onSubmit(titulo, archivos);
    } catch (error) {
      console.error('Error al enviar avance:', error);
      alert('Ocurrió un error al enviar el avance');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div
      id="modal-background"
      onClick={handleClickOutside}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto"
    >
      <div className="bg-[#F8F7F7] flex flex-col gap-4 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto transition-all duration-300">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
        >✕</button>

        <div className='flex justify-center'>
          <h2 className="text-xl font-medium">Enviar Avance</h2>
        </div>

        <div className="flex mb-4 gap-10 items-center">
          <label className="block text-sm mb-1">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            placeholder='Inserte el título del avance'
            className="w-full rounded px-3 py-[2px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-7">
          <label className="text-sm mb-1 mt-1">Archivos</label>

          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept={tiposPermitidos.join(',')}
            onChange={handleFileChange}
            className="hidden"
            disabled={isSubmitting}
          />
          {archivos.length > 0 && (
            <ul className="flex flex-col text-sm text-gray-700 gap-3">
              {archivos.map((file, index) => (
                <li key={index} className="flex w-[375px] justify-between items-center bg-white rounded">
                  <span className="truncate w-[80%]">{file.name}</span>
                  <button
                    onClick={() => !isSubmitting && eliminarArchivo(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={isSubmitting}
                  >
                    <img src={eliminar} alt="" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='flex justify-center'>
          {archivos.length < 7 && (
            <button
              onClick={handleUploadClick}
              disabled={isSubmitting}
            >
              <img src={agregar} alt="" />
            </button>
          )}
        </div>

        <div className='flex justify-center'>
          <button
            className={`w-[130px] text-[13px] rounded-md ${titulo.trim() !== '' && archivos.length > 0 && !isSubmitting
                ? 'bg-[#0CB2D5] hover:bg-[#0a9ec0] text-white'
                : 'bg-[#DAD6D7] cursor-not-allowed'
              } py-2`}
            onClick={handleSubmit}
            disabled={titulo.trim() === '' || archivos.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnviarAvance;