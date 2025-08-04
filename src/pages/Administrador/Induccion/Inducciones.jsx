import { useQuery } from "@tanstack/react-query";
import LayoutApp from "../../../layout/LayoutApp";
import { asesoriasService } from "../../../services/asesoriasService";
import ModalSubirInduccion from "./components/ModalSubirInduccion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Induccion = () => {
  const [openModal, setOpenModal] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);

  const navigate = useNavigate();

  const { data: asesoramientos, isLoading } = useQuery({
    queryKey: ["asesoramientos"],
    queryFn: asesoriasService.asesorias,
    refetchOnWindowFocus: false,
  });

  const navigateInduccion = (id) => {
    navigate(`/admin/induccion/${id}`);
  };

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("es-PE", options);
  };

  return (
    // <div className="bg-red-400 absolute top-0 left-0 z-[99]">
    <LayoutApp>
      <main className="flex flex-col xl:mx-32  items-start">
        <h2 className="text-3xl font-bold mb-5">
          Agregar Inducciones a asesorias
        </h2>


        <div className="w-full overflow-auto">
          <div className="min-w-[1200px] w-full table-auto ">
            <div className="flex flex-col gap-[10px] pt-3  px-[30px] py-[10px] w-full  bg-white border-b border-slate-300 rounded-t-lg shadow-lg">
              <div className="flex flex-col">
                <div className="flex justify-between text-[#495D72] font-medium p-[6px] rounded-md">
                  <div className="w-[40px] flex justify-center">Id</div>
                  <div className="flex-1 flex justify-center max-w-[150px]">
                    Delegado
                  </div>
                  <div className="flex-1 flex justify-center max-w-[200px]">
                    Profesión Asesoria
                  </div>
                  <div className="flex-1 flex justify-center">
                    Fecha Asignación
                  </div>
                  <div className="flex-1 flex justify-center max-w-[150px]">
                    Área
                  </div>
                  <div className="flex-1 flex justify-center">Acciones</div>
                </div>
              </div>
            </div>
            {isLoading
              ? "cargando..."
              : asesoramientos.map((asesoria, index) => (
                  <div
                    key={asesoria?.id_asesoramiento}
                    className={`flex w-full overflow-auto text-[#2B2829] font-normal p-[30px] rounded-md ${
                      index % 2 === 0 ? "bg-white" : "bg-[#E9E7E7]"
                    }`}
                  >
                    <div className="w-[40px] flex justify-center">
                      {asesoria?.id_asesoramiento}
                    </div>
                    <div className="flex-1 flex justify-start max-w-[150px]">
                      {asesoria?.delegado}
                    </div>
                    <div className="flex-1 flex text-center max-w-[200px]">
                      {asesoria?.profesion_asesoria}
                    </div>
                    <div className="flex-1 flex justify-center items-center">
                      {formatDate(asesoria?.fecha_inicio)}
                    </div>
                    <div className="flex-1 flex justify-center items-center max-w-[150px]">
                      {asesoria?.area}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigateInduccion(asesoria?.id_asesoramiento)
                        }
                        className="rounded-sm px-3 py-1 bg-[#1C1C34] flex justify-center text-white flex-1"
                      >
                        Ver inducciones
                      </button>
                      <button
                        onClick={() => {
                          setOpenModal(true),
                            setIdSeleccionado(asesoria?.id_asesoramiento);
                        }}
                        className=" rounded-sm px-3 py-1 bg-[#1B1B33] flex justify-center text-white flex-1"
                      >
                        Subir Video
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </main>

      <ModalSubirInduccion
        openModal={openModal}
        setOpenModal={setOpenModal}
        idSeleccionado={idSeleccionado}
        setIdSeleccionado={setIdSeleccionado}
      />
    </LayoutApp>
    // </div>
  );
};

export default Induccion;