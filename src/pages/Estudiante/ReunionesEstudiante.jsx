import { useEffect, useState } from "react";
import LayoutApp from "../../layout/LayoutApp";
import Zoom from "../../assets/icons/IconEstudiante/ZoomLink.svg";
import download_icon from "../../assets/icons/download.png";
import play_icon from "../../assets/icons/play-white.png";
import { useQuery } from "@tanstack/react-query";
import { induccionesService } from "../../services/induccionesService";
import ReactPlayer from 'react-player';
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

      fetch(`${import.meta.env.VITE_API_PORT_ENV}/cliente/miAsesoramiento/${id}`)
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
            console.log(data)
            return asesoriasArray
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
      fetch(`${import.meta.env.VITE_API_PORT_ENV}/reuniones/espera/${selectedAsesoriaId}`)
        .then((res) => res.json())
        .then((data) => {
          setProximasReuniones(data);
        })
        .catch((error) =>
          console.error("Error al obtener reuniones próximas:", error)
        )
        .finally(() => setLoading(false));
      // Obtener reuniones terminadas
      // fetch(
      //   `${import.meta.env.VITE_API_PORT_ENV}/inducciones/induccionesByAsesoria/${selectedAsesoriaId}`
      // )
      //   .then((res) => res.json())
      //   .then((data) => {
      //     console.log(data);
      //     setInducciones(data);
      //   })
      //   .catch((error) =>
      //     console.error("Error al obtener reuniones terminadas:", error)
      //   )
      //   .finally(() => setLoading(false));
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

  const downloadFile = async (induccion) => {
    const response = await fetch(induccion.url);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "video.mp4";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
                <option value="" disabled>Seleccione una opción</option>
                {asesorias && asesorias.length > 0 && asesorias.map((asesoria, index) => (
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
                        <div
                          className={`flex flex-col justify-center items-center rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none w-full sm:w-[104px] h-[100px] sm:h-full bg-[#17162E] p-4 text-white`}
                        >
                          <p>{formattedDate.month}</p>
                          <h1 className="text-[30px]">{formattedDate.day}</h1>
                          <p className="text-[12px]">{formattedDate.time}</p>
                        </div>
                        <div className="flex flex-col justify-between w-full h-full border border-[#AAA3A5] bg-[#F0EFEF] p-4 rounded-b-xl sm:rounded-r-xl sm:rounded-bl-none">
                          <span className="flex flex-col gap-[6px]">
                            <p className="font-medium">{reunion.titulo}</p>
                            <h1 className="text-[#666666]">
                              Codigo: {reunion.meetingId}
                            </h1>
                          </span>
                          <div className="w-full px-5">
                            <button className="flex gap-4 justify-between px-1 h-12 items-center text-white rounded-2xl bg-[#1271ED]">
                              <a href={reunion.enlace_zoom} target="_blank">
                                <p className="font-medium">Enlace Zoom</p>
                              </a>
                              <img src={Zoom} alt="Zoom" className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-[12px]">
                <div className="flex w-full border-b-[3px] gap-3 border-[#0CB2D5] font-normal">
                  <button className="px-3 rounded-t-[5px] w-[105px] bg-[#0CB2D5] text-white">
                    Anteriores
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
                              src="/wp-induccion.jpg"
                              className="block w-full rounded-md"
                              alt="back_image-induccion"
                            />
                            <div className="absolute w-full h-full top-0 flex flex-col justify-between p-2">
                              <p className="text-white">{induccion?.titulo}</p>
                              <div className="flex justify-between text-white">
                                {/* <button
                                  onClick={() => downloadFile(induccion)}
                                  className="text-sm border border-white rounded-md  p-2 flex gap-1"
                                >
                                  Descargar
                                  <span>
                                    <img
                                      src={download_icon}
                                      alt="download-icon"
                                    />
                                  </span>
                                </button> */}
                                <button
                                  onClick={() => {
                                    setUrlVideo(induccion.url);
                                    setShowModalVideo(true);
                                  }}
                                  className="ml-auto text-sm border border-white rounded-md  p-2 flex gap-1 items-center"
                                >
                                  Ver
                                  <span>
                                    <img src={play_icon} alt="play-icon" />
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
          <div onClick={() => setShowModalVideo(false)} className="fixed bg-black/50 top-0 left-0 w-full h-full flex items-center justify-center z-50 px-4">
            <div onClick={(event) => event.stopPropagation()} className="bg-white p-6 rounded-lg w-full shadow-lg lg:w-[500px] lg:h-[500px] max-w-[800px] max-h-[500px]">
              <VideoPlayer urlVideo={urlVideo} />
              {/* <video
                src={urlVideo}
                controls
                className="w-full h-full"
              ></video> */}
            </div>
          </div>
        )}
      </main>
    </LayoutApp>
  );
};

export default ReunionesEstudiante;
