import React, { useState, useEffect, useRef } from "react";
import busqueda from "../../../assets/icons/busqueda.svg";

const AsignarExtra = ({ close }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [allAlumnos, setAllAlumnos] = useState([]);

  // Referencias para manejar clicks fuera
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Datos del formulario
  const [formData, setFormData] = useState({
    titulo: "",
    pago_total: "",
    fecha_pago: "",
    id_asesoramiento: "", // id_asesoramiento será el ID del alumno seleccionado
  });

  // Cargar todos los alumnos al montar el componente
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
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    // Agregar event listener para clicks fuera
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Limpiar event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Manejar clicks fuera del input y dropdown
  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
  };

  // Filtrar alumnos según término de búsqueda
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

  // Manejar selección de alumno
  const handleSelectAlumno = (alumno) => {
    setSelectedAlumno(alumno);
    setSearchTerm(`${alumno.delegado} (ID: ${alumno.id_asesoramiento})`);
    setFormData((prev) => ({
      ...prev,
      id_asesoramiento: alumno.id_asesoramiento,
    }));
    setShowResults(false);
  };

  // Manejar focus en el input
  const handleInputFocus = () => {
    setShowResults(true);
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "search") {
      setSearchTerm(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3001/pagos/otrosServicios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
    <div className="flex flex-col absolute gap-[15px] top-60 left-96 px-10 pt-12 w-[875px] rounded-lg bg-white border border-[#D2CECF]">
      <h1 className="text-xl font-medium">Asignar servicios extra</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-between">
          <div className="flex flex-col w-full h-[82px] gap-[15px] relative">
            <h2 className="font-medium">Alumno:</h2>
            <div className="flex gap-3 items-center">
              <div className="flex w-full h-8 rounded-md px-[10px] py-[6px] justify-between bg-[#E4E2E2] relative">
                <input
                  ref={inputRef}
                  className="bg-transparent w-full focus:outline-none text-black placeholder:text-[#888]"
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
            </div>

            {showResults && searchResults.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute z-10 top-[70px] w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg"
              >
                {searchResults.map((alumno) => (
                  <div
                    key={alumno.id_asesoramiento} // Aquí asignamos un key único
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
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col w-full h-[82px] gap-[15px]">
            <h2 className="font-medium">Servicio:</h2>
            <input
              name="titulo"
              placeholder="Digite el Servicio extra"
              className="flex items-center rounded-2xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium"
              value={formData.titulo}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="flex justify-between gap-[15px]">
          <div className="flex flex-col w-full h-[82px] gap-[15px]">
            <h2 className="font-medium">Monto:</h2>
            <input
              name="pago_total"
              type="number"
              placeholder="Monto total"
              className="flex items-center rounded-2xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium"
              value={formData.pago_total}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col w-full h-[82px] gap-[15px]">
            <h2 className="font-medium">Fecha Pago:</h2>
            <input
              name="fecha_pago"
              type="date"
              placeholder="Ingrese una fecha"
              className="flex items-center rounded-2xl text-[#1C1C34] w-full h-[43px] bg-[#E9E7E7] px-4 font-medium"
              value={formData.fecha_pago}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="flex w-full py-4 px-1 h-[68px] justify-end gap-4">
          <button
            type="button"
            onClick={close}
            className="h-7 w-[100px] border rounded-[4px] text-[11px] font-bold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="h-7 w-[100px] border bg-black rounded-[4px] text-[11px] font-bold text-white"
          >
            Agregar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AsignarExtra;
