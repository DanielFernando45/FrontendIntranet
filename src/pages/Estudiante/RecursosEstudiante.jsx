import React, { useState, useEffect } from "react";
import LayoutApp from "../../layout/LayoutApp";
import FeclaIzqui from "../../assets/icons/arrow-left.svg";
import FechaDerec from "../../assets/icons/arrow-right.svg";
import flechaAzul from "../../assets/icons/arrowAzul.svg";
import play from "../../assets/icons/play.svg";
import youtube from "../../assets/images/ImagenYouTube.png";
import ver from "../../assets/icons/ver.svg";
import descargar from "../../assets/icons/descargarblanco.svg";
import link from "../../assets/icons/link.svg";

const RecursosEstudiante = () => {
  // Estados para los datos de las APIs
  const [tutoriales, setTutoriales] = useState([]);
  const [guias, setGuias] = useState([]);
  const [herramientas, setHerramientas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Estados para los modales
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [currentPdf, setCurrentPdf] = useState("");

  // Estados para controlar los índices de los elementos visibles
  const [visibleTutorials, setVisibleTutorials] = useState([0, 1, 2, 3]);
  const [visibleGuias, setVisibleGuias] = useState([0, 1, 2, 3, 4]);
  const [visibleHerramientas, setVisibleHerramientas] = useState([0, 1, 2, 3, 4, 5]);

  useEffect(() => {
    const calcularTutorialsVisibles = () => {
      const width = window.innerWidth;
      if (width >= 1636) setVisibleTutorials([0, 1, 2, 3]);
      else if (width >= 1200) setVisibleTutorials([0, 1, 2]);
      else if (width >= 900) setVisibleTutorials([0, 1]);
      else if (width >= 768) setVisibleTutorials([0]);
      else setVisibleTutorials([0]);
    };

    const calcularGuiasVisibles = () => {
      const width = window.innerWidth;

      if (width >= 1636) setVisibleGuias([0, 1, 2, 3, 4]);
      else if (width >= 1200) setVisibleGuias([0, 1, 2, 3]);
      else if (width >= 900) setVisibleGuias([0, 1, 2]);
      else if (width >= 768) setVisibleGuias([0, 1]);
      else if (width >= 600) setVisibleGuias([0, 1]);
      else setVisibleGuias([0]);
    };

    const calcularHerramientasVisibles = () => {
      const width = window.innerWidth;
      if (width >= 1440) setVisibleHerramientas([0, 1, 2, 3, 4, 5]);
      else if (width >= 1200) setVisibleHerramientas([0, 1, 2, 3, 4]);
      else if (width >= 900) setVisibleHerramientas([0, 1, 2, 3]);
      else if (width >= 768) setVisibleHerramientas([0, 1, 2 ]);
      else if (width >= 600) setVisibleHerramientas([0, 1]);
      else setVisibleHerramientas([0]);
    };

    // Llamada inicial
    calcularGuiasVisibles();
    calcularHerramientasVisibles();
    calcularTutorialsVisibles();

    // Escuchamos cambios de tamaño
    window.addEventListener("resize", calcularTutorialsVisibles);
    window.addEventListener("resize", calcularGuiasVisibles);
    window.addEventListener("resize", calcularHerramientasVisibles);

    // Cleanup
    return () => {
      window.removeEventListener("resize", calcularTutorialsVisibles);
      window.removeEventListener("resize", calcularGuiasVisibles);
      window.removeEventListener("resize", calcularHerramientasVisibles);
    };
  }, []); 

  // Función para cargar imágenes y verificar cuando están listas
  const loadImages = async (items, imageKey) => {
    const imagePromises = items.map((item) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = item[imageKey] || youtube;
        img.onload = resolve;
        img.onerror = resolve; // Resuelve incluso si hay error para no bloquear
      });
    });
    await Promise.all(imagePromises);
  };

  // Obtener datos de las APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Obtener todos los datos en paralelo
        const [tutorialesRes, guiasRes, herramientasRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_PORT_ENV}/recursos/tutoriales/all`).then((res) =>
            res.json()
          ),
          fetch(`${import.meta.env.VITE_API_PORT_ENV}/recursos/guias/all`).then((res) =>
            res.json()
          ),
          fetch(`${import.meta.env.VITE_API_PORT_ENV}/recursos/herramientas/all`).then((res) =>
            res.json()
          ),
        ]);

        // Establecer los datos
        setTutoriales(tutorialesRes);
        setGuias(guiasRes);
        setHerramientas(herramientasRes);

        // Pre-cargar imágenes
        await Promise.all([
          loadImages(tutorialesRes, "enlace"),
          loadImages(guiasRes, "imagen"),
          loadImages(herramientasRes, "imagen"),
        ]);

        // Todo está listo
        setImagesLoaded(true);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para extraer el ID del video de YouTube
  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Función para abrir el modal de video
  const openVideoModal = (url) => {
    setCurrentVideo(url);
    setShowVideoModal(true);
  };

  // Función para abrir el modal de PDF
  const openPdfModal = (url) => {
    setCurrentPdf(url);
    setShowPdfModal(true);
  };

  // Función para descargar PDF
  const downloadPdf = (url, title) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = title || "documento.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para rotar los elementos hacia la derecha
  const rotateRight = (section) => {
    if (section === "tutorial") {
      setVisibleTutorials((prev) => {
        const newIndices = prev.map((i) => (i + 1) % tutoriales.length);
        return newIndices;
      });
    } else if (section === "guia") {
      setVisibleGuias((prev) => {
        const newIndices = prev.map((i) => (i + 1) % guias.length);
        return newIndices;
      });
    } else if (section === "herramienta") {
      setVisibleHerramientas((prev) => {
        const newIndices = prev.map((i) => (i + 1) % herramientas.length);
        return newIndices;
      });
    }
  };

  // Función para rotar los elementos hacia la izquierda
  const rotateLeft = (section) => {
    if (section === "tutorial") {
      setVisibleTutorials((prev) => {
        const newIndices = prev.map(
          (i) => (i - 1 + tutoriales.length) % tutoriales.length
        );
        return newIndices;
      });
    } else if (section === "guia") {
      setVisibleGuias((prev) => {
        const newIndices = prev.map(
          (i) => (i - 1 + guias.length) % guias.length
        );
        return newIndices;
      });
    } else if (section === "herramienta") {
      setVisibleHerramientas((prev) => {
        const newIndices = prev.map(
          (i) => (i - 1 + herramientas.length) % herramientas.length
        );
        return newIndices;
      });
    }
  };

  // Componente Skeleton para Tutoriales
  const TutorialSkeleton = () => (
    <div className="relative w-[300px]">
      <div className="w-[300px] h-[400px] rounded-xl relative overflow-hidden bg-gray-200 animate-pulse">
        <div className="w-full h-[283px] rounded-t-xl bg-gray-300"></div>
        <div className="absolute bottom-0 left-0 w-full h-[116px] bg-gray-200 rounded-b-xl"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 z-10">
          <div className="h-5 w-3/4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
        </div>
        <div className="absolute top-[258px] right-[25px] bg-gray-300 h-[50px] w-[50px] rounded-full"></div>
      </div>
    </div>
  );

  // Componente Skeleton para Guías
  const GuiaSkeleton = () => (
    <div className="relative w-[262px] h-[284px] bg-gray-200 animate-pulse rounded-xl">
      <div className="w-full h-[126px] rounded-t-xl bg-gray-300"></div>
      <div className="w-full h-[110px] gap-[10px] py-[10px] px-[15px] bg-white">
        <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
        <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
      </div>
      <div className="flex h-[48px] bg-gray-300 rounded-b-xl">
        <div className="w-1/2 border-r border-gray-400"></div>
        <div className="w-1/2 border-l border-gray-400"></div>
      </div>
    </div>
  );

  // Componente Skeleton para Herramientas
  const HerramientaSkeleton = () => (
    <div className="relative w-[190px] h-[284px] bg-gray-200 animate-pulse rounded-xl">
      <div className="w-full h-[126px] rounded-t-xl bg-gray-300"></div>
      <div className="flex flex-col w-full h-[83px] gap-[4px] py-[10px] px-[10px] bg-white">
        <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
        <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
      </div>
      <div className="h-[33px] bg-gray-300 rounded-b-xl"></div>
    </div>
  );

  // Componente de carga completa
  const FullPageSkeleton = () => (
    <div className="w-full h-screen flex flex-col gap-8 p-5">
      <div className="flex justify-between items-center">
        <div className="h-7 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="flex gap-4">
          {Array(5)
            .fill()
            .map((_, i) => (
              <TutorialSkeleton key={`full-tutorial-${i}`} />
            ))}
        </div>
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <div className="h-7 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="flex gap-4">
          {Array(5)
            .fill()
            .map((_, i) => (
              <GuiaSkeleton key={`full-guia-${i}`} />
            ))}
        </div>
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <div className="h-7 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="flex gap-4">
          {Array(5)
            .fill()
            .map((_, i) => (
              <HerramientaSkeleton key={`full-herramienta-${i}`} />
            ))}
        </div>
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  );

  if (loading || !imagesLoaded) {
    return (
      <LayoutApp>
        <FullPageSkeleton />
      </LayoutApp>
    );
  }

  return (
    <LayoutApp>
      <main className="flex flex-col 1xl:mx-5 gap-5 xl:px-4">
        {/* Modal de Video */}
        {showVideoModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setShowVideoModal(false)}
          >
            <div
              className="relative bg-white p-4 rounded-lg w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-10 right-0 text-white text-2xl"
                onClick={() => setShowVideoModal(false)}
              >
                ×
              </button>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  width="100%"
                  height="500"
                  src={`https://www.youtube.com/embed/${getYouTubeId(
                    currentVideo
                  )}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* Modal de PDF */}
        {showPdfModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setShowPdfModal(false)}
          >
            <div
              className="relative bg-white p-4 rounded-lg w-full max-w-6xl h-5/6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-10 right-0 text-white text-2xl"
                onClick={() => setShowPdfModal(false)}
              >
                ×
              </button>
              <div className="h-full w-full">
                <iframe
                  src={currentPdf}
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* TUTORIALES */}
        <div className="bg-white rounded-xl py-5">

          <h2 className="text-[20px] font-medium ml-4 sm:ml-8">Tutoriales</h2>
          
          <div className="flex justify-center w-full  sm:gap-4 xl:gap-[1px] ">
            <button
              onClick={() => rotateLeft("tutorial")}
              className="flex items-center"
            >
              <img src={FeclaIzqui} alt="" />
            </button>

            <div className="flex gap-4 ">
              {visibleTutorials.map((index) => {
                const tutorial = tutoriales[index];
                if (!tutorial) return null;

                return (
                  <section
                    key={tutorial.id}
                    className="relative group cursor-pointer border w-[250px] sm:w-[400px] md:w-[600px] lg:w-[350px] drop-shadow rounded-xl"
                  >
                    <div className="h-[338px] sm:h-[400px]   rounded-xl relative overflow-hidden ">
                      <img
                        className="w-full h-[283px] rounded-t-xl object-cover"
                        src={`https://img.youtube.com/vi/${getYouTubeId(
                          tutorial.enlace
                        )}/maxresdefault.jpg`}
                        alt={tutorial.titulo}
                        onError={(e) => {
                          e.target.src = youtube; // Imagen de respaldo
                        }}
                      />

                      <div className="absolute bottom-0 left-0 w-full h-[85px] sm:h-[116px] bg-white rounded-b-xl transition-all duration-500 group-hover:h-full group-hover:bg-white/90 group-hover:backdrop-blur-sm"></div>

                      <div className="absolute bottom-0 left-0 w-full p-6 z-10 transition-all duration-500 group-hover:bottom-1/4 group-hover:translate-y-1/2">
                        <div className="flex flex-col gap-[1px] transition-all duration-300 group-hover:items-center group-hover:gap-2">
                          <h1 className="text-[16px] font-semibold transition-all duration-300 group-hover:text-[20px] group-hover:text-center">
                            {tutorial.titulo}
                          </h1>
                        </div>
                      </div>

                      <button
                        className="absolute top-[219px] right-[10px] sm:top-[258px] sm:right-[25px] bg-white h-[50px] w-[50px] rounded-full flex justify-center items-center shadow-md transition-all duration-500 group-hover:h-[70px] group-hover:w-[70px] group-hover:top-1/2 group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:right-auto z-20"
                        onClick={() => openVideoModal(tutorial.enlace)}
                      >
                        <img
                          src={play}
                          alt="Play"
                          className="transition-all duration-300 group-hover:scale-110"
                        />
                      </button>
                    </div>
                  </section>
                );
              })}
            </div>

            <button
              onClick={() => rotateRight("tutorial")}
              className="flex items-center"
            >
              <img src={FechaDerec} alt="" />
            </button>
          </div>

        </div>

        <div className="flex flex-col justify-between gap-5">
            {/* GUIAS */}
            <div className="bg-white rounded-xl py-2">

              <h2 className="text-[20px] font-medium ml-4">Guías</h2>

              <div className="flex justify-center w-full ">
                <button
                  onClick={() => rotateLeft("guia")}
                  className="flex items-center"
                >
                  <img src={FeclaIzqui} alt="" />
                </button>

                <div className="flex gap-2 1xl:gap-6 3xl:gap-2">
                  {visibleGuias.map((index) => {
                    const guia = guias[index];
                    if (!guia) return null;

                    return (
                      <section
                        key={guia.id}
                        className="relative w-[262px] h-[284px] drop-shadow-md rounded-xl"
                      >
                        <img
                          className="w-full h-[126px] rounded-t-xl object-cover"
                          src={guia.imagen}
                          alt={guia.titulo}
                          onError={(e) => {
                            e.target.src = youtube; // Imagen de respaldo
                          }}
                        />
                        <div className="w-full h-[110px] gap-[10px] py-[10px] px-[15px] bg-white">
                          <h1 className="text-[15px] font-medium">{guia.titulo}</h1>
                          <p className="text-[12px] text-[#425466] line-clamp-3">
                            {guia.descripcion}
                          </p>
                        </div>
                        <div className="flex h-[48px] bg-[#1B435D] rounded-b-xl">
                          <button
                            className="flex w-full h-[48px] justify-center items-center border-r"
                            onClick={() => openPdfModal(guia.documento)}
                          >
                            <img src={ver} alt="Ver" />
                          </button>
                          <button
                            className="flex w-full h-[48px] justify-center items-center border-l"
                            onClick={() => downloadPdf(guia.documento, guia.titulo)}
                          >
                            <img src={descargar} alt="Descargar" />
                          </button>
                        </div>
                      </section>
                    );
                  })}
                </div>

                <button
                  onClick={() => rotateRight("guia")}
                  className="flex items-center"
                >
                  <img src={FechaDerec} alt="" />
                </button>
              </div>
            </div>

              {/* HERRAMIENTAS */}
            <div className="flex flex-col  gap-5 bg-white rounded-xl p-2">

                <h2 className="text-[20px] font-medium ml-4">Herramientas</h2>

              <div className="flex justify-center w-full h-[250px] ">
                <button
                  onClick={() => rotateLeft("herramienta")}
                  className="flex items-center"
                >
                  <img src={FeclaIzqui} alt="" />
                </button>

                <div className="flex gap-4 1xl:gap-2 3xl:gap-7 ">
                  {visibleHerramientas.map((index) => {
                    const herramienta = herramientas[index];
                    if (!herramienta) return null;

                    return (
                      <section
                        key={herramienta.id}
                        className="relative w-[190px] h-[235px] drop-shadow-md rounded-xl"
                      >
                        <img
                          className="w-full h-[126px] rounded-t-xl object-cover bg-white"
                          src={herramienta.imagen}
                          alt={herramienta.nombre}
                          onError={(e) => {
                            e.target.src = youtube; // Imagen de respaldo
                          }}
                        />
                        <div className="flex flex-col w-full h-[83px] gap-[4px] py-[10px] px-[10px] bg-white">
                          <h1 className="text-[15px] font-medium">
                            {herramienta.nombre}
                          </h1>
                          <p className="text-[9px] text-[#425466] line-clamp-3">
                            {herramienta.descripcion}
                          </p>
                        </div>

                        <a
                          href={herramienta.enlace}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-[33px] bg-[#1B435D] rounded-b-xl flex flex-col w-full justify-center items-center"
                        >
                          <img src={link} alt="Enlace" />
                        </a>
                      </section>
                    );
                  })}
                </div>

                <button
                  onClick={() => rotateRight("herramienta")}
                  className="flex items-center"
                >
                  <img src={FechaDerec} alt="" />
                </button>
              </div>
            </div>

        </div>

        
        
      </main>
    </LayoutApp>
  );
};

export default RecursosEstudiante;
