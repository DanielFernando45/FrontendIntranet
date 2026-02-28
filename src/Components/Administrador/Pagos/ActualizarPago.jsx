import React, { useState, useEffect } from "react";
import check from "../../../assets/icons/check.svg";
import toast from "react-hot-toast";

const ActualizarPago = ({ onClose, pagoData }) => {
  const [numeroCuotas, setNumeroCuotas] = useState(1);
  const [cuotas, setCuotas] = useState([]);
  const [totalPagar, setTotalPagar] = useState("");
  const [exito, setExito] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pagoData) {
      setNumeroCuotas(pagoData.numero_cuotas);
      setTotalPagar(pagoData.total_pagar);
      
      // Procesar las cuotas para asegurar que tengan el formato correcto
      const cuotasProcesadas = pagoData.cuotas.map((cuota, index) => ({
        ...cuota,
        // Asegurar que la fecha esté en formato YYYY-MM-DD para el input date
        fecha_pago: cuota.fecha_pago ? cuota.fecha_pago.split('T')[0] : "",
        // Mantener el estado original
        estado_original: cuota.estado_pago
      }));
      
      setCuotas(cuotasProcesadas);
    }
  }, [pagoData]);

  const handleNumeroCuotasChange = (e) => {
    const value = Number(e.target.value);
    setNumeroCuotas(value);
    
    // Ajustar el array de cuotas según el nuevo número seleccionado
    if (value < cuotas.length) {
      // Si se reduce el número, eliminar las cuotas sobrantes
      setCuotas(cuotas.slice(0, value));
    } else if (value > cuotas.length) {
      // Si se aumenta el número, agregar nuevas cuotas
      const nuevasCuotas = [...cuotas];
      for (let i = cuotas.length; i < value; i++) {
        nuevasCuotas.push({
          id: null,
          nombre: `Cuota ${i + 1}`,
          monto: "",
          fecha_pago: "",
          estado_pago: "por_pagar",
          estado_original: "por_pagar"
        });
      }
      setCuotas(nuevasCuotas);
    }
  };

  const handleCuotaChange = (index, field, value) => {
    const nuevasCuotas = [...cuotas];
    nuevasCuotas[index][field] = value;
    
    // Si se está actualizando la fecha de pago, cambiar el estado a PAGADO
    if (field === 'fecha_pago' && value) {
      nuevasCuotas[index].estado_pago = 'pagado';
    }
    
    // Si se limpia la fecha de pago, cambiar el estado a POR_PAGAR
    if (field === 'fecha_pago' && !value) {
      nuevasCuotas[index].estado_pago = 'por_pagar';
    }
    
    setCuotas(nuevasCuotas);
  };

  const validarMontos = () => {
    // Validar que todas las cuotas tengan monto
    for (let i = 0; i < cuotas.length; i++) {
      if (!cuotas[i].monto || cuotas[i].monto <= 0) {
        toast.error(`Por favor ingrese un monto válido para la ${cuotas[i].nombre}`);
        return false;
      }
    }

    // Validar que la suma de las cuotas sea igual al total
    const sumaCuotas = cuotas.reduce((acc, cuota) => acc + Number(cuota.monto), 0);
    if (Math.abs(sumaCuotas - Number(totalPagar)) > 0.01) {
      toast.error(`La suma de las cuotas (${sumaCuotas}) debe ser igual al total a pagar (${totalPagar})`);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (!validarMontos()) {
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Actualizando pagos...");

    try {
      // Construir el payload dinámicamente
      const payload = {
        numero_cuotas: numeroCuotas
      };
      
      // Agregar montos y fechas de todas las cuotas
      cuotas.forEach((cuota, index) => {
        const numCuota = index + 1;
        payload[`monto${numCuota}`] = Number(cuota.monto);
        
        // Solo enviar fecha si existe (esto marcará la cuota como pagada en el backend)
        if (cuota.fecha_pago) {
          payload[`fecha_pago${numCuota}`] = `${cuota.fecha_pago} 00:00:00`;
        }
      });

      console.log("Enviando payload:", payload); // Para debugging

      const response = await fetch(
        `${import.meta.env.VITE_API_PORT_ENV}/pagos/updateCuotas/${
          pagoData.id_infoPago
        }`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar los pagos");
      }

      toast.dismiss(toastId);
      setExito(true);
      toast.success("Pagos actualizados correctamente");

      setTimeout(() => {
        setExito(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      toast.dismiss(toastId);
      toast.error(error.message || "Error al actualizar los pagos");
    } finally {
      setLoading(false);
    }
  };

  // Generar opciones para el select de 2 a 6 cuotas
  const generarOpcionesCuotas = () => {
    const opciones = [];
    for (let i = 2; i <= 6; i++) {
      opciones.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return opciones;
  };

  // Función para organizar las cuotas en filas de máximo 2
  const renderizarCuotasEnFilas = () => {
    const filas = [];
    
    for (let i = 0; i < cuotas.length; i += 2) {
      const cuotasEnFila = Math.min(2, cuotas.length - i);
      filas.push(
        <div key={`fila-${i}`} className="flex flex-col md:flex-row gap-6 mt-4">
          {[...Array(cuotasEnFila)].map((_, index) => {
            const cuotaIndex = i + index;
            const cuota = cuotas[cuotaIndex];
            const isPagada = cuota.estado_pago === 'pagado';
            const cambiaEstado = cuota.estado_original !== cuota.estado_pago;
            
            return (
              <div 
                key={cuotaIndex} 
                className={`flex-1 border rounded-lg p-4 ${
                  isPagada ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg text-[#1C1C34]">
                    {cuota.nombre}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isPagada 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {isPagada ? 'PAGADO' : 'POR PAGAR'}
                    {cambiaEstado && isPagada && (
                      <span className="ml-1 text-green-600">●</span>
                    )}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-sm">Monto:</label>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#1C1C34] text-white rounded-full w-10 h-9 flex items-center justify-center font-bold text-sm">
                        S/.
                      </span>
                      <input
                        type="number"
                        value={cuota.monto}
                        onChange={(e) =>
                          handleCuotaChange(cuotaIndex, "monto", e.target.value)
                        }
                        disabled={loading}
                        placeholder="Ingrese un monto"
                        className="rounded-lg text-[#1C1C34] bg-white border border-gray-300 px-3 py-2 font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#1C1C34]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-sm">
                      Fecha de Pago:
                      <span className="text-xs text-gray-500 ml-2">
                        (Seleccione para marcar como pagado)
                      </span>
                    </label>
                    <input
                      type="date"
                      value={cuota.fecha_pago || ""}
                      onChange={(e) =>
                        handleCuotaChange(cuotaIndex, "fecha_pago", e.target.value)
                      }
                      disabled={loading}
                      className="rounded-lg text-[#1C1C34] bg-white border border-gray-300 px-3 py-2 font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#1C1C34]"
                    />
                    {isPagada && cuota.fecha_pago && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Pagado el {new Date(cuota.fecha_pago).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    
    return filas;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black bg-opacity-30">
      <div className="w-full max-w-5xl bg-white rounded-lg border border-[#D2CECF] px-6 py-8 max-h-[90vh] overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-4">Actualizar pagos por cuotas</h1>

        {exito && (
          <div className="flex items-center gap-2 text-green-600 font-semibold mb-4 bg-green-50 p-3 rounded-lg">
            <img src={check} alt="check" className="w-5 h-5" />
            Pagos actualizados correctamente
          </div>
        )}

        {/* Datos generales */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex flex-col w-full gap-2">
            <label className="font-medium">Alumno:</label>
            <input
              value={pagoData?.delegado || ""}
              disabled
              className="rounded-lg text-[#1C1C34] bg-gray-100 px-4 py-2 font-medium w-full border border-gray-200"
            />
          </div>
          <div className="flex flex-col w-full md:max-w-[180px] gap-2">
            <label className="font-medium">Número de cuotas:</label>
            <select
              onChange={handleNumeroCuotasChange}
              value={numeroCuotas}
              className="rounded-lg bg-white border border-gray-300 px-4 py-2 font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#1C1C34]"
            >
              {generarOpcionesCuotas()}
            </select>
          </div>
          <div className="flex flex-col w-full md:max-w-[220px] gap-2">
            <label className="font-medium">Total a pagar:</label>
            <input
              disabled
              value={totalPagar}
              className="rounded-lg text-[#1C1C34] bg-gray-100 px-4 py-2 font-medium w-full border border-gray-200"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Instrucciones:</span> Para marcar una cuota como pagada, seleccione una fecha en el campo "Fecha de Pago". El estado cambiará automáticamente a PAGADO.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-6 mb-4 border-b pb-2">Detalle de Cuotas</h2>

        {/* Cuotas dinámicas organizadas en filas */}
        {renderizarCuotasEnFilas()}

        {/* Botones */}
        <div className="flex justify-end mt-8 gap-4 pt-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`h-10 w-[120px] border border-black rounded-[4px] text-[13px] font-bold text-[#02242B] transition-colors ${
              loading 
                ? "opacity-50 cursor-not-allowed bg-gray-100" 
                : "hover:bg-gray-100"
            }`}
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className={`h-10 w-[120px] bg-black rounded-[4px] text-[13px] font-bold text-white transition-colors ${
              loading 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:bg-gray-800"
            }`}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActualizarPago;