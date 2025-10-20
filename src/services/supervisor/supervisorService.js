// src/services/supervisor/supervisorService.js
import api from "../api";

const obtenerAreasPorSupervisor = async (idSupervisor) => {
  const { data } = await api.get(`/supervisor/areas/${idSupervisor}`);
  return data;
};

const obtenerAuditorias = async (idArea, idAsesor, idCliente) => {
  const { data } = await api.get(
    `/auditoria/${idArea}/${idAsesor}/${idCliente}`
  );
  return data;
};

const obtenerClientesPorAsesor = async (idAsesor) => {
  if (!idAsesor) return [];
  try {
    const { data } = await api.get(`/asesor/${idAsesor}/clientes-delegados`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // ⚠️ Si el backend lanza NotFoundException, devolvemos []
    if (error.response?.status === 404) {
      console.warn("El asesor no tiene clientes delegados registrados.");
      return [];
    }

    console.error("Error al listar clientes delegados:", error);
    return [];
  }
};
// ✅ Exporta como objeto
export const supervisorService = {
  obtenerAreasPorSupervisor,
  obtenerAuditorias,
  obtenerClientesPorAsesor,
};
