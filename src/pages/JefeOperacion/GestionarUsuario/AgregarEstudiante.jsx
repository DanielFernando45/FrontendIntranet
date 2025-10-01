import React, { useState } from "react";
import LayoutApp from "../../../layout/LayoutApp";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AgregarEstudiante = () => {
  const navigate = useNavigate();

  const [clienteData, setClienteData] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    telefono: null,
    email: "",
    pais: "",
    gradoAcademico: null,
    universidad: "",
    carrera: "",
  });

  const handlerAtras = () => {
    navigate("/jefe-operaciones/gestionar-usuarios");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ["telefono", "gradoAcademico"].includes(name)
      ? parseInt(value) || ""
      : value;

    setClienteData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_PORT_ENV}/cliente/add`,
        clienteData
      );
      toast.success("Cliente añadido exitosamente ✅");
      navigate("/jefe-operaciones/gestionar-usuarios");
    } catch (error) {
      console.error("Error al añadir estudiante:", error);
      toast.error("❌ Error al guardar estudiante. Revisa los datos.");
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
                  value={clienteData.nombre}
                  onChange={handleChange}
                  placeholder="Ingrese nombres"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                />
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>Apellidos</p>
                <input
                  name="apellido"
                  value={clienteData.apellido}
                  onChange={handleChange}
                  placeholder="Ingrese apellidos"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                />
              </div>
            </div>

            {/* Teléfono y DNI */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>Teléfono</p>
                <input
                  name="telefono"
                  value={clienteData.telefono || ""}
                  onChange={handleChange}
                  placeholder="Agregar Teléfono"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                />
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>DNI</p>
                <input
                  name="dni"
                  value={clienteData.dni}
                  onChange={handleChange}
                  placeholder="Ingrese DNI"
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
                  value={clienteData.universidad}
                  onChange={handleChange}
                  placeholder="Ingresar Universidad"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                />
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>Grado Académico</p>
                <select
                  name="gradoAcademico"
                  value={clienteData.gradoAcademico || ""}
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

            {/* Email y País */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>Correo electrónico</p>
                <input
                  name="email"
                  value={clienteData.email}
                  onChange={handleChange}
                  placeholder="Ingrese correo"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                />
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>País</p>
                <input
                  name="pais"
                  value={clienteData.pais}
                  onChange={handleChange}
                  placeholder="Ingrese país"
                  className="bg-[#F9F9F9] w-full h-[49px] rounded-lg text-[#808080] p-4"
                />
              </div>
            </div>

            {/* Carrera y Botones */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <p>Carrera</p>
                <input
                  name="carrera"
                  value={clienteData.carrera}
                  onChange={handleChange}
                  placeholder="Ingrese la Carrera"
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

export default AgregarEstudiante;
