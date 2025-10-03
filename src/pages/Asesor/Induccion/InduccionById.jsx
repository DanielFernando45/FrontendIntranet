import { useQuery } from "@tanstack/react-query";
import LayoutApp from "../../../layout/LayoutApp";
import { useNavigate, useParams } from "react-router-dom";
import { induccionesService } from "../../../services/induccionesService";
import { asesoriasService } from "../../../services/asesoriasService";
import trash_icon from "../../../assets/icons/trash.png";
import play_icon from "../../../assets/icons/play.svg";
import download_icon from "../../../assets/icons/download.png";
import ModalBorrarInduccion from "../../../Components/Induccion/ModalBorrarInduccion";
import { useState } from "react";
import back from "../../../assets/icons/back.png";

const InduccionById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [expandedInfo, setExpandedInfo] = useState(false);

  const {
    data: induccionesByIdAsesoramiento,
    isLoading: isLoadingInducciones,
    isError: isErrorInducciones,
    error: errorInducciones,
  } = useQuery({
    queryKey: ["induccionesByIdAsesoramiento", id],
    queryFn: () => induccionesService.obtenerInduccionesByIdAsesoria(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });

  const { 
    data: asesoramientoById, 
    isLoading: isLoadingAsesoramiento,
    isError: isErrorAsesoramiento,
    error: errorAsesoramiento,
  } = useQuery({
    queryKey: ["asesoramientoById", id],
    queryFn: () => asesoriasService.asesoramientoById(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });

  const handleVideoAction = (video, action) => {
    setSelectedVideo(video);
    if (action === 'delete') {
      setOpenModalDelete(true);
    } else if (action === 'play') {
      // Aquí podrías abrir un modal con el video en grande
      const videoElement = document.createElement('video');
      videoElement.src = video.url;
      videoElement.controls = true;
      videoElement.style.width = '80%';
      videoElement.style.maxWidth = '800px';
      videoElement.style.borderRadius = '12px';
      
      // Modal simple para mostrar el video
      if (window.confirm('¿Quieres ver el video en pantalla completa? Haz clic en OK y luego en el ícono de pantalla completa del reproductor.')) {
        window.open(video.url, '_blank');
      }
    }
  };

  const handleDownload = (video) => {
    // Simulación de descarga
    const link = document.createElement('a');
    link.href = video.url;
    link.download = `${video.titulo}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoadingInducciones || isLoadingAsesoramiento) {
    return (
      <LayoutApp>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg">Cargando información...</span>
        </div>
      </LayoutApp>
    );
  }

  if (isErrorInducciones || isErrorAsesoramiento) {
    return (
      <LayoutApp>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Error al cargar los datos</h3>
            <p className="text-gray-600 mb-4">Por favor, intenta nuevamente</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </LayoutApp>
    );
  }

  const asesoramiento = asesoramientoById?.[0];

  if (!asesoramiento) {
    return (
      <LayoutApp>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2">No se encontró el asesoramiento</h3>
            <button 
              onClick={() => navigate("/asesor/inducciones")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver a inducciones
            </button>
          </div>
        </div>
      </LayoutApp>
    );
  }

  return (
    <LayoutApp>
      <div className="p-4 ml-[100px] xl:ml-0 relative">
        {/* Header con información del asesoramiento */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 relative transition-all duration-300 hover:shadow-xl">
          <button
            onClick={() => navigate("/asesor/inducciones")}
            className="w-10 h-10 absolute rounded-full bg-gray-100 flex justify-center items-center right-4 top-4 hover:bg-gray-200 transition-colors group"
            title="Volver atrás"
          >
            <img src={back} alt="back-icon" className="group-hover:scale-110 transition-transform" />
          </button>
          
          <h3 className="text-2xl font-bold mb-4 text-gray-800 pr-16">
            {asesoramiento.referencia}
          </h3>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-8 items-start">
              <div className="flex-1 min-w-[250px]">
                <p className="font-semibold text-gray-700 mb-2">
                  Delegado:{" "}
                  <span className="font-medium text-gray-900 ml-2 bg-blue-50 px-3 py-1 rounded-full">
                    {asesoramiento.delegado}
                  </span>
                </p>
                
                <div className="mt-4">
                  <p className="font-semibold text-gray-700 mb-2">Área: </p>
                  <span className="font-medium text-gray-900 bg-green-50 px-3 py-1 rounded-full">
                    {asesoramiento.area}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-[250px]">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-700">Integrantes:</p>
                  <button 
                    onClick={() => setExpandedInfo(!expandedInfo)}
                    className="text-blue-600 text-sm hover:text-blue-800 transition-colors"
                  >
                    {expandedInfo ? 'Ver menos' : 'Ver todos'}
                  </button>
                </div>
                <ul className={`space-y-1 transition-all duration-300 ${expandedInfo ? '' : 'max-h-20 overflow-hidden'}`}>
                  {asesoramiento.estudiantes.map((item, index) => (
                    <li 
                      key={item.id} 
                      className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm mr-2">
                        {index + 1}
                      </span>
                      {item.estudiante}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de videos */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-gray-800">Videos de Inducción</h4>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {induccionesByIdAsesoramiento?.length || 0} videos
            </span>
          </div>

          {isLoadingInducciones ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3">Cargando videos...</span>
            </div>
          ) : !induccionesByIdAsesoramiento || induccionesByIdAsesoramiento.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-300 text-8xl mb-4">🎬</div>
              <h5 className="text-lg font-semibold text-gray-500 mb-2">
                No hay videos subidos aún
              </h5>
              <p className="text-gray-400">
                Los videos de inducción aparecerán aquí cuando sean agregados
              </p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {induccionesByIdAsesoramiento.map((item, index) => (
                <div 
                  key={item.id}
                  className="bg-gray-50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
                >
                  <div className="relative">
                    <video
                      src={item.url}
                      className="w-full h-32 object-cover"
                      poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ccircle cx='200' cy='100' r='40' fill='%23d1d5db'/%3E%3Cpolygon points='180,80 180,120 220,100' fill='%239ca3af'/%3E%3C/svg%3E"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => handleVideoAction(item, 'play')}
                        className="bg-white bg-opacity-90 rounded-full p-3 mr-2 hover:scale-110 transition-transform"
                        title="Reproducir video"
                      >
                        <img src={play_icon} alt="play" className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDownload(item)}
                        className="bg-white bg-opacity-90 rounded-full p-3 mr-2 hover:scale-110 transition-transform"
                        title="Descargar video"
                      >
                        <img src={download_icon} alt="download" className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleVideoAction(item, 'delete')}
                      className="absolute top-3 right-3 bg-white bg-opacity-80 rounded-full p-2 hover:bg-red-500 hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      title="Eliminar video"
                    >
                      <img src={trash_icon} alt="delete" className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h5 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                      {item.titulo}
                    </h5>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.capitulo}
                    </p>
                    <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                      <span>Video {index + 1}</span>
                      <span className="bg-gray-200 px-2 py-1 rounded-full">
                        {Math.floor(Math.random() * 10) + 1} min
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ModalBorrarInduccion
        id={selectedVideo?.id}
        openModalDelete={openModalDelete}
        setOpenModalDelete={setOpenModalDelete}
        videoTitle={selectedVideo?.titulo}
      />
    </LayoutApp>
  );
};

export default InduccionById;