import { useEffect, useState } from "react";
import LayoutApp from "../../layout/LayoutApp";
import Zoom from "../../assets/icons/IconEstudiante/ZoomLink.svg";
import download_icon from "../../assets/icons/download.png";
import play_icon from "../../assets/icons/play-white.png";
import { useQuery } from "@tanstack/react-query";
import { induccionesService } from "../../services/induccionesService";
import ReactPlayer from "react-player";
import VideoPlayer from "../../Components/VideoPlayer";

const ReunionesEstudiante = () => {
  const [asesorias, setAsesorias] = useState([]);
  const [selectedAsesoriaId, setSelectedAsesoriaId] = useState(null);
  const [proximasReuniones, setProximasReuniones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModalVideo, setShowModalVideo] = useState(false);
  const [urlVideo, setUrlVideo] = useState(null);

  const { data: inducciones, isLoading: induccionesLoading } = useQuery({
    queryKey: ["inducciones", selectedAsesoriaId],
    queryFn: () =>
      induccionesService.obtenerInduccionesByIdAsesoria(selectedAsesoriaId),
    enabled: !!selectedAsesoriaId,
  });

  console.log(inducciones);

  useEffect(() => {
    const usuario = localStorage.getItem("user");
    if (usuario) {
      const user = JSON.parse(usuario);
      const id = user.id_cliente;

      fetch(
        `${import.meta.env.VITE_API_PORT_ENV}/cliente/miAsesoramiento/${id}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.isEmpty) {
            console.warn(data.message);
            setAsesorias([]);
            return;
          }
          const asesoriasArray = Object.values(data).map((item) => ({
            id: item.id,
            profesion: item.profesion_asesoria,
          }));
          setAsesorias(() => {
            console.log(data);
            return asesoriasArray;
          });

          if (asesoriasArray.length > 0) {
            const primeraAsesoriaId = asesoriasArray[0].id;
            setSelectedAsesoriaId(primeraAsesoriaId);
          }
        })
        .catch((error) => console.error("Error al obtener asesorías:", error))
        .finally(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    if (selectedAsesoriaId) {
      // Obtener reuniones en espera
      fetch(
        `${
          import.meta.env.VITE_API_PORT_ENV
        }/reuniones/espera/${selectedAsesoriaId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setProximasReuniones(data);
        })
        .catch((error) =>
          console.error("Error al obtener reuniones próximas:", error)
        )
        .finally(() => setLoading(false));
    }
  }, [selectedAsesoriaId]);

  const handleChange = (e) => {
    const asesoriaId = e.target.value;
    setSelectedAsesoriaId(asesoriaId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long" };
    return {
      month: new Intl.DateTimeFormat("es-ES", options).format(date),
      day: date.getUTCDate(), // Usar getUTCDate para mantener consistencia
      time: date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC", // Forzar a usar UTC para la hora
      }),
    };
  };

  return (
    <LayoutApp>
      <main className="flex justify-center ">
        <div className="flex flex-col gap-[40px] lg:ml-1 p-[20px]  w-full  bg-white rounded-[20px] ">
          <div className="flex flex-col gap-[12px]">
            <div className="flex justify-between flex-col sm:flex-row">
              <h1 className="font-medium text-[20px]">Reuniones</h1>
              <select
                onChange={handleChange}
                value={selectedAsesoriaId || ""}
                className="border rounded-t-md border-[#b4a6aa]"
              >
                <option value="" disabled>
                  Seleccione una opción
                </option>
                {asesorias &&
                  asesorias.length > 0 &&
                  asesorias.map((asesoria, index) => (
                    <option key={index} value={asesoria.id}>
                      {asesoria.profesion}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex w-full border-b-[3px] gap-3 border-black font-normal">
              <button className="px-3 rounded-t-[5px] w-[105px] bg-[#17162E] text-white">
                Próximos
              </button>
            </div>
          </div>

          {/* Contenido para reuniones próximas */}
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <>
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap justify-start gap-6">
                  {proximasReuniones.map((reunion, index) => {
                    const formattedDate = formatDate(reunion.fecha_reunion);
                    return (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row w-full sm:w-[310px] h-auto sm:h-[170px] items-center"
                      >
                        {/* Sección de fecha */}
                        <div className="flex flex-col justify-center items-center rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none w-full sm:w-[104px] h-[100px] sm:h-full bg-[#17162E] p-4 text-white">
                          <p className="text-xs">{formattedDate.month}</p>
                          <h1 className="text-3xl font-semibold">
                            {formattedDate.day}
                          </h1>
                          <p className="text-[10px]">{formattedDate.time}</p>
                        </div>

                        {/* Sección de reunión */}
                        <div className="flex flex-col justify-between w-full h-full border border-[#E0E0E0] bg-[#F9F9F9] p-4 rounded-b-xl sm:rounded-r-xl sm:rounded-bl-none">
                          <span className="flex flex-col gap-2">
                            <p className="font-medium text-[#333333]">
                              {reunion.titulo}
                            </p>
                            <h1 className="text-[#999999] text-sm">
                              Código: {reunion.meetingId}
                            </h1>
                          </span>
                          <div className="w-full px-4">
                            <button className="flex gap-4 justify-between items-center h-10 px-6 bg-[#1271ED] hover:bg-[#1E85F6] text-white rounded-full transition-all duration-200">
                              <a
                                href={reunion.enlace_zoom}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <p className="font-medium text-sm">
                                  Enlace Zoom
                                </p>
                              </a>
                              <img src={Zoom} alt="Zoom" className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-[12px]">
                <div className="flex w-full border-b-[3px] border-[#0CB2D5] font-normal">
                  <button className="px-4 py-1 rounded-t-[5px] bg-[#0CB2D5] text-white">
                    Inducciones
                  </button>
                </div>
              </div>

              {/* Contenido para reuniones terminadas */}
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
                  {induccionesLoading ? (
                    <p>Cargando inducciones...</p>
                  ) : inducciones && inducciones.length > 0 ? (
                    <>
                      {inducciones.map((induccion, index) => {
                        return (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row items-center relative"
                          >
                            <img
                              src="/preview.png"
                              className="block w-full rounded-md shadow-lg"
                              alt="back_image-induccion"
                            />

                            <div className="absolute w-full h-full top-0 flex flex-col justify-between p-6 bg-gradient-to-t from-black to-transparent opacity-80">
                              {/* Título */}
                              <p className="text-white text-3xl font-bold text-shadow-md mb-4">
                                {induccion?.titulo}
                              </p>

                              <div className="flex justify-between items-center mt-auto">
                                {/* Botón de ver */}
                                <button
                                  onClick={() => {
                                    setUrlVideo(induccion.url);
                                    setShowModalVideo(true);
                                  }}
                                  className="ml-auto text-sm bg-blue-500 text-white border-2 border-blue-500 rounded-md p-3 flex gap-2 items-center hover:bg-white hover:text-blue-500 transition-all duration-300 ease-in-out"
                                >
                                  Ver
                                  <span>
                                    <img
                                      src={play_icon}
                                      alt="play-icon"
                                      className="w-5 h-5"
                                    />
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <p>No hay inducciones disponibles</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {showModalVideo && (
          <div
            onClick={() => setShowModalVideo(false)}
            className="fixed bg-black/50 top-0 left-0 w-full h-full flex items-center justify-center z-50 px-4"
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className=" p-6 rounded-lg w-full shadow-lg max-w-[100%] max-h-[80vh] relative"
              style={{
                aspectRatio: "14/8", // Relación de aspecto para videos horizontales
              }}
            >
              <VideoPlayer urlVideo={urlVideo} />
            </div>
          </div>
        )}
      </main>
    </LayoutApp>
  );
};

export default ReunionesEstudiante;
