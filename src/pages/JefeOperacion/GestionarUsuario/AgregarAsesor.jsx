import React, { useState } from "react";
import LayoutApp from "../../../layout/LayoutApp";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AgregarAsesor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    area: "",
    especialidad: "",
    universidad: "",
    gradoAcademico: null, // numérico
    email: "",
    url_imagen: "",
    telefono: null, // numérico
    dni: "",
  });

  const handlerAtras = () => {
    navigate("/jefe-operaciones/gestionar-usuarios/listar-asesores");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ["telefono", "gradoAcademico"].includes(name)
      ? parseInt(value) || ""
      : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_PORT_ENV}/asesor/add`,
        formData
      );
      alert("Asesor añadido exitosamente");
      navigate("/jefe-operaciones/gestionar-usuarios/listar-asesores");
    } catch (error) {
      console.error("Error al añadir asesor:", error);
      alert("Error al guardar asesor. Revisa los datos.");
    }
  };

  return (
    <LayoutApp>
      <main className="px-4 md:px-20 py-10">
        <div className="fondo_login rounded-t-[20px] w-full h-14"></div>

        <div className="flex flex-col gap-10 pb-12 pt-8 w-full h-full px-5 bg-white rounded-b-[20px]">
          <div className="flex flex-col gap-6">
            {/* Nombre y Apellido */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>Nombres</p>
                <input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ingrese nombres"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                />
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>Apellidos</p>
                <input
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Ingrese apellidos"
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
                  placeholder="Ingrese especialidad"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                />
              </div>
            </div>

            {/* Universidad y Grado Académico */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>Universidad</p>
                <input
                  name="universidad"
                  value={formData.universidad}
                  onChange={handleChange}
                  placeholder="Ingrese universidad"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                />
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>Grado Académico</p>
                <select
                  name="gradoAcademico"
                  value={formData.gradoAcademico || ""}
                  onChange={handleChange}
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                >
                  <option value="">Seleccione nivel</option>
                  <option value={1}>Estudiante Pregrado</option>
                  <option value={2}>Bachiller</option>
                  <option value={3}>Licenciado</option>
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
                  placeholder="Ingrese correo"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                />
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>Teléfono</p>
                <input
                  name="telefono"
                  type="number"
                  value={formData.telefono || ""}
                  onChange={handleChange}
                  placeholder="Ingrese teléfono"
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
                  placeholder="Ingrese DNI"
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
                  onClick={handleSubmit}
                  className="h-[46px] w-full md:w-[180px] fondo_login text-white rounded-lg flex justify-center items-center"
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </LayoutApp>
  );
};

export default AgregarAsesor;
