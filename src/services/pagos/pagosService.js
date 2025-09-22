import api from "../api";

const listarPagosCuotas = async () => {
  try {
    const { data } = await api.get("/pago/listarPagosCuotas");
    return data;
  } catch (error) {
    console.error("Error al obtener los pagos en cuotas:", error);
    throw error; // Re-lanzamos el error para manejarlo en el componente
  }
};

const listarPagosContado = async () => {
  try {
    const { data } = await api.get("/pago/listarPagosCuotas");
    return data;
  } catch (error) {
    console.error("Error al obtener los pagos en cuotas:", error);
    throw error; // Re-lanzamos el error para manejarlo en el componente
  }
};

export const pagosService = {
  listarPagosCuotas,
  listarPagosContado,
};
