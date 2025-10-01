import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import AgregarHerramientas from "./BotonesConfig/AgregarHerramientas";
import EditarHerramientas from "./BotonesConfig/EditarHerramientas";
import toast from "react-hot-toast";
import { Pencil, Trash2, Loader2, Import } from "lucide-react";

const Herramientas = () => {
  const queryClient = useQueryClient();
  const [showAgregarHerramientas, setShowAgregarHerramientas] = useState(false);
  const [editHerramientas, setEditHerramientas] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔹 Extraer nombre de archivo de una URL
  const extraerNombreArchivo = (url) => {
    if (!url) return "";
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      return pathParts[pathParts.length - 1];
    } catch {
      const parts = url.split("/");
      return parts[parts.length - 1];
    }
  };

  // 🔹 Query para obtener herramientas
  const {
    data: herramientas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["herramientas"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_PORT_ENV}/recursos/herramientas/all`
      );
      return res.data.map((herramienta) => ({
        ...herramienta,
        nombre_imagen: extraerNombreArchivo(herramienta.url_imagen),
      }));
    },
  });

  // 🔹 Mutación para eliminar
  const eliminarMutation = useMutation({
    mutationFn: async (id) =>
      axios.delete(
        `${
          import.meta.env.VITE_API_PORT_ENV
        }/recursos/herramientas/delete/${id}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["herramientas"]);
      toast.success("Herramienta eliminada correctamente");
    },
    onError: () => {
      toast.error("Error al eliminar herramienta");
    },
  });

  const handleEditar = (id) => {
    setEditHerramientas(true);
    setEditId(id);
  };

  const handleEliminar = (id) => {
    eliminarMutation.mutate(id);
  };

  if (isLoading) return <p>Cargando herramientas...</p>;
  if (isError) return <p>Error al cargar herramientas.</p>;

  return (
    <>
      <h1 className="ml-5 text-[20px] font-medium">Agregar Herramientas</h1>
      <div className="flex flex-col w-full">
        {/* Cabecera */}
        <div className="grid grid-cols-6 bg-[#F5F5F5] text-[#495D72] font-semibold px-4 py-3 rounded-t-md text-sm">
          <div className="text-center">ID</div>
          <div className="text-center">Nombre</div>
          <div className="text-center">Descripción</div>
          <div className="text-center">Imagen</div>
          <div className="text-center">Enlace</div>
          <div className="text-center">Acciones</div>
        </div>

        {/* Lista de herramientas */}
        {herramientas.map((herramienta, index) => (
          <div
            key={herramienta.id}
            className={`grid grid-cols-6 items-center px-4 py-3 text-sm ${
              index % 2 === 0 ? "bg-[#F9F9F9]" : "bg-white"
            } hover:bg-gray-100 transition`}
          >
            {/* ID */}
            <div className="text-center font-medium">{herramienta.id}</div>

            {/* Nombre */}
            <div className="truncate px-2">{herramienta.nombre}</div>

            {/* Descripción */}
            <div className="truncate  text-center px-2 text-gray-700 line-clamp-1">
              {herramienta.descripcion}
            </div>

            {/* Imagen */}
            <div
              className="truncate  text-center text-xs text-gray-600"
              title={herramienta.url_imagen}
            >
              {herramienta.nombre_imagen || "—"}
            </div>

            {/* Enlace */}
            <div className="truncate text-center text-xs text-gray-600">
              <a
                href={herramienta.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
                title={herramienta.enlace}
              >
                Visitar sitio
              </a>
            </div>

            {/* Acciones */}
            <div className="flex justify-center gap-2">
              {/* Editar */}
              <button
                onClick={() => handleEditar(herramienta.id)}
                className="w-9 h-9 rounded-md bg-[#1C1C34] flex justify-center items-center text-white hover:bg-[#2a2a4a] transition"
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </button>

              {/* Eliminar */}
              <button
                onClick={() => handleEliminar(herramienta.id)}
                className="w-9 h-9 rounded-md bg-[#8F1313] flex justify-center items-center text-white hover:bg-[#a31d1d] transition"
                title="Eliminar"
              >
                {eliminarMutation.isLoading && editId === herramienta.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowAgregarHerramientas(true)}
        className="mt-5 px-5 h-10 border rounded-xl text-[#5e98d3] border-[#5e98d3]"
      >
        Herramienta Nueva
      </button>

      {showAgregarHerramientas && (
        <AgregarHerramientas
          close={() => {
            setShowAgregarHerramientas(false);
            queryClient.invalidateQueries(["herramientas"]);
          }}
        />
      )}

      {editHerramientas && (
        <EditarHerramientas
          close={() => {
            setEditHerramientas(false);
            queryClient.invalidateQueries(["herramientas"]);
          }}
          herramientaId={editId}
        />
      )}
    </>
  );
};

export default Herramientas;
