import React, { useEffect, useState } from "react";
import LayoutApp from "../../../layout/LayoutApp";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditarAsesor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    area: "",
    especialidad: "",
    universidad: "",
    gradoAcademico: null,
    email: "",
    telefono: null,
    dni: "",
    url_imagen: "",
  });

  // Obtener datos
  useEffect(() => {
    const fetchAsesor = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_PORT_ENV}/asesor/${id}`
        );
        const asesor = response.data;
        setFormData({
          ...asesor,
          area: asesor.area?.id || "",
          gradoAcademico: asesor.gradoAcademico?.id || "",
        });
      } catch (error) {
        console.error("Error al obtener datos del asesor:", error);
      }
    };
    fetchAsesor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ["telefono", "gradoAcademico"].includes(name)
      ? parseInt(value) || ""
      : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleGuardar = async () => {
    const payload = {
      dni: formData.dni,
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      url_imagen: formData.url_imagen,
      area: formData.area,
      especialidad: formData.especialidad,
      gradoAcademico: formData.gradoAcademico,
      universidad: formData.universidad,
    };

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_PORT_ENV}/asesor/update/${id}`,
        payload
      );
      alert("Asesor actualizado correctamente");
      navigate("/jefe-operaciones/gestionar-usuarios/listar-asesores");
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("Error al actualizar asesor.");
    }
  };

  const handlerAtras = () => {
    navigate("/jefe-operaciones/gestionar-usuarios/listar-asesores");
  };

  return (
    <LayoutApp>
      <main className="px-4 md:px-20 py-10">
        <div className="fondo_login rounded-t-[20px] w-full h-14"></div>

        <div className="flex flex-col gap-10 pb-12 pt-8 w-full h-full px-5 bg-white rounded-b-[20px]">
          {/* Nombre y Apellido */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <p>Nombres</p>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <p>Apellidos</p>
              <input
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Apellido"
                className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
              />
            </div>
          </div>

          {/* Área y Especialidad */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <p>Área</p>
              <select
                name="area"
                value={formData.area || ""}
                onChange={handleChange}
                className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
              >
                <option value="">Seleccione Área</option>
                <option value="145b58f1-b41f-4eeb-a196-a01fa9f43aa7">
                  Salud
                </option>
                <option value="58e1231d-180a-4c6c-add1-990af1dcf4f7">
                  Negocio
                </option>
                <option value="d307e9b1-9f62-40ba-989e-e9f7d4344324">
                  Social
                </option>
                <option value="daf3c634-7cc7-4a99-a002-dddf4f7864e8">
                  Legal
                </option>
                <option value="f0551441-7c5d-4765-aa3d-35530497250d">
                  Ingeniería
                </option>
              </select>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <p>Especialidad</p>
              <input
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                placeholder="Especialidad"
                className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
              />
            </div>
          </div>

          {/* Universidad y Nivel educativo */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <p>Universidad</p>
              <input
                name="universidad"
                value={formData.universidad}
                onChange={handleChange}
                placeholder="Universidad"
                className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <p>Nivel educativo</p>
              <select
                name="gradoAcademico"
                value={formData.gradoAcademico || ""}
                onChange={handleChange}
                className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
              >
                <option value="">Seleccione nivel</option>
                <option value={1}>Estudiante Pregrado</option>
                <option value={2}>Bachiller</option>
                <option value={3}>Titulado</option>
                <option value={4}>Maestría</option>
                <option value={5}>Doctorado</option>
              </select>
            </div>
          </div>

          {/* Email y Teléfono */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <p>Correo electrónico</p>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo"
                className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <p>Teléfono</p>
              <input
                name="telefono"
                value={formData.telefono || ""}
                onChange={handleChange}
                placeholder="Teléfono"
                className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
              />
            </div>
          </div>

          {/* DNI y Botones */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <p>DNI</p>
              <input
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="DNI"
                className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
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
                className="h-[46px] w-full md:w-[180px] fondo_login text-white rounded-lg flex justify-center items-center"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </main>
    </LayoutApp>
  );
};

export default EditarAsesor;
