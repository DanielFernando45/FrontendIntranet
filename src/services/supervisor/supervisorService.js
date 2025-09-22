// src/services/supervisor/supervisorService.js
import api from "../api";

const obtenerAreasPorSupervisor = async (idSupervisor) => {
  const { data } = await api.get(`/supervisor/areas/${idSupervisor}`);
  return data;
};

// ✅ Exporta como objeto
export const supervisorService = {
  obtenerAreasPorSupervisor,
};
