import React, { useState, useEffect, useRef } from "react";
import busqueda from "../../../assets/icons/busqueda.svg";
import toast from "react-hot-toast";

const EditarExtra = ({ closeEdit, servicio }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allAlumnos, setAllAlumnos] = useState([]);
  const [formData, setFormData] = useState({
    titulo: "",
    pago_total: "",
    fecha_pago: "",
    id_asesoramiento: "",
  });

  useEffect(() => {
    if (servicio) {
      setFormData({
        titulo: servicio.titulo,
        pago_total: servicio.pago_total,
        fecha_pago: servicio.fecha_pago?.split("T")[0] || "",
        id_asesoramiento: servicio.id_asesoramiento,
      });
      setSearchTerm(`${servicio.delegado} (ID: ${servicio.id_asesoramiento})`);
    }
  }, [servicio]);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_PORT_ENV}/asesoramiento/delegadosToServicios`
    )
      .then((response) => response.json())
      .then((data) => setAllAlumnos(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/pagos/updateServicios/${servicio.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: formData.titulo,
            pago_total: parseFloat(formData.pago_total),
            fecha_pago: formData.fecha_pago
              ? `${formData.fecha_pago} 00:00:00`
              : null,
          }),
        }
      );

      if (response.ok) {
        toast.success("Servicio actualizado correctamente");
        closeEdit();
        setTimeout(() => window.location.reload(), 1000); // 👈 da tiempo al toast
      } else {
        throw new Error("Error al actualizar el servicio");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Hubo un error al actualizar el servicio ❌");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-lg md:max-w-2xl lg:max-w-3xl p-6 relative">
        <h1 className="text-xl font-semibold mb-4">Editar servicios extra</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Alumno */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Alumno:</label>
            <div className="flex items-center bg-[#E4E2E2] rounded-md px-2 py-1">
              <input
                className="bg-transparent flex-1 focus:outline-none text-black placeholder:text-[#888]"
                type="text"
                name="search"
                value={searchTerm}
                disabled
              />
              <img src={busqueda} alt="Buscar" />
            </div>
          </div>

          {/* Servicio */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Servicio:</label>
            <input
              name="titulo"
              className="rounded-md text-[#AAA3A5] w-full bg-[#E9E7E7] px-3 py-2 font-medium"
              value={formData.titulo}
              disabled
            />
          </div>

          {/* Monto y Fecha */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col flex-1 gap-2">
              <label className="font-medium">Monto:</label>
              <input
                name="pago_total"
                type="number"
                placeholder="Monto total"
                className="rounded-md text-[#1C1C34] w-full bg-[#E9E7E7] px-3 py-2 font-medium"
                value={formData.pago_total}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <label className="font-medium">Fecha Pago:</label>
              <input
                name="fecha_pago"
                type="date"
                className="rounded-md text-[#1C1C34] w-full bg-[#E9E7E7] px-3 py-2 font-medium"
                value={formData.fecha_pago}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={closeEdit}
              className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800"
            >
              Editar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarExtra;
