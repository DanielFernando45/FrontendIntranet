import React, { useState, useEffect } from "react";
import { ClipboardX } from "lucide-react";

const Activos = () => {
  const [asesorias, setAsesorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsesorias = async () => {
      try {
        const userString = localStorage.getItem("user");
        const user = JSON.parse(userString);
        const id = user.id_asesor;

        const response = await fetch(
          `${
            import.meta.env.VITE_API_PORT_ENV
          }/asesoramiento/misAsesoriasActivas/${id}`
        );

        if (!response.ok) {
          throw new Error("No tienes asesorías activas");
        }

        const data = await response.json();
        setAsesorias(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAsesorias();
  }, []);

  const formatDate = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-PE", {
      timeZone: "UTC",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Cargando...</div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center h-64">{error}</div>;
  }

  if (asesorias.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4 text-[#82777A]">
        <ClipboardX className="w-12 h-12 text-slate-800 font-medium" />{" "}
        <p className="text-sm font-medium">No tienes asesorías activas</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm">
      {/* Contenedor scrollable */}
      <div className="overflow-x-auto rounded-md">
        <table className="min-w-[900px] w-full text-sm text-left text-gray-700 border-collapse">
          {/* Encabezado */}
          <thead className="bg-[#F2F2F2] text-[#495D72] font-semibold">
            <tr>
              <th className="px-4 py-2 text-center w-[120px]">ID Asesoría</th>
              <th className="px-4 py-2 text-center w-[250px]">Delegado</th>
              <th className="px-4 py-2 text-center w-[250px]">Tipo Trabajo</th>
              <th className="px-4 py-2 text-center w-[200px]">Modalidad</th>
              <th className="px-4 py-2 text-center w-[250px]">Referencia</th>
              <th className="px-4 py-2 text-center w-[180px]">F. Inicio</th>
              <th className="px-4 py-2 text-center w-[180px]">
                F. Vencimiento
              </th>
            </tr>
          </thead>

          {/* Cuerpo */}
          <tbody>
            {asesorias.map((asesoria, index) => (
              <tr
                key={asesoria.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-[#F9F9F9]"
                } hover:bg-blue-50 transition-colors`}
              >
                <td className="px-4 py-2 text-center">{asesoria.id}</td>
                <td className="px-4 py-2 text-center">{asesoria.delegado}</td>
                <td className="px-4 py-2 text-center">
                  {asesoria.tipo_trabajo}
                </td>
                <td className="px-4 py-2 text-center">{asesoria.modalidad}</td>
                <td className="px-4 py-2 text-center">
                  {asesoria.profesion_asesoria}
                </td>
                <td className="px-4 py-2 text-center">
                  {formatDate(asesoria.fecha_inicio)}
                </td>
                <td className="px-4 py-2 text-center">
                  {formatDate(asesoria.fecha_fin)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Indicador visual opcional (móvil) */}
      <p className="text-xs text-gray-400 mt-2 text-center block md:hidden">
        🔹 Desliza horizontalmente para ver más columnas
      </p>
    </div>
  );
};

export default Activos;
