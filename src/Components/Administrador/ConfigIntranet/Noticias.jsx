import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import AgregarNoticias from "./BotonesConfig/AgregarNoticias";
import EditarNoticias from "./BotonesConfig/EditarNoticias";
import toast from "react-hot-toast";
import { Pencil, Trash2, Loader2 } from "lucide-react";

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
      toast.success("Noticia eliminada correctamente");
    },
    onError: () => {
      toast.error("Error al eliminar la noticia");
    },
  });

  const handleEditar = (id) => {
    setEditNoticias(true);
    setEditId(id);
  };

  const handleEliminar = (id) => {
    eliminarMutation.mutate(id);
  };

  if (isLoading) return <p>Cargando noticias...</p>;
  if (isError) return <p>Error al cargar las noticias.</p>;

  return (
    <>
      <h1 className="ml-5 text-[20px] font-medium">Agregar Noticias</h1>
      {/* Encabezado */}
      <div className="flex flex-col w-full">
        {/* Cabecera */}
        <div className="grid grid-cols-7 bg-[#F5F5F5] text-[#495D72] font-semibold px-4 py-3 rounded-t-md text-sm">
          <div className="text-center">ID</div>
          <div className="col-span-2 text-center">Título</div>
          <div className="col-span-2 text-center">Descripción</div>
          <div className="text-center">Archivo</div>
          <div className="text-center">Acciones</div>
        </div>

        {/* Lista */}
        {noticias.map((noticia, index) => (
          <div
            key={noticia.id}
            className={`grid grid-cols-7 items-center px-4 py-3 text-sm ${
              index % 2 === 0 ? "bg-[#F9F9F9]" : "bg-white"
            } hover:bg-gray-100 transition`}
          >
            {/* ID */}
            <div className="text-center font-medium">{noticia.id}</div>

            {/* Titulo */}
            <div className="col-span-2 truncate">{noticia.titulo}</div>

            {/* Descripción */}
            <div className="col-span-2 px-2 text-sm text-gray-700 line-clamp-1">
              {noticia.descripcion}
            </div>

            {/* Archivo */}
            <div
              className="truncate text-xs text-gray-600"
              title={noticia.url_imagen}
            >
              {noticia.nombre_archivo || "—"}
            </div>

            {/* Acciones */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleEditar(noticia.id)}
                className="w-9 h-9 rounded-md bg-[#1C1C34] flex justify-center items-center text-white hover:bg-[#2a2a4a] transition"
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleEliminar(noticia.id)}
                className="w-9 h-9 rounded-md bg-[#8F1313] flex justify-center items-center text-white hover:bg-[#a31d1d] transition"
                title="Eliminar"
              >
                {eliminarMutation.isLoading && editId === noticia.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

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
