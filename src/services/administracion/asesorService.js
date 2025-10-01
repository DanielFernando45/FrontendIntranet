import api from "../api";

const getAsesoramientosYDelegado = async (idAsesor) => {
  const res = await api.get(`/asesor/asesoramientosYDelegado/${idAsesor}`);
  return res.data;
};

export const asesorService = {
  getAsesoramientosYDelegado,
};
