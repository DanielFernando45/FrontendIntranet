import api from "./api";

const reunionesPorFecha = async (idAsesor, fecha_reunion) => {
  if (fecha_reunion == null) {
    fecha_reunion = new Date().toISOString().split("T")[0];
  }
  const { data } = await api.get(
    `/reuniones/proximasReunionesPorFecha/${idAsesor}?fecha_reunion=${fecha_reunion}`
  );
  return data;
};
export const reunionesService = {
  reunionesPorFecha,
};
