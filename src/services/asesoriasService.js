import api from "./api";

const asesorias = async () => {

  console.log(api.getUri())

  try {
    const { data } = await api.get(`/asesoramiento/listar/`);
    return data;
  } catch (error) {
    console.error("Error al obtener las asesorías del estudiante:", error);
  }
};

const asesoramientoById = async (id) => {
  try {
    const { data } = await api.get(
      `/asesoramiento/listar/${id}`
    );
    return data;
  } catch (error) {
    console.error("Error al obtener las asesorías del estudiante:", error);
  }
};

const asesoriasPorEstudiante = async (idEstudiante) => {
  try {
    const { data } = await api(
      `/cliente/miAsesoramiento/${idEstudiante}`
    );
    return data;
  } catch (error) {
    console.error("Error al obtener las asesorías del estudiante:", error);
    // throw error;
  }
};

const obtenerDelegado = async (idAsesoria) => {
  try {
    const { data } = await api.get(
      `/cliente/miAsesoramiento/${idAsesoria}`
    );
    return data;
  } catch (error) {
    console.error("Error al obtener las asesorías del estudiante:", error);
    // throw error;
  }
};

export const asesoriasService = {
  asesoriasPorEstudiante,
  asesorias,
  asesoramientoById,
  obtenerDelegado,
};
