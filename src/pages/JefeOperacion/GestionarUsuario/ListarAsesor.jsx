import React, { useEffect, useState } from "react";
import Buscar from "../../../Components/Administrador/GestionarUsuario/Buscar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ListarAsesor = () => {
  const navigate = useNavigate();
  const [asesores, setAsesores] = useState([]);
  const [todosLosAsesores, setTodosLosAsesores] = useState([]);

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
    if (!window.confirm("¿Estás seguro que deseas eliminar este asesor?"))
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_PORT_ENV}/asesor/delete/${id}`
      );
      const nuevosAsesores = asesores.filter((asesor) => asesor.id !== id);
      setAsesores(nuevosAsesores);
      setTodosLosAsesores(nuevosAsesores);
    } catch (error) {
      console.error("Error al eliminar el asesor:", error);
      alert("Ocurrió un error al eliminar el asesor.");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">CRUD</h2>
        <Buscar onBuscar={handleBuscar} onReset={handleReset} />
      </div>

      {/* Scroll horizontal en móviles */}
      <div className="overflow-x-auto mt-4">
        <div className="min-w-[700px]">
          {/* Encabezado */}
          <div className="grid grid-cols-7 text-[#495D72] font-medium p-2 rounded-md bg-gray-100">
            <div className="text-center">ID</div>
            <div className="text-center">Asesor</div>
            <div className="text-center">Área</div>
            <div className="text-center">Especialidad</div>
            <div className="text-center">Universidad</div>
            <div className="text-center">Editar</div>
            <div className="text-center">Eliminar</div>
          </div>

          {/* Filas */}
          {asesores.map((asesor, index) => (
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
              <button
                onClick={() => handleEditarAsesor(asesor?.id)}
                className="rounded-md px-2 py-1 bg-[#1C1C34] text-white text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminarAsesor(asesor.id)}
                className="rounded-md px-2 py-1 bg-[#8F1313] text-white text-sm"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Botón agregar */}
      <div className="flex justify-center mt-5">
        <button
          onClick={handlerAgregarAsesor}
          className="text-white w-full sm:w-[230px] h-10 rounded font-semibold bg-[#1B435D] text-center"
        >
          Agregar Asesor
        </button>
      </div>
    </>
  );
};

export default ListarAsesor;
