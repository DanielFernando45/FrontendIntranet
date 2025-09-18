import api from "./api";

const estudiantesPorAsignacion = async (idAsesoramiento) => {
  const { data } = await api.get(
    `/cliente/listar/${idAsesoramiento}`
  );
  return data;
};

const clientesSinAsignar = async () => {
  const { data } = await api.get("/cliente/filter/sin_asignar");
  return data;
};

const listarClientesAll = async () => {
  const { data } = await api.get("/cliente/filter/all");
  return data;
};


export const clientesService = {
  estudiantesPorAsignacion,
  clientesSinAsignar,
  listarClientesAll
};