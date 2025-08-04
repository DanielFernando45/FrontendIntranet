import LayoutApp from "../../layout/LayoutApp";
import { useState, useEffect } from "react";
import flechaAzul from "../../assets/icons/arrowAzul.svg"
import plus from "../../assets/icons/IconEstudiante/add.svg"
import EnvioArchivo from "../../Components/Cliente/EnvioArchivos";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import MisEnvios from '../../pages/Estudiante/EntregasEnvio/MisEnviosCli'
import EnvioAsesor from '../../pages/Estudiante/EntregasEnvio/EnvioAsesor'

const EntregaRevisionEst = () => {
  const [showModal, setShowModal] = useState(false);
  const [asesorias, setAsesorias] = useState([]);
  const [selectedAsesoriaId, setSelectedAsesoriaId] = useState(null);
  const [docEnvio, setEnvio] = useState("MisEnvios");
  const [showNewAdvanceButton, setShowNewAdvanceButton] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isTerminados = location.pathname.includes("terminados");
  const isPendientes = location.pathname.includes("pendientes");

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      const userId = user.id;

      fetch(`${import.meta.env.VITE_API_PORT_ENV}/cliente/miAsesoramiento/${userId}`)
        .then(res => res.json())
        .then(data => {
          const asesoriasArray = Object.values(data).map(item => ({
            id: item.id,
            profesion: item.profesion_asesoria
          }));
          setAsesorias(asesoriasArray);

          if (asesoriasArray.length > 0) {
            const primeraAsesoriaId = asesoriasArray[0].id;
            setSelectedAsesoriaId(primeraAsesoriaId);
            
            // Verificar si el usuario es el asesor de esta asesoría
            checkIfUserIsAdvisor(primeraAsesoriaId, userId);
          }
        })
        .catch(error => console.error('Error al obtener asesorías:', error));
    }
  }, []);

  const checkIfUserIsAdvisor = (asesoriaId, userId) => {
    fetch(`${import.meta.env.VITE_API_PORT_ENV}/cliente/idClienteByAsesoramiento/${asesoriaId}`)
      .then(res => res.json())
      .then(data => {
        // Comparar el ID del asesor con el ID del usuario
        setShowNewAdvanceButton(data.id === userId);
      })
      .catch(error => {
        console.error('Error al verificar asesor:', error);
        setShowNewAdvanceButton(false);
      });
  };

  const handleChange = (e) => {
    const asesoriaId = e.target.value;
    setSelectedAsesoriaId(asesoriaId);
    
    // Verificar si el usuario es el asesor cuando cambia la selección
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      checkIfUserIsAdvisor(asesoriaId, user.id);
    }
  }

  return (
    <LayoutApp>
      <main className="flex flex-col gap-3 lg:mx-5 items-start ">

        <div className="flex flex-col md:flex-row justify-between w-full gap-y-4">
          {showNewAdvanceButton && (
            <button className="flex justify-between px-3 rounded-lg bg-white w-[180px] items-center font-medium" 
              onClick={() => setShowModal(true)}>
              <p>Nuevo Avance</p>
              <img className="" src={plus} alt="" />
            </button>
          )}
          {!showNewAdvanceButton && <div className="w-[180px]"></div>} {/* Espacio reservado para mantener el layout */}
          
          <select
            className='text-xs mn:text-sm sm:text-base border-2 rounded-md px-2'
            onChange={handleChange}
            value={selectedAsesoriaId || ''}
          >
            {asesorias.map((asesoria, index) => (
              <option key={index} value={asesoria.id}>{asesoria.profesion}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-[10px] px-[20px] sm:px-[40px] py-5 w-full  bg-white rounded-[10px]">
          <div className="flex flex-col gap-[12px]">

            <div className=" mt-5 flex justify-between">
              <h2 className="text-base md:text-2xl font-bold">Asuntos</h2>
              <span className="flex  justify-end gap-1 items-center font-medium text-[#2F80ED]">
                <a href="">Ver todo</a>
                <img src={flechaAzul} alt="" />
              </span>
            </div>

            <div className="flex w-full border-b-2 gap-3 border-black font-normal">
              <button
                className={`px-3 text-xs md:text-base rounded-t-[5px] w-[115px] ${isTerminados ? "bg-[#17162E] text-white" : ""
                  }`}
                onClick={() => navigate("terminados")}
              >
                Terminados
              </button>
              <button
                className={`px-3 text-xs md:text-base rounded-t-[5px] w-[105px] ${isPendientes ? "bg-[#17162E] text-white" : ""
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

        <div className="flex flex-col gap-[10px] px-[20px] sm:px-[40px] py-5 w-full  bg-white rounded-[10px]">

          <div className="flex justify-between flex-col md:flex-row">
            <h2 className="text-base md:text-2xl font-bold">Documentos</h2>
            <span className="flex md:justify-end gap-1 items-center font-medium text-[#2F80ED]">
              <a href="">Ver todo</a>
              <img src={flechaAzul} alt="" />
            </span>
          </div>
          <div className="flex w-full border-b-2 gap-3 border-black font-normal">
            <button
              className={`px-3 text-xs md:text-base rounded-t-[5px] w-[115px] ${docEnvio === "MisEnvios" ? "bg-[#17162E] text-white" : ""
                }`}
              onClick={() => setEnvio("MisEnvios")}
            >
              Mis envíos
            </button>
            <button
              className={`px-3 text-xs md:text-base rounded-t-[5px] w-[135px] ${docEnvio === "EnviosAsesor" ? "bg-[#17162E] text-white" : ""
                }`}
              onClick={() => setEnvio("EnviosAsesor")}
            >
              Envíos asesor
            </button>
          </div> 

          <div>
            {
              docEnvio === "MisEnvios" ? (
                <MisEnvios idAsesoramiento={selectedAsesoriaId}/>
              ) : (
                <EnvioAsesor idAsesoramiento={selectedAsesoriaId}/>
              )
            }
          </div>
        </div>

        <EnvioArchivo
          show={showModal}
          onClose={() => setShowModal(false)}
          asesoriaId={selectedAsesoriaId}
        />
      </main>
    </LayoutApp>
  )
}

export default EntregaRevisionEst;