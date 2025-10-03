import React, { useRef, useEffect, useState } from "react";
import toast from "react-hot-toast";
const CrearZoom = ({ Close, idAsesoramiento, delegado }) => {
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    titulo: "",
    fecha: "",
    hora: "",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        Close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [Close]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulo || !formData.fecha || !formData.hora) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const idAsesor = user.id_asesor;
      const fecha_reunion = `${formData.fecha}T${formData.hora}:00`;

      const reunionData = {
        titulo: formData.titulo,
        fecha_reunion,
        id_asesoramiento: idAsesoramiento,
        id_asesor: idAsesor,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_PORT_ENV}/reuniones/crear-reunion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reunionData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear la reunión");
      }

      const data = await response.json();
      console.log("Reunión creada:", data);

      toast.success("Zoom creado correctamente ✅");
      Close();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Error al crear la reunión. Intenta nuevamente ❌");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={modalRef}
        className="relative w-[90%] sm:w-[600px] bg-[#F8F7F7] rounded-xl p-4 py-10 flex flex-col gap-5"
      >
        <button
          onClick={Close}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold p-1"
          aria-label="Cerrar"
        >
          ×
        </button>

        <h1 className="font-medium text-center">Agregar reunión</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 mb-10 w-full px-4 sm:px-10"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-10 sm:gap-14 font-medium">
            <p className="w-full sm:w-auto">Tema: </p>
            <input
              type="text"
              name="titulo"
              placeholder="Inserte el Tema"
              className="w-full sm:w-[350px] p-1 rounded-lg px-3"
              value={formData.titulo}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-10 sm:gap-14 font-medium">
            <p className="w-full sm:w-auto">Delegado: </p>
            <input
              type="text"
              placeholder={delegado}
              className="w-full sm:w-[350px] p-1 rounded-lg px-3 bg-gray-100"
              disabled
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-10 sm:gap-14 font-medium">
            <p className="w-full sm:w-auto">Fecha: </p>
            <input
              type="date"
              name="fecha"
              placeholder="Elija Fecha"
              className="w-full sm:w-[350px] rounded-lg px-3 p-1"
              value={formData.fecha}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-10 sm:gap-14 font-medium">
            <p className="w-full sm:w-auto">Hora: </p>
            <input
              type="time"
              name="hora"
              placeholder="Inserte Hora"
              className="w-full sm:w-[350px] rounded-lg px-3 p-1"
              value={formData.hora}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="px-6 rounded-md p-2 bg-[#E9E7E7] hover:bg-[#D1CFCF] self-center mt-4"
          >
            Agregar Zoom
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearZoom;
