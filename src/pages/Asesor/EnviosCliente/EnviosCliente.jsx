import React from 'react'
import { useState, useEffect } from "react";
import arrowIcon from '../../../assets/icons/IconEstudiante/arriba.svg'
import descargar from '../../../assets/icons/Descargas.svg'
import documentosVacios from '../../../assets/icons/documentosVacios.png'
import axios from 'axios';

const EnviosCliente = ({ idAsesoramiento }) => {
  const [envioCliente, setEnvioCliente] = useState([]);
  const [openItems, setOpenItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idAsesoramiento) {
      setLoading(true);
      axios.get(`${import.meta.env.VITE_API_PORT_ENV}/documentos/estudiante/list/${idAsesoramiento}`)
        .then(response => {
          setEnvioCliente(response.data);
          // Inicializar el estado de apertura para cada item
          const initialOpenState = {};
          response.data.forEach((envio, index) => {
            initialOpenState[index] = false;
          });
          setOpenItems(initialOpenState);
        })
        .catch(error => {
          console.error('Error al obtener los pendientes:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [idAsesoramiento]);

  const toggleOpen = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const options = { month: 'short', day: 'numeric', year: 'numeric' }
    return date.toLocaleDateString('es-PE', options)
  }

  const cortarTexto = (texto) => {
    const index = texto.indexOf('-');
    if (index !== -1) {
      return texto.substring(index + 1);
    }
    return texto; // Si no se encuentra el guion, devuelve el texto original
  }

  // Función para extraer todos los documentos de un envio
  const getDocuments = (envio) => {
    const documents = [];
    let i = 1;

    while (envio[`nombreDoc${i}`] && envio[`ruta${i}`]) {
      // Extraer el pathFile de la URL (última parte después de /)
      const urlParts = envio[`ruta${i}`].split('/');
      const pathFile = urlParts[urlParts.length - 1];

      documents.push({
        name: envio[`nombreDoc${i}`],
        url: envio[`ruta${i}`],
        pathFile: pathFile
      });
      i++;
    }

    return documents;
  };

  // Función para descargar archivos directamente desde la URL proporcionada
  const handleDownload = async (url, filename) => {
    try {
      // Crear un enlace temporal para descargar el archivo
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Limpiar
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      alert('Error al descargar el archivo');
    }
  };

  // Componente Skeleton
  const SkeletonRow = () => (
    <div className="flex justify-between bg-[#E9E7E7] p-[6px] rounded-md items-center mt-2 animate-pulse">
      <div className="w-[300px] h-6 bg-gray-300 rounded"></div>
      <div className="w-[102px] h-6 bg-gray-300 rounded"></div>
      <div className="w-[100px] h-6 bg-gray-300 rounded"></div>
      <div className="w-[250px] h-6 bg-gray-300 rounded"></div>
      <div className="w-[65px] h-6 bg-gray-300 rounded"></div>
    </div>
  );

  return (
    <div className="flex flex-col text-[14px]">
      <div className="flex  justify-between text-[#495D72] font-medium p-[6px] rounded-md">
        <div className="flex-1 md:w-[300px]   flex">Titulo</div>
        <div className="w-[102px] hidden md:flex justify-center">Estado</div>
        <div className="flex-1 md:w-[100px] flex justify-center">Fecha</div>
        <div className="flex-1 md:w-[250px] flex justify-center">Archivo</div>
        <div className="w-[65px] rounded-md px-3 flex justify-center">Descargas</div>
      </div>

      {loading ? (
        // Mostrar skeletons mientras carga
        <>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </>
      ) : envioCliente.length > 0 ? (
        // Mostrar datos cuando ya están cargados
        <div className='h-[300px] overflow-auto'>{
          envioCliente.map((envio, index) => {
          const documents = getDocuments(envio);
          const hasDocuments = documents.length > 0;

          return (
            <React.Fragment key={envio.id_asunto || index} >
              <div className="flex justify-between text-[#2B2829] text-xs md:text-base font-normal bg-[#E9E7E7] p-[6px] rounded-md items-center mt-2">
                <div className="flex-1 lg:w-[300px] flex">{envio.asunto}</div>
                <div className='hidden md:flex w-[100px] text-white bg-[#353563] rounded px-3 justify-center'>{envio.estado}</div>
                <div className="flex-1 md:w-[150px] flex justify-center">{formatDate(envio.fecha)}</div>
                <div className="flex-1 md:w-[250px] flex justify-start overflow-hidden text-ellipsis whitespace-nowrap max-w-[15ch]">
                  {hasDocuments ? documents[0].name : 'No hay archivos'}
                </div>

                <div className="w-[65px] flex justify-center">
                  {hasDocuments && (
                    <button onClick={() => toggleOpen(index)} className="transition-transform duration-300">
                      <img
                        src={arrowIcon}
                        alt="toggle"
                        className={`transform transition-transform duration-300 ${openItems[index] ? 'rotate-180' : 'rotate-0'}`}
                      />
                    </button>
                  )}
                </div>
              </div>

              {openItems[index] && hasDocuments && (
                <div className="bg-white shadow-md  rounded-md  px-[6px] my-2">
                  <div className="flex justify-between items-center  border-b last:border-b-0">
                    <div className="w-[300px] flex">{envio.asunto}</div>
                    <div className="hidden md:flex w-[100px] justify-center">{envio.estado}</div>
                    <div className="w-[150px] flex justify-center">{formatDate(envio.fecha)}</div>
                    <div className="w-[265px] flex flex-col gap-1 justify-center  font-semibold text-[#495D72]">
                      {documents.map((doc, docIndex) => (
                        <div
                          key={docIndex}
                          className=" flex justify-between items-center py-[6px] border-b last:border-b-0"
                        >

                          <div className=" w-[150px] flex justify-start overflow-hidden text-ellipsis whitespace-nowrap max-w-[15ch]">
                            {cortarTexto(doc.name)}
                          </div>
                          <div className="w-[65px] flex justify-center">
                            <button
                              onClick={() => handleDownload(doc.pathFile, doc.name)}
                              className="transition-transform duration-300 hover:scale-110"
                            >
                              <img src={descargar} alt="Descargar" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </React.Fragment>
          );
        })}
        </div>
        
      ) : (
        // Mostrar cuando no hay datos
        <div className="flex justify-center ">
          <div className="flex flex-col border rounded-[12px] text-[12px] justify-center items-center w-[280px] sm:w-[370px] mn:w-[335px] lg:w-full   h-[120px] sm:h-[190px]  gap-5 text-[#82777A] shadow-[0px_4px_4px_4px_rgba(0,0,0,0.25)] " >
            <img src={documentosVacios} alt="" />
            No hay envíos realizados
          </div>
        </div>
      )}
    </div>
  );
}

export default EnviosCliente;