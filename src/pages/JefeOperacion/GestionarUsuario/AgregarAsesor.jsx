import React, { useState } from "react";
import LayoutApp from "../../../layout/LayoutApp";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AgregarAsesor = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    area: "",
    especialidad: "",
    universidad: "",
    gradoAcademico: null,
    email: "",
    url_imagen: "",
    telefono: null,
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
    if (isSubmitting) return; // 🚫 Previene clicks dobles
    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false); // ✅ Reactiva el botón al terminar
    }
  };

  return (
    <LayoutApp>
      <main className="px-4 md:px-20 py-10">
        <div className="fondo_login rounded-t-[20px] w-full h-14"></div>

        <div className="flex flex-col gap-10 pb-12 pt-8 w-full h-full px-5 bg-white rounded-b-[20px]">
          <div className="flex flex-col gap-6">
            {/* ...campos del formulario iguales... */}

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
                  disabled={isSubmitting} // ⛔ Deshabilita durante envío
                  className={`h-[46px] w-full md:w-[180px] fondo_login text-white rounded-lg flex justify-center items-center ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Añadiendo..." : "Añadir"}
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
