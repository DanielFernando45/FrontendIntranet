import LayoutApp from "../../layout/LayoutApp";
import portada from "../../assets/images/PortadaAsesor.png";
import Zoom from "../../assets/icons/IconEstudiante/ZoomLink.svg";
import { useState, useEffect } from "react";
import EnviosClientes from "../Asesor/EnviosCliente/EnviosCliente";

const HomeAsesor = () => {
  const [asesorias, setAsesorias] = useState([]);
  const [selectedAsesoriaId, setSelectedAsesoriaId] = useState(null);
  const [reuniones, setReuniones] = useState([]);

  const user = localStorage.getItem("user");
  const userData = JSON.parse(user);
  const NombreAsesor = userData.nombre;

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      const id = user.id_asesor;

      fetch(
        `${
          import.meta.env.VITE_API_PORT_ENV
        }/asesor/asesoramientosYDelegado/${id}`
      )
        .then((res) => res.json())
        .then((data) => {
          const asesoriasArray = Object.values(data).map((item) => ({
            id: item.id_asesoramiento,
            profesion: item.profesion_asesoria,
            delegado: item.delegado,
          }));
          setAsesorias(asesoriasArray);

          if (asesoriasArray.length > 0) {
            const primeraAsesoriaId = asesoriasArray[0].id;
            setSelectedAsesoriaId(primeraAsesoriaId);
          }
        })
        .catch((error) => console.error("Error al obtener asesorías:", error));
    }
  }, []);

  const handleChange = (e) => {
    const asesoriaId = e.target.value;
    setSelectedAsesoriaId(asesoriaId);
  };

  useEffect(() => {
    const ReunionReciente = async () => {
      try {
        if (selectedAsesoriaId) {
          const response = await fetch(
            `${
              import.meta.env.VITE_API_PORT_ENV
            }/reuniones/allReunionesProximas/${selectedAsesoriaId}`
          );
          const data = await response.json();
          setReuniones(data);
        }
      } catch (error) {
        console.error("Error al obtener las reuniones recientes:", error);
      }
    };
    ReunionReciente();
  }, [selectedAsesoriaId]);

  const formatFecha = (fechaString) => {
    const date = new Date(fechaString);
    const options = { month: "long" };
    // Extraer directamente la hora y minutos de la cadena ISO
    const timePart = fechaString.split("T")[1].substring(0, 5);

    return {
      mes: new Intl.DateTimeFormat("es-ES", options).format(date),
      dia: date.getUTCDate(),
      hora: timePart,
    };
  };

  const fecha = new Date();

  // Array de nombres de meses en español
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Extraemos día, mes y año
  const dia = fecha.getDate();
  const mes = meses[fecha.getMonth()]; // Obtenemos el nombre del mes
  const año = fecha.getFullYear();

  return (
    <LayoutApp>
      <main className="md:mx-8">
        {/* Portada Asesor */}
        <div className="flex flex-col xl:flex-row items-center justify-between bg-[#17162E] text-white rounded-2xl w-full shadow-lg overflow-hidden">
          {/* Texto */}
          <div className="flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-16 xl:px-[45px] py-6 sm:py-8 xl:py-6 w-full xl:w-1/2">
            <p className="text-[12px] sm:text-[16px] md:text-[18px] text-[#B5B5B5] mb-2">
              {dia} de {mes}, {año}
            </p>

            <h2 className="text-[16px] sm:text-[22px] md:text-[26px] lg:text-[28px] xl:text-[24px] font-semibold leading-tight">
              Bienvenido {NombreAsesor} al Intranet de asesoría de tesis
            </h2>

            <p className="text-[11px] sm:text-[14px] md:text-[16px] xl:text-[15px] text-[#B5B5B5] mt-2">
              Aquí encontrarás todas las herramientas que vas a utilizar
            </p>
          </div>

          {/* Imagen */}
          <div className="w-full xl:w-1/2 h-[180px] sm:h-[220px] md:h-[250px] xl:h-[280px]">
            <img
              src={portada}
              alt="Graduación"
              className="w-full h-full object-cover rounded-b-2xl xl:rounded-r-2xl xl:rounded-b-none"
            />
          </div>
        </div>

        <div className="flex flex-col xl:flex-row   mt-4 justify-between">
          {/*Envio Asesor*/}
          <div className="bg-[#F5F5F5] rounded-xl p-4 mt-5 w-full xl:w-[780px] 1xl:w-[863px] 2xl:w-[1050px] 3xl:w-[1150px] 4xl:w-[1250px] 6xl:w-[1450px]">
            <div className="flex justify-between">
              <h2 className=" sm:text-2xl  font-semibold">
                Ultimos Envios del Cliente
              </h2>
            </div>

            <div>
              <EnviosClientes idAsesoramiento={selectedAsesoriaId} />
            </div>
          </div>

          {/*Reuniones */}
          <div className="xl:ml-[45px] w-full flex flex-col gap-5 mt-5 xl:w-[350px] 2xl:w-[500px]">
            <select
              className="border-2 rounded-md px-2 border-black "
              onChange={handleChange}
              value={selectedAsesoriaId || ""}
            >
              {asesorias.map((asesoria, index) => (
                <option key={index} value={asesoria.id}>
                  {asesoria.delegado}
                </option>
              ))}
            </select>

            <div className="bg-[#F5F5F5] rounded-xl p-4 h-[280px] overflow-auto ">
              <div className=" flex justify-between ">
                <h2 className="sm:text-2xl font-semibold ">Reuniones</h2>
              </div>

              {reuniones.map((reunion) => (
                <div
                  key={reunion.id}
                  className="flex w-auto mt-4 h-auto mn:w-[300px] mn:h-[150px] md:h-[200px] xl:h-[130px] 1xl:h-[200px] md:w-[400px] mx-auto lg:w-auto items-center"
                >
                  {/* Fecha y Hora */}
                  <div className="flex flex-col h-full justify-between gap-4 items-center rounded-l-xl w-[80px] mn:w-[104px] bg-[#17162E] p-4 text-white">
                    <div className="flex flex-col justify-center items-center gap-3">
                      <p className="text-xs md:text-sm uppercase text-[#B1B1B1]">
                        {formatFecha(reunion.fecha_reunion).mes}
                      </p>
                      <p className="text-lg md:text-xl font-bold text-white">
                        {formatFecha(reunion.fecha_reunion).dia}
                      </p>
                    </div>
                    <p className="text-xs md:text-sm text-[#B1B1B1]">
                      {formatFecha(reunion.fecha_reunion).hora}
                    </p>
                  </div>

                  {/* Contenedor de contenido */}
                  <div className="flex flex-col h-full flex-1 gap-3 bg-white p-4 justify-between rounded-r-xl shadow-sm">
                    <p className="text-sm md:text-base text-[#333333] text-center">
                      {reunion.delegado}
                    </p>

                    {/* Botón de Enlace Zoom */}
                    <button className="flex gap-3 justify-between px-4 h-10 md:h-12 items-center text-white rounded-lg bg-[#1271ED] hover:bg-[#1E85F6] transition-colors">
                      <a
                        href={reunion.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex justify-between items-center"
                      >
                        <p className="font-medium text-xs md:text-sm">
                          Enlace Zoom
                        </p>
                        <img src={Zoom} alt="Zoom" className="w-5 h-5" />
                      </a>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </LayoutApp>
  );
};

export default HomeAsesor;
