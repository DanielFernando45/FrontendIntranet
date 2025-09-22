import api from "./api";

const tiposContratos = async () => {
  const response = api.get(`/common/listar-tipoContratos`);
  return response;
};

const tiposTrabajos = async () => {
  const response = api.get(`/common/listar-trabajos`);
  return response;
};

export const trabajosService = {
  tiposContratos,
  tiposTrabajos,
};
