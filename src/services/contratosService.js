import api from "./api";

const listarContratosAsignados = async () => {
  try {
    const { data } = await api.get(`/asesoramiento/listarContratosAsignados`);
    return data;
  } catch (error) {
    console.log("Error al obtener contratos asignados");
  }
};
const ListarContratoNoAsignados = async () => {
  try {
    const response = await api.get("/contrato/contratosNoAsignados");
    return response.data; // Aquí accedemos directamente a 'data'
  } catch (error) {
    console.error("Error al obtener los contratos no asignados:", error);
    throw error; // Re-lanzamos el error para manejarlo en el componente
  }
};

const CrearContrato = async (idAsesoramiento, contratoData) => {
  try {
    // Usamos idAsesoramiento en la URL para asociar el contrato con el asesoramiento
    const response = await api.post(
      `/contrato/crear-contrato/${idAsesoramiento}`,
      contratoData
    );
    return response.data; // Aquí accedemos directamente a 'data'
  } catch (error) {
    console.error("Error al crear el contrato:", error);
    throw error; // Re-lanzamos el error para manejarlo en el componente
  }
};

const eliminarContrato = async (idContrato) => {
  try {
    const response = await api.delete(
      `/contrato/eliminar-contrato/${idContrato}`
    );
    return response.data; // Aquí accedemos directamente a 'data'
  } catch (error) {
    console.error("Error al eliminar el contrato:", error);
    throw error; // Re-lanzamos el error para manejarlo en el componente
  }
};

const actualizarContrato = async (idContrato, contratoData) => {
  try {
    const response = await api.put(
      `/contrato/editar-contrato/${idContrato}`,
      contratoData
    );
    return response.data; // Aquí accedemos directamente a 'data'
  } catch (error) {
    console.error("Error al actualizar el contrato:", error);
    throw error; // Re-lanzamos el error para manejarlo en el componente
  }
};

export const contratosService = {
  ListarContratoNoAsignados,
  CrearContrato,
  listarContratosAsignados,
  eliminarContrato,
  actualizarContrato,
};
