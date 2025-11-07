import React, { useEffect, useState } from "react";
import Buscar from "../../../Components/Administrador/GestionarUsuario/Buscar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ListarEstudiante = () => {
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesBase, setEstudiantesBase] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Establecer la cantidad de items por página
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.error("No hay token en localStorage");
  }

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_PORT_ENV}/cliente`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setEstudiantes(res.data);
        setEstudiantesBase(res.data);
      })
      .catch((err) => console.error("Error al obtener estudiantes:", err));
  }, []);

  const handlerAgregarEstudiante = () => {
    navigate("/jefe-operaciones/gestionar-usuarios/agregar-estudiante");
  };

  const handlerEditarEstudiante = (id) => {
    navigate(`/jefe-operaciones/gestionar-usuarios/editar-estudiante/${id}`);
  };

  const formatearFecha = (fecha) => {
    if (!fecha || fecha === "Por asignar") return "Por Asignar";

    const date = new Date(fecha);
    return date.toLocaleDateString("es-PE", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleBuscar = (query) => {
    const filtro = query.toLowerCase();
    const resultado = estudiantesBase.filter((est) => {
      return (
        est.id?.toString().includes(filtro) ||
        est.dni?.toString().includes(filtro) ||
        est.cliente?.toLowerCase().includes(filtro)
      );
    });
    setEstudiantes(resultado);
  };

  const handleReset = () => {
    setEstudiantes(estudiantesBase);
  };

  const handleEliminarEstudiante = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_PORT_ENV}/cliente/delete/${id}`
      );

      const nuevosEstudiantes = estudiantes.filter(
        (estudiante) => estudiante.id !== id
      );
      setEstudiantes(nuevosEstudiantes);
      setEstudiantesBase(nuevosEstudiantes);

      toast.success("Estudiante eliminado correctamente ✅");
    } catch (error) {
      console.error("Error al eliminar el estudiante:", error);
      toast.error("❌ Error al eliminar el estudiante.");
    }
  };

  // Función para cambiar de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Calcular los estudiantes que se deben mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEstudiantes = estudiantes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcular el total de páginas
  const totalPages = Math.ceil(estudiantes.length / itemsPerPage);

  return (
    <div className="min-w-[1200px] w-full">
      <div className="flex flex-col gap-[12px]">
        <div className="flex justify-start">
          <h2 className="text-2xl font-bold">Gestionar Estudiantes</h2>
        </div>
        <Buscar onBuscar={handleBuscar} onReset={handleReset} />
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between text-[#495D72] font-medium p-[6px] rounded-md">
          <div className="w-[40px] flex justify-center">ID</div>
          <div className="w-[300px] flex justify-center">Alumno</div>
          <div className="w-[100px] flex justify-center">F.Inicio</div>
          <div className="w-[110px] flex justify-center">F.Vencimiento</div>
          <div className="w-[360px] flex justify-center">Carrera</div>
          <div className="w-[250px] flex justify-center">Contrato</div>
          <div className="w-[110px] flex justify-center">Editar</div>
          <div className="w-[110px] flex justify-center">Eliminar</div>
        </div>

        {currentEstudiantes.length > 0 ? (
          currentEstudiantes.map((estudiante, index) => (
            <div
              key={estudiante.id}
              className={`flex justify-between items-center text-[#2B2829] font-normal p-[6px] rounded-md ${
                index % 2 === 0 ? "bg-white" : "bg-[#E9E7E7]"
              }`}
            >
              <div className="w-[40px] flex justify-center">
                {estudiante.id}
              </div>
              <div className="w-[300px] flex justify-start">
                {estudiante.cliente}
              </div>
              <div className="w-[100px] flex justify-center">
                {formatearFecha(estudiante.fechaInicio)}
              </div>
              <div className="w-[110px] flex justify-center">
                {formatearFecha(estudiante.fechaFinal)}
              </div>
              <div className="w-[360px] flex justify-center">
                {estudiante.carrera}
              </div>
              <div className="w-[100px] flex justify-start">
                {!estudiante.modalidad ? "Por Asignar" : estudiante.modalidad}
              </div>
              <div className="w-[100px] flex justify-start">
                {!estudiante.tipopago ? "Por Asignar" : estudiante.tipopago}
              </div>
              <button
                onClick={() => handlerEditarEstudiante(estudiante.id)}
                className="w-[110px] rounded-md px-3 py-1 bg-[#1C1C34] flex justify-center text-white"
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminarEstudiante(estudiante.id)}
                className="w-[110px] rounded-md px-3 py-1 bg-[#8F1313] flex justify-center text-white"
              >
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No se encontraron estudiantes.
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between mt-5 gap-4 items-center">
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
          onClick={handlerAgregarEstudiante}
          className="flex justify-between text-white w-[210px] h-8 rounded font-semibold bg-[#1B435D] px-6 py-1 mt-5"
        >
          <p>Agregar Estudiante</p>
        </button>
      </div>
    </div>
  );
};

export default ListarEstudiante;
