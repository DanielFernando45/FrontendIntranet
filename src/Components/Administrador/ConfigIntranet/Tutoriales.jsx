import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import AgregarTutoriales from "./BotonesConfig/AgregarTutoriales";
import EditarTutoriales from "./BotonesConfig/EditarTutoriales";
import toast from "react-hot-toast";
import { Pencil, Trash2, Loader2 } from "lucide-react";

const Tutoriales = () => {
  const queryClient = useQueryClient();
  const [showAgregarTutoriales, setShowAgregarTutoriales] = useState(false);
  const [editTutoriales, setEditTutoriales] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔹 Query para obtener tutoriales
  const {
    data: tutoriales = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tutoriales"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_PORT_ENV}/recursos/tutoriales/all`
      );
      return res.data;
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: async (id) =>
      axios.delete(
        `${import.meta.env.VITE_API_PORT_ENV}/recursos/tutoriales/delete/${id}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["tutoriales"]); // refresca lista
      toast.success("Tutorial eliminado correctamente");
    },
    onError: () => {
      toast.error("❌ Error al eliminar el tutorial");
    },
  });

  const handleEditar = (id) => {
    setEditTutoriales(true);
    setEditId(id);
  };

  const handleEliminar = (id) => {
    eliminarMutation.mutate(id);
  };

  if (isLoading) return <p>Cargando tutoriales...</p>;
  if (isError) return <p>Error al cargar los tutoriales.</p>;

  return (
    <>
      <h1 className="ml-5 text-[20px] font-medium">Agregar Tutoriales</h1>

      {/* Encabezado */}
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-4 bg-[#F5F5F5] text-[#495D72] font-semibold px-4 py-3 rounded-t-md text-sm">
          <div className="text-center">ID</div>
          <div className="text-center">Título</div>
          <div className="text-center">Enlace</div>
          <div className="text-center">Acciones</div>
        </div>

        {/* Lista */}
        {tutoriales.map((tutorial, index) => (
          <div
            key={tutorial.id}
            className={`grid grid-cols-4 items-center px-4 py-3 text-sm ${
              index % 2 === 0 ? "bg-[#F9F9F9]" : "bg-white"
            } hover:bg-gray-100 transition`}
          >
            {/* ID */}
            <div className="text-center font-medium">{tutorial.id}</div>

            {/* Título */}
            <div className="truncate px-2">{tutorial.titulo}</div>

            {/* Enlace */}
            <div
              className="truncate text-blue-600 hover:underline cursor-pointer px-2"
              title={tutorial.enlace}
            >
              <a
                href={tutorial.enlace}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tutorial.enlace}
              </a>
            </div>

            {/* Acciones */}
            <div className="flex justify-center gap-2">
              {/* Editar */}
              <button
                onClick={() => handleEditar(tutorial.id)}
                className="w-9 h-9 rounded-md bg-[#1C1C34] flex justify-center items-center text-white hover:bg-[#2a2a4a] transition"
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </button>

              {/* Eliminar */}
              <button
                onClick={() => handleEliminar(tutorial.id)}
                className="w-9 h-9 rounded-md bg-[#8F1313] flex justify-center items-center text-white hover:bg-[#a31d1d] transition"
                title="Eliminar"
              >
                {eliminarMutation.isLoading && editId === tutorial.id ? (
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
        onClick={() => setShowAgregarTutoriales(true)}
        className="mt-5 w-40 h-10 border rounded-xl text-[#5e98d3] border-[#5e98d3]"
      >
        Tutorial Nuevo
      </button>

      {/* Modal para agregar */}
      {showAgregarTutoriales && (
        <AgregarTutoriales
          close={() => {
            setShowAgregarTutoriales(false);
            queryClient.invalidateQueries(["tutoriales"]); // refresca lista
          }}
        />
      )}

      {/* Modal para editar */}
      {editTutoriales && (
        <EditarTutoriales
          close={() => {
            setEditTutoriales(false);
            queryClient.invalidateQueries(["tutoriales"]); // refresca lista
          }}
          tutorialId={editId}
        />
      )}
    </>
  );
};

export default Tutoriales;
