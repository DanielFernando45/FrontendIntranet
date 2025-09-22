import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import AgregarTutoriales from "./BotonesConfig/AgregarTutoriales";
import EditarTutoriales from "./BotonesConfig/EditarTutoriales";

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

  // 🔹 Mutación para eliminar tutorial
  const eliminarMutation = useMutation({
    mutationFn: async (id) =>
      axios.delete(
        `${import.meta.env.VITE_API_PORT_ENV}/recursos/tutoriales/delete/${id}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["tutoriales"]); // refresca lista
      alert("Tutorial eliminado correctamente");
    },
    onError: () => {
      alert("Error al eliminar tutorial");
    },
  });

  const handleEditar = (id) => {
    setEditTutoriales(true);
    setEditId(id);
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este tutorial?")) {
      eliminarMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Cargando tutoriales...</p>;
  if (isError) return <p>Error al cargar los tutoriales.</p>;

  return (
    <>
      <h1 className="ml-5 text-[20px] font-medium">Agregar Tutoriales</h1>

      {/* Encabezado */}
      <div className="flex flex-col">
        <div className="flex justify-between text-[#495D72] font-normal p-[6px] rounded-md">
          <div className="w-[50px] flex justify-center">ID</div>
          <div className="w-[400px] flex justify-center">Título</div>
          <div className="w-[550px] flex justify-center">Enlace</div>
          <div className="w-[110px] flex justify-center">Editar</div>
          <div className="w-[110px] flex justify-center">Eliminar</div>
        </div>
      </div>

      {/* Lista de tutoriales */}
      {tutoriales.map((tutorial, index) => (
        <div className="flex flex-col" key={tutorial.id}>
          <div
            className={`flex justify-between text-[#2B2829] font-normal ${
              index % 2 === 0 ? "bg-[#E9E7E7]" : ""
            } p-[6px] rounded-md`}
          >
            <div className="w-[50px] flex justify-center">{tutorial.id}</div>
            <div className="w-[400px] flex justify-start">
              {tutorial.titulo}
            </div>
            <div className="w-[550px] flex justify-start truncate">
              {tutorial.enlace}
            </div>

            <button
              onClick={() => handleEditar(tutorial.id)}
              className="w-[110px] rounded-md px-3 py-1 bg-[#1C1C34] flex justify-center items-center text-white"
            >
              Editar
            </button>

            <button
              onClick={() => handleEliminar(tutorial.id)}
              className="w-[110px] rounded-md px-3 py-1 bg-[#8F1313] flex justify-center items-center text-white"
            >
              {eliminarMutation.isLoading && editId === tutorial.id
                ? "Eliminando..."
                : "Eliminar"}
            </button>
          </div>
        </div>
      ))}

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
