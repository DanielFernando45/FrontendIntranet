import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { GoPlusCircle } from "react-icons/go";
import { TiDelete } from "react-icons/ti";
import { asuntosService } from "../../../services/asuntosServices";

const ModalEditarDoc = ({ idAsunto, onClose }) => {
  const userAuth = JSON.parse(localStorage.getItem("user"));
  const addFile = useRef(null);
  const [tituloAsunto, setTituloAsunto] = useState("");
  const [files, setFiles] = useState([]);
  const [idAsesoramiento, setIdAsesoramiento] = useState(null);
  const [documentosEditar, setDocumentosEditar] = useState([]);
  const [idsElminar, setIdsEliminar] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ["obtenerAsuntoTerminadosAsesor", idAsunto],
    queryFn: () => asuntosService.asuntoAsesorByIdAsunto(idAsunto),
    enabled: !!idAsunto,
  });

  useEffect(() => {
    if (data) {
      const documentosEdi = data.asunto.documentos.map((doc) => {
        return { id: doc.id, nombre: doc.nombre };
      });

      setIdAsesoramiento(data.asunto?.asesoramiento?.id);
      setDocumentosEditar(documentosEdi);
      setTituloAsunto(data.asunto?.titulo);
    }
  }, [data]);

  const deleteFromList = (documento) => {
    if (documento.id != null) {
      setIdsEliminar((prev) => [...prev, documento.id]);
    } else {
      setFiles((prevFiles) =>
        prevFiles.filter((file) => file.name !== documento.nombre)
      );
    }

    const documentosUpdate = documentosEditar.filter(
      (item) => item.nombre !== documento.nombre
    );
    setDocumentosEditar(documentosUpdate);
  };

  const mutate = useMutation({
    mutationFn: (body) => asuntosService.editarAsunto(body),
    onSuccess: () => {
      alert("Asunto actualizado");
      onClose();
      setIdsEliminar([]);
      setDocumentosEditar([]);
      setFiles([]);
    },
  });

  if (isLoading) return;

  const handleClickOutside = (e) => {
    if (e.target.id === "modal-background") {
      onClose();
    }
  };

  const tiposPermitidos = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
  ];

  const handleButtonClick = () => {
    if (addFile.current) {
      addFile.current.click();
    }
  };

  const handleFileChange = (e) => {
    const nuevosArchivos = Array.from(e.target.files);
    const archivosValidos = nuevosArchivos.filter((file) =>
      tiposPermitidos.includes(file.type)
    );

    if (archivosValidos.length === 0)
      return alert("No se acepta ese tipo de archivo");

    setDocumentosEditar((prev) => [
      ...prev,
      { id: null, nombre: archivosValidos[0].name },
    ]);

    setFiles((prevFiles) => [...prevFiles, ...archivosValidos]);
  };

  const handleEdit = () => {
    if (tituloAsunto.length === 0) {
      return alert("El asunto no puede ir vacío!");
    }
    if (documentosEditar.length === 0) {
      return alert("No puedes dejar los archivos vacíos!");
    }

    const formData = new FormData();
    formData.append("titulo", tituloAsunto);

    // ✅ enviar como JSON string
    formData.append("idsElminar", JSON.stringify(idsElminar ?? []));

    if (idAsesoramiento) {
      formData.append("idAsesoramiento", String(idAsesoramiento));
    }

    const roleValue =
      typeof userAuth?.role === "string"
        ? userAuth.role
        : userAuth?.role?.nombre;

    if (roleValue) {
      formData.append("subido_por", roleValue.toLowerCase()); // enum en minúsculas
    }

    files.forEach((file) => formData.append("files", file));

    // 🔍 debug
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    mutate.mutate({ idAsunto, formData });
  };

  return (
    <div
      id="modal-background"
      onClick={handleClickOutside}
      className="px-4 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto"
    >
      <div className="bg-[#F8F7F7] flex flex-col gap-4 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto transition-all duration-300">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>

        <div className="flex justify-center">
          <h2 className="text-xl font-medium">Editar Asunto</h2>
        </div>

        <div className="flex mb-4 gap-5 items-center">
          <label className="block text-sm mb-1">Asunto</label>
          <input
            type="text"
            onChange={(e) => setTituloAsunto(e.target.value)}
            value={tituloAsunto}
            placeholder="Inserte el asunto"
            className="border border-gray-400 shadow-sm w-full rounded px-3 py-[2px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex gap-3">
          <label className="text-sm mb-1 mt-1">Archivos</label>
          <div>
            {documentosEditar.map((documento) => (
              <div key={documento.nombre} className="flex items-center gap-2">
                <p>{documento.nombre}</p>
                <button onClick={() => deleteFromList(documento)}>
                  <TiDelete size={20} className="text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button className="block mx-auto" onClick={handleButtonClick}>
          <GoPlusCircle size={25} />
        </button>

        <input
          type="file"
          ref={addFile}
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          disabled={mutate.isPending}
          onClick={handleEdit}
          className={`bg-slate-700 w-[200px] mx-auto text-white rounded-lg py-2 ${
            mutate.isPending && "opacity-50"
          }`}
        >
          {mutate.isPending ? "Actualizando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
};

export default ModalEditarDoc;
