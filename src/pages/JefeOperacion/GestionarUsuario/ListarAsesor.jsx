import React, { useEffect, useState } from "react";
import Buscar from "../../../Components/Administrador/GestionarUsuario/Buscar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ListarAsesor = () => {
  const navigate = useNavigate();
  const [asesores, setAsesores] = useState([]);
  const [todosLosAsesores, setTodosLosAsesores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Establecer la cantidad de items por página

  useEffect(() => {
    const fetchAsesores = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_PORT_ENV}/asesor`
        );
        setAsesores(response.data);
        setTodosLosAsesores(response.data);
      } catch (error) {
        console.error("Error al obtener los asesores:", error);
        toast.error("Error al cargar los asesores");
      }
    };
    fetchAsesores();
  }, []);

  const handleBuscar = (query) => {
    const q = query.toLowerCase();
    const resultados = todosLosAsesores.filter(
      (asesor) =>
        asesor.id?.toString().includes(q) ||
        asesor.dni?.toLowerCase().includes(q) ||
        `${asesor.nombre} ${asesor.apellido}`.toLowerCase().includes(q)
    );
    setAsesores(resultados);
  };

  const handleReset = () => {
    setAsesores(todosLosAsesores);
  };

  const handlerAgregarAsesor = () => {
    navigate("/jefe-operaciones/gestionar-usuarios/agregar-asesor");
  };

  const handleEditarAsesor = (id) => {
    navigate(`/jefe-operaciones/gestionar-usuarios/editar-asesor/${id}`);
  };

  const handleEliminarAsesor = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este asesor?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_PORT_ENV}/asesor/delete/${id}`
      );
      const nuevosAsesores = asesores.filter((asesor) => asesor.id !== id);
      setAsesores(nuevosAsesores);
      setTodosLosAsesores(nuevosAsesores);
      toast.success("Asesor eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el asesor:", error);
      toast.error("Ocurrió un error al eliminar el asesor");
    }
  };

  // Función para cambiar de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Calcular los asesores que se deben mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAsesores = asesores.slice(indexOfFirstItem, indexOfLastItem);

  // Calcular el total de páginas
  const totalPages = Math.ceil(asesores.length / itemsPerPage);

  return (
    <>
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">Gestionar Asesores</h2>
        <Buscar onBuscar={handleBuscar} onReset={handleReset} />
      </div>

      <div className="overflow-x-auto mt-4">
        <div className="min-w-[700px] md:min-w-full">
          <div className="grid grid-cols-7 text-[#495D72] font-medium p-2 rounded-md bg-gray-100 text-sm">
            <div className="text-center">ID</div>
            <div className="text-center">Asesor</div>
            <div className="text-center">Área</div>
            <div className="text-center">Especialidad</div>
            <div className="text-center">Universidad</div>
            <div className="text-center">Editar</div>
            <div className="text-center">Eliminar</div>
          </div>

          {currentAsesores.length > 0 ? (
            currentAsesores.map((asesor, index) => (
              <div
                key={asesor.id}
                className={`grid grid-cols-7 items-center text-[#2B2829] text-sm md:text-base p-2 rounded-md ${
                  index % 2 === 0 ? "bg-white" : "bg-[#F3F4F6]"
                }`}
              >
                <div className="text-center">{asesor?.id}</div>
                <div className="truncate">
                  {asesor?.nombre} {asesor?.apellido}
                </div>
                <div className="text-center">{asesor?.area?.nombre}</div>
                <div className="truncate">{asesor?.especialidad}</div>
                <div className="truncate">{asesor?.universidad}</div>
                <div className="flex justify-center">
                  <button
                    onClick={() => handleEditarAsesor(asesor?.id)}
                    className="w-[110px] rounded-md px-3 py-1 bg-[#1C1C34] flex justify-center text-white"
                  >
                    Editar
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => handleEliminarAsesor(asesor.id)}
                    className="rounded-md px-3 py-1 bg-[#8F1313] text-white text-sm hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No se encontraron asesores.
            </div>
          )}
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row justify-between mt-5 gap-4 items-center">
          {/* Filtro de filas por página */}
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

          {/* Indicador de página */}
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>

          {/* Botones de navegación */}
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

      <div className="flex justify-center mt-5">
        <button
          onClick={handlerAgregarAsesor}
          className="flex justify-between text-white w-[210px] h-8 rounded font-semibold bg-[#1B435D] px-6 py-1 mt-5"
        >
          Agregar Asesor
        </button>
      </div>
    </>
  );
};

export default ListarAsesor;
