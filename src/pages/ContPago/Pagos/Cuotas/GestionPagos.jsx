import React, { useState, useEffect } from "react";
import ActualizarPago from "../../../../Components/Administrador/Pagos/ActualizarPago";
import tachoeliminar from "../../../../assets/icons/tacho.svg";

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
    const pagoData = {
      id_infoPago: pagoInfo.id_infopago,
      delegado: pagoInfo.delegado,
      contrato: pagoInfo.contrato,
      numero_cuotas: pagoInfo.pagos.length,
      total_pagar: calculateTotal(pagoInfo.pagos),
      cuotas: pagoInfo.pagos
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .map((pago) => ({
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

  if (loading) return <div>Cargando datos de pagos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Cabecera solo en desktop */}
        <div className="hidden md:flex justify-between text-[#495D72] font-medium p-[6px] pr-10 rounded-md">
          <div className="w-[100px] flex justify-center">IdPago</div>
          <div className="w-[300px] flex justify-center">Delegado</div>
          <div className="w-[100px] flex justify-center">Contrato</div>
          <div className="w-[510px] flex justify-center">Pagos</div>
          <div className="w-[150px] flex justify-center">Monto Total</div>
          <div className="w-[200px] flex justify-center">Acción</div>
        </div>

        {pagos.map((pagoInfo, idx) => (
          <div key={pagoInfo.id_infopago}>
            {/* Vista Desktop */}
            <div
              className={`hidden md:flex justify-between items-center text-[#575051] font-normal p-[6px] pr-10 rounded-2xl ${
                idx % 2 === 0 ? "bg-[#E9E7E7]" : ""
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
              <div className="w-[510px] flex flex-wrap justify-start gap-2 text-[#575051]">
                {pagoInfo.pagos
                  .sort((a, b) => a.nombre.localeCompare(b.nombre))
                  .map((pago) => (
                    <div
                      key={pago.id}
                      className="flex flex-col bg-white text-[13px] rounded-2xl px-3 py-1"
                    >
                      <p className="font-semibold">
                        {pago.nombre}: S/. {pago.monto}
                      </p>
                      {pago.estado_pago === "pagado" ? (
                        <p>Fecha: {formatDate(pago.fecha_pago)}</p>
                      ) : (
                        <p className="text-[#FF1E00] border border-[#FF1E00] rounded-2xl px-2">
                          Por pagar
                        </p>
                      )}
                    </div>
                  ))}
              </div>
              <div className="flex w-[150px] justify-center">
                S/. {calculateTotal(pagoInfo.pagos)}
              </div>
              <div className="flex w-[200px] justify-center gap-2">
                <button
                  className="px-2 py-1 bg-[#1C1C34] text-white text-xs rounded-md"
                  onClick={() => handleActualizarClick(pagoInfo)}
                >
                  Actualizar Pagos
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white text-xs rounded-md"
                  onClick={() => handleEliminarClick(pagoInfo)}
                >
                  Eliminar
                </button>
              </div>
            </div>

            {/* Vista Mobile/Tablet */}
            <div
              className={`md:hidden flex flex-col gap-2 text-[#575051] font-normal p-4 rounded-2xl ${
                idx % 2 === 0 ? "bg-[#E9E7E7]" : "bg-white"
              }`}
            >
              <div>
                <span className="font-semibold">IdPago:</span>{" "}
                {pagoInfo.id_infopago}
              </div>
              <div>
                <span className="font-semibold">Delegado:</span>{" "}
                {pagoInfo.delegado}
              </div>
              <div>
                <span className="font-semibold">Contrato:</span>{" "}
                {pagoInfo.contrato}
              </div>
              <div>
                <span className="font-semibold">Pagos:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {pagoInfo.pagos
                    .sort((a, b) => a.nombre.localeCompare(b.nombre))
                    .map((pago) => (
                      <div
                        key={pago.id}
                        className="bg-gray-100 rounded-lg px-2 py-1 text-xs"
                      >
                        <p>
                          {pago.nombre}: S/. {pago.monto}
                        </p>
                        {pago.estado_pago === "pagado" ? (
                          <p className="text-green-600 text-[10px]">
                            {formatDate(pago.fecha_pago)}
                          </p>
                        ) : (
                          <p className="text-[#FF1E00] text-[10px]">Por pagar</p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <span className="font-semibold">Monto Total:</span> S/.{" "}
                {calculateTotal(pagoInfo.pagos)}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="flex-1 px-1 py-1 bg-[#1C1C34] text-white text-[10px] rounded-md"
                  onClick={() => handleActualizarClick(pagoInfo)}
                >
                  Actualizar 
                </button>
                <button
                  className="flex-1 px-1 py-1 border border-red-500 text-red-500 text-[10px] rounded-md"
                  onClick={() => handleEliminarClick(pagoInfo)}
                >
                  Eliminar
                </button>
              </div>
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
