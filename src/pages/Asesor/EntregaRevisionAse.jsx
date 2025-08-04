import LayoutApp from "../../layout/LayoutApp";
import { useState, useEffect } from "react";
import flechaAzul from "../../assets/icons/arrowAzul.svg"
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import MiEnvioAsesor from '../../pages/Asesor/EnviosCliente/MisEnviosAsesor'
import EnvioCliente from '../../pages/Asesor/EnviosCliente/EnviosCliente'

const EntregaRevisionAse = () => {
  const [asesorias, setAsesorias] = useState([]);
  const [selectedAsesoriaId, setSelectedAsesoriaId] = useState(null);
  const [docEnvio, setEnvio] = useState("MisEnvios");

 
  const navigate = useNavigate();
  const location = useLocation();

  const isTerminados = location.pathname.includes("terminados");
  const isPendientes = location.pathname.includes("pendientes");

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      const id = user.id;

      fetch(`${import.meta.env.VITE_API_PORT_ENV}/asesor/asesoramientosYDelegado/${id}`)
        .then(res => res.json())
        .then(data => {
          const asesoriasArray = Object.values(data).map(item => ({
            id: item.id_asesoramiento,
            profesion: item.profesion_asesoria,
            delegado: item.delegado
          }));
          setAsesorias(asesoriasArray);

          if (asesoriasArray.length > 0) {
            const primeraAsesoriaId = asesoriasArray[0].id;
            setSelectedAsesoriaId(primeraAsesoriaId);

          }
        })
        .catch(error => console.error('Error al obtener asesorías:', error));
    }
  }, []);

  const handleChange = (e) => {
    const asesoriaId = e.target.value;
    setSelectedAsesoriaId(asesoriaId);
  }

  return (
    <LayoutApp>
      <main className="flex flex-col gap-11 items-start mr-14 mb-5">

        <div className="flex ml-8 justify-end w-full">
          <select
            className="border-2 rounded-md px-2 border-black "
            onChange={handleChange}
            value={selectedAsesoriaId || ''}
          >
            {asesorias.map((asesoria, index) => (
              <option key={index} value={asesoria.id}>{asesoria.profesion} - {asesoria.delegado}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-[10px] ml-8  p-[40px]  w-full  bg-white rounded-[10px]">
          <div className="flex flex-col gap-[12px]">
            <div className="  flex justify-between">

              <h2 className="text-2xl font-bold">Asuntos</h2>
              {/* <span className="flex justify-end gap-1 items-center font-medium text-[#2F80ED]">
                <a href="">Ver todo</a>
                <img src={flechaAzul} alt="" />
              </span> */}
            </div>

            <div className="flex w-full border-b-2 gap-3 border-black font-normal">
              <button
                className={`px-3 rounded-t-[5px] w-[115px] ${isTerminados ? "bg-[#17162E] text-white" : ""
                  }`}
                onClick={() => navigate("terminados")}
              >
                Terminados
              </button>
              <button
                className={`px-3 rounded-t-[5px] w-[105px] ${isPendientes ? "bg-[#17162E] text-white" : ""
                  }`}
                onClick={() => navigate("pendientes")}
              >
                Pendientes
              </button>
            </div>

          </div>


          <div>
            <Outlet context={selectedAsesoriaId} />
          </div>


        </div>

        <div className="flex flex-col gap-[10px] ml-8 p-[40px] w-full  bg-white rounded-[10px]">

          <div className="flex justify-between  ">
            <h2 className="text-2xl font-bold">Documentos</h2>
            {/* <span className="flex justify-end gap-1 items-center font-medium text-[#2F80ED]">
              <a href="">Ver todo</a>
              <img src={flechaAzul} alt="" />
            </span> */}
          </div>

          <div className="flex w-full border-b-2 gap-3 border-black font-normal">
            <button
              className={`px-3 rounded-t-[5px] w-[115px] ${docEnvio === "MisEnvios" ? "bg-[#17162E] text-white" : ""
                }`}
              onClick={() => setEnvio("MisEnvios")}
            >
              Mis envíos
            </button>
            <button
              className={`px-3 rounded-t-[5px] w-[135px] ${docEnvio === "EnviosCliente" ? "bg-[#17162E] text-white" : ""
                }`}
              onClick={() => setEnvio("EnviosCliente")}
            >
              Envíos cliente
            </button>
          </div>

          <div>
            {
              docEnvio === "MisEnvios" ? (
                <MiEnvioAsesor idAsesoramiento={selectedAsesoriaId} />
              ) : (
                <EnvioCliente idAsesoramiento={selectedAsesoriaId} />
              )
            }
          </div>

        </div>

      </main>
    </LayoutApp>

  )
}

export default EntregaRevisionAse