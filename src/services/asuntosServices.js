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
  const { data } = await api.patch(`/asuntos/${idAsunto}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

const editarAsuntoEstudiante = async ({ idAsunto, formData }) => {
  const { data } = await api.patch(
    `/asuntos/estudiante/${idAsunto}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

const editarFechaTerminadoAsuntoAsesor = async ({
  idAsunto,
  fecha_estimada,
}) => {
  const { data } = await api.put(
    `/asuntos/editarFechaAsuntoPendiente/${idAsunto}`,
    { fecha_estimada } // 🚀 ya viene en ISO desde el modal
  );

  return data;
};
const agregarAsuntosFinales = async (id, formData) => {
  try {
    const res = await api.patch(
      `http://localhost:3001/asuntos/finished/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    console.log("Avance enviado:", res.data);
  } catch (err) {
    console.error("Error al enviar avance:", err.response?.data || err);
  }
};

export const asuntosService = {
  asuntoById,
  eliminarAsunto,
  editarAsunto,
  agregarAsuntosFinales,
  editarAsuntoEstudiante,
  asuntoAsesorByIdAsunto,
  editarFechaTerminadoAsuntoAsesor,
};
