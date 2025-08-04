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
        setAsesores(() => {
          return response.data;
        });
        setTodosLosAsesores(response.data);
      } catch (error) {
        console.error("Error al obtener los asesores:", error);
      }
    };
    fetchAsesores();
  }, []);

  const handleBuscar = async (query) => {
    try {
      const q = query.toLowerCase();
      const resultados = todosLosAsesores.filter(
        (asesor) =>
          asesor.id?.toString().includes(q) ||
          asesor.dni?.toLowerCase().includes(q) ||
          `${asesor.nombre} ${asesor.apellido}`.toLowerCase().includes(q)
      );
      setAsesores(resultados);
    } catch (error) {
      console.error("Error durante la búsqueda:", error);
    }
  };

  const handleReset = () => {
    setAsesores(todosLosAsesores);
  };

  const handlerAgregarAsesor = () => {
    navigate("/admin/gestionar-usuarios/agregar-asesor");
  };

  const handleEditarAsesor = (id) => {
    navigate(`/admin/gestionar-usuarios/editar-asesor/${id}`);
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
      <div className="flex flex-col gap-[12px]">
        <div className="flex justify-start">
          <h2 className="text-2xl font-bold">CRUD</h2>
        </div>
        <Buscar onBuscar={handleBuscar} onReset={handleReset} />
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between text-[#495D72] font-medium p-[6px] rounded-md">
          <div className="w-[40px] flex justify-center">ID</div>
          <div className="w-[300px] flex justify-center">Asesor</div>
          <div className="w-[150px] flex justify-center">Área</div>
          <div className="w-[250px] flex justify-center">Especialidad</div>
          <div className="w-[250px] flex justify-center">Universidad</div>
          <div className="w-[110px] flex justify-center">Editar</div>
          <div className="w-[110px] flex justify-center">Eliminar</div>
        </div>

        {asesores.map((asesor, index) => (
          <div
            key={asesor.id}
            className={`flex justify-between items-center text-[#2B2829] font-normal p-[6px] rounded-md ${
              index % 2 === 0 ? "bg-white" : "bg-[#E9E7E7]"
            }`}
          >
            <div className="w-[40px] flex justify-center">{asesor?.id}</div>
            <div className="w-[300px] flex justify-start">
              {asesor?.nombre} {asesor?.apellido}
            </div>
            <div className="w-[150px] flex justify-center">
              {asesor?.areaAsesor.nombre}
            </div>
            <div className="w-[250px] flex justify-start">
              {asesor?.especialidad}
            </div>
            <div className="w-[250px] flex justify-start">
              {asesor?.universidad}
            </div>
            <button
              onClick={() => handleEditarAsesor(asesor?.id)}
              className="w-[110px] rounded-md px-3 py-1 bg-[#1C1C34] flex justify-center text-white"
            >
              Editar
            </button>
            <button
              onClick={() => handleEliminarAsesor(asesor.id)}
              className="w-[110px] rounded-md px-3 py-1 bg-[#8F1313] flex justify-center text-white"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handlerAgregarAsesor}
        className="block text-white w-[230px] h-8 rounded font-semibold bg-[#1B435D] text-center py-1 mt-5"
      >
        <p>Agregar Asesor</p>
      </button>
    </>
  );
};

export default ListarAsesor;
