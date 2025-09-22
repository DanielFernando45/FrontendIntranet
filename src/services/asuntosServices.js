import api from "./api";

const asuntoById = async (id) => {
  const { data } = await api.get(`/asuntos/obtenerAsunto/${id}`);
  return data;
};

const asuntoAsesorByIdAsunto = async (id) => {
  const { data } = await api.get(
    `/asuntos/obtenerAsuntoTerminadosAsesor/${id}`
  );
  return data;
};

const eliminarAsunto = async (id) => {
  const { data } = await api.delete(`/asuntos/${id}`);
  return data;
};

const editarAsunto = async ({ idAsunto, formData }) => {
  const { data } = await api.put(`/asuntos/${idAsunto}`, formData);
  return data;
};

const editarFechaTerminadoAsuntoAsesor = async ({ idAsunto, horario }) => {
  const { data } = await api.put(
    `/asuntos/editarFechaAsuntoPendiente/${idAsunto}`,
    { horario }
  );
  return data;
};

export const asuntosService = {
  asuntoById,
  eliminarAsunto,
  editarAsunto,
  asuntoAsesorByIdAsunto,
  editarFechaTerminadoAsuntoAsesor,
};
