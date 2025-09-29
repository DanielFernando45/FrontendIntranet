import React, { useEffect, useState } from "react";
import LayoutApp from "../../../layout/LayoutApp";
import LogoAleja from "../../../assets/icons/IconEstudiante/LogoOscuro.svg";

const MiContrato = () => {
  const [asesorias, setAsesorias] = useState([]);
  const [contrato, setContrato] = useState(null);
  const [selectedAsesoriaId, setSelectedAsesoriaId] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      const idCliente = user.id_cliente;

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
            obtenerDatosContrato(primeraAsesoriaId);
          }
        })
        .catch((error) => console.error("Error al obtener asesorías:", error));
    }
  }, []);

  const obtenerDatosContrato = (asesoriaId) => {
    fetch(
      `${import.meta.env.VITE_API_PORT_ENV}/cliente/misContratos/${asesoriaId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setContrato(data);
      })
      .catch((error) => console.error("Error al obtener contrato:", error));
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Por Asignar";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-PE");
  };

  const handleChange = (e) => {
    const asesoriaId = e.target.value;
    setSelectedAsesoriaId(asesoriaId);
    obtenerDatosContrato(asesoriaId);
  };

  return (
    <LayoutApp>
      <main className="xl:m-24">
        <div className=" fondo_login rounded-t-[20px] w-full h-14 "> </div>
        <div className="flex flex-col  gap-[40px] p-5 mn:p-8 sm:p-12 w-full h-full bg-white rounded-b-[20px] ">
          <div className="flex flex-col gap-4">
            <h1 className="text-[23px] font-medium">Mis Contratos</h1>

            {/* Select de asesorías */}
            <div className="flex justify-start w-full">
              <select
                className="w-full max-w-xs px-4 py-2 text-[15px] rounded-lg border border-gray-300 bg-white text-gray-700 
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 
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

            {contrato ? (
              <>
                <div className="flex gap-10 flex-col sm:flex-row">
                  <div className="flex flex-col  gap-3 w-full">
                    <p className="pl-[1px]">Servicio</p>
                    <div
                      className="flex bg-[#F9F9F9] w-full h-[49px] rounded-lg 
                      text-[#808080] items-center p-4"
                    >
                      {contrato.servicio || "No asignado"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full">
                    <p className="pl-[1px]">Modalidad</p>
                    <div
                      className="flex bg-[#F9F9F9] w-full h-[49px] rounded-lg 
                      text-[#808080] items-center p-4"
                    >
                      {contrato.modalidad || "No asignado"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-10 flex-col sm:flex-row">
                  <div className="flex flex-col gap-3 w-full">
                    <p className="pl-[1px]">Fecha Inicio</p>
                    <div
                      className="flex bg-[#F9F9F9] w-full h-[49px] rounded-lg 
                      text-[#808080] items-center p-4"
                    >
                      {formatearFecha(contrato.fecha_inicio)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full">
                    <p className="pl-[1px]">Fecha Fin</p>
                    <div
                      className="flex bg-[#F9F9F9] w-full h-[49px] rounded-lg 
                      text-[#808080] items-center p-4"
                    >
                      {formatearFecha(contrato.fecha_fin)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-10 flex-col sm:flex-row">
                  <div className="flex flex-col gap-3 w-full">
                    <p className="pl-[1px]">Categoría</p>
                    <div
                      className="flex bg-[#F9F9F9] w-full h-[49px] rounded-lg 
                      text-[#808080] items-center p-4"
                    >
                      {contrato?.categoria?.descripcion || "No asignado"}
                    </div>
                  </div>
                  

                  <div className="flex flex-col gap-3 w-full">
                    <p className="pl-[1px]">Tipo de Pago</p>
                    <div
                      className="flex bg-[#F9F9F9] w-full h-[49px] rounded-lg 
                      text-[#808080] items-center p-4"
                    >
                      {contrato?.tipoPago?.nombre || "No asignado"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-10">
                  <div className="flex flex-col gap-3 w-full">
                    <p className="pl-[1px]">Tipo de Trabajo</p>
                    <div
                      className="flex bg-[#F9F9F9] w-full h-[49px] rounded-lg 
                      text-[#808080] items-center p-4"
                    >
                      {contrato?.tipoTrabajo?.nombre || "No asignado"}
                    </div>
                  </div>

                </div>
              </>
            ) : (
              <p className="text-gray-500">
                No hay contrato disponible para esta asesoría.
              </p>
            )}
          </div>

          <div className="flex h-[127px] w-full justify-end">
            <img className="h-full " src={LogoAleja} alt="Logo Alejandría" />
          </div>
        </div>
      </main>
    </LayoutApp>
  );
};

export default MiContrato;
