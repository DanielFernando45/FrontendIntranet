import React, { useState } from "react";
import flechaabajo from "../../../assets/icons/Flecha.svg";
import flechaarriba from "../../../assets/icons/arrow-up.svg";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { asesoriasService } from "../../../services/asesoriasService";
import { getUsuarioDesdeToken } from "../../../utils/validateToken";

const Asignados = () => {
  const [eliminando, setEliminando] = useState(false);
  const [expandedIds, setExpandedIds] = useState([]);
  const Navigate = useNavigate();
  const usuario = getUsuarioDesdeToken();
  const idSupervisor = usuario?.id_supervisor;

  // Dejo tu query EXACTA como pediste
  const {
    data: asesorias = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["asesoria"],
    queryFn: async () => {
      const res = await asesoriasService.asesoramientoSupervisor(idSupervisor);
      return res;
    },
    refetchOnWindowFocus: false,
    initialData: [],
  });

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const displayStudents = (estudiantes = []) => {
    if (!estudiantes.length) return "----------";
    if (estudiantes.length === 1) return estudiantes[0].estudiante;
    const restantes = estudiantes.length - 1;
    return `${estudiantes[0].estudiante} (+${restantes} más)`;
  };

  if (isLoading) return <div>Cargando asesorías…</div>;
  if (isError) return <div>Error al cargar asesorías.</div>;

  return (
    <div>
      <h1 className="text-[20px] font-medium">Clientes Asignados</h1>

      <div className="overflow-x-auto ">
        <div className="flex flex-col gap-2 min-w-[805px]">
          <div className="flex justify-between px-1 text-[#495D72] font-medium">
            <div className="w-[100px]">IdAsesoria</div>
            <div className="w-[220px] text-center">Delegado</div>
            <div className="w-[160px] text-center">Área</div>
            <div className="w-[260px] text-center">Alumnos</div>
            <div className="w-[220px] text-center">Asesor</div>
            <div className="w-[220px] text-center">Acciones</div>
          </div>

          <div className="flex flex-col gap-1 px-1">
            {asesorias.map((asesoria, index) => (
              <React.Fragment key={asesoria.id_asesoramiento}>
                <div
                  className={`flex justify-between items-center px-1 rounded-md ${index % 2 === 0 ? "bg-[#E9E7E7]" : ""
                    } py-2`}
                >
                  <div className="w-[100px]">
                    {String(asesoria.id_asesoramiento ?? "").padStart(4, "0")}
                  </div>

                  <div className="w-[220px] truncate" title={asesoria.delegado}>
                    {asesoria.delegado || "—"}
                  </div>

                  <div className="w-[160px] text-center">
                    {asesoria.area || "—"}
                  </div>

                  <div
                    className="w-[260px] truncate"
                    title={displayStudents(asesoria.clientes)}
                  >
                    {displayStudents(asesoria.clientes)}
                  </div>

                  <div className="w-[220px] text-center">
                    {asesoria.asesor || "—"}
                  </div>

                  <div className="flex w-[220px] justify-around px-3">
                    <button
                      className="bg-[#1C1C34] text-white font-medium px-6 py-1 rounded-md"
                      onClick={() =>
                        Navigate(
                          `/supervisor/edit-asig/${asesoria.id_asesoramiento}`
                        )
                      }
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => toggleExpand(asesoria.id_asesoramiento)}
                      aria-label={
                        expandedIds.includes(asesoria.id_asesoramiento)
                          ? "Cerrar detalle"
                          : "Ver detalle"
                      }
                      title={
                        expandedIds.includes(asesoria.id_asesoramiento)
                          ? "Cerrar detalle"
                          : "Ver detalle"
                      }
                    >
                      <img
                        src={
                          expandedIds.includes(asesoria.id_asesoramiento)
                            ? flechaarriba
                            : flechaabajo
                        }
                        alt={
                          expandedIds.includes(asesoria.id_asesoramiento)
                            ? "Cerrar"
                            : "Expandir"
                        }
                      />
                    </button>
                  </div>
                </div>

                {expandedIds.includes(asesoria.id_asesoramiento) && (
                  <div
                    className={`px-4 py-2 rounded-b-md ${index % 2 === 0 ? "bg-[#E9E7E7]" : "bg-white"
                      }`}
                  >
                    <div className="font-medium mb-2">Estudiantes:</div>

                    {Array.isArray(asesoria.clientes) &&
                      asesoria.clientes.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {asesoria.clientes.map(
                          (
                            c // ✅ usar clientes (plural)
                          ) => (
                            <li key={c.id_estudiante}>{c.estudiante}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      <div className="text-gray-500">
                        Sin estudiantes asignados.
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}

            {!asesorias.length && (
              <div className="text-gray-500 py-4 text-center">
                No hay asesorías asignadas.
              </div>
            )}
          </div>
        </div>
      </div>


      <div className="flex justify-env mt-4">
        <button
          className="rounded-lg w-[180px] text-white bg-black py-1"
          onClick={() => Navigate("/supervisor/nueva-asesoria")}
        >
          Agregar Asesoría
        </button>
      </div>

      {eliminando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              ¿Estás seguro de eliminar esta asesoría?
            </h2>
            <p className="mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEliminando(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // TODO: Lógica para eliminar la asesoría
                  setEliminando(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Asignados;
