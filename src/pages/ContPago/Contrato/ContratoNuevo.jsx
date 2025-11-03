import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import flechaabajo from "../../../assets/icons/Flecha.svg";
import flechaarriba from "../../../assets/icons/arrow-up.svg";
import { contratosService } from "../../../services/contratosService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // 👈 importación del toast

const ContratoNuevo = () => {
  const [expandedIds, setExpandedIds] = useState({});
  const [asigContrato, setAsigContrato] = useState(false);
  const [formData, setFormData] = useState({
    modalidad: "",
    servicio: "",
    idCategoria: "",
    idTipoTrabajo: "",
    idTipoPago: "",
    fechaInicio: "",
    fechaFin: "",
    documentos: "",
  });
  const [currentIdAsesoramiento, setCurrentIdAsesoramiento] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage] = useState(5); // Elementos por página
  const navigate = useNavigate();

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Mostrar solo un estudiante resumido
  const displayStudents = (clientes) => {
    if (!Array.isArray(clientes) || clientes.length === 0) return "----------";
    if (clientes.length === 1) return clientes[0]?.estudiante || "----------";
    return `${clientes[0]?.estudiante || "Estudiante"} +${
      clientes.length - 1
    } más`;
  };

  const {
    data: contratosNoAsignados = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["contratosNoAsignados"],
    queryFn: contratosService.ListarContratoNoAsignados,
    refetchOnWindowFocus: false,
    initialData: [],
    onError: (error) => console.error("Error al cargar los contratos:", error),
  });

  const mutation = useMutation({
    mutationFn: (idAsesoramiento) =>
      contratosService.CrearContrato(idAsesoramiento, {
        ...formData,
        idTipoTrabajo: parseInt(formData.idTipoTrabajo),
        idTipoPago: parseInt(formData.idTipoPago),
        idCategoria: formData.idCategoria || null,
      }),
    onSuccess: () => {
      toast.success("Contrato creado exitosamente 🎉");
      setAsigContrato(false);
    },
    onError: (error) => {
      console.error("Error al crear el contrato:", error.response?.data);
      toast.error(
        `Error al crear el contrato: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const handleFormSubmit = () => {
    if (mutation.isLoading) return; // 🚫 Previene clicks repetidos

    if (!currentIdAsesoramiento) {
      toast.error("⚠️ No se ha seleccionado un asesoramiento.");
      return;
    }

    const toastId = toast.loading("🧾 Creando contrato...");

    mutation.mutate(currentIdAsesoramiento, {
      onSuccess: () => {
        toast.dismiss(toastId);
        toast.success("Contrato creado exitosamente 🎉");
        setAsigContrato(false);
        navigate("/cont-pago/contratos?tab=asignado");
      },
      onError: (error) => {
        toast.dismiss(toastId);
        console.error("Error al crear el contrato:", error.response?.data);
        toast.error(
          `Error al crear el contrato: ${
            error.response?.data?.message || error.message
          }`
        );
      },
    });
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContracts = contratosNoAsignados.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(contratosNoAsignados.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar: {error.message}</div>;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl sm:text-2xl font-medium">Contratos Nuevos</h1>
      <div className="hidden md:grid grid-cols-5 gap-2 px-2 text-[#495D72] font-medium text-sm sm:text-base">
        <div>ID Asesoria</div>
        <div className="text-center">Delegado</div>
        <div className="text-center">Alumnos</div>
        <div className="text-center">Asesor</div>
        <div className="text-center">Acciones</div>
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-2">
        {contratosNoAsignados.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            No hay contratos nuevos por asignar
          </div>
        ) : (
          currentContracts.map((contrato, index) => (
            <React.Fragment key={contrato.id_asesoramiento}>
              <div
                className={`grid grid-cols-1 md:grid-cols-5 gap-2 items-center p-2 rounded-md ${
                  index % 2 === 0 ? "bg-[#E9E7E7]" : "bg-white"
                }`}
              >
                <div className="text-sm">
                  {contrato.id_asesoramiento.toString().padStart(4, "0")}
                </div>
                <div>{contrato.delegado}</div>
                <div>
                  {displayStudents(
                    Array.isArray(contrato.cliente) ? contrato.cliente : []
                  )}
                </div>
                <div>{contrato.asesor}</div>
                <div className="flex justify-between md:justify-center gap-2">
                  <button
                    className="bg-[#1C1C34] text-white text-sm px-4 py-1 rounded-md"
                    onClick={() => {
                      setAsigContrato(true);
                      setCurrentIdAsesoramiento(contrato.id_asesoramiento);
                    }}
                  >
                    Contrato
                  </button>
                  <button
                    onClick={() => toggleExpand(contrato.id_asesoramiento)}
                  >
                    <img
                      src={
                        expandedIds[contrato.id_asesoramiento]
                          ? flechaarriba
                          : flechaabajo
                      }
                      alt="toggle"
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </div>

              {/* Expandible */}
              {expandedIds[contrato.id_asesoramiento] && (
                <div className="px-4 py-2 text-sm bg-gray-50 rounded-md">
                  <div className="font-medium mb-1">Estudiantes:</div>
                  {Array.isArray(contrato.cliente) &&
                  contrato.cliente.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {contrato.cliente.map((e) => (
                        <li key={e.id_estudiante}>{e.estudiante}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500">
                      No hay estudiantes asignados
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => handlePageChange(1)}
            className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors"
            disabled={currentPage === 1}
          >
            {"<<"}
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors"
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          <span className="flex items-center justify-center">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors"
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors"
            disabled={currentPage === totalPages}
          >
            {">>"}
          </button>
        </div>
      )}

      {/* Modal */}
      {asigContrato && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setAsigContrato(false)}
        >
          <div
            className="w-[95%] max-w-4xl bg-white shadow-md rounded-xl p-6 sm:p-10 border border-[#E9E7E7] overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-xl sm:text-2xl font-semibold mb-4">
              Asignar Contrato
            </h1>

            {/* Formulario */}
            <div className="flex flex-col gap-6">
              {/* Modalidad y Servicio */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col w-full md:w-1/2">
                  <label className="text-sm sm:text-base font-medium">
                    Modalidad:
                  </label>
                  <select
                    className="bg-[#E9E7E7] rounded-lg p-2"
                    onChange={(e) =>
                      setFormData({ ...formData, modalidad: e.target.value })
                    }
                  >
                    <option>Seleccionar</option>
                    <option value="Avance">Avance</option>
                    <option value="Plazo">Plazo</option>
                  </select>
                </div>
                <div className="flex flex-col w-full md:w-1/2">
                  <label className="text-sm sm:text-base font-medium">
                    Servicio:
                  </label>
                  <select
                    className="bg-[#E9E7E7] rounded-lg p-2"
                    onChange={(e) =>
                      setFormData({ ...formData, servicio: e.target.value })
                    }
                  >
                    <option>Seleccionar</option>
                    <option value="Proyecto">Proyecto</option>
                    <option value="Inf.Final">Inf.Final</option>
                    <option value="Completo">Completo</option>
                  </select>
                </div>
              </div>

              {/* Categoría visible solo si es Completo */}
              {formData.servicio === "Completo" && (
                <div className="flex flex-col">
                  <label className="text-sm sm:text-base font-medium">
                    Categoría:
                  </label>
                  <select
                    className="bg-[#E9E7E7] rounded-lg p-2"
                    onChange={(e) =>
                      setFormData({ ...formData, idCategoria: e.target.value })
                    }
                  >
                    <option>Seleccionar</option>
                    <option value="5f1b4ec3-3777-4cbc-82a0-cd33d9aec4a0">
                      Oro
                    </option>
                    <option value="cdf0ac54-a9f1-4f06-bcfe-f4f5a1d5b4d1">
                      Plata
                    </option>
                    <option value="c4ad9ec9-2631-47fb-92e3-5493e2cc1703">
                      Bronce
                    </option>
                  </select>
                </div>
              )}

              {/* Tipo Trabajo y Pago */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col w-full md:w-1/2">
                  <label className="text-sm sm:text-base font-medium">
                    Tipo Trabajo:
                  </label>
                  <select
                    className="bg-[#E9E7E7] rounded-lg p-2"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        idTipoTrabajo: e.target.value,
                      })
                    }
                  >
                    <option>Seleccionar</option>
                    <option value={1}>Proyecto Bachillerato</option>
                    <option value={2}>Tesis Pregrado</option>
                    <option value={3}>Tesis Maestría</option>
                    <option value={4}>Tesis Doctorado</option>
                    <option value={5}>Plan de negocios</option>
                    <option value={6}>Revisión sistemática</option>
                    <option value={7}>Articulo Cientifico</option>
                    <option value={8}>Estudio de prefactibilidad</option>
                    <option value={9}>Suficiencia profesional</option>
                    <option value={10}>Tesis Segunda Especialidad</option>
                  </select>
                </div>
                <div className="flex flex-col w-full md:w-1/2">
                  <label className="text-sm sm:text-base font-medium">
                    Tipo de Pago:
                  </label>
                  <select
                    className="bg-[#E9E7E7] rounded-lg p-2"
                    onChange={(e) =>
                      setFormData({ ...formData, idTipoPago: e.target.value })
                    }
                  >
                    <option>Seleccionar</option>
                    <option value={1}>Contado</option>
                    <option value={2}>Cuotas</option>
                  </select>
                </div>
              </div>

              {/* Fechas */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col w-full md:w-1/2">
                  <label className="text-sm sm:text-base font-medium">
                    Fecha Inicio:
                  </label>
                  <input
                    type="date"
                    className="bg-[#E9E7E7] rounded-lg p-2"
                    onChange={(e) =>
                      setFormData({ ...formData, fechaInicio: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col w-full md:w-1/2">
                  <label className="text-sm sm:text-base font-medium">
                    Fecha Final:
                  </label>
                  <input
                    type="date"
                    className="bg-[#E9E7E7] rounded-lg p-2"
                    onChange={(e) =>
                      setFormData({ ...formData, fechaFin: e.target.value })
                    }
                  />
                </div>
              </div>
              {/* Subida de documento */}
              <div className="flex flex-col">
                <label className="text-sm sm:text-base font-medium">
                  Documento (Word o PDF):
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="bg-[#E9E7E7] rounded-lg p-2"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const validTypes = [
                      "application/pdf",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ];
                    if (!validTypes.includes(file.type)) {
                      alert(
                        "Solo se permiten archivos PDF o Word (.doc, .docx)"
                      );
                      e.target.value = ""; // limpia el input
                      return;
                    }
                    setFormData({ ...formData, documentos: File });
                  }}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="border border-[#1C1C34] rounded-md px-6 py-2 text-sm sm:text-base"
                onClick={() => setAsigContrato(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-[#1C1C34] rounded-md px-8 py-2 text-sm sm:text-base text-white"
                onClick={handleFormSubmit}
              >
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContratoNuevo;
