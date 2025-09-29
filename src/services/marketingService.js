import api from "./api";

const agregarHerramientas = async (formDataToSend) => {
  try {
    const response = await api.post(
      `/recursos/herramientas/add`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data; // devolvés los datos para usarlos afuera
  } catch (error) {
    console.error("Error al agregar herramientas:", error);
    throw error; // lo propagás si querés manejarlo donde lo llames
  }
};


export const marketingService = {
    agregarHerramientas

}