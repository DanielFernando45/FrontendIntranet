import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import AgregarNoticias from "./BotonesConfig/AgregarNoticias";
import EditarNoticias from "./BotonesConfig/EditarNoticias";

const Noticias = () => {
  const queryClient = useQueryClient();
  const [showAgregarNoticias, setShowAgregarNoticias] = useState(false);
  const [editNoticias, setEditNoticias] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔹 Función para extraer nombre del archivo
  const extraerNombreArchivo = (url) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      return pathParts[pathParts.length - 1];
    } catch {
      const parts = url.split("/");
      return parts[parts.length - 1];
    }
  };

  // 🔹 Query para obtener noticias
  const {
    data: noticias = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["noticias"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_PORT_ENV}/recursos/noticias/all`
      );
      return res.data.map((noticia) => ({
        ...noticia,
        nombre_archivo: extraerNombreArchivo(noticia.url_imagen),
      }));
    },
  });

  // 🔹 Mutación para eliminar noticia
  const eliminarMutation = useMutation({
    mutationFn: async (id) =>
      axios.delete(
        `${import.meta.env.VITE_API_PORT_ENV}/recursos/noticias/delete/${id}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["noticias"]); // refresca lista
      alert("Noticia eliminada correctamente");
    },
    onError: () => {
      alert("Error al eliminar noticia");
    },
  });

  const handleEditar = (id) => {
    setEditNoticias(true);
    setEditId(id);
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta noticia?")) {
      eliminarMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Cargando noticias...</p>;
  if (isError) return <p>Error al cargar las noticias.</p>;

  return (
    <>
      <h1 className="ml-5 text-[20px] font-medium">Agregar Noticias</h1>

      {/* Encabezado */}
      <div className="flex flex-col">
        <div className="flex justify-between text-[#495D72] font-normal p-[6px] rounded-md">
          <div className="w-[50px] flex justify-center">ID</div>
          <div className="w-[400px] flex justify-center">Titulo</div>
          <div className="w-[550px] flex justify-center">Descripcion</div>
          <div className="w-[200px] flex justify-center">Archivo</div>
          <div className="w-[110px] flex justify-center">Editar</div>
          <div className="w-[110px] flex justify-center">Eliminar</div>
        </div>
      </div>

      {/* Lista de noticias */}
      {noticias.map((noticia, index) => (
        <div className="flex flex-col" key={noticia.id}>
          <div
            className={`flex justify-between text-[#2B2829] font-normal ${
              index % 2 === 0 ? "bg-[#E9E7E7]" : ""
            } p-[6px] rounded-md`}
          >
            <div className="w-[50px] flex justify-center">{noticia.id}</div>
            <div className="w-[400px] flex justify-start">{noticia.titulo}</div>
            <div className="w-[550px] flex justify-start">
              {noticia.descripcion}
            </div>
            <div
              className="w-[200px] flex justify-start text-[11px]"
              title={noticia.url_imagen}
            >
              {noticia.nombre_archivo}
            </div>

            <button
              onClick={() => handleEditar(noticia.id)}
              className="w-[110px] rounded-md px-3 py-1 bg-[#1C1C34] flex justify-center items-center text-white"
            >
              Editar
            </button>

            <button
              onClick={() => handleEliminar(noticia.id)}
              className="w-[110px] rounded-md px-3 py-1 bg-[#8F1313] flex justify-center items-center text-white"
            >
              {eliminarMutation.isLoading && editId === noticia.id
                ? "Eliminando..."
                : "Eliminar"}
            </button>
          </div>
        </div>
      ))}

      {/* Botón para agregar */}
      <button
        onClick={() => setShowAgregarNoticias(true)}
        className="mt-5 w-40 h-10 border rounded-xl text-[#5e98d3] border-[#5e98d3]"
      >
        Noticia Nueva
      </button>

      {/* Modal para agregar */}
      {showAgregarNoticias && (
        <AgregarNoticias
          close={() => {
            setShowAgregarNoticias(false);
            queryClient.invalidateQueries(["noticias"]); // refresca lista
          }}
        />
      )}

      {/* Modal para editar */}
      {editNoticias && (
        <EditarNoticias
          close={() => {
            setEditNoticias(false);
            queryClient.invalidateQueries(["noticias"]); // refresca lista
          }}
          noticiaId={editId}
        />
      )}
    </>
  );
};

export default Noticias;
