import { useState, useEffect } from "react";
import LayoutApp from '../../layout/LayoutApp'
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const ReunionesAsesor = () => {

  const [asesorias, setAsesorias] = useState([]);
  const [selectedAsesoriaId, setSelectedAsesoriaId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const isProximo = location.pathname.includes("proximo");
  const isAnteriores = location.pathname.includes("anteriores");

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      const id = user.id_asesor;

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
      <main className="m-2 ">
        <div className="flex flex-col gap-[40px] xl:ml-8 p-[40px] bg-white rounded-[20px] ">

          <div className="flex flex-col gap-[12px]">

            <div className="flex justify-between">
              <h1 className="font-medium text-[20px]">
                Reuniones
              </h1>
              <select
                className="border-2 rounded-md px-2 border-black "
                onChange={handleChange}
                value={selectedAsesoriaId || ''}
              >
                {asesorias.map((asesoria, index) => (
                  <option key={index} value={asesoria.id}>{asesoria.delegado}</option>
                ))}
              </select>
            </div>

            <div className="flex w-full border-b gap-3 border-black font-normal">
              <button
                className={`px-3 rounded-t-[5px] w-[105px] ${isProximo ? "bg-[#17162E] text-white" : ""
                  }`}
                onClick={() => navigate("proximo")}
              >
                Próximos
              </button>
              {/* <button
                className={`px-3 rounded-t-[5px] w-[105px] ${isAnteriores ? "bg-[#17162E] text-white" : ""
                  }`}
                onClick={() => navigate("anteriores")}
              >
                Anteriores
              </button> */}
            </div>
          </div>


          <div className="mt-4">
            <Outlet context={{ selectedAsesoriaId, asesorias }} />
          </div>

        </div>
      </main>

    </LayoutApp>

  )
}

export default ReunionesAsesor