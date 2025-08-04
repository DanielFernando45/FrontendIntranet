import api from "./api";

const registrarInduccion = async (body) => {

    try {
        await api.post('/inducciones', body, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    } catch (error) {
        return error.message ? error.message : 'Error al intentar registrar la inducción'
    }
}

const obtenerInduccionesByIdAsesoria = async (idAsesoramiento) => {
    console.log(typeof idAsesoramiento)
    try {
        const { data } = await api.get(`/inducciones/induccionesByAsesoria/${idAsesoramiento}`)
        console.log(data);

        return data;
    } catch (error) {
        return error.message ? error.message : 'Error al intentar registrar la inducción'
    }
}


const borrarInduccionById = async (idAsesoramiento) => {
    try {
        return { data } = await api.delete(`/inducciones/${idAsesoramiento}`)
    } catch (error) {
        return error.message ? error.message : 'Error al intentar borrar la inducción'
    }
}

export const induccionesService = {
    registrarInduccion,
    obtenerInduccionesByIdAsesoria,
    borrarInduccionById
}