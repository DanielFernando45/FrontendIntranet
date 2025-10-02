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
    <div className="flex flex-col bg-white rounded-xl p-2">
      <div className="flex justify-between text-[#495D72] font-medium p-[6px] rounded-md">
        <div className="w-[100px] flex justify-center">IDAsesoria</div>
        <div className="w-[300px] flex justify-center">Delegado</div>
        <div className="w-[300px] flex justify-center">Tipo Trabajo</div>
        <div className="w-[300px] flex justify-center">Modalidad</div>
        <div className="w-[300px] flex justify-center">Referencia</div>
        <div className="w-[250px] flex justify-center">F.inicio</div>
        <div className="w-[250px] flex justify-center">F.vencimiento</div>
      </div>

      {asesorias.map((asesoria, index) => (
        <div
          key={asesoria.id}
          className={`flex justify-between text-[#2B2829] font-normal ${
            index % 2 === 0 ? "bg-white" : "bg-[#E9E7E7]"
          } p-[6px] rounded-md text-[14px]`}
        >
          <div className="w-[100px] flex justify-center">{asesoria.id}</div>
          <div className="w-[300px] flex justify-center">
            {asesoria.delegado}
          </div>
          <div className="w-[300px] flex justify-center">
            {asesoria.tipo_trabajo}
          </div>
          <div className="w-[300px] flex justify-center">
            {asesoria.modalidad}
          </div>
          <div className="w-[300px] flex justify-center">
            {asesoria.profesion_asesoria}
          </div>
          <div className="w-[250px] flex justify-center">
            {formatDate(asesoria.fecha_inicio)}
          </div>
          <div className="w-[250px] flex justify-center">
            {formatDate(asesoria.fecha_fin)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Activos;
