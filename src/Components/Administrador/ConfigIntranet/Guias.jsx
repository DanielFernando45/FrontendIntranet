import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import AgregarGuias from "./BotonesConfig/AgregarGuias";
import EditarGuias from "./BotonesConfig/EditarGuias";

const Guias = () => {
  const queryClient = useQueryClient();
  const [showAgregarGuias, setShowAgregarGuias] = useState(false);
  const [editGuias, setEditGuias] = useState(false);
  const [editId, setEditId] = useState(null);

  // Función para extraer el nombre del archivo de una URL
  const extraerNombreArchivo = (url) => {
    if (!url) return "";
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      return pathParts[pathParts.length - 1];
    } catch (e) {
      const parts = url.split("/");
      return parts[parts.length - 1];
    }
  };

  // 🔹 Query para cargar guías
  const {
    data: guias = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["guias"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_PORT_ENV}/recursos/guias/all`
      );
      return res.data.map((guia) => ({
        ...guia,
        nombre_imagen: extraerNombreArchivo(guia.url_imagen),
        nombre_documento: extraerNombreArchivo(guia.doc_url),
      }));
    },
  });

  // 🔹 Mutación para eliminar guía
  const eliminarMutation = useMutation({
    mutationFn: async (id) =>
      axios.delete(
        `${import.meta.env.VITE_API_PORT_ENV}/recursos/guias/delete/${id}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["guias"]); // refresca automáticamente
      alert("Guía eliminada correctamente");
    },
    onError: () => {
      alert("Error al eliminar guía");
    },
  });

  const handleEditar = (id) => {
    setEditGuias(true);
    setEditId(id);
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta guía?")) {
      eliminarMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Cargando guías...</p>;
  if (isError) return <p>Error al cargar las guías.</p>;

  return (
    <>
      <h1 className="ml-5 text-[20px] font-medium">Agregar Guías</h1>
      <div className="flex flex-col">
        <div className="flex justify-between text-[#495D72] font-normal p-[6px] rounded-md">
          <div className="w-[50px] flex justify-center">ID</div>
          <div className="w-[250px] flex justify-center">Título</div>
          <div className="w-[400px] flex justify-center">Descripción</div>
          <div className="w-[200px] flex justify-center">Imagen</div>
          <div className="w-[200px] flex justify-center">Documento</div>
          <div className="w-[110px] flex justify-center">Editar</div>
          <div className="w-[110px] flex justify-center">Eliminar</div>
        </div>
      </div>

      {/* Lista de guías */}
      {guias.map((guia, index) => (
        <div className="flex flex-col" key={guia.id}>
          <div
            className={`flex justify-between text-[#2B2829] font-normal ${
              index % 2 === 0 ? "bg-[#E9E7E7]" : ""
            } p-[6px] rounded-md`}
          >
            <div className="w-[50px] flex justify-center">{guia.id}</div>
            <div className="w-[250px] flex justify-start">{guia.titulo}</div>
            <div className="w-[400px] flex justify-start">
              {guia.descripcion}
            </div>
            <div
              className="w-[200px] flex justify-start text-[11px]"
              title={guia.url_imagen}
            >
              {guia.nombre_imagen}
            </div>
            <div className="w-[200px] flex justify-start text-[11px]">
              <a
                href={guia.doc_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
                title={guia.doc_url}
              >
                {guia.nombre_documento || "Ver documento"}
              </a>
            </div>
            <button
              onClick={() => handleEditar(guia.id)}
              className="w-[110px] rounded-md px-3 py-1 bg-[#1C1C34] flex justify-center items-center text-white"
            >
              Editar
            </button>
            <button
              onClick={() => handleEliminar(guia.id)}
              className="w-[110px] rounded-md px-3 py-1 bg-[#8F1313] flex justify-center items-center text-white"
            >
              {eliminarMutation.isLoading && editId === guia.id
                ? "Eliminando..."
                : "Eliminar"}
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={() => setShowAgregarGuias(true)}
        className="mt-5 w-40 h-10 border rounded-xl text-[#5e98d3] border-[#5e98d3]"
      >
        Guía Nueva
      </button>

      {showAgregarGuias && (
        <AgregarGuias
          close={() => {
            setShowAgregarGuias(false);
            queryClient.invalidateQueries(["guias"]);
          }}
        />
      )}

      {editGuias && (
        <EditarGuias
          close={() => {
            setEditGuias(false);
            queryClient.invalidateQueries(["guias"]);
          }}
          guiaId={editId}
        />
      )}
    </>
  );
};

export default Guias;
