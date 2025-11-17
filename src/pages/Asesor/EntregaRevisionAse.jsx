import LayoutApp from "../../layout/LayoutApp";
import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import MiEnvioAsesor from "../../pages/Asesor/EnviosCliente/MisEnviosAsesor";
import EnvioCliente from "../../pages/Asesor/EnviosCliente/EnviosCliente";
import OtrosDocs from "../../pages/Asesor/EnviosCliente/OtrosDocs";

const EntregaRevisionAse = () => {
  const [asesorias, setAsesorias] = useState([]);
  const [selectedAsesoriaId, setSelectedAsesoriaId] = useState(null);
  const [docEnvio, setEnvio] = useState("MisEnvios");

  const navigate = useNavigate();
  const location = useLocation();

  const isTerminados = location.pathname.includes("terminados");
  const isPendientes = location.pathname.includes("pendientes");

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
            setSelectedAsesoriaId(asesoriasArray[0].id);
          }
        })
        .catch((error) => console.error("Error al obtener asesorías:", error));
    }
  }, []);

  const handleChange = (e) => {
    setSelectedAsesoriaId(e.target.value);
  };

  const renderDoc = () =>{
    switch(docEnvio) {
      case "MisEnvios":
        return <MiEnvioAsesor idAsesoramiento={selectedAsesoriaId} />;
      case "EnviosCliente":
        return <EnvioCliente idAsesoramiento={selectedAsesoriaId} />;
      case "OtrosDocs":
        return <OtrosDocs />;
      default:
        return null;
    }
  }

  return (
    <LayoutApp>
      <main className="flex flex-col gap-8 px-4 sm:px-6 lg:px-12 py-6">
        {/* Selector de asesorías */}
        <div className="flex justify-center sm:justify-end w-full">
          <select
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base 
                       bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0CB2D5] 
                       transition-all duration-200"
            onChange={handleChange}
            value={selectedAsesoriaId || ""}
          >
            {asesorias.map((asesoria, index) => (
              <option key={index} value={asesoria.id}>
                {asesoria.profesion} - {asesoria.delegado}
              </option>
            ))}
          </select>
        </div>

        {/* Asuntos */}
        <div className="flex flex-col gap-4 p-4 sm:p-6 lg:p-10 w-full bg-white rounded-[10px] shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold">Asuntos</h2>

          <div className="flex w-full border-b-2 gap-3 border-black font-normal overflow-x-auto">
            <button
              className={`px-4 py-2 rounded-t-[5px] whitespace-nowrap ${
                isTerminados ? "bg-[#17162E] text-white" : ""
              }`}
              onClick={() => navigate("terminados")}
            >
              Terminados
            </button>
            <button
              className={`px-4 py-2 rounded-t-[5px] whitespace-nowrap ${
                isPendientes ? "bg-[#17162E] text-white" : ""
              }`}
              onClick={() => navigate("pendientes")}
            >
              Pendientes
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <Outlet context={selectedAsesoriaId} />
          </div>
        </div>

        {/* Documentos */}
        <div className="flex flex-col gap-4 p-4 sm:p-6 lg:p-10 w-full bg-white rounded-[10px] shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold">Documentos</h2>

          <div className="flex w-full border-b-2 gap-3 border-black font-normal overflow-x-auto">
            <button
              className={`px-4 py-2 rounded-t-[5px] whitespace-nowrap ${
                docEnvio === "MisEnvios" ? "bg-[#17162E] text-white" : ""
              }`}
              onClick={() => setEnvio("MisEnvios")}
            >
              Mis envíos
            </button>
            <button
              className={`px-4 py-2 rounded-t-[5px] whitespace-nowrap ${
                docEnvio === "EnviosCliente" ? "bg-[#17162E] text-white" : ""
              }`}
              onClick={() => setEnvio("EnviosCliente")}
            >
              Envíos cliente
            </button>
            <button
              className={`px-4 py-2 rounded-t-[5px] whitespace-nowrap ${
                docEnvio === "OtrosDocs" ? "bg-[#17162E] text-white" : ""
              }`}
              onClick={() => setEnvio("OtrosDocs")}
            >
              Otros Docs 
            </button>
          </div>

          <div className="">
            {renderDoc()}
            {/* {docEnvio === "MisEnvios" ? (
              <MiEnvioAsesor idAsesoramiento={selectedAsesoriaId} />
            ) : (
              <EnvioCliente idAsesoramiento={selectedAsesoriaId} />
            )} */}
          </div>
        </div>
      </main>
    </LayoutApp>
  );
};

export default EntregaRevisionAse;
