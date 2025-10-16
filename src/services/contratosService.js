import api from "./api";

const listarContratosAsignados = async () => {
  try {
    const { data } = await api.get(`/asesoramiento/listarContratosAsignados`);
    return data;
  } catch {
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
    const formData = new FormData();

    formData.append("modalidad", contratoData.modalidad);
    formData.append("servicio", contratoData.servicio);
    formData.append("idTipoTrabajo", contratoData.idTipoTrabajo);
    formData.append("idTipoPago", contratoData.idTipoPago);

    if (contratoData.idCategoria) {
      formData.append("idCategoria", contratoData.idCategoria);
    }
    if (contratoData.fechaInicio) {
      formData.append("fechaInicio", contratoData.fechaInicio);
    }
    if (contratoData.fechaFin) {
      formData.append("fechaFin", contratoData.fechaFin);
    }

    // 👇 Aquí se envía el archivo correctamente
    if (contratoData.documentos) {
      formData.append("files", contratoData.documentos); // <-- el backend espera 'files'
    }

    const response = await api.post(
      `/contrato/crear-contrato/${idAsesoramiento}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al crear el contrato:", error);
    throw error;
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
      contratoData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // 👈 obligatorio para enviar archivos
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el contrato:", error);
    throw error;
  }
};

export const contratosService = {
  ListarContratoNoAsignados,
  CrearContrato,
  listarContratosAsignados,
  eliminarContrato,
  actualizarContrato,
};
