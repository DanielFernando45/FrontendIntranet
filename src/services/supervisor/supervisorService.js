// src/services/supervisor/supervisorService.js
import api from "../api";

const obtenerAreasPorSupervisor = async (idSupervisor) => {
  const { data } = await api.get(`/supervisor/areas/${idSupervisor}`);
  return data;
};

const obtenerAuditorias = async (idArea, idAsesor, fecha) => {
  const { data } = await api.get(`/auditoria/filtrar`, {
    params: { idArea, idAsesor, fecha },
  });
  return data;
};

// ✅ Exporta como objeto
export const supervisorService = {
  obtenerAreasPorSupervisor,
  obtenerAuditorias,
};
