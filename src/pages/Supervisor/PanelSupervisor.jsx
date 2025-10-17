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
    fecha: "",
    areaId: "",
    asesorId: "",
  });
  const [actividades, setActividades] = useState([]);
  const [expandedCliente, setExpandedCliente] = useState(null);
  const [areaSeleccionada, setAreaSeleccionada] = useState(null);
  const [asesorSeleccionado, setAsesorSeleccionado] = useState(null);

  const usuario = getUsuarioDesdeToken();
  const idSupervisor = usuario?.id_supervisor;

  // Obtener áreas del supervisor
  const {
    data: areas = [],
    isLoading: loadingAreas,
    isError: errorAreas,
  } = useQuery({
    queryKey: ["areasSupervisor", idSupervisor],
    queryFn: () => supervisorService.obtenerAreasPorSupervisor(idSupervisor),
  });

  // 🔄 Cargar actividades del backend cuando cambien los filtros
  useEffect(() => {
    const fetchAuditorias = async () => {
      if (!filtros.areaId || !filtros.asesorId || !filtros.fecha) return;

      try {
        const auditorias = await supervisorService.obtenerAuditorias(
          filtros.areaId,
          filtros.asesorId,
          filtros.fecha
        );
        setActividades(auditorias);
      } catch (error) {
        console.error("Error al obtener auditorías:", error);
        setActividades([]);
      }
    };

    fetchAuditorias();
  }, [filtros]);

  // 🔁 Agrupar actividades por cliente
  const clientesAgrupados = actividades.reduce((acc, act) => {
    if (!acc[act.cliente]) acc[act.cliente] = { area: act.area, acts: [] };
    acc[act.cliente].acts.push(act);
    return acc;
  }, {});

  const toggleExpand = (cliente) => {
    setExpandedCliente(expandedCliente === cliente ? null : cliente);
  };

  if (loadingAreas) return <p>Cargando áreas...</p>;
  if (errorAreas) return <p>Error al cargar datos.</p>;

  return (
    <LayoutApp>
      <main className="p-3 sm:p-6 bg-white rounded-2xl shadow-lg w-full">
        {/* 🔍 FILTROS */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6 items-start sm:items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            Panel del Supervisor
          </h1>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            {/* 📅 FECHA */}
            <input
              type="date"
              className="border rounded-lg p-2 text-sm w-full sm:w-auto"
              value={filtros.fecha}
              onChange={(e) =>
                setFiltros({ ...filtros, fecha: e.target.value })
              }
            />

            {/* 🏢 ÁREA */}
            <select
              className="border rounded-lg p-2 text-sm w-full sm:w-auto"
              onChange={(e) => {
                const areaSeleccionada = areas.find(
                  (a) => a.id === e.target.value
                );
                setAreaSeleccionada(areaSeleccionada);
                setFiltros((prev) => ({ ...prev, areaId: e.target.value }));
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
          </div>
        </div>

        {/* 📊 TABLA PRINCIPAL */}
        {asesorSeleccionado ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 hidden sm:table-header-group">
                <tr>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Área</th>
                  <th className="p-3">Asesoría</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Descripción</th>
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
                        <td className="p-3 sm:table-cell">{a.area}</td>
                        <td className="p-3 italic text-gray-600 sm:table-cell">
                          {a.asesoría}
                        </td>
                        <td className="p-3 sm:table-cell">{a.tipo}</td>
                        <td className="p-3 sm:table-cell">{a.descripcion}</td>
                        <td className="p-3 sm:table-cell">
                          {new Date(a.fecha).toLocaleDateString("es-PE")}
                        </td>
                        <td className="p-3 text-center sm:table-cell">
                          {a.archivos ? (
                            <a
                              href={a.archivos}
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

                    {/* 🔽 Detalle expandido */}
                    {expandedCliente === cliente && (
                      <tr className="bg-gray-50 border-b">
                        <td colSpan={8} className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-3">
                            Detalles de {cliente}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.acts.map((a, i) => (
                              <div
                                key={i}
                                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                              >
                                <p className="font-medium text-gray-700 text-sm mb-1">
                                  <em>{a.asesoría}</em>
                                </p>
                                <p className="text-xs text-gray-600 mb-2">
                                  {a.detalle}
                                </p>
                                <p className="text-xs flex items-center gap-1 text-gray-500 mb-2">
                                  {a.accion.includes("Agrego un avance") && (
                                    <PlusCircle
                                      size={12}
                                      className="text-green-600"
                                    />
                                  )}
                                  {a.accion.includes("Actualizó un asunto") && (
                                    <Edit
                                      size={12}
                                      className="text-yellow-600"
                                    />
                                  )}

                                  <span>{a.accion}</span>
                                </p>
                                {a.archivos ? (
                                  <a
                                    href={a.archivos}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-xs flex items-center gap-1"
                                  >
                                    <FileText size={12} /> Ver archivo
                                  </a>
                                ) : (
                                  <span className="text-xs text-gray-400">
                                    Sin archivo adjunto
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            Seleccioná un asesor para visualizar sus clientes y actividades.
          </p>
        )}
      </main>
    </LayoutApp>
  );
};

export default PanelSupervisor;
