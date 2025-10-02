import React, { useState, useEffect } from "react";
import { ClipboardX } from "lucide-react";

const Desactivados = () => {
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
          }/asesoramiento/misAsesoriasInactivas/${id}`
        );

        if (!response.ok) {
          throw new Error("No tienes asesorías inactivas");
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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Cargando asesorías inactivas...
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center h-64">{error}</div>;
  }

  if (asesorias.length === 0) {
    return (
      <div className="flex flex-col bg-white rounded-xl justify-center items-center h-64 gap-4 text-[#82777A]">
        <ClipboardX className="w-12 h-12 text-slate-800 font-medium" />{" "}
        <p className="text-sm font-medium">No tienes asesorías inactivas</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-2 overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Encabezados */}
        <div className="flex justify-between text-[#495D72] font-medium p-[6px] rounded-md">
          <div className="flex-1 min-w-[60px]">ID</div>
          <div className="flex-1 min-w-[150px]">Delegado</div>
          <div className="flex-1 min-w-[150px] text-center">Asesoría</div>
          <div className="flex-1 min-w-[150px] text-center">F. inicio</div>
          <div className="flex-1 min-w-[150px] text-center">F. vencimiento</div>
          <div className="flex-1 min-w-[120px] text-center">Reuniones</div>
        </div>

        {/* Filas */}
        {asesorias.map((asesoria, index) => (
          <div
            key={asesoria.id}
            className={`flex justify-between text-[#2B2829] font-normal ${
              index % 2 === 0 ? "bg-white" : "bg-[#E9E7E7]"
            } p-[6px] rounded-md`}
          >
            <div className="flex-1 min-w-[60px]">{asesoria.id}</div>
            <div className="flex-1 min-w-[150px] truncate">
              {asesoria.delegado}
            </div>
            <div className="flex-1 min-w-[150px] text-center truncate">
              {asesoria.profesion_asesoria}
            </div>
            <div className="flex-1 min-w-[150px] text-center">
              {formatDate(asesoria.fecha_inicio)}
            </div>
            <div className="flex-1 min-w-[150px] text-center">
              {formatDate(asesoria.fecha_fin)}
            </div>
            <div className="flex-1 min-w-[120px] border-[#1C1C34] border rounded-md px-2 text-center text-[#1C1C34] cursor-not-allowed">
              Finalizada
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Desactivados;
