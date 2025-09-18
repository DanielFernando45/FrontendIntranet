import api from "./api";

const asesorias = async () => {

  console.log(api.getUri())

  try {
    const { data } = await api.get(`/asesoramiento/listar/`);
    return data;
  } catch (error) {
    console.error("Error al obtener las asesorías del estudiante:", error);
  }

};

const listarContratosAsignados = async () => {
  try {
    const { data } = await api.get(`/asesoramiento/listarContratosAsignados`)
    return data;
  } catch (error) {
    console.log("Error al obtener contratos asignados")
  }
}

const asignacionesContratos = async () => {
  try {
    const { data } = await api.get(`/asesoramiento/listarAsignados`)
    return data;
  } catch (error) {
    console.log("Error al obtener asignaciones y Contratos")
  }
}

const asesorinducciones = async (id) => {
  try {
    const { data } = await api.get(
      `/procesos-asesoria/listadoInducciones/${id}`
    );
    return data
  } catch (error) {
    console.error("Error al obtener los clientes de este asesor")
  }
}

const asesoramientoSupervisor = async (id) => {
  try {
    const { data } = await api.get(
      `/asesoramiento/supervisoresListadoArea/${id}`
    );
    return data;
  } catch (error) {
    console.error("Error al obtener las asesorías del estudiante:", error);
  }
}
const asesoramientoById = async (id) => {
  try {
    const { data } = await api.get(
      `/asesoramiento/verInduccion/${id}`
    );
    return data;
  } catch (error) {
    console.error("Error al obtener las asesorías del estudiante:", error);
  }
};

// services/asesoriasService.ts
export const actualizarAsignamiento = async (id, datos) => {
  try {
    const { data } = await api.put(`/asesoramiento/Actualizar-Asignacion/${id}`, datos);
    return data;
  } catch (error) {
    console.error("[Actualizar-Asignacion] STATUS:", error?.response?.status);
    console.error("[Actualizar-Asignacion] DATA:", error?.response?.data);
    throw error;
  }
};


const asesoriasPorEstudiante = async (idEstudiante) => {
  try {
    const { data } = await api(
      `/cliente/miAsesoramiento/${idEstudiante}`
    );
    return data;
  } catch (error) {
    console.error("Error al obtener las asesorías del estudiante:", error);
    // throw error;
  }
};

const obtenerDelegado = async (idAsesoria) => {
  try {
    const { data } = await api.get(
      `/cliente/miAsesoramiento/${idAsesoria}`
    );
    return data;
  } catch (error) {
    console.error("Error al obtener las asesorías del estudiante:", error);
    // throw error;
  }
};

const crearAsignacion = async (datos) => {
  try {
    const { data } = await api.post('/asesoramiento/crear-y-asignar', datos);
    return data;
  } catch (error) {
    console.error("Error al crear la asignación:", error?.response?.data || error.message);
    throw error;
  }
};

const obtenerAsesoramiento = async (id) => {
  try {
    const { data } = await api.get(`/asesoramiento/obtenerAsesoramiento/${id}`);
    return data;
  } catch (error) {
    console.error("Error al obtener el asesoramiento por ID:", error);
    throw error;
  }
};

export const asesoriasService = {
  asignacionesContratos,
  asesoriasPorEstudiante,
  asesorias,
  listarContratosAsignados,
  asesorinducciones,
  asesoramientoById,
  obtenerDelegado,
  crearAsignacion,
  obtenerAsesoramiento,
  actualizarAsignamiento,
  asesoramientoSupervisor,
};
