import api from "./api";

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB por parte

 async function uploadLargeFile(file, onProgress) {
  const totalParts = Math.ceil(file.size / CHUNK_SIZE);
  const fileName = `inducciones/${Date.now()}-${file.name}`;

  // 1. Iniciar subida multipart
  const startRes = await api.post("/backblaze/start-large-upload", {
    fileName,
    contentType: file.type,
  });
  const fileId = startRes.data.fileId;

  const partSha1Array = [];
  let uploadedBytes = 0;

  for (
    let partNumber = 1, offset = 0;
    offset < file.size;
    partNumber++, offset += CHUNK_SIZE
  ) {
    const chunk = file.slice(offset, offset + CHUNK_SIZE);

    // 2. Obtener URL para subir la parte
    const partRes = await api.post("/backblaze/get-upload-part-url", {
      fileId,
    });

    const uploadUrl = partRes.data.uploadUrl;
    const authorizationToken = partRes.data.authorizationToken;

    // 3. Calcular SHA1 del chunk (Backblaze lo requiere)
    const chunkBuffer = await chunk.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-1", chunkBuffer);
    const sha1 = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // 4. Subir el chunk directamente
    console.log(`📤 Subiendo parte ${partNumber} de ${totalParts}`);
    await api.post(uploadUrl, chunk, {
      headers: {
        Authorization: authorizationToken,
        "X-Bz-Part-Number": partNumber,
        "Content-Length": chunk.size,
        "X-Bz-Content-Sha1": sha1,
      },
    });

    partSha1Array.push(sha1);
    uploadedBytes += chunk.size;

    if (onProgress) {
      onProgress(Math.round((uploadedBytes / file.size) * 100));
    }
  }

  // 5. Finalizar subida
  await api.post("/backblaze/finish-large-upload", {
    fileId,
    partSha1Array,
  });

  return `https://f004.backblazeb2.com/file/IntranetAlejandria/${fileName}`;
}

const registrarInduccion = async (body) => {
  try {
    await api.post("/inducciones", body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return error.response?.data?.message || "Error al registrar la inducción";
  }
};

const obtenerInduccionesByIdAsesoria = async (idAsesoramiento) => {
  try {
    const { data } = await api.get(
      `/inducciones/induccionesByAsesoria/${idAsesoramiento}`
    );

    return data;
  } catch (error) {
    return error.message
      ? error.message
      : "Error al intentar registrar la inducción";
  }
};

const borrarInduccionById = async (idAsesoramiento) => {
  try {
    const { data } = await api.delete(`/inducciones/${idAsesoramiento}`);
    return data;
  } catch (error) {
    return error.message
      ? error.message
      : "Error al intentar borrar la inducción";
  }
};

export const induccionesService = {
  registrarInduccion,
  uploadLargeFile,
  obtenerInduccionesByIdAsesoria,
  borrarInduccionById,
};
