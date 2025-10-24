import React, { useEffect, useState } from "react";
import agregar from "../../../assets/icons/IconAdmin/add-white.svg";
import AsignarExtra from "../../../Components/Administrador/Pagos/AsignarExtra";
import EditarExtra from "../../../Components/Administrador/Pagos/EditarExtra";
import axios from "axios";
import toast from "react-hot-toast";

const ServiciosExtra = () => {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [servicioToDelete, setServicioToDelete] = useState(null);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Número de servicios por página

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = () => {
    axios
      .get(`${import.meta.env.VITE_API_PORT_ENV}/pagos/listServicios`)
      .then((res) => setServicios(res.data))
      .catch((error) => console.error("Error al cargar los datos", error));
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-PE", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleDeleteClick = (servicio) => {
    setServicioToDelete(servicio);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!servicioToDelete) return;

    axios
      .delete(
        `${import.meta.env.VITE_API_PORT_ENV}/pagos/delete/${
          servicioToDelete.id
        }`
      )
      .then(() => {
        toast.success("Servicio eliminado correctamente");
        cargarServicios();
        setShowDeleteModal(false);
        setServicioToDelete(null);
      })
      .catch((error) => {
        console.error("Error al eliminar el servicio", error);
        toast.error("Error al eliminar el servicio");
        setShowDeleteModal(false);
      });
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setServicioToDelete(null);
  };

  // Cálculo de los servicios a mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServicios = servicios.slice(indexOfFirstItem, indexOfLastItem);

  // Calcular el total de páginas
  const totalPages = Math.ceil(servicios.length / itemsPerPage);

  // Función para cambiar de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <div className="flex flex-col bg-white rounded-lg p-5 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4">
          <h1 className="text-lg sm:text-xl font-medium">Servicios Extra</h1>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#1C1C34] rounded-3xl px-4 text-white text-sm sm:text-xs w-full sm:w-48 h-10"
          >
            Agregar servicio
            <img src={agregar} alt="" className="h-6 sm:h-8" />
          </button>
        </div>

        {/* Tabla con scroll horizontal */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="text-[#495D72] font-medium border-b">
                <th className="py-2 px-3 text-center">IdPago</th>
                <th className="py-2 px-3 text-left">Delegado/Cliente</th>
                <th className="py-2 px-3 text-left">Servicio Extra</th>
                <th className="py-2 px-3 text-center">Fecha Pago</th>
                <th className="py-2 px-3 text-center">Pago</th>
                <th className="py-2 px-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {currentServicios.map((servicio, index) => (
                <tr
                  key={servicio.id}
                  className={`text-[#2B2829] text-sm md:text-base ${
                    index % 2 === 0 ? "bg-white" : "bg-[#F5F5F5]"
                  }`}
                >
                  <td className="py-2 px-3 text-center">{servicio.id}</td>
                  <td className="py-2 px-3">{servicio.delegado}</td>
                  <td className="py-2 px-3">{servicio.titulo}</td>
                  <td className="py-2 px-3 text-center">
                    {formatearFecha(servicio.fecha_pago)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    S/. {servicio.pago_total}.00
                  </td>
                  <td className="py-2 px-3 text-center">
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <button
                        onClick={() => {
                          setServicioSeleccionado(servicio);
                          setEdit(true);
                        }}
                        className="px-3 py-1 bg-[#1C1C34] text-white rounded-md text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(servicio)}
                        className="px-3 py-1 bg-[#E32323] text-white rounded-md text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-5 gap-4">
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
            <span className="flex items-center justify-center">
              Página {currentPage} de {totalPages}
            </span>
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
        )}
      </div>

      {open && <AsignarExtra close={() => setOpen(false)} />}
      {edit && (
        <EditarExtra
          closeEdit={() => setEdit(false)}
          servicio={servicioSeleccionado}
        />
      )}

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[95%] max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirmar Eliminación</h3>
            <p className="mb-6">
              ¿Estás seguro que deseas eliminar el servicio "
              {servicioToDelete?.titulo}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiciosExtra;
