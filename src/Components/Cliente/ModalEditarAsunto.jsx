import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { asuntosService } from "../../services/asuntosServices";
import { TiDelete } from "react-icons/ti";
import { GoPlusCircle } from "react-icons/go";
import toast from "react-hot-toast"; // 👈 importación

const ModalEditarAsunto = ({ onClose, idAsunto }) => {
  const userAuth = JSON.parse(localStorage.getItem("user"));
  const addFile = useRef(null);
  const [tituloAsunto, setTituloAsunto] = useState("");
  const [files, setFiles] = useState([]);
  const [idAsesoramiento, setIdAsesoramiento] = useState(null);
  const [documentosEditar, setDocumentosEditar] = useState([]);
  const [idsElminar, setIdsEliminar] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ["obtenerAsuntoById", idAsunto],
    queryFn: () => asuntosService.asuntoById(idAsunto),
    enabled: !!idAsunto,
  });

  useEffect(() => {
    if (data) {
      const documentosEdi = data.asunto.documentos.map((doc) => ({
        id: doc.id,
        nombre: doc.nombre,
      }));

      setIdAsesoramiento(data.asunto?.asesoramiento.id);
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
    mutationFn: (body) => asuntosService.editarAsuntoEstudiante(body),
    onSuccess: () => {
      toast.success("Asunto actualizado correctamente");
      onClose();
      setIdsEliminar([]);
      setFiles([]);
    },
    onError: (error) => {
      console.error("Error al editar asunto:", error);
      toast.error("Hubo un error al actualizar el asunto ❌");
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

    if (archivosValidos.length === 0) {
      toast.error("No se aceptan archivos de este tipo ❌");
      return;
    }

    archivosValidos.forEach((file) => {
      setDocumentosEditar((prev) => [...prev, { id: null, nombre: file.name }]);
    });

    setFiles((prevFiles) => [...prevFiles, ...archivosValidos]);
  };

  const handleEdit = () => {
    if (tituloAsunto.trim().length === 0) {
      toast.error("El título del asunto no puede ir vacío ❌");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", tituloAsunto);
    formData.append("idAsesoramiento", idAsesoramiento);
    formData.append("idsElminar", JSON.stringify(idsElminar));

    if (typeof userAuth.role === "object" && userAuth.role.nombre) {
      formData.append("subido_por", userAuth.role.nombre);
    } else {
      formData.append("subido_por", userAuth.role);
    }

    files.forEach((file) => {
      formData.append("files", file);
    });

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
              <div key={documento.id ?? documento.nombre} className="flex">
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

export default ModalEditarAsunto;
