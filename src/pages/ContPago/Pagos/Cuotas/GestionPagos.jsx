import React, { useState, useEffect } from "react";
import ActualizarPago from "../../../../Components/Administrador/Pagos/ActualizarPago";
import tachoelimanar from "../../../../assets/icons/tacho.svg";

const GestionPagos = () => {
  const [actualizar, setActualizar] = useState(false);
  const [eliminar, setEliminar] = useState(false);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPago, setSelectedPago] = useState(null);
  const [pagoToDelete, setPagoToDelete] = useState(null);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_PORT_ENV}/pagos/cuotas`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los datos de pagos");
        }
        const data = await response.json();
        setPagos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, []);

  const handleActualizarClick = (pagoInfo) => {
    // Preparar los datos para enviar a ActualizarPago
    const pagoData = {
      id_infoPago: pagoInfo.id_infopago,
      delegado: pagoInfo.delegado,
      contrato: pagoInfo.contrato,
      numero_cuotas: pagoInfo.pagos.length,
      total_pagar: calculateTotal(pagoInfo.pagos),
      cuotas: pagoInfo.pagos
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .map((pago, index) => ({
          nombre: pago.nombre,
          monto: pago.monto,
          fecha_pago: pago.fecha_pago ? pago.fecha_pago.split("T")[0] : "",
          estado_pago: pago.estado_pago,
          id: pago.id,
        })),
    };

    setSelectedPago(pagoData);
    setActualizar(true);
  };

  const handleEliminarClick = (pagoInfo) => {
    setPagoToDelete(pagoInfo.id_infopago);
    setEliminar(true);
  };

  const confirmarEliminar = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_PORT_ENV}/pagos/delete/${pagoToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el pago");
      }

      // Actualizar la lista de pagos después de eliminar
      const updatedPagos = pagos.filter(
        (pago) => pago.id_infopago !== pagoToDelete
      );
      setPagos(updatedPagos);

      setEliminar(false);
      setPagoToDelete(null);
    } catch (err) {
      setError(err.message);
      setEliminar(false);
    }
  };

  const formatDate = (fecha) => {
    const date = new Date(fecha);
    // Forzamos UTC en el formato
    return date.toLocaleDateString("es-PE", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const calculateTotal = (pagosArray) => {
    return pagosArray.reduce((total, pago) => total + pago.monto, 0);
  };

  if (loading) {
    return <div>Cargando datos de pagos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-between text-[#495D72] font-medium p-[6px] pr-10 rounded-md">
          <div className="w-[100px] flex justify-center">IdPago</div>
          <div className="w-[300px] flex justify-center">Delegado</div>
          <div className="w-[100px] flex justify-center">Contrato</div>
          <div className="w-[510px] flex justify-center">Pagos</div>
          <div className="w-[150px] flex justify-center">Monto Total</div>
          <div className="w-[200px] flex justify-center ">Acción</div>
        </div>

        {pagos.map((pagoInfo) => (
          <div
            key={pagoInfo.id_infopago}
            className={`flex justify-between items-center text-[#575051] font-normal p-[6px] pr-10 rounded-2xl ${
              pagos.indexOf(pagoInfo) % 2 === 0 ? "bg-[#E9E7E7]" : ""
            }`}
          >
            <div className="w-[100px] flex justify-center">
              {pagoInfo.id_infopago}
            </div>
            <div className="w-[300px] flex justify-center">
              {pagoInfo.delegado}
            </div>
            <div className="w-[100px] flex justify-center">
              {pagoInfo.contrato}
            </div>
            <div className="w-[510px] flex justify-start gap-3 text-[#575051]">
              {[...pagoInfo.pagos]
                .sort((a, b) => a.nombre.localeCompare(b.nombre))
                .map((pago) => (
                  <div
                    key={pago.id}
                    className={`flex flex-col h-[50px] ${
                      pagos.indexOf(pagoInfo) % 2 === 0
                        ? "bg-white"
                        : "bg-[#E9E7E7]"
                    } text-[13px] rounded-3xl justify-between px-5 py-1 items-center`}
                  >
                    <p className="font-semibold">
                      {pago.nombre}: S/. {pago.monto}
                    </p>
                    {pago.estado_pago === "pagado" ? (
                      <p>Fecha: {formatDate(pago.fecha_pago)}</p>
                    ) : (
                      <p className="flex justify-center text-[#FF1E00] border border-[#FF1E00] rounded-2xl px-3">
                        Por pagar
                      </p>
                    )}
                  </div>
                ))}
            </div>
            <div className="flex w-[150px] justify-center">
              S/. {calculateTotal(pagoInfo.pagos)}
            </div>
            <div className="flex w-[200px] justify-between">
              <button
                className="font-medium rounded-md px-1 py-1 bg-[#1C1C34] flex justify-center text-white text-[14px]"
                onClick={() => handleActualizarClick(pagoInfo)}
              >
                Actualizar Pagos
              </button>
              <button
                className=""
                onClick={() => handleEliminarClick(pagoInfo)}
              >
                <img src={tachoelimanar} alt="Eliminar" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {actualizar && selectedPago && (
        <ActualizarPago
          onClose={() => {
            setActualizar(false);
            setSelectedPago(null);
          }}
          pagoData={selectedPago}
        />
      )}
      {eliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              ¿Estás seguro de que deseas eliminar este pago?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => {
                  setEliminar(false);
                  setPagoToDelete(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={confirmarEliminar}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GestionPagos;
