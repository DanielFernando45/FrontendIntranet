import React, { useEffect, useState } from "react";
import LayoutApp from "../../../layout/LayoutApp";
import perfil from "../../../assets/icons/PerfilIcon.svg";
import Diana from "../../../assets/PerfilAsesores/Diana.png";
import Victor from "../../../assets/PerfilAsesores/Victor.png";
import Antony from "../../../assets/PerfilAsesores/Antony.png";
import Daniel from "../../../assets/PerfilAsesores/DanielDominguez.png";
import Olenka from "../../../assets/PerfilAsesores/Olenka.jpg";
import Brenda from "../../../assets/PerfilAsesores/Brenda.jpg";
import Haider from "../../../assets/PerfilAsesores/Haider.png";
import Lidia from "../../../assets/PerfilAsesores/Lidia.png";
import Hebert from "../../../assets/PerfilAsesores/Heber.jpeg";
import Christian from "../../../assets/PerfilAsesores/Christian.jpeg";

const MiAsesor = () => {
  const [asesorias, setAsesorias] = useState([]);
  const [asesor, setAsesor] = useState(null);
  const [selectedAsesoriaId, setSelectedAsesoriaId] = useState(null);

  //  Obtener usuario desde localStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const idCliente = user?.id_cliente;

  //  Relación de asesores con imágenes por nombre
  const verAsesor = [
    { nombre: "Diana Alexandra", imagen: Diana },
    { nombre: "Victor Alfonso", imagen: Victor },
    {nombre :"Hebert Wilder", imagen: Hebert},
    {nombre :"Christian Alexis", imagen:Christian},
    { nombre: "Antony", imagen: Antony },
    { nombre: "Brenda Lucia", imagen: Brenda },
    { nombre: "Olenka Ethel", imagen: Olenka },
    { nombre: "Daniel Emmerson", imagen: Daniel },
    { nombre: "Haider Dante", imagen: Haider },
    { nombre: "Lidia Balbina", imagen: Lidia },
  ];

  // 🔹 Obtener asesorías al cargar el componente
  useEffect(() => {
    if (!idCliente) return;

    fetch(
      `${
        import.meta.env.VITE_API_PORT_ENV
      }/cliente/miAsesoramiento/${idCliente}`
    )
      .then((res) => res.json())
      .then((data) => {
        const asesoriasArray = Object.values(data).map((item) => ({
          id: item.id,
          profesion: item.profesion_asesoria,
        }));
        setAsesorias(asesoriasArray);

        if (asesoriasArray.length > 0) {
          const primeraAsesoriaId = asesoriasArray[0].id;
          setSelectedAsesoriaId(primeraAsesoriaId);
          obtenerDatosAsesor(primeraAsesoriaId);
        }
      })
      .catch((error) => console.error("Error al obtener asesorías:", error));
  }, [idCliente]);

  // 🔹 Función para obtener el asesor
  const obtenerDatosAsesor = (asesoriaId) => {
    fetch(`${import.meta.env.VITE_API_PORT_ENV}/cliente/asesor/${asesoriaId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return res.json();
      })
      .then((data) => {
        setAsesor(data);
      })
      .catch((error) => {
        console.error("Error al obtener datos del asesor:", error);
      });
  };

  // 🔹 Manejo de cambio de selección
  const handleChange = (e) => {
    const asesoriaId = e.target.value;
    setSelectedAsesoriaId(asesoriaId);
    obtenerDatosAsesor(asesoriaId);
  };

  // 🔹 Obtener imagen del asesor por nombre o fallback
  const getImagenAsesor = (nombre) => {
    const encontrado = verAsesor.find((a) => a.nombre === nombre);
    return encontrado ? encontrado.imagen : perfil;
  };

  return (
    <LayoutApp>
      <main className="lg:m-5">
        <div className="fondo_login rounded-t-[20px] w-full h-14 shadow-xl"></div>
        <div className="shadow-xl flex flex-col items-center gap-[22px] w-full h-full p-5 bg-white rounded-b-[20px]">
          <div className="flex justify-start w-full">
            <select
              className="w-full max-w-xs px-4 py-2 text-[15px] rounded-lg border border-gray-300 bg-white text-gray-700 
               shadow-sm focus:outline-none focus:ring-2 
               transition duration-200 ease-in-out cursor-pointer "
              onChange={handleChange}
              value={selectedAsesoriaId || ""}
            >
              {asesorias.map((asesoria) => (
                <option key={asesoria.id} value={asesoria.id}>
                  {asesoria.profesion}
                </option>
              ))}
            </select>
          </div>

          <h1 className="text-xl font-medium">Mi asesor</h1>

          {/* Imagen del asesor */}
          <img
            src={getImagenAsesor(asesor?.nombre)}
            alt="Asesor"
            className="w-[240px] h-[240px] rounded-full object-cover"
          />

          {/* Datos del asesor */}
          {asesor ? (
            <div className="text-center">
              <h1 className="text-xl font-medium">
                {asesor.nombre} {asesor.apellido}
              </h1>

            </div>
          ) : (
            <p className="text-gray-500">
              No hay Asesor disponible para esta asesoría.
            </p>
          )}
        </div>
      </main>
    </LayoutApp>
  );
};

export default MiAsesor;
