import React, { useEffect, useState } from 'react';
import axios from 'axios';
import descargar from "../../../assets/icons/Descargas.svg";
const OtrosDocs = ({ idAsesoramiento }) => {
  const [DocExtra, setDocExtra] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idAsesoramiento) {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_PORT_ENV}/asesoramiento-documentos/listar/${idAsesoramiento}`)
        .then((response) => {
          setDocExtra(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener los documentos:", error);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [idAsesoramiento]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("es-PE", options);
  };

  const cortarTexto = (texto) => {
    if (!texto) return "";
    const filename = texto.split("/").pop();
    const index = filename.indexOf("-");
    let limpio = index !== -1 ? filename.substring(index + 1) : filename;
    const limite = 20;
    if (limpio.length > limite) {
      limpio = limpio.slice(0, limite) + "...";
    }
    return limpio;
  };

  const SkeletonRow = () => (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-[#E9E7E7] p-2 rounded-md animate-pulse mt-2">
      <div className="h-6 bg-gray-300 rounded"></div>
      <div className="hidden sm:block h-6 bg-gray-300 rounded"></div>
      <div className="hidden sm:block h-6 bg-gray-300 rounded"></div>
      <div className="hidden sm:block h-6 bg-gray-300 rounded"></div>
      <div className="h-6 bg-gray-300 rounded"></div>
    </div>
  );

  return (
    <div>
      <h2 className="font-semibold text-lg mb-2">Documentos Adicionales</h2>

      <div className="flex justify-between text-[#495D72] font-medium p-[6px] rounded-md text-xs md:text-base">
        <div className="w-[300px] flex">Título</div>

        <div className="w-[100px] flex justify-center">Fecha</div>
        <div className="w-[250px] justify-center hidden md:flex">Archivo(s)</div>
        <div className="w-[65px] rounded-md px-3 flex justify-center">Descargar</div>
      </div>

      {loading ? (
        <SkeletonRow />
      ) : (
        DocExtra.map((doc) =>
          doc.archivos.map((archivo) => (
            <div
              key={`${doc.id}-${archivo.id}`}
              className="flex justify-between bg-[#F5F5F5] p-2 mt-2 rounded-md text-xs md:text-sm items-center"
            >
              <div className="w-[300px] flex">{doc.titulo}</div>
              <div className="w-[100px] flex justify-center">{formatDate(doc.fecha)}</div>
              <div className="w-[250px] hidden md:flex justify-center">{cortarTexto(archivo.url)}</div>
              <div className="w-[65px] flex justify-center">
                <a
                  href={archivo.signedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-white px-2 py-1 border-2 rounded hover:bg-blue-600 transition"
                >
                  <img
                    src={descargar}
                    alt="Descargar"
                    className="w-5 h-5"
                  />
                </a>
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
};

export default OtrosDocs;
