import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import AgregarGuias from "./BotonesConfig/AgregarGuias";
import EditarGuias from "./BotonesConfig/EditarGuias";
import toast from "react-hot-toast";
import { Pencil, Trash2, Loader2 } from "lucide-react";

const Guias = () => {
  const queryClient = useQueryClient();
  const [showAgregarGuias, setShowAgregarGuias] = useState(false);
  const [editGuias, setEditGuias] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Establecer la cantidad de items por página

  // Función para extraer el nombre del archivo de una URL
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

  const eliminarMutation = useMutation({
    mutationFn: async (id) =>
      axios.delete(
        `${import.meta.env.VITE_API_PORT_ENV}/recursos/guias/delete/${id}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["guias"]); // refresca automáticamente
      toast.success("Guía eliminada correctamente");
    },
    onError: () => {
      toast.error("Error al eliminar la guía");
    },
  });

  const handleEditar = (id) => {
    setEditGuias(true);
    setEditId(id);
  };

  const handleEliminar = (id) => {
    eliminarMutation.mutate(id);
  };

  // Calcular los guías que se deben mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGuias = guias.slice(indexOfFirstItem, indexOfLastItem);

  // Calcular el total de páginas
  const totalPages = Math.ceil(guias.length / itemsPerPage);

  // Función para cambiar de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) return <p>Cargando guías...</p>;
  if (isError) return <p>Error al cargar las guías.</p>;

  return (
    <>
      <h1 className="ml-5 text-[20px] font-medium">Agregar Guías</h1>

      <div className="flex flex-col w-full">
        {/* Cabecera */}
        <div className="grid grid-cols-6 bg-[#F5F5F5] text-[#495D72] font-semibold px-4 py-3 rounded-t-md text-sm">
          <div className="text-center">ID</div>
          <div className="text-center">Título</div>
          <div className="text-center">Descripción</div>
          <div className="text-center">Imagen</div>
          <div className="text-center">Documento</div>
          <div className="text-center">Acciones</div>
        </div>

        {/* Lista de guías */}
        {currentGuias.map((guia, index) => (
          <div
            key={guia.id}
            className={`grid grid-cols-6 items-center px-4 py-3 text-sm ${
              index % 2 === 0 ? "bg-[#F9F9F9]" : "bg-white"
            } hover:bg-gray-100 transition`}
          >
            {/* ID */}
            <div className="text-center font-medium">{guia.id}</div>

            {/* Título */}
            <div className="truncate px-2">{guia.titulo}</div>

            {/* Descripción */}
            <div className="truncate px-2 text-gray-700 line-clamp-1">
              {guia.descripcion}
            </div>

            {/* Imagen */}
            <div
              className="truncate text-xs text-gray-600"
              title={guia.url_imagen}
            >
              {guia.nombre_imagen || "—"}
            </div>

            {/* Documento */}
            <div className="truncate text-xs text-gray-600">
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

            {/* Acciones */}
            <div className="flex justify-center gap-2">
              {/* Editar */}
              <button
                onClick={() => handleEditar(guia.id)}
                className="w-9 h-9 rounded-md bg-[#1C1C34] flex justify-center items-center text-white hover:bg-[#2a2a4a] transition"
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </button>

              {/* Eliminar */}
              <button
                onClick={() => handleEliminar(guia.id)}
                className="w-9 h-9 rounded-md bg-[#8F1313] flex justify-center items-center text-white hover:bg-[#a31d1d] transition"
                title="Eliminar"
              >
                {eliminarMutation.isLoading && editId === guia.id ? (
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
        onClick={() => setShowAgregarGuias(true)}
        className="mt-5 w-40 h-10 border rounded-xl text-[#5e98d3] border-[#5e98d3]"
      >
        Guía Nueva
      </button>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between mt-5 gap-4 items-center">
          <div className="flex items-center">
            <span className="mr-2 text-sm">Rows per page</span>
            <select
              className="px-3 py-1 border rounded-md text-sm"
              value={itemsPerPage}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>

          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePageChange(1)}
              className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors"
              disabled={currentPage === 1}
            >
              {"<<"}
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors"
              disabled={currentPage === 1}
            >
              {"<"}
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors"
              disabled={currentPage === totalPages}
            >
              {">"}
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors"
              disabled={currentPage === totalPages}
            >
              {">>"}
            </button>
          </div>
        </div>
      )}

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
