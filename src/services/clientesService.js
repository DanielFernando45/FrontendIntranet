import api from "./api";

const estudiantesPorAsignacion = async (idAsesoramiento) => {
  const { data } = await api.get(
    `/cliente/listar/${idAsesoramiento}`
  );
  return data;
};
export const clientesService = {
  estudiantesPorAsignacion,
};
