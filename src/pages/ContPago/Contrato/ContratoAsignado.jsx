import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";
import { useQuery, useMutation } from "@tanstack/react-query";
import { asesoriasService } from "../../../services/asesoriasService"; // Importamos el servicio
import { contratosService } from "../../../services/contratosService"; // Importamos el servicio

const ContratoAsignado = () => {
  const [editContrato, setEditContrato] = useState(false);
  const [eliminar, setEliminar] = useState(false);
  const [currentContrato, setCurrentContrato] = useState(null);
  const [formData, setFormData] = useState({
    modalidad: "",
    servicio: "",
    idCategoria: "", // Se asume que esto es un UUID
    idTipoTrabajo: "", // Número para el tipo de trabajo
    idTipoPago: "", // Número para el tipo de pago
    fechaInicio: "",
    fechaFin: "",
  });

  const { data: contrato, refetch } = useQuery({
    queryKey: ["contrato"],
    queryFn: async () => {
      const res = await asesoriasService.listarContratosAsignados();
      return res;
    },
    refetchOnWindowFocus: false,
    initialData: [],
  });

  // Mutación para editar el contrato
  const mutationEditar = useMutation({
    mutationFn: (idContrato) =>
      contratosService.actualizarContrato(idContrato, { ...formData }),
    onSuccess: () => {
      alert("Contrato editado exitosamente");
      setEditContrato(false); // Cerrar el modal
      refetch(); // Refrescamos los datos sin necesidad de recargar la página
    },
    onError: (error) => {
      console.error("Error al editar el contrato:", error.response?.data);
      alert(
        `Error al editar el contrato: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  // Mutación para eliminar el contrato
  const mutationEliminar = useMutation({
    mutationFn: (idContrato) => contratosService.eliminarContrato(idContrato),
    onSuccess: () => {
      alert("Contrato eliminado exitosamente");
      setEliminar(false); // Cerrar el modal
      refetch(); // Refrescamos los datos sin necesidad de recargar la página
    },
    onError: (error) => {
      console.error("Error al eliminar el contrato:", error.response?.data);
      alert(`Error al eliminar el contrato: ${error.response?.data?.message}`);
    },
  });

  // Función para manejar la edición del contrato
  const handleEditSubmit = () => {
    const fechaInicio = new Date(formData.fechaInicio);
    const fechaFin = new Date(formData.fechaFin);

    if (!formData.fechaInicio || !formData.fechaFin) {
      alert("Ambas fechas son obligatorias.");
      return;
    }

    if (fechaInicio > fechaFin) {
      alert("La fecha de inicio no puede ser mayor que la fecha de fin.");
      return;
    }

    // Formatear las fechas para MySQL
    const formattedFechaInicio = fechaInicio
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const formattedFechaFin = fechaFin
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    setFormData({
      ...formData,
      fechaInicio: formattedFechaInicio,
      fechaFin: formattedFechaFin,
    });

    if (currentContrato) {
      console.log("Enviando contrato con ID:", currentContrato.id_contrato);
      mutationEditar.mutate(currentContrato.id_contrato); // Llamamos la mutación para editar el contrato
    } else {
      alert("No se ha seleccionado un contrato.");
    }
  };

  // Función para manejar la eliminación del contrato
  const handleDeleteSubmit = () => {
    if (currentContrato) {
      mutationEliminar.mutate(currentContrato.id_contrato); // Llamamos la mutación para eliminar el contrato
    } else {
      alert("No se ha seleccionado un contrato.");
    }
  };

  // Función que se ejecuta al hacer clic en el botón de "Editar"
  const handleEditClick = (contrato) => {
    setEditContrato(true);
    setCurrentContrato(contrato); // Guardamos el contrato seleccionado para editar
    setFormData({
      modalidad: contrato.modalidad,
      servicio: contrato.servicio,
      idCategoria: contrato.id_categoria,
      idTipoTrabajo: contrato.id_tipoTrabajo,
      idTipoPago: contrato.id_tipoPago,
      fechaInicio: contrato.fecha_inicio,
      fechaFin: contrato.fecha_fin,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-[25px] font-medium">Contratos Asignados</h1>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between px-1 text-[#495D72] font-medium">
          <div className="w-[200px] text-center">IdContratos</div>
          <div className="w-[350px] text-center">Trab.Investigacion</div>
          <div className="w-[300px] text-center">Delegado</div>
          <div className="w-[200px] text-center">FechaRegistro</div>
          <div className="w-[200px] text-center">Modalidad</div>
          <div className="w-[200px] text-center">Tipo de Pago</div>
          <div className="w-[100px] text-center">Accion</div>
        </div>
        {contrato.map((contrato, index) => (
          <div key={index} className="flex justify-between px-1">
            <div className="w-[200px] text-center">
              {"CT-" + (index + 1).toString().padStart(3, "0")}
            </div>
            <div className="w-[350px] text-center">
              {contrato.trabajo_investigacion}
            </div>
            <div className="w-[300px] text-center">{contrato.delegado}</div>
            <div className="w-[200px] text-center">
              {new Date(contrato.fecha_registro).toLocaleDateString()}
            </div>
            <div className="w-[200px] text-center">{contrato.modalidad}</div>
            <div className="w-[200px] text-center">{contrato.tipo_pago}</div>
            <div className="w-[100px] flex justify-between px-2">
              <button
                className="p-1 bg-[#353563] rounded-md text-white"
                onClick={() => handleEditClick(contrato)} // Llamamos a handleEditClick
              >
                <FaRegEdit size={20} />
              </button>
              <button
                className="p-1 bg-[#353563] rounded-md text-white"
                onClick={() => {
                  setEliminar(true);
                  setCurrentContrato(contrato); // Guardamos el contrato seleccionado para eliminar
                }}
              >
                <IoTrash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Editar Contrato */}
      {editContrato && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setEditContrato(false)}
        >
          <div
            className="flex flex-col gap-8 w-[800px] bg-white shadow-md rounded-xl p-10 border border-[#E9E7E7]"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-[25px] font-semibold">Editar Contrato</h1>
            <div className="flex flex-col gap-5">
              <div className="flex justify-start gap-14">
                <div className="flex flex-col gap-1 w-[200px] ">
                  <label className="text-[17px] font-medium">Modalidad:</label>
                  <select
                    className="bg-[#E9E7E7] rounded-2xl p-3 h-[50px]"
                    value={formData.modalidad}
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
                    value={formData.servicio}
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
                      value={formData.idCategoria}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          idCategoria: e.target.value,
                        })
                      }
                    >
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

              {/* Resto del formulario similar a la edición */}
              <div className="flex justify-start gap-20">
                <div className="flex flex-col gap-1 w-[300px]">
                  <label className="text-[17px] font-medium">
                    Tipo Trabajo:
                  </label>
                  <select
                    className="bg-[#E9E7E7] rounded-2xl p-3 h-[50px]"
                    value={formData.idTipoTrabajo}
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
                    value={formData.idTipoPago}
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
                    type="date"
                    className="bg-[#E9E7E7] rounded-2xl p-3 h-[50px]"
                    value={formData.fechaInicio}
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
                    type="date"
                    className="bg-[#E9E7E7] rounded-2xl p-3 h-[50px]"
                    value={formData.fechaFin}
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
                onClick={() => setEditContrato(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-[#1C1C34] rounded-md px-14 py-2 text-white"
                onClick={handleEditSubmit}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Eliminar Contrato */}
      {eliminar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setEliminar(false)}
        >
          <div
            className="flex flex-col gap-8 w-[500px] bg-white shadow-md rounded-xl p-10 border border-[#E9E7E7]"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-[25px] font-semibold">Eliminar Contrato</h1>
            <p className="text-[18px]">
              ¿Estás seguro de que deseas eliminar este contrato? Esta acción no
              se puede deshacer.
            </p>

            <div className="flex gap-5 justify-end">
              <button
                className="border border-[#1C1C34] rounded-md px-10 py-2"
                onClick={() => setEliminar(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 rounded-md px-14 py-2 text-white"
                onClick={handleDeleteSubmit}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContratoAsignado;
