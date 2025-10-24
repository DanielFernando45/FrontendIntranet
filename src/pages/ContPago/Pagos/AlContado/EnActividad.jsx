import React, { useState, useEffect } from "react";
import axios from "axios";
import EditarAlContado from "../../../../Components/Administrador/Pagos/EditarAlContado";
import tachoelimanar from "../../../../assets/icons/tacho.svg";
import toast from "react-hot-toast";

const EnActividad = () => {
  const [clientes, setClientes] = useState([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [editar, setEditar] = useState(false);
  const [clienteEdit, setClienteEdit] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Número de clientes por página

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_PORT_ENV}/pagos/contado`
        );
        setClientes(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error al obtener los datos:", err);
      }
    };

    fetchClientes();
  }, []);

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    // Forzamos UTC en el formato
    return date.toLocaleDateString("es-PE", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleEditarClick = (cliente) => {
    setClienteEdit(cliente);
    setEditar(true);
  };

  const handleEliminarClick = (cliente) => {
    setClienteAEliminar(cliente.id_infoPago);
    setMostrarConfirmacion(true);
  };

  const confirmarEliminar = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_PORT_ENV}/pagos/delete/${clienteAEliminar}`
      );

      // Actualizar el estado local eliminando el cliente
      setClientes((prevClientes) =>
        prevClientes.filter(
          (cliente) => cliente.id_infoPago !== clienteAEliminar
        )
      );

      toast.success("Pago eliminado correctamente");

      setMostrarConfirmacion(false);
      setClienteAEliminar(null);
    } catch (err) {
      console.error("Error al eliminar el pago:", err);
      toast.error("Error al eliminar el pago");
      setMostrarConfirmacion(false);
    }
  };

  const handleActualizarPago = async (id, datosActualizados) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_PORT_ENV}/pagos/updateContado/${id}`,
        datosActualizados
      );

      // Actualizar el estado local
      setClientes((prevClientes) =>
        prevClientes.map((cliente) =>
          cliente.id_infoPago === id
            ? {
                ...cliente,
                ultimo_monto: datosActualizados.pago_total,
                fecha_ultimo_pago: datosActualizados.fecha_pago,
              }
            : cliente
        )
      );

      toast.success("Servicio actualizado correctamente");
      setEditar(false);
    } catch (err) {
      console.error("Error al actualizar el pago:", err);
      toast.error("Error al actualizar el servicio");
    }
  };

  // Paginación: Cálculo de los clientes a mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClientes = clientes.slice(indexOfFirstItem, indexOfLastItem);

  // Paginación: Total de páginas
  const totalPages = Math.ceil(clientes.length / itemsPerPage);

  // Cambiar de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between text-[#495D72] font-medium p-[6px] pr-10 rounded-md">
        <div className="w-[40px] flex justify-center">IdPago</div>
        <div className="w-[300px] flex justify-center">Alumno</div>
        <div className="w-[210px] flex justify-center">Asesoria</div>
        <div className="w-[160px] flex justify-center">Fecha Pago</div>
        <div className="w-[370px] flex justify-center">Monto del contrato</div>
        <div className="w-[120px] flex justify-center">Accion</div>
      </div>

      {currentClientes.map((cliente, index) => (
        <div
          key={cliente.id_infoPago}
          className={`flex justify-between text-[#2B2829] ${
            index % 2 === 0 ? "bg-[#E9E7E7]" : "bg-[#ffffff]"
          } font-normal p-[6px] pr-10 rounded-md`}
        >
          <div className="w-[40px] flex justify-center">
            {cliente.id_infoPago}
          </div>
          <div className="w-[300px] flex justify-center">
            {cliente.delegado}
          </div>
          <div className="w-[210px] flex justify-center">
            {cliente.contrato}
          </div>
          <div className="w-[160px] flex justify-center">
            {formatearFecha(cliente.fecha_ultimo_pago)}
          </div>
          <div className="w-[370px] flex justify-center">
            S/ {cliente.ultimo_monto.toLocaleString("es-PE")}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleEditarClick(cliente)}
              className="w-[120px] font-medium rounded-md px-4 py-1 bg-[#0A8EAA] ml-1 flex justify-center text-white text-[14px]"
            >
              Editar
            </button>
            <button
              onClick={() => handleEliminarClick(cliente)}
              className="font-medium rounded-md px-2 py-1 flex items-center justify-center"
            >
              <img src={tachoelimanar} alt="Eliminar" />
            </button>
          </div>
        </div>
      ))}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-4">
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

      {editar && (
        <EditarAlContado
          cliente={clienteEdit}
          onUpdate={handleActualizarPago}
          cerrar={() => setEditar(false)}
        />
      )}

      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              ¿Estás seguro de que deseas eliminar este pago al contado?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => {
                  setMostrarConfirmacion(false);
                  setClienteAEliminar(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={confirmarEliminar}
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

export default EnActividad;
