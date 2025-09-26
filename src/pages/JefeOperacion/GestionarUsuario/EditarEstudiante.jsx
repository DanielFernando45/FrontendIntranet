import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LayoutApp from "../../../layout/LayoutApp";
import axios from "axios";

const EditarEstudiante = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [estudianteData, setEstudianteData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    dni: "",
    carrera: "",
    gradoAcademico: "",
    universidad: "",
    pais: "",
    email: "",
  });

  useEffect(() => {
    const fetchEstudiante = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_PORT_ENV}/cliente/${id}`
        );
        const estudiante = response.data;
        setEstudianteData({
          ...estudiante,
          gradoAcademico: estudiante.gradoAcademico?.id || "",
        });
      } catch (error) {
        console.log("Error al obtener datos del estudiante", error);
      }
    };
    fetchEstudiante();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ["gradoAcademico", "telefono"].includes(name)
      ? parseInt(value) || ""
      : value;
    setEstudianteData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handlerAtras = () => {
    navigate("/jefe-operaciones/gestionar-usuarios");
  };

  const handleGuardar = async () => {
    const payload = {
      nombre: estudianteData.nombre,
      apellido: estudianteData.apellido,
      telefono: estudianteData.telefono,
      dni: estudianteData.dni,
      carrera: estudianteData.carrera,
      gradoAcademico: estudianteData.gradoAcademico,
      universidad: estudianteData.universidad,
      pais: estudianteData.pais,
      email: estudianteData.email,
    };

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_PORT_ENV}/cliente/update/${id}`,
        payload
      );
      alert("Estudiante actualizado correctamente");
      navigate("/jefe-operaciones/gestionar-usuarios");
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("Error al actualizar estudiante.");
    }
  };

  return (
    <LayoutApp>
      <main className="px-4 md:px-20 py-10">
        <div className="rounded-t-[20px] w-full h-14 fondo_login"></div>

        <div className="flex flex-col gap-8 pb-12 pt-8 w-full h-full px-5 bg-white rounded-b-[20px]">
          <div className="flex flex-col gap-6">
            {/* Nombres y Apellidos */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>Nombres</p>
                <input
                  name="nombre"
                  placeholder="Nombre"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                  value={estudianteData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>Apellidos</p>
                <input
                  name="apellido"
                  placeholder="Apellido"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                  value={estudianteData.apellido}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Teléfono y DNI */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>Teléfono</p>
                <input
                  name="telefono"
                  placeholder="Teléfono"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                  value={estudianteData.telefono}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>DNI</p>
                <input
                  name="dni"
                  placeholder="DNI"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                  value={estudianteData.dni}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Carrera y Nivel educativo */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>Carrera</p>
                <input
                  name="carrera"
                  placeholder="Carrera"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                  value={estudianteData.carrera}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>Actual nivel educativo</p>
                <select
                  name="gradoAcademico"
                  value={estudianteData.gradoAcademico || ""}
                  onChange={handleChange}
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                >
                  <option value="">Seleccione Grado Académico</option>
                  <option value={1}>Estudiante Pregrado</option>
                  <option value={2}>Bachiller</option>
                  <option value={3}>Titulado</option>
                  <option value={4}>Maestría</option>
                  <option value={5}>Doctorado</option>
                </select>
              </div>
            </div>

            {/* Universidad y País */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>Universidad</p>
                <input
                  name="universidad"
                  placeholder="Universidad"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                  value={estudianteData.universidad}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>País</p>
                <input
                  name="pais"
                  placeholder="País"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                  value={estudianteData.pais}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Correo + Botones */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>Correo</p>
                <input
                  name="email"
                  placeholder="Correo"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                  value={estudianteData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2 justify-end">
                <button
                  onClick={handlerAtras}
                  className="h-[46px] w-full md:w-[180px] border border-black rounded-lg flex justify-center items-center"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardar}
                  className="h-[46px] w-full md:w-[180px] bg-[#1B435D] text-white rounded-lg flex justify-center items-center"
                >
                  Modificar
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </LayoutApp>
  );
};

export default EditarEstudiante;
