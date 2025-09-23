import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { asuntosService } from "../../../../services/asuntosServices";
import { TiDelete } from "react-icons/ti";
import { GoPlusCircle } from "react-icons/go";

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
    mutationFn: (body) => asuntosService.editarAsunto(body),
    onSuccess: () => {
      alert("Asunto actualizado");
      onClose();
      setIdsEliminar([]);
      setFiles([]);
    },
    onError: (error) => {
      console.error("Error al editar asunto:", error);
      alert("Hubo un error al actualizar el asunto.");
    },
  });

  if (isLoading) return;

  const handleClickOutside = (e) => {
    if (e.target.id === "modal-background") {
      onClose();
    }
  };

  const tiposPermitidos = [
    // Documentos
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    // Imágenes
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    // Comprimidos
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
      return alert("No se aceptan archivos de este tipo.");
    }

    archivosValidos.forEach((file) => {
      setDocumentosEditar((prev) => [...prev, { id: null, nombre: file.name }]);
    });

    setFiles((prevFiles) => [...prevFiles, ...archivosValidos]);
  };

  const handleEdit = () => {
    if (tituloAsunto.trim().length === 0) {
      return alert("El título del asunto no puede estar vacío.");
    }

    const formData = new FormData();
    formData.append("titulo", tituloAsunto);
    formData.append("idAsesoramiento", idAsesoramiento);
    formData.append("idsElminar", JSON.stringify(idsElminar));

    // Corregido: asegúrate de enviar un string o número
    if (userAuth?.role?.nombre) {
      formData.append("subido_por", userAuth.role.nombre);
    } else if (typeof userAuth?.role === "string") {
      formData.append("subido_por", userAuth.role);
    } else {
      console.warn("Rol no definido correctamente:", userAuth.role);
      return alert("Error: Rol del usuario no válido.");
    }

    files.forEach((file) => {
      formData.append("files", file);
    });

    // Debug del contenido del formData
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    mutate.mutate({ idAsunto, formData });
  };

  return (
    <>
      {/* Overlay para móviles */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity xl:hidden ${
          activeSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setActiveSidebar(false)}
      />

      <aside
        className={`
        fixed top-0 left-0 h-full bg-white z-50 shadow-md transition-all duration-300
        ${activeSidebar ? "w-[200px] xl:w-[260px]" : "w-[64px]"}
        ${
          activeSidebar ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
        }
      `}
      >
        {/* Logo + Botón */}
        <div className="flex flex-col items-center py-4 gap-4">
          <img
            className="w-[40px] h-[40px]"
            src={LogoAleja}
            alt="logo"
            draggable="false"
          />
          {/* Botón hamburguesa visible solo en móvil */}
          <button
            className="text-gray-700 xl:hidden"
            onClick={() => setActiveSidebar(!activeSidebar)}
          >
            <IoMenuSharp size={26} />
          </button>
        </div>

        {/* Menú navegación */}
        <nav className="mt-4 h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <ul className="flex flex-col gap-1">
            {rutasPorRoles[role]?.map((item) => (
              <li key={item.title} className="group relative">
                <Link
                  to={item.path}
                  className="flex items-center h-[48px] px-3 transition-colors duration-200 border-l-4 border-transparent hover:border-gray-500"
                >
                  {/* Icono */}
                  <div className="min-w-[40px] flex justify-center items-center">
                    <img
                      src={item.icono}
                      alt={item.title}
                      className="w-5 h-5 object-contain"
                    />
                  </div>

                  {/* Título */}
                  <span
                    className={`
              text-sm font-medium ml-2 whitespace-nowrap transition-all duration-300
              ${
                activeSidebar
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2 xl:opacity-100 xl:translate-x-0"
              }
            `}
                  >
                    {item.title}
                  </span>
                </Link>

                {/* Tooltip si está colapsado */}
                {!activeSidebar && (
                  <span
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs rounded px-2 py-1
            opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
                  >
                    {item.title}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default ModalEditarAsunto;
