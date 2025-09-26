import LayoutApp from "../../layout/LayoutApp";
import portada from "../../assets/images/PortadaAsesor.png";
import flechaAzul from "../../assets/icons/arrowAzul.svg";
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
        <div className="xl:relative xl:justify-end flex items-center relative flex-col xl:flex-row bg-[#17162E] text-white rounded-2xl w-full xl:h-[410px] shadow-lg">
          <div className="xl:absolute flex flex-col 5xl:justify-center  p-4 sm:p-9 md:p-12 lg:p-14 xl:p-10 xl:px-[55px] w-full md:h-full md:pt-7 lg:pt-14">
            <p className="text-[12px] sm:text-[18px] md:text-[22px] lg:text-[28px] xl:text-[20px] text-[#B5B5B5]">
              {dia} de {mes}, {año}
            </p>

            <div className="xl:w-[620px] 5xl:pt-20">
              <h2 className="text-[15px] sm:text-[25px] md:text-[30px] lg:text-[40px] xl:text-[30px] 1xl:text-[35px] font-semibold mt-2 md:mt-1">
                Bienvenido {NombreAsesor} al Intranet de asesoría de tesis
              </h2>
            </div>

            <p className="text-[10px] sm:text-[15px] md:text-[20px] lg:text-[25px] xl:text-[17px] 1xl:text-[20px] text-[#B5B5B5] mt-4 xl:mt-3">
              Aquí encontraras todas las herramientas que vas a utilizar
            </p>
          </div>

          {/* Imagen móvil */}
          <img
            src={portada}
            alt="Graduación"
            className="rounded-b-xl w-full h-full object-cover xl:hidden"
          />

          {/* Imagen escritorio */}
          <div className="max-xl:hidden">
            <img
              src={portada}
              alt="Graduación"
              className="rounded-xl w-full h-full xl:h-[410px]   1xl:h-[410px]  2xl:h-[410px] object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col xl:flex-row justify-between">
          {/*Envio Asesor*/}
          <div className="bg-[#F5F5F5] rounded-xl p-4 mt-5 w-full xl:w-[780px] 1xl:w-[863px] 2xl:w-[1050px] 3xl:w-[1150px] 4xl:w-[1250px] 6xl:w-[1450px]">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold">
                Ultimos Envios del Cliente
              </h2>
              <span className="flex justify-end gap-1 items-center font-medium text-[#2F80ED]">
                <a href=""></a>
                <img src={flechaAzul} alt="" />
              </span>
            </div>

            <div>
              <EnviosClientes idAsesoramiento={selectedAsesoriaId} />
            </div>
          </div>

          {/*Reuniones */}
          <div className="xl:ml-[45px] w-full flex flex-col gap-5 mt-5 2xl:w-[500px]">
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

            <div className=" bg-[#F5F5F5] rounded-xl p-4 h-[230px] overflow-auto ">
              <div className="  flex justify-between ">
                <h2 className="text-2xl font-semibold ">Reuniones</h2>
                <span className="flex  justify-end gap-1 items-center font-medium text-[#2F80ED]">
                  <a href="">Ver todo</a>
                  <img src={flechaAzul} alt="" />
                </span>
              </div>

              {reuniones.map((reunion) => (
                <div
                  key={reunion.id}
                  className="flex w-auto mt-4 h-[120px] mn:w-[300px] mn:h-[150px] md:h-[200px] xl:h-[130px] 1xl:h-[150px]  md:w-[400px] mx-auto lg:w-auto items-center"
                >
                  <div className="flex flex-col h-full justify-between gap-[45px] items-center rounded-l-xl w-[80px] mn:w-[104px] bg-[#17162E] p-4 text-white">
                    <div className="flex flex-col justify-center items-center gap-5">
                      <p className="text-xs md:text-[14px] uppercase 1xl:text-[16px] 2xl:text-[18px]">
                        {formatFecha(reunion.fecha_reunion).mes}
                      </p>
                      <p className="text-xs md:text-[20px] 1xl:text-[21px] 2xl:text-[24px]">
                        {formatFecha(reunion.fecha_reunion).dia}
                      </p>
                    </div>
                    <p className="text-xs md:text-[12px] 1xl:text-[16px]">
                      {formatFecha(reunion.fecha_reunion).hora}
                    </p>
                  </div>
                  <div className="flex flex-col h-full flex-1 gap-5 bg-white p-4 justify-between rounded-r-xl">
                    <p className="text-xs md:text-basefont-medium 1xl:text-[15px] 2xl:text-[17px] text-center w-full">
                      {reunion.delegado}
                    </p>
                    <button className="flex gap-4 justify-between px-1 h-8 md:h-12 items-center text-white rounded-2xl bg-[#1271ED]">
                      <a
                        href={reunion.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex justify-between items-center px-2"
                      >
                        <p className="font-medium text-xs md:text-[13px]">
                          Enlace Zoom
                        </p>
                        <img src={Zoom} alt="Zoom" className="w-6 h-6" />
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
