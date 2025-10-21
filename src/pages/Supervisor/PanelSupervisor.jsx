import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Edit,
  PlusCircle,
} from "lucide-react";
import LayoutApp from "../../layout/LayoutApp";
import { useQuery } from "@tanstack/react-query";
import { supervisorService } from "../../services/supervisor/supervisorService";
import { getUsuarioDesdeToken } from "../../utils/validateToken";

const PanelSupervisor = () => {
  const [filtros, setFiltros] = useState({
    areaId: "",
    asesorId: "",
    clienteId: "",
  });
  const [actividades, setActividades] = useState([]);
  const [expandedCliente, setExpandedCliente] = useState(null);
  const [areaSeleccionada, setAreaSeleccionada] = useState(null);
  const [asesorSeleccionado, setAsesorSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const usuario = getUsuarioDesdeToken();
  const idSupervisor = usuario?.id_supervisor;

  // 🔹 Obtener áreas del supervisor
  const {
    data: areas = [],
    isLoading: loadingAreas,
    isError: errorAreas,
  } = useQuery({
    queryKey: ["areasSupervisor", idSupervisor],
    queryFn: () => supervisorService.obtenerAreasPorSupervisor(idSupervisor),
    enabled: !!idSupervisor, // 👈 evita que se resetee mientras carga
  });

  // 🔹 Obtener clientes delegados del asesor seleccionado
  const {
    data: clientes = [],
    isLoading: loadingClientes,
    isError: errorClientes,
  } = useQuery({
    queryKey: ["clientesAsesor", asesorSeleccionado?.id],
    queryFn: () =>
      supervisorService.obtenerClientesPorAsesor(asesorSeleccionado?.id),
    enabled: !!asesorSeleccionado?.id,
  });

  // 🔹 Cargar auditorías cuando haya área, asesor y cliente seleccionados
  useEffect(() => {
    const fetchAuditorias = async () => {
      if (!filtros.areaId || !filtros.asesorId || !filtros.clienteId) return;

      try {
        const auditorias = await supervisorService.obtenerAuditorias(
          filtros.areaId,
          filtros.asesorId,
          filtros.clienteId
        );
        setActividades(auditorias);
      } catch (error) {
        console.error("Error al obtener auditorías:", error);
        setActividades([]);
      }
    };

    fetchAuditorias();
  }, [filtros.areaId, filtros.asesorId, filtros.clienteId]);

  // 🔁 Agrupar actividades por cliente
  const clientesAgrupados = actividades.reduce((acc, act) => {
    if (!acc[act.cliente]) acc[act.cliente] = { area: act.area, acts: [] };
    acc[act.cliente].acts.push(act);
    return acc;
  }, {});

  const toggleExpand = (cliente) => {
    setExpandedCliente(expandedCliente === cliente ? null : cliente);
  };

  if (loadingClientes || loadingAreas) return <p>Cargando datos...</p>;
  if (errorClientes || errorAreas) return <p>Error al cargar datos.</p>;

  return (
    <LayoutApp>
      <main className="p-3 sm:p-6 bg-white rounded-2xl shadow-lg w-full">
        {/* 🔍 FILTROS */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6 items-start sm:items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            Panel del Supervisor
          </h1>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            {/* 🏢 ÁREA */}
            <select
              className="border rounded-lg p-2 text-sm w-full sm:w-auto"
              value={filtros.areaId} // 👈 fuerza el valor visible
              onChange={(e) => {
                const area = areas.find((a) => a.id === e.target.value);
                setAreaSeleccionada(area);
                setFiltros((prev) => ({ ...prev, areaId: e.target.value }));
                setAsesorSeleccionado(null);
                setClienteSeleccionado(null);
                setBusqueda("");
              }}
            >
              <option value="">Selecciona un área</option>
              {areas?.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nombre}
                </option>
              ))}
            </select>

            {/* 👨‍🏫 ASESOR */}
            <select
              className="border rounded-lg p-2 text-sm w-full sm:w-auto"
              value={asesorSeleccionado?.id || ""}
              onChange={(e) => {
                const selected = areaSeleccionada?.asesores.find(
                  (a) => a.id === parseInt(e.target.value)
                );
                setAsesorSeleccionado(selected);
                setFiltros((prev) => ({ ...prev, asesorId: e.target.value }));
                setClienteSeleccionado(null);
                setBusqueda("");
              }}
              disabled={!areaSeleccionada}
            >
              <option value="">Seleccionar asesor</option>
              {areaSeleccionada?.asesores?.map((asesor) => (
                <option key={asesor.id} value={asesor.id}>
                  {asesor.nombre}
                </option>
              ))}
            </select>

            {/* 👥 CLIENTE CON BUSCADOR */}
            {asesorSeleccionado && clientes?.length === 0 ? (
              <p className="text-sm text-gray-500 italic py-2">
                El asesor seleccionado no tiene clientes registrados.
              </p>
            ) : (
              <>
                <input
                  list="clientesDelegados"
                  className="border rounded-lg p-2 text-sm w-full sm:w-64"
                  placeholder={
                    asesorSeleccionado
                      ? "Buscar o seleccionar cliente delegado..."
                      : "Selecciona un asesor primero"
                  }
                  disabled={!asesorSeleccionado}
                  value={busqueda}
                  onChange={(e) => {
                    const valor = e.target.value;
                    setBusqueda(valor);

                    const cliente = clientes.find(
                      (c) =>
                        c.nombre.toLowerCase() === valor.toLowerCase() ||
                        `${c.nombre} ${c.apellido}`.toLowerCase() ===
                          valor.toLowerCase()
                    );

                    if (cliente) {
                      setClienteSeleccionado(cliente);
                      setFiltros((prev) => ({
                        ...prev,
                        clienteId: cliente.id,
                      }));
                    } else {
                      setClienteSeleccionado(null);
                      setFiltros((prev) => ({ ...prev, clienteId: "" }));
                    }
                  }}
                  onSelect={(e) => {
                    const valor = e.target.value;
                    const cliente = clientes.find(
                      (c) =>
                        c.nombre.toLowerCase() === valor.toLowerCase() ||
                        `${c.nombre} ${c.apellido}`.toLowerCase() ===
                          valor.toLowerCase()
                    );
                    if (cliente) {
                      setClienteSeleccionado(cliente);
                      setBusqueda(`${cliente.nombre} ${cliente.apellido}`);
                      setFiltros((prev) => ({
                        ...prev,
                        clienteId: cliente.id,
                      }));
                    }
                  }}
                />

                <datalist id="clientesDelegados">
                  {clientes?.map((c) => (
                    <option key={c.id} value={`${c.nombre} ${c.apellido}`} />
                  ))}
                </datalist>
              </>
            )}
          </div>
        </div>

        {/* 📊 TABLA PRINCIPAL */}
        {clienteSeleccionado ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 hidden sm:table-header-group">
                <tr>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Asesoría</th>
                  <th className="p-3">Descripción</th>
                  <th className="p-3"> Accion</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3 text-center">Archivo</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(clientesAgrupados).map(([cliente, data]) => (
                  <React.Fragment key={cliente}>
                    {data.acts.map((a, idx) => (
                      <tr
                        key={idx}
                        className="border-b hover:bg-gray-50 flex flex-col sm:table-row mb-3 sm:mb-0 rounded-lg sm:rounded-none shadow-sm sm:shadow-none"
                      >
                        <td
                          onClick={() => toggleExpand(cliente)}
                          className="p-3 font-medium cursor-pointer flex items-center justify-between sm:justify-start gap-2 border-b sm:border-none"
                        >
                          <div className="flex items-center gap-2">
                            {idx === 0 && (
                              <>
                                {expandedCliente === cliente ? (
                                  <ChevronUp size={16} />
                                ) : (
                                  <ChevronDown size={16} />
                                )}
                                {cliente}
                              </>
                            )}
                            {idx > 0 && (
                              <span className="text-transparent">-</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 italic text-gray-600 sm:table-cell">
                          {a.asesoría}
                        </td>
                        <td className="p-3 sm:table-cell">{a.descripcion}</td>
                        <td className="text-xs flex items-center gap-1 text-gray-500 mb-2">
                          {a.accion.includes("Agrego un avance") && (
                            <PlusCircle size={12} className="text-green-600" />
                          )}
                          {a.accion.includes("Actualizó un asunto") && (
                            <Edit size={12} className="text-yellow-600" />
                          )}
                          <span>{a.accion}</span>
                        </td>
                        <td className="p-3 sm:table-cell">
                          {new Date(a.fecha).toLocaleDateString("es-PE")}
                        </td>
                        <td className="p-3 text-center sm:table-cell">
                          {a.archivos?.length > 0 ? (
                            <a
                              href={a.archivos[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex justify-center"
                            >
                              <FileText size={16} />
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            Seleccioná un cliente delegado para visualizar sus actividades.
          </p>
        )}
      </main>
    </LayoutApp>
  );
};

export default PanelSupervisor;
