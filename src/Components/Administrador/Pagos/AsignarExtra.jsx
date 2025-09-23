import React, { useState, useEffect, useRef } from "react";
import busqueda from "../../../assets/icons/busqueda.svg";

const AsignarExtra = ({ close }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [allAlumnos, setAllAlumnos] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    titulo: "",
    pago_total: "",
    fecha_pago: "",
    id_asesoramiento: "",
  });

  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_API_PORT_ENV
      }/asesoramiento/ListarContratosAsignados`
    )
      .then((response) => response.json())
      .then((data) => {
        setAllAlumnos(data);
        setSearchResults(data);
      })
      .catch((error) => console.error("Error fetching data:", error));

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
  };

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResults(allAlumnos);
    } else {
      const filtered = allAlumnos.filter(
        (item) =>
          (item.id_asesoramiento &&
            item.id_asesoramiento.toString().includes(searchTerm)) ||
          item.delegado.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchTerm, allAlumnos]);

  const handleSelectAlumno = (alumno) => {
    setSelectedAlumno(alumno);
    setSearchTerm(`${alumno.delegado} (ID: ${alumno.id_asesoramiento})`);
    setFormData((prev) => ({
      ...prev,
      id_asesoramiento: alumno.id_asesoramiento,
    }));
    setShowResults(false);
  };

  const handleInputFocus = () => setShowResults(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "search") {
      setSearchTerm(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3001/pagos/otrosServicios",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: formData.titulo,
            pago_total: parseFloat(formData.pago_total),
            fecha_pago: formData.fecha_pago
              ? `${formData.fecha_pago} 00:00:00`
              : null,
            id_asesoramiento: parseInt(formData.id_asesoramiento),
          }),
        }
      );

      if (response.ok) {
        alert("Servicio extra agregado correctamente");
        close();
        window.location.reload();
      } else {
        throw new Error("Error al agregar el servicio");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al agregar el servicio");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-lg md:max-w-2xl lg:max-w-3xl p-6 relative">
        <h1 className="text-xl font-semibold mb-4">Asignar servicios extra</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Alumno */}
          <div className="flex flex-col gap-2 relative">
            <label className="font-medium">Alumno:</label>
            <div className="flex items-center bg-[#E4E2E2] rounded-md px-2 py-1">
              <input
                ref={inputRef}
                className="bg-transparent flex-1 focus:outline-none text-black placeholder:text-[#888]"
                type="text"
                name="search"
                placeholder="Buscar por IdAsesoria o nombre..."
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onClick={handleInputFocus}
              />
              <img src={busqueda} alt="Buscar" />
            </div>

            {showResults && searchResults.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute top-full mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg z-20"
              >
                {searchResults.map((alumno) => (
                  <div
                    key={alumno.id_asesoramiento}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectAlumno(alumno)}
                  >
                    <div className="font-medium">{alumno.delegado}</div>
                    <div className="text-sm">
                      ID: {alumno.id_asesoramiento} - {alumno.tipo_trabajo}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Servicio */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Servicio:</label>
            <input
              name="titulo"
              placeholder="Digite el Servicio extra"
              className="rounded-md text-[#1C1C34] w-full bg-[#E9E7E7] px-3 py-2 font-medium"
              value={formData.titulo}
              onChange={handleInputChange}
              required
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
              onClick={close}
              className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AsignarExtra;
