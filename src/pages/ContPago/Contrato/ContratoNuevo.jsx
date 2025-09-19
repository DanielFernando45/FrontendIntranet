import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import flechaabajo from "../../../assets/icons/Flecha.svg";
import flechaarriba from "../../../assets/icons/arrow-up.svg";
import { contratosService } from "../../../services/contratosService"; // Importamos el servicio

const ContratoNuevo = () => {
  const [expandedIds, setExpandedIds] = useState({}); // Usamos un objeto para controlar la expansión
  const [asigContrato, setAsigContrato] = useState(false);
  const [servicio, setServicio] = useState(false);
  const [formData, setFormData] = useState({
    modalidad: "",
    servicio: "",
    idCategoria: "", // Se asume que esto es un UUID
    idTipoTrabajo: "", // Número para el tipo de trabajo
    idTipoPago: "", // Número para el tipo de pago
    fechaInicio: "",
    fechaFin: "",
  });
  const [currentIdAsesoramiento, setCurrentIdAsesoramiento] = useState(null); // Nuevo estado para el idAsesoramiento

  const toggleExpand = (id) => {
    setExpandedIds((prevExpandedIds) => ({
      ...prevExpandedIds,
      [id]: !prevExpandedIds[id], // Alternamos el estado de expansión para el contrato con ese id
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("es-ES", options);
  };

  const displayStudents = (estudiantes) => {
    if (!Array.isArray(estudiantes)) {
      return "----------"; // Si no es un array, devolvemos un valor por defecto
    }
    if (estudiantes.length === 0) {
      return "----------"; // Si no hay estudiantes, devolvemos "----------"
    } else if (estudiantes.length === 1) {
      return estudiantes[0].estudiante; // Si hay un solo estudiante, lo mostramos
    } else {
      return estudiantes[0].estudiante; // Si hay más de uno, mostramos solo el primer estudiante
    }
  };

  // Usamos TanStack Query con useQuery para obtener los contratos no asignados
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
    onError: (error) => {
      console.error("Error al cargar los contratos:", error);
    },
  });

  // Si está cargando
  if (isLoading) return <div>Cargando...</div>;

  // Si hay error
  if (isError) {
    console.error(error);
    return <div>Error al cargar los contratos: {error.message}</div>;
  }

  const mutation = useMutation({
    mutationFn: (idAsesoramiento) =>
      contratosService.CrearContrato(idAsesoramiento, {
        ...formData,
        idTipoTrabajo: parseInt(formData.idTipoTrabajo), // Convertimos tipoTrabajo a número
        idTipoPago: parseInt(formData.idTipoPago), // Convertimos tipoPago a número
        idCategoria: formData.idCategoria || null, // Si no se selecciona categoría, lo enviamos como null
      }),
    onSuccess: () => {
      alert("Contrato creado exitosamente");
      setAsigContrato(false); // Cerrar el modal
    },
    onError: (error) => {
      console.error("Error al crear el contrato:", error.response?.data); // Ver respuesta detallada del servidor
      alert(
        `Error al crear el contrato: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const handleFormSubmit = () => {
    // Asegurarse de que el id está presente antes de realizar la solicitud
    if (currentIdAsesoramiento) {
      console.log(
        "Enviando contrato con ID Asesoramiento:",
        currentIdAsesoramiento
      ); // Mostrar el ID que estamos enviando
      mutation.mutate(currentIdAsesoramiento); // Llamamos la mutación para crear el contrato
    } else {
      alert("No se ha seleccionado un asesoramiento.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-[25px] font-medium">Contratos Nuevos</h1>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between px-1 text-[#495D72] font-medium">
          <div className="w-[100px]">IdAsesoria</div>
          <div className="w-[300px] text-center">Delegado</div>
          <div className="w-[300px] text-center">Alumnos</div>
          <div className="w-[300px] text-center">Asesor</div>
          <div className="w-[200px] text-center">Asig.Contrato</div>
        </div>
        <div className="flex flex-col gap-1 px-1">
          {contratosNoAsignados.map((contrato, index) => (
            <React.Fragment key={contrato.id_asesoramiento}>
              <div
                className={`flex justify-between px-1 rounded-md ${
                  index % 2 === 0 ? "bg-[#E9E7E7]" : ""
                } py-2`}
              >
                <div className="w-[100px]">
                  {contrato.id_asesoramiento.toString().padStart(4, "0")}
                </div>
                <div className="w-[300px]">{contrato.delegado}</div>

                <div className="w-[300px]">
                  {displayStudents(contrato.estudiantes)}{" "}
                </div>
                <div className="w-[300px]">{contrato.asesor}</div>
                <div className="flex w-[200px] justify-between px-3">
                  <button
                    className="bg-[#1C1C34] text-white font-medium px-7 rounded-md "
                    onClick={() => {
                      setAsigContrato(true);
                      setCurrentIdAsesoramiento(contrato.id_asesoramiento); // Guardamos el id del contrato
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
                      alt={
                        expandedIds[contrato.id_asesoramiento]
                          ? "Cerrar"
                          : "Expandir"
                      }
                    />
                  </button>
                </div>
              </div>

              {expandedIds[contrato.id_asesoramiento] && (
                <div
                  className={`px-4 py-2 rounded-b-md ${
                    index % 2 === 0 ? "bg-[#E9E7E7]" : "bg-white"
                  }`}
                >
                  <div className="font-medium mb-2">Estudiantes :</div>
                  {contrato.estudiantes && contrato.estudiantes.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {contrato.estudiantes.map((estudiante) => (
                        <li key={estudiante.id_estudiante}>
                          {estudiante.estudiante}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500">
                      Solo tienes 1 estudiante
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {asigContrato && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setAsigContrato(false)}
        >
          <div
            className="flex flex-col gap-8 w-[800px] bg-white shadow-md rounded-xl p-10 border border-[#E9E7E7]"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-[25px] font-semibold">Asignar Contrato</h1>
            <div className="flex flex-col gap-5">
              <div className="flex justify-start gap-14">
                <div className="flex flex-col gap-1 w-[200px]">
                  <label className="text-[17px] font-medium">Modalidad:</label>
                  <select
                    className="bg-[#E9E7E7] rounded-2xl p-3 h-[50px]"
                    onChange={(e) =>
                      setFormData({ ...formData, modalidad: e.target.value })
                    }
                  >
                    <option disabled>Seleccionar</option>
                    <option value="Avance">Avance</option>
                    <option value="Plazo">Plazo</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 w-[200px]">
                  <label className="text-[17px] font-medium">Servicio:</label>
                  <select
                    className="bg-[#E9E7E7] rounded-2xl p-3 h-[50px]"
                    onChange={(e) =>
                      setFormData({ ...formData, servicio: e.target.value })
                    }
                  >
                    <option disabled>Seleccionar</option>
                    <option value="Proyecto">Proyecto</option>
                    <option value="Inf.Final">Inf.Final</option>
                    <option value="Completo">Completo</option>
                  </select>
                </div>
                {formData.servicio === "Completo" && (
                  <div className="flex flex-col gap-1 w-[200px]">
                    <label className="text-[17px] font-medium">
                      Categoría:
                    </label>
                    <select
                      className="bg-[#E9E7E7] rounded-2xl p-3 h-[50px]"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          idCategoria: e.target.value,
                        })
                      }
                    >
                      <option disabled>Seleccionar</option>
                      <option value="5f1b4ec3-3777-4cbc-82a0-cd33d9aec4a0">
                        Oro
                      </option>
                      <option value="c4ad9ec9-2631-47fb-92e3-5493e2cc1703">
                        Bronce
                      </option>
                      <option value="cdf0ac54-a9f1-4f06-bcfe-f4f5a1d5b4d1">
                        Plata
                      </option>
                    </select>
                  </div>
                )}
              </div>
              <div className="flex justify-start gap-20">
                <div className="flex flex-col gap-1 w-[300px]">
                  <label className="text-[17px] font-medium">
                    Tipo Trabajo:
                  </label>
                  <select
                    className="bg-[#E9E7E7] rounded-2xl p-3 h-[50px]"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        idTipoTrabajo: e.target.value,
                      })
                    }
                  >
                    <option disabled>Seleccionar</option>
                    <option value={1}>Proyecto Bachillerato</option>
                    <option value={2}>Tesis Pregrado</option>
                    <option value={3}>Tesis</option>
                    <option value={4}>Tesis Maestría</option>
                    <option value={5}>Tesis Doctorado</option>
                    <option value={6}>Plan de Negocios</option>
                    <option value={7}>Revisión Sistemática</option>
                    <option value={8}>Artículo Científico</option>
                    <option value={9}>Estudio de Prefactibilidad</option>
                    <option value={10}>Suficiencia Profesional</option>
                    <option value={11}>Tesis Segunda Especialidad</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 w-[300px]">
                  <label className="text-[17px] font-medium">
                    Tipo de Pago:
                  </label>
                  <select
                    className="bg-[#E9E7E7] rounded-2xl p-3 h-[50px]"
                    onChange={(e) =>
                      setFormData({ ...formData, idTipoPago: e.target.value })
                    }
                  >
                    <option disabled>Seleccionar</option>
                    <option value={1}>Contado</option>
                    <option value={2}>Cuotas</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-start gap-20">
                <div className="flex flex-col gap-1 w-[300px]">
                  <label className="text-[17px] font-medium">
                    Fecha Inicio:
                  </label>
                  <input
                    className="bg-[#E9E7E7] rounded-2xl p-3 h-[50px]"
                    type="date"
                    onChange={(e) =>
                      setFormData({ ...formData, fechaInicio: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1 w-[300px]">
                  <label className="text-[17px] font-medium">
                    Fecha Final:
                  </label>
                  <input
                    className="bg-[#E9E7E7] rounded-2xl p-3 h-[50px]"
                    type="date"
                    onChange={(e) =>
                      setFormData({ ...formData, fechaFin: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-5 justify-end">
              <button
                className="border border-[#1C1C34] rounded-md px-10 py-2"
                onClick={() => setAsigContrato(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-[#1C1C34] rounded-md px-14 py-2 text-white"
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
