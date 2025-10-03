import api from "./api";

const getCalendarioEstudiante = async (selectedAsesoriaId) => {
  const response = await api.get(
    `/common/calendario_estudiante/${selectedAsesoriaId}`
  );
  return response.data;
};

const getCalendarioAsesor = async (selectedAsesoriaId) => {
  const response = await api.get(
    `/common/calendario_asesor/${selectedAsesoriaId}`
  );
  return response.data;
};

export const commonService = {
  getCalendarioEstudiante,
  getCalendarioAsesor
};
