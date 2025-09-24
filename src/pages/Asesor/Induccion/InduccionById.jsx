import { useQuery } from "@tanstack/react-query";
import LayoutApp from "../../../layout/LayoutApp";
import { useNavigate, useParams } from "react-router-dom";
import { induccionesService } from "../../../services/induccionesService";
import { asesoriasService } from "../../../services/asesoriasService";
import trash_icon from "../../../assets/icons/trash.png";
import ModalBorrarInduccion from "../../../Components/Induccion/ModalBorrarInduccion";
import { useState } from "react";
import back from "../../../assets/icons/back.png";

const InduccionById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [openModalDelete, setOpenModalDelete] = useState(false);

  const {
    data: induccionesByIdAsesoramiento,
    isLoading: isLoadingInducciones,
  } = useQuery({
    queryKey: ["induccionesByIdAsesoramiento"],
    queryFn: () => induccionesService.obtenerInduccionesByIdAsesoria(id),
    refetchOnWindowFocus: false,
    initialData: [],
    enabled: !!id,
  });

  const { data: asesoramientoById, isLoading: isLoadingAsesoramiento } =
    useQuery({
      queryKey: ["asesoramientoById"],
      queryFn: () => asesoriasService.asesoramientoById(id),
      refetchOnWindowFocus: false,
    });

  if (
    isLoadingInducciones ||
    isLoadingAsesoramiento ||
    !Array.isArray(asesoramientoById) ||
    asesoramientoById.length === 0
  ) {
    return (
      <LayoutApp>
        <div className="p-4">Cargando...</div>
      </LayoutApp>
    );
  }

  console.log(isLoadingInducciones);

  return (
    <LayoutApp>
      <div className="p-4 ml-[100px] xl:ml-0 relative">
        <div className="bg-white p-4 relative rounded-xl">
          <button
            onClick={() => navigate("/asesor/inducciones")}
            className="w-[35px] h-[35px] absolute rounded-full bg-gray-200 flex justify-center items-center right-2 top-2"
          >
            <img src={back} alt="back-icon" />
          </button>
          <h3 className="text-2xl font-semibold mb-6">
            {asesoramientoById[0]?.referencia}
          </h3>

          <div className="space-y-2">
            <div className="flex gap-x-[200px]">
              <p className="font-semibold">
                Delegado:{" "}
                <span className="font-light ml-2">
                  {asesoramientoById[0]?.delegado}
                </span>
              </p>
              <div className="flex flex-col">
                <p className="font-semibold">Integrantes: </p>
                <ul className="list-disc">
                  {asesoramientoById[0]?.estudiantes.map((item) => (
                    <li key={item.id} className="list-item list-inside">
                      {item.estudiante}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="font-semibold">
                Área:{" "}
                <span className="font-normal">
                  {asesoramientoById[0]?.area}
                </span>
              </p>
            </div>
            <p className="text-xl font-semibold">Videos:</p>
            <hr className="h-1 bg-black" />
            <div className="flex">
              {isLoadingInducciones ? (
                <p className="text-4xl">Cargando...</p>
              ) : !induccionesByIdAsesoramiento ||
                induccionesByIdAsesoramiento.length === 0 ? (
                <p className="text-xl font-semibold">
                  No hay videos subidos aun.
                </p>
              ) : (
                <div className="grid gap-4 w-full grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
                  {induccionesByIdAsesoramiento.map((item) => (
                    <div className="relative  bg-[#F8F7F7] ">
                      <video
                        src={item.url}
                        controls
                        className="rounded-t-2xl min-w-[250px] w-full max-h-[100px]"
                      ></video>
                      <div className="px-3 py-1 rounded-b-2xl shadow-[5px_15px_10px_#ccc,-5px_0_10px_#ccc]">
                        <p className="text-xl font-semibold">{item.titulo}</p>
                        <p className="text-lg">{item.capitulo}</p>
                      </div>
                      <button
                        onClick={() => setOpenModalDelete(true)}
                        className="absolute top-3 right-3"
                      >
                        <img
                          src={trash_icon}
                          alt="trash-icon"
                          className="block"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ModalBorrarInduccion
        id={induccionesByIdAsesoramiento[0]?.id}
        openModalDelete={openModalDelete}
        setOpenModalDelete={setOpenModalDelete}
      />
    </LayoutApp>
  );
};

export default InduccionById;
