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

const listarContratosAsignados = async() =>{
  try {
    const {data } = await api.get(`/asesoramiento/listarContratosAsignados`)
    return data;
  } catch (error) {
    console.log("Error al obtener contratos asignados")
  }
}

const asignacionesContratos = async() =>{
  try {
    const {data} = await api.get(`/asesoramiento/listarAsignados`)
    return data;
  } catch (error) {
    console.log("Error al obtener asignaciones y Contratos")
  }
}

const asesorinducciones = async (id) =>{
  try{
    const {data} = await api.get(
      `/procesos-asesoria/listadoInducciones/${id}`
    );
    return data
  }catch (error){
      console.error("Error al obtener los clientes de este asesor")
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

export const asesoriasService = {
  asignacionesContratos,
  asesoriasPorEstudiante,
  asesorias,
  listarContratosAsignados,
  asesorinducciones,
  asesoramientoById,
  obtenerDelegado,
};
