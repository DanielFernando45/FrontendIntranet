import React, { useEffect, useState } from "react";
import LayoutApp from "../../layout/LayoutApp";
import calendar_icon from "../../assets/icons/calendar.png";

const PagosEstudiante = () => {
  const [asesorias, setAsesorias] = useState([]);
  const [selectedAsesoriaId, setSelectedAsesoriaId] = useState(null);
  const [pagosAsesoria, setPagosAsesoria] = useState([]);
  const [pagosServicios, setPagosServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  // RESPONSIVE
  const [showOtrosPagos, setShowOtrosPagos] = useState(false);

  useEffect(() => {
    const usuario = localStorage.getItem("user");
    if (usuario) {
      const user = JSON.parse(usuario);
      const id = user.id_cliente;

      fetch(
        `${import.meta.env.VITE_API_PORT_ENV}/cliente/miAsesoramiento/${id}`
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
          }
        })
        .catch((error) => console.error("Error al obtener asesorías:", error))
        .finally(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    if (selectedAsesoriaId) {
      // Obtener pagos de asesoría
      fetch(
        `${
          import.meta.env.VITE_API_PORT_ENV
        }/pagos/misAsesorias/${selectedAsesoriaId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setPagosAsesoria(data);
        })
        .catch((error) =>
          console.error("Error al obtener pagos de asesoría:", error)
        );

      // Obtener pagos de servicios (solo visualización)
      fetch(
        `${
          import.meta.env.VITE_API_PORT_ENV
        }/pagos/misServicios/${selectedAsesoriaId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setPagosServicios(data);
        }) // Para depuración
        .catch((error) =>
          console.error("Error al obtener pagos de servicios:", error)
        );
    }
  }, [selectedAsesoriaId]);

  const handleChange = (e) => {
    const asesoriaId = e.target.value;
    setSelectedAsesoriaId(asesoriaId);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString.includes("1969-12-31")) {
      return "Fecha no definida";
    }

    // Asegurar formato ISO válido
    const isoString = dateString.replace(" ", "T");

    const date = new Date(isoString);

    if (isNaN(date)) {
      return "Fecha no definida";
    }

    return date.toLocaleDateString("es-ES", {
      timeZone: "UTC",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const parseDate = (dateString) => {
    const fechita = new Date(`${dateString}`);
    return fechita.toLocaleDateString("es-ES", {
      timeZone: "UTC",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Función para calcular el total de todas las cuotas (sin importar estado)
  const calcularTotalCuotas = () => {
    try {
      // Filtramos solo los pagos que son cuotas (titulo incluye "Cuota")
      const cuotas = pagosAsesoria.filter(
        (pago) => pago.titulo && pago.titulo.includes("Cuota")
      );

      // Sumamos todos los montos de las cuotas
      const total = cuotas.reduce((sum, pago) => {
        const monto = parseFloat(pago.monto) || 0;
        return sum + monto;
      }, 0);

      return total.toFixed(2);
    } catch (error) {
      console.error("Error al calcular total de cuotas:", error);
      return "0.00";
    }
  };

  // Función para calcular el total de cuotas pendientes
  const calcularDeudaPendiente = () => {
    try {
      // Filtramos cuotas pendientes (estado_pago es "por_pagar" o "pendiente")
      const pendientes = pagosAsesoria.filter(
        (pago) =>
          pago.titulo &&
          pago.titulo.includes("Cuota") &&
          pago.estado_pago &&
          (pago.estado_pago.toLowerCase() === "por_pagar" ||
            pago.estado_pago.toLowerCase() === "pendiente")
      );

      const totalPendiente = pendientes.reduce((sum, pago) => {
        const monto = parseFloat(pago.monto) || 0;
        return sum + monto;
      }, 0);

      return totalPendiente == 0 ? 0 : totalPendiente.toFixed(2);
    } catch (error) {
      console.error("Error al calcular deuda pendiente:", error);
      return "0.00";
    }
  };

  // Función para calcular el total de cuotas pagadas
  const calcularTotalPagado = () => {
    try {
      // Filtramos cuotas pagadas
      const pagados = pagosAsesoria.filter(
        (pago) =>
          (pago.titulo && pago.titulo.includes("Cuota")) ||
          (pago.titulo.includes("total") &&
            pago.estado_pago &&
            pago.estado_pago.toLowerCase() === "pagado")
      );

      const totalPagado = pagados.reduce((sum, pago) => {
        const monto = parseFloat(pago.monto) || 0;
        return sum + monto;
      }, 0);

      return totalPagado.toFixed(2);
    } catch (error) {
      console.error("Error al calcular total pagado:", error);
      return "0.00";
    }
  };

  const calcularDeudaTotal = (pagos) => {
    try {
      const total = pagos.reduce((sum, pago) => {
        const monto = parseFloat(pago.monto) || 0;
        return sum + monto;
      }, 0);
      return total.toFixed(2);
    } catch (error) {
      console.error("Error al calcular monto:", error);
      return "0.00";
    }
  };

  if (loading) {
    return (
      <LayoutApp>
        <main className="ml-5 mr-20 bg-white rounded-[20px] h-[658px] p-10 flex items-center justify-center">
          <div>Cargando...</div>
        </main>
      </LayoutApp>
    );
  }

  return (
    <LayoutApp>
      <main className="sm:ml-5 1xl:mr-20 sm:bg-white rounded-[20px] h-[658px] py-6 sm:p-10">
        <div className="hidden flex-col gap-7 sm:flex">
          <div className="w-full">
            <h1 className="text-[20px] font-bold">Estado de cuenta</h1>
          </div>

          <div className="flex justify-between flex-wrap gap-y-10">
            <div className="w-full 1xl:w-[80%]">
              <div className="flex flex-row justify-between p-2">
                <div className="flex justify-center flex-1">Título</div>
                <div className="flex justify-center flex-1">Monto</div>
                <div className="flex justify-center flex-1">Fecha de pago</div>
                <div className="flex justify-center flex-1 md:flex-none w-auto">
                  Estado
                </div>
              </div>

              {pagosAsesoria.length > 0 ? (
                pagosAsesoria.map((pago, index) => (
                  <div
                    key={index}
                    className={`flex flex-row justify-between items-center gap-2 ${
                      index % 2 === 0 ? "bg-[#E9E7E7]" : ""
                    } p-2 rounded-lg`}
                  >
                    <div className="text-sm md:text-base flex justify-center flex-1">
                      {pago.titulo || "Sin título"}
                    </div>
                    <div className="text-sm md:text-base flex justify-center flex-1">
                      S/{(parseFloat(pago.monto) || 0).toFixed(2)}
                    </div>
                    <div className="text-sm md:text-base flex justify-center flex-1">
                      {formatDate(pago.fecha_pago)}
                    </div>
                    <div
                      className={`flex justify-center flex-1 md:flex-none w-auto px-1 ${
                        pago.estado_pago &&
                        pago.estado_pago.toLowerCase() === "pagado"
                          ? "text-[#347433] border-[#347433]"
                          : "text-[#EE1D1D] border-[#EE1D1D]"
                      } border rounded-lg`}
                    >
                      {pago.estado_pago === "por_pagar"
                        ? "Por pagar"
                        : pago.estado_pago &&
                          pago.estado_pago.toLowerCase() === "pagado"
                        ? "Pagado"
                        : "Pendiente"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 bg-[#E9E7E7] rounded-xl">
                  No hay pagos de asesoría registrados
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 w-[230px] mx-auto">
              <select
                onChange={handleChange}
                value={selectedAsesoriaId || ""}
                className="border rounded-t-md border-[#b4a6aa]"
              >
                {asesorias.map((asesoria, index) => (
                  <option key={index} value={asesoria.id}>
                    {asesoria.profesion}
                  </option>
                ))}
              </select>

              <div className="flex justify-between">
                <h2>Total cuotas:</h2>
                <h2 className="text-[#82777A]">S/.{calcularTotalCuotas()}</h2>
              </div>
              <div className="flex justify-between">
                <h2>Total pagado:</h2>
                <h2 className="text-[#16610E]">S/.{calcularTotalPagado()}</h2>
              </div>
              <div className="flex justify-between">
                <h2>Por pagar:</h2>
                <h2 className="text-[#EE1D1D]">
                  S/.{calcularDeudaPendiente()}
                </h2>
              </div>
            </div>
          </div>

          <div className="w-full">
            <h1 className="text-[20px] font-bold">Pagos de Servicios</h1>
          </div>

          <div className="w-full">
            <div className="flex flex-row justify-between p-2">
              <div className="text-sm md:text-base flex justify-center flex-1">
                Título
              </div>
              <div className="text-sm md:text-base flex justify-center flex-1">
                Monto
              </div>
              <div className="text-sm md:text-base flex justify-center flex-1">
                Fecha de pago
              </div>
              <div className="text-sm md:text-base flex justify-center flex-1 md:flex-none w-auto">
                Estado
              </div>
            </div>

            {pagosServicios.length > 0 ? (
              pagosServicios.map((pago, index) => (
                <div
                  key={index}
                  className={`flex flex-row items-center justify-between gap-2 ${
                    index % 2 === 0 ? "bg-[#E9E7E7]" : ""
                  } p-2 rounded-lg`}
                >
                  <div className="text-sm md:text-base flex justify-center  flex-1 ">
                    {pago.titulo || "Sin título"}
                  </div>
                  <div className="text-sm md:text-base flex justify-center  flex-1 ">
                    S/{(parseFloat(pago.monto) || 0).toFixed(2)}
                  </div>
                  <div className="text-sm md:text-base flex justify-center  flex-1 ">
                    {formatDate(pago.fecha_pago)}
                  </div>
                  <div
                    className={`text-sm md:text-base flex justify-center flex-1 md:flex-none w-auto md:px-2 ${
                      pago.estado_pago &&
                      pago.estado_pago.toLowerCase() === "pagado"
                        ? "text-[#16610E] border-[#16610E]"
                        : "text-[#EE1D1D] border-[#EE1D1D]"
                    } border rounded-lg`}
                  >
                    {pago.estado_pago === "por_pagar"
                      ? "Por pagar"
                      : pago.estado_pago &&
                        pago.estado_pago.toLowerCase() === "pagado"
                      ? "Pagado"
                      : "Pendiente"}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 bg-[#E9E7E7] rounded-xl">
                No hay otros pagos registrados
              </div>
            )}
          </div>
        </div>

        {/* RESPONSIVE */}
        <div className="block sm:hidden space-y-9">
          <div className="flex  border-b items-center">
            <button
              onClick={() => setShowOtrosPagos(false)}
              className={`${
                showOtrosPagos
                  ? "text-[#1C233E] bg-transparent"
                  : "text-white bg-[#1C233E]"
              } text-[20px] font-bold  flex-1 text-center rounded-t-lg text-sm py-2`}
            >
              Estado de cuenta
            </button>
            <button
              onClick={() => setShowOtrosPagos(true)}
              className={`text-[20px] font-bold  flex-1 rounded-t-lg ${
                showOtrosPagos
                  ? "text-white bg-[#1C233E]"
                  : "text-[#1C233E] bg-transparent"
              } text-center text-sm py-2`}
            >
              Otros Pagos
            </button>
          </div>

          <select
            onChange={handleChange}
            value={selectedAsesoriaId || ""}
            className="border rounded-md border-[#b4a6aa] block w-full py-2 px-2 outline-none"
          >
            {asesorias.map((asesoria, index) => (
              <option key={index} value={asesoria.id}>
                {asesoria.profesion}
              </option>
            ))}
          </select>

          {showOtrosPagos ? (
            <div>
              {pagosServicios.length > 0 ? (
                pagosServicios.map((pago, index) => (
                  <div
                    key={pago.titulo}
                    className="bg-white rounded-lg shadow-sm border"
                  >
                    <div className="flex  border-b">
                      <div className="flex w-[150px] border-r p-4 items-center justify-center">
                        <p className="text-center">{pago?.titulo}</p>
                        {/* <span className="text-gray-600">{index + 1}</span> */}
                      </div>
                      <div className="flex-1 self-end flex flex-col gap-2 text-end p-4">
                        <p className="text-xl">Monto</p>
                        <p className="text-gray-600 text-xl">
                          S/. {pago?.monto}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col mn:flex-row items-center justify-between gap-3">
                      <div className="flex w-full mn:w-auto">
                        <p className="border border-[#16610E] text-center flex-1 mn:flex-auto text-[#16610E] py-1 px-4 rounded-md">
                          {pago?.estado_pago}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>
                          <img
                            src={calendar_icon}
                            alt="calendar icon"
                            className="w-4 h-4"
                          />
                        </span>
                        <p>{parseDate(pago?.fecha_pago)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 bg-[#E9E7E7] rounded-xl">
                  No hay pagos de asesoría registrados
                </div>
              )}
            </div>
          ) : (
            <div className="">
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-3 flex items-center justify-center gap-x-8">
                  <div className="space-y-4">
                    <p className="text-base text-[#1C233E]">Deuda Total:</p>
                    <p className="text-base text-[#1C233E]">Deuda Pendiente:</p>
                  </div>
                  <div className="space-y-4">
                    <p>S/. {calcularDeudaTotal(pagosAsesoria)}</p>
                    <p>S/. {calcularDeudaPendiente(pagosAsesoria)}</p>
                  </div>
                </div>

                {pagosAsesoria.length > 0 ? (
                  pagosAsesoria.map((pago, index) => (
                    <div
                      key={pago.titulo}
                      className="bg-white rounded-lg shadow-sm border"
                    >
                      <div className="flex  border-b">
                        <div className="flex flex-col w-[150px] border-r p-4 items-center">
                          <p>{pago?.titulo.split(" ")[0]}</p>
                          <span className="text-gray-600">{index + 1}</span>
                        </div>
                        <div className="flex-1 self-end flex flex-col gap-2 text-end p-4">
                          <p>Monto</p>
                          <p className="text-gray-600">S/. {pago?.monto}</p>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col mn:flex-row items-center justify-between gap-3">
                        <div className="flex w-full mn:w-auto">
                          <p className="border border-[#16610E] text-center flex-1 mn:flex-auto text-[#16610E] py-1 px-4 rounded-md">
                            {pago?.estado_pago}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>
                            <img
                              src={calendar_icon}
                              alt="calendar icon"
                              className="w-4 h-4"
                            />
                          </span>
                          <p>{parseDate(pago?.fecha_pago)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 bg-[#E9E7E7] rounded-xl">
                    No hay otros pagos registrados
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RESPONSIVE */}
      </main>
    </LayoutApp>
  );
};

export default PagosEstudiante;
