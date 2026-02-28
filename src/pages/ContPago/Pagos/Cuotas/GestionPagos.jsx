import React, { useState, useEffect } from "react";
import ActualizarPago from "../../../../Components/Administrador/Pagos/ActualizarPago";
import { 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaTrash, 
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaSearch,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaFileInvoiceDollar,
  FaUserGraduate,
  FaHashtag,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle
} from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { RiMoneyDollarCircleLine, RiRefreshLine } from "react-icons/ri";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { VscError } from "react-icons/vsc";
import { BsThreeDotsVertical } from "react-icons/bs";

const GestionPagos = () => {
  const [actualizar, setActualizar] = useState(false);
  const [eliminar, setEliminar] = useState(false);
  const [verDetalle, setVerDetalle] = useState(false);
  const [pagos, setPagos] = useState([]);
  const [filteredPagos, setFilteredPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPago, setSelectedPago] = useState(null);
  const [pagoToDelete, setPagoToDelete] = useState(null);
  const [pagoDetalle, setPagoDetalle] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(null);

  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Estadísticas
  const [estadisticas, setEstadisticas] = useState({
    totalPagos: 0,
    pagosCompletados: 0,
    pagosPendientes: 0,
    pagosParciales: 0,
    montoTotal: 0,
    montoPagado: 0,
    montoPendiente: 0
  });

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_PORT_ENV}/pagos/cuotas`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los datos de pagos");
        }
        const data = await response.json();
        setPagos(data);
        setFilteredPagos(data);
        calcularEstadisticas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, []);

  useEffect(() => {
    // Aplicar filtros y búsqueda
    let resultado = [...pagos];

    // Filtro por término de búsqueda
    if (searchTerm) {
      resultado = resultado.filter(pago => 
        pago.delegado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pago.contrato?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pago.id_infopago.toString().includes(searchTerm)
      );
    }

    // Filtro por estado general del pago
    if (filterEstado !== "todos") {
      resultado = resultado.filter(pago => {
        const pagosPagados = pago.pagos.filter(p => p.estado_pago === "pagado").length;
        const totalPagos = pago.pagos.length;
        
        if (filterEstado === "completado") return pagosPagados === totalPagos;
        if (filterEstado === "pendiente") return pagosPagados === 0;
        if (filterEstado === "parcial") return pagosPagados > 0 && pagosPagados < totalPagos;
        return true;
      });
    }

    // Ordenamiento
    resultado.sort((a, b) => {
      let aValue, bValue;
      
      switch(sortConfig.key) {
        case "id":
          aValue = a.id_infopago;
          bValue = b.id_infopago;
          break;
        case "delegado":
          aValue = a.delegado || "";
          bValue = b.delegado || "";
          break;
        case "contrato":
          aValue = a.contrato || "";
          bValue = b.contrato || "";
          break;
        case "total":
          aValue = calculateTotal(a.pagos);
          bValue = calculateTotal(b.pagos);
          break;
        case "estado":
          const aPagados = a.pagos.filter(p => p.estado_pago === "pagado").length;
          const bPagados = b.pagos.filter(p => p.estado_pago === "pagado").length;
          aValue = aPagados / a.pagos.length;
          bValue = bPagados / b.pagos.length;
          break;
        case "fecha":
          aValue = new Date(a.fecha_creado || 0);
          bValue = new Date(b.fecha_creado || 0);
          break;
        default:
          aValue = a.id_infopago;
          bValue = b.id_infopago;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredPagos(resultado);
    setCurrentPage(1);
    calcularEstadisticas(resultado);
  }, [searchTerm, filterEstado, sortConfig, pagos]);

  const calcularEstadisticas = (pagosData) => {
    const stats = {
      totalPagos: pagosData.length,
      pagosCompletados: 0,
      pagosPendientes: 0,
      pagosParciales: 0,
      montoTotal: 0,
      montoPagado: 0,
      montoPendiente: 0
    };

    pagosData.forEach(pago => {
      const totalPago = calculateTotal(pago.pagos);
      stats.montoTotal += totalPago;
      
      const pagosPagados = pago.pagos.filter(p => p.estado_pago === "pagado").length;
      const totalPagos = pago.pagos.length;
      
      if (pagosPagados === totalPagos) {
        stats.pagosCompletados++;
        stats.montoPagado += totalPago;
      } else if (pagosPagados === 0) {
        stats.pagosPendientes++;
        stats.montoPendiente += totalPago;
      } else {
        stats.pagosParciales++;
        // Calcular monto pagado parcialmente
        const montoPagadoParcial = pago.pagos
          .filter(p => p.estado_pago === "pagado")
          .reduce((acc, p) => acc + p.monto, 0);
        stats.montoPagado += montoPagadoParcial;
        stats.montoPendiente += (totalPago - montoPagadoParcial);
      }
    });

    setEstadisticas(stats);
  };

  const handleActualizarClick = (pagoInfo) => {
    const pagoData = {
      id_infoPago: pagoInfo.id_infopago,
      delegado: pagoInfo.delegado,
      contrato: pagoInfo.contrato,
      numero_cuotas: pagoInfo.pagos.length,
      total_pagar: calculateTotal(pagoInfo.pagos),
      cuotas: pagoInfo.pagos
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .map((pago) => ({
          nombre: pago.nombre,
          monto: pago.monto,
          fecha_pago: pago.fecha_pago ? pago.fecha_pago.split("T")[0] : "",
          estado_pago: pago.estado_pago,
          id: pago.id,
        })),
    };

    setSelectedPago(pagoData);
    setActualizar(true);
    setMenuAbierto(null);
  };

  const handleVerDetalleClick = (pagoInfo) => {
    setPagoDetalle(pagoInfo);
    setVerDetalle(true);
    setMenuAbierto(null);
  };

  const handleEliminarClick = (pagoInfo) => {
    setPagoToDelete(pagoInfo);
    setEliminar(true);
    setMenuAbierto(null);
  };

  const confirmarEliminar = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_PORT_ENV}/pagos/delete/${pagoToDelete.id_infopago}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el pago");
      }

      const updatedPagos = pagos.filter(
        (pago) => pago.id_infopago !== pagoToDelete.id_infopago
      );
      setPagos(updatedPagos);

      setEliminar(false);
      setPagoToDelete(null);
    } catch (err) {
      setError(err.message);
      setEliminar(false);
    }
  };

  const formatDate = (fecha) => {
    if (!fecha) return "—";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-PE", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatDateTime = (fecha) => {
    if (!fecha) return "—";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-PE", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const calculateTotal = (pagosArray) => {
    return pagosArray.reduce((total, pago) => total + pago.monto, 0);
  };

  const getEstadoGeneral = (pagos) => {
    const pagados = pagos.filter(p => p.estado_pago === "pagado").length;
    const total = pagos.length;
    
    if (pagados === total) {
      return { texto: "Completado", color: "bg-green-100 text-green-800", icono: FaCheckCircle };
    } else if (pagados === 0) {
      return { texto: "Pendiente", color: "bg-red-100 text-red-800", icono: FaClock };
    } else {
      return { texto: "Parcial", color: "bg-yellow-100 text-yellow-800", icono: FaExclamationTriangle };
    }
  };

  const getBarraProgreso = (pagos) => {
    const pagados = pagos.filter(p => p.estado_pago === "pagado").length;
    const total = pagos.length;
    return (pagados / total) * 100;
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-400 ml-1" />;
    return sortConfig.direction === "asc" 
      ? <FaSortUp className="text-[#1C1C34] ml-1" /> 
      : <FaSortDown className="text-[#1C1C34] ml-1" />;
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPagos = filteredPagos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPagos.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const limpiarFiltros = () => {
    setSearchTerm("");
    setFilterEstado("todos");
    setSortConfig({ key: "id", direction: "desc" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-[#1C1C34] mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <MdPayment className="text-[#1C1C34] text-2xl opacity-50" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">Cargando datos de pagos...</p>
          <p className="text-sm text-gray-400 mt-2">Por favor espere</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center bg-red-50 p-8 rounded-xl border border-red-200 max-w-md">
          <VscError className="text-red-500 text-5xl mx-auto mb-4" />
          <p className="text-red-600 font-semibold text-lg mb-2">Error al cargar los datos</p>
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-[#1C1C34] text-white rounded-lg hover:bg-opacity-90 transition-colors inline-flex items-center gap-2"
          >
            <RiRefreshLine />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header con título y estadísticas */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1C1C34] mb-2 flex items-center gap-3">
              <div className="p-2 bg-[#1C1C34] bg-opacity-10 rounded-lg">
                <MdPayment className="text-[#1C1C34] text-2xl" />
              </div>
              Gestión de Pagos por Cuotas
            </h1>
            <p className="text-gray-600">Administra y da seguimiento a todos los pagos registrados en el sistema</p>
          </div>
          <div className="bg-[#1C1C34] text-white px-4 py-2 rounded-lg text-sm font-medium">
            Total: {filteredPagos.length} registros
          </div>
        </div>

        {/* Tarjetas de estadísticas mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <RiMoneyDollarCircleLine className="text-blue-600 text-xl" />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Total general
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">S/. {estadisticas.montoTotal.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Monto total en todos los pagos</p>
            <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <IoMdCheckmarkCircleOutline className="text-green-600 text-xl" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Completados
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">S/. {estadisticas.montoPagado.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{estadisticas.pagosCompletados} pagos completados</p>
            <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${(estadisticas.montoPagado / estadisticas.montoTotal * 100) || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaExclamationTriangle className="text-yellow-600 text-xl" />
              </div>
              <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                Pendiente
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">S/. {estadisticas.montoPendiente.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{estadisticas.pagosPendientes + estadisticas.pagosParciales} pagos pendientes</p>
            <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 rounded-full" 
                style={{ width: `${(estadisticas.montoPendiente / estadisticas.montoTotal * 100) || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaFileInvoiceDollar className="text-purple-600 text-xl" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                Distribución
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completados:</span>
                <span className="font-semibold text-green-600">{estadisticas.pagosCompletados}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Parciales:</span>
                <span className="font-semibold text-yellow-600">{estadisticas.pagosParciales}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pendientes:</span>
                <span className="font-semibold text-red-600">{estadisticas.pagosPendientes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de filtros mejorada */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por alumno, contrato o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C1C34] focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C1C34] focus:border-transparent appearance-none bg-white min-w-[160px]"
              >
                <option value="todos">Todos los estados</option>
                <option value="completado">Completados</option>
                <option value="parcial">Pagos parciales</option>
                <option value="pendiente">Pendientes</option>
              </select>
            </div>
            {(searchTerm || filterEstado !== "todos") && (
              <button
                onClick={limpiarFiltros}
                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de pagos mejorada */}
      {currentPagos.length === 0 ? (
        <div className="text-center bg-gray-50 rounded-xl p-16 border-2 border-dashed border-gray-300">
          <img 
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='7' width='20' height='14' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'%3E%3C/path%3E%3C/svg%3E" 
            alt="No hay datos" 
            className="w-32 mx-auto mb-4 opacity-40"
          />
          <p className="text-gray-500 text-lg font-medium mb-2">No se encontraron resultados</p>
          <p className="text-gray-400 text-sm mb-4">Intenta con otros términos de búsqueda o filtros</p>
          <button
            onClick={limpiarFiltros}
            className="px-6 py-2 bg-[#1C1C34] text-white rounded-lg hover:bg-opacity-90 transition-colors inline-flex items-center gap-2"
          >
            <RiRefreshLine />
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Cabecera de la tabla */}
            <div className="hidden lg:grid grid-cols-12 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div 
                className="col-span-1 flex items-center cursor-pointer hover:text-[#1C1C34]"
                onClick={() => handleSort("id")}
              >
                <FaHashtag className="mr-1" />
                ID {getSortIcon("id")}
              </div>
              <div 
                className="col-span-2 flex items-center cursor-pointer hover:text-[#1C1C34]"
                onClick={() => handleSort("delegado")}
              >
                <FaUserGraduate className="mr-1" />
                Alumno {getSortIcon("delegado")}
              </div>
              <div 
                className="col-span-1 flex items-center cursor-pointer hover:text-[#1C1C34]"
                onClick={() => handleSort("contrato")}
              >
                Contrato {getSortIcon("contrato")}
              </div>
              <div className="col-span-3 flex items-center">
                <FaMoneyBillWave className="mr-1" />
                Detalle de Cuotas
              </div>
              <div 
                className="col-span-1 flex items-center justify-end cursor-pointer hover:text-[#1C1C34]"
                onClick={() => handleSort("total")}
              >
                Total {getSortIcon("total")}
              </div>
              <div 
                className="col-span-2 flex items-center justify-center cursor-pointer hover:text-[#1C1C34]"
                onClick={() => handleSort("estado")}
              >
                Estado {getSortIcon("estado")}
              </div>
              
              <div className="col-span-1 flex items-center justify-center">
                Acciones
              </div>
            </div>

            {/* Cuerpo de la tabla */}
            {currentPagos.map((pagoInfo, idx) => {
              const estadoGeneral = getEstadoGeneral(pagoInfo.pagos);
              const EstadoIcono = estadoGeneral.icono;
              const progreso = getBarraProgreso(pagoInfo.pagos);
              
              return (
                <div
                  key={pagoInfo.id_infopago}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-0 px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors relative ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  {/* Versión móvil */}
                  <div className="lg:hidden space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#1C1C34] text-white text-xs px-2 py-1 rounded-lg">
                          ID: #{pagoInfo.id_infopago}
                        </span>
                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-lg">
                          {pagoInfo.contrato}
                        </span>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setMenuAbierto(menuAbierto === pagoInfo.id_infopago ? null : pagoInfo.id_infopago)}
                          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <BsThreeDotsVertical />
                        </button>
                        {menuAbierto === pagoInfo.id_infopago && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <button
                              onClick={() => handleVerDetalleClick(pagoInfo)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                            >
                              <FaEye className="text-blue-500" />
                              Ver detalles
                            </button>
                            <button
                              onClick={() => handleActualizarClick(pagoInfo)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                            >
                              <FaEdit className="text-green-500" />
                              Actualizar
                            </button>
                            <button
                              onClick={() => handleEliminarClick(pagoInfo)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-red-600"
                            >
                              <FaTrash />
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-semibold text-gray-800">{pagoInfo.delegado}</p>
                    </div>

                    <div className="space-y-2">
                      {pagoInfo.pagos
                        .sort((a, b) => a.nombre.localeCompare(b.nombre))
                        .slice(0, 3)
                        .map((pago) => (
                          <div key={pago.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{pago.nombre}:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">S/. {pago.monto}</span>
                              {pago.estado_pago === "pagado" ? (
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                  {formatDate(pago.fecha_pago)}
                                </span>
                              ) : (
                                <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                  Pendiente
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      {pagoInfo.pagos.length > 3 && (
                        <p className="text-xs text-gray-500 text-center mt-1">
                          +{pagoInfo.pagos.length - 3} cuotas más
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-lg font-bold text-[#1C1C34]">
                          S/. {calculateTotal(pagoInfo.pagos).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${estadoGeneral.color}`}>
                          <EstadoIcono />
                          {estadoGeneral.texto}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDateTime(pagoInfo.fecha_creado)}
                        </p>
                      </div>
                    </div>

                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#1C1C34] rounded-full transition-all duration-300"
                        style={{ width: `${progreso}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Versión desktop */}
                  <div className="hidden lg:flex lg:col-span-1 items-center font-medium text-gray-700">
                    #{pagoInfo.id_infopago}
                  </div>
                  <div className="hidden lg:flex lg:col-span-2 items-center">
                    <div className="truncate" title={pagoInfo.delegado}>
                      {pagoInfo.delegado}
                    </div>
                  </div>
                  <div className="hidden lg:flex lg:col-span-1 items-center text-gray-600">
                    {pagoInfo.contrato}
                  </div>
                  <div className="hidden lg:flex lg:col-span-3 items-center">
                    <div className="flex flex-wrap gap-2">
                      {pagoInfo.pagos
                        .sort((a, b) => a.nombre.localeCompare(b.nombre))
                        .map((pago) => (
                          <div
                            key={pago.id}
                            className={`group relative flex items-center text-xs rounded-lg px-2 py-1 ${
                              pago.estado_pago === "pagado"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                          >
                            <span className="font-medium mr-1">{pago.nombre}:</span>
                            <span className="font-bold">S/. {pago.monto}</span>
                            {pago.estado_pago === "pagado" && (
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                Pagado: {formatDate(pago.fecha_pago)}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="hidden lg:flex lg:col-span-1 items-center justify-end font-bold text-[#1C1C34]">
                    S/. {calculateTotal(pagoInfo.pagos).toFixed(2)}
                  </div>
                  <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
                    <div className="flex flex-col items-center w-full max-w-[140px]">
                      <div className="flex items-center gap-2 w-full mb-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${estadoGeneral.color}`}>
                          <EstadoIcono />
                          {estadoGeneral.texto}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#1C1C34] rounded-full transition-all duration-300"
                          style={{ width: `${progreso}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {pagoInfo.pagos.filter(p => p.estado_pago === "pagado").length}/{pagoInfo.pagos.length} cuotas
                      </span>
                    </div>
                  </div>
                  
                  <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerDetalleClick(pagoInfo)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleActualizarClick(pagoInfo)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Actualizar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleEliminarClick(pagoInfo)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Información de paginación y controles */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{' '}
              <span className="font-medium">{Math.min(indexOfLastItem, filteredPagos.length)}</span> de{' '}
              <span className="font-medium">{filteredPagos.length}</span> resultados
            </p>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#1C1C34] hover:bg-gray-100"
                  }`}
                >
                  <FaChevronCircleLeft />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#1C1C34] hover:bg-gray-100"
                  }`}
                >
                  <FaChevronLeft />
                </button>

                <div className="flex gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-[#1C1C34] text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#1C1C34] hover:bg-gray-100"
                  }`}
                >
                  <FaChevronRight />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#1C1C34] hover:bg-gray-100"
                  }`}
                >
                  <FaChevronCircleRight />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal de actualizar */}
      {actualizar && selectedPago && (
        <ActualizarPago
          onClose={() => {
            setActualizar(false);
            setSelectedPago(null);
          }}
          pagoData={selectedPago}
        />
      )}

      {/* Modal de detalle */}
      {verDetalle && pagoDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#1C1C34] to-[#2c2c4f] text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Detalle del Pago</h2>
                  <p className="text-white/80">ID: #{pagoDetalle.id_infopago}</p>
                </div>
                <button
                  onClick={() => setVerDetalle(false)}
                  className="text-white/80 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Alumno</p>
                  <p className="font-semibold text-gray-800">{pagoDetalle.delegado}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Contrato</p>
                  <p className="font-semibold text-gray-800">{pagoDetalle.contrato}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fecha de creación</p>
                  <p className="font-semibold text-gray-800">{formatDateTime(pagoDetalle.fecha_creado)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total a pagar</p>
                  <p className="text-xl font-bold text-[#1C1C34]">
                    S/. {calculateTotal(pagoDetalle.pagos).toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaMoneyBillWave className="text-[#1C1C34]" />
                  Detalle de Cuotas
                </h3>
                <div className="space-y-3">
                  {pagoDetalle.pagos
                    .sort((a, b) => a.nombre.localeCompare(b.nombre))
                    .map((pago) => (
                      <div
                        key={pago.id}
                        className={`p-4 rounded-lg border ${
                          pago.estado_pago === "pagado"
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-gray-700">{pago.nombre}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            pago.estado_pago === "pagado"
                              ? "bg-green-200 text-green-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}>
                            {pago.estado_pago === "pagado" ? "Pagado" : "Por pagar"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Monto</p>
                            <p className="font-semibold text-gray-800">S/. {pago.monto}</p>
                          </div>
                          {pago.fecha_pago && (
                            <div>
                              <p className="text-gray-500">Fecha de pago</p>
                              <p className="font-semibold text-gray-800">{formatDate(pago.fecha_pago)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 flex justify-end">
              <button
                onClick={() => setVerDetalle(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de eliminación mejorado */}
      {eliminar && pagoToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-red-500 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <FaTrash className="text-xl" />
                </div>
                <h3 className="text-xl font-bold">Confirmar eliminación</h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                ¿Estás seguro de que deseas eliminar este pago?
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600 mb-2">Detalles del pago a eliminar:</p>
                <p className="font-semibold text-gray-800">ID: #{pagoToDelete.id_infopago}</p>
                <p className="text-gray-700">Alumno: {pagoToDelete.delegado}</p>
                <p className="text-gray-700">Contrato: {pagoToDelete.contrato}</p>
                <p className="text-gray-700 font-medium mt-2">
                  Total: S/. {calculateTotal(pagoToDelete.pagos).toFixed(2)}
                </p>
              </div>

              <p className="text-sm text-red-600 mb-6">
                <VscError className="inline mr-1" />
                Esta acción no se puede deshacer. Se eliminarán todos los datos relacionados.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  onClick={() => {
                    setEliminar(false);
                    setPagoToDelete(null);
                  }}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  onClick={confirmarEliminar}
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPagos;