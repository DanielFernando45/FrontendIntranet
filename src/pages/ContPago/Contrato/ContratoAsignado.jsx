import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";
import { useQuery, useMutation } from "@tanstack/react-query";
import { asesoriasService } from "../../../services/asesoriasService";
import { contratosService } from "../../../services/contratosService";
import toast from "react-hot-toast";

const ContratoAsignado = () => {
  const [editContrato, setEditContrato] = useState(false);
  const [eliminar, setEliminar] = useState(false);
  const [currentContrato, setCurrentContrato] = useState(null);
  const [formData, setFormData] = useState({
    modalidad: "",
    servicio: "",
    idCategoria: "",
    idTipoTrabajo: "",
    idTipoPago: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const { data: contrato = [], refetch } = useQuery({
    queryKey: ["contrato"],
    queryFn: asesoriasService.listarContratosAsignados,
    refetchOnWindowFocus: false,
    initialData: [],
  });

  const formatDate = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-PE", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatDateToInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    return date.toISOString().split("T")[0];
  };

  const mutationEditar = useMutation({
    mutationFn: (data) =>
      contratosService.actualizarContrato(data.id, data.payload),
    onSuccess: () => {
      toast.success("Contrato editado exitosamente");
      setEditContrato(false);
      refetch();
    },
    onError: (error) => {
      toast.error(
        `Error al editar el contrato: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const mutationEliminar = useMutation({
    mutationFn: (idContrato) => contratosService.eliminarContrato(idContrato),
    onSuccess: () => {
      toast.success("Contrato eliminado exitosamente");
      setEliminar(false);
      refetch();
    },
    onError: (error) => {
      toast.error(
        `Error al eliminar el contrato: ${error.response?.data?.message}`
      );
    },
  });

  const handleEditSubmit = () => {
    if (!formData.fechaInicio || !formData.fechaFin) {
      toast.error("Ambas fechas son obligatorias.");
      return;
    }
    const fechaInicio = new Date(formData.fechaInicio);
    const fechaFin = new Date(formData.fechaFin);

    if (fechaInicio > fechaFin) {
      toast.error("La fecha de inicio no puede ser mayor que la fecha de fin.");
      return;
    }
    // Si el servicio es Completo, la categoría es obligatoria

    if (formData.servicio === "Completo" && !formData.idCategoria) {
      toast.error("Selecciona una categoría.");
      return;
    }

    if (currentContrato) {
      const payload = {
        modalidad: formData.modalidad,
        servicio: formData.servicio,
        idTipoTrabajo: Number(formData.idTipoTrabajo),
        idTipoPago: Number(formData.idTipoPago),
        fechaInicio: fechaInicio.toISOString().slice(0, 19).replace("T", " "),
        fechaFin: fechaFin.toISOString().slice(0, 19).replace("T", " "),
      };

      // Solo agregar idCategoria si aplica y tiene valor
      if (formData.servicio === "Completo" && formData.idCategoria) {
        payload.idCategoria = formData.idCategoria;
      }

      mutationEditar.mutate({
        id: currentContrato.id_contrato, // mantenemos tu key tal cual
        payload,
      });
    }
  };

  const handleDeleteSubmit = () => {
    if (currentContrato) mutationEliminar.mutate(currentContrato.id_contrato);
  };

  const handleEditClick = (contrato) => {
    setEditContrato(true);
    setCurrentContrato(contrato);
    setFormData({
      modalidad: contrato.modalidad || "",
      servicio: contrato.servicio || "",
      idCategoria: contrato.idCategoria || "", // usa el nombre que viene del back
      idTipoTrabajo: contrato.idTipoTrabajo || "",
      idTipoPago: contrato.idTipoPago || "",
      fechaInicio: formatDateToInput(contrato.fecha_inicio),
      fechaFin: formatDateToInput(contrato.fecha_fin),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl sm:text-2xl font-medium">Contratos Asignados</h1>

      {/* Contenedor con scroll horizontal */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Encabezado */}
          <div className="grid grid-cols-8 text-sm sm:text-base font-medium text-[#495D72] p-2">
            <div className="text-center">ID Contrato</div>
            <div className="text-center">Trab. Investigación</div>
            <div className="text-center col-span-2">Delegado</div>
            <div className="text-center">Fecha Registro</div>
            <div className="text-center">Modalidad</div>
            <div className="text-center">Tipo de Pago</div>
            <div className="text-center">Acción</div>
          </div>

          {/* Filas */}
          {contrato.map((c, index) => (
            <div
              key={index}
              className="grid grid-cols-8 text-sm sm:text-base items-center p-2 border-b"
            >
              <div className="text-center">
                {"CT-" + (index + 1).toString().padStart(3, "0")}
              </div>
              <div className="text-center">{c.trabajo_investigacion}</div>
              <div className="text-center col-span-2">{c.delegado}</div>
              <div className="text-center ">{formatDate(c.fecha_inicio)}</div>
              <div className="text-center">{c.modalidad}</div>
              <div className="text-center">{c.tipo_pago}</div>
              <div className="flex justify-center gap-2">
                <button
                  className="p-1 bg-[#353563] rounded-md text-white"
                  onClick={() => handleEditClick(c)}
                >
                  <FaRegEdit size={18} />
                </button>
                <button
                  className="p-1 bg-red-600 rounded-md text-white"
                  onClick={() => {
                    setEliminar(true);
                    setCurrentContrato(c);
                  }}
                >
                  <IoTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Editar */}
      {editContrato && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setEditContrato(false)}
        >
          <div
            className="w-[95%] max-w-4xl bg-white shadow-md rounded-xl p-6 sm:p-10 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-xl sm:text-2xl font-semibold mb-4">
              Editar Contrato
            </h1>

            <div className="flex flex-col gap-6">
              {/* Modalidad y Servicio */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col w-full md:w-1/2">
                  <label className="text-sm font-medium">Modalidad:</label>
                  <select
                    className="bg-[#E9E7E7] rounded-lg p-2"
                    value={formData.modalidad}
                    onChange={(e) =>
                      setFormData({ ...formData, modalidad: e.target.value })
                    }
                  >
                    <option >Seleccionar</option>
                    <option value="avance">Avance</option>
                    <option value="plazo">Plazo</option>
                  </select>
                </div>
                <div className="flex flex-col w-full md:w-1/2">
                  <label className="text-sm font-medium">Servicio:</label>
                  <select
                    className="bg-[#E9E7E7] rounded-lg p-2"
                    value={formData.servicio}
                    onChange={(e) =>
                      setFormData({ ...formData, servicio: e.target.value })
                    }
                  >
                    <option>Seleccionar</option>
                    <option value="proyecto">Proyecto</option>
                    <option value="inf.Final">Inf.Final</option>
                    <option value="completo">Completo</option>
                  </select>
                </div>
              </div>

              {/* Categoría */}
              {formData.servicio === "completo" && (
                <div className="flex flex-col">
                  <label className="text-sm font-medium">Categoría:</label>
                  <select
                    className="bg-[#E9E7E7] rounded-lg p-2"
                    value={formData.idCategoria}
                    onChange={(e) =>
                      setFormData({ ...formData, idCategoria: e.target.value })
                    }
                  >
                    <option >Seleccionar</option>
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

              {/* Tipo trabajo y pago */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col w-full md:w-1/2">
                  <label className="text-sm font-medium">Tipo Trabajo:</label>
                  <select
                    className="bg-[#E9E7E7] rounded-lg p-2"
                    value={formData.idTipoTrabajo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        idTipoTrabajo: e.target.value,
                      })
                    }
                  >
                    <option >Seleccionar</option>
                    <option value={1}>Proyecto Bachillerato</option>
                    <option value={2}>Tesis Pregrado</option>
                    <option value={3}>Tesis</option>
                    <option value={4}>Tesis Maestría</option>
                    <option value={5}>Tesis Doctorado</option>
                    <option value={6}>Plan de negocios</option>
                    <option value={7}>Revisión sistemática</option>
                    <option value={8}>Articulo Cientifico</option>
                    <option value={8}>Estudio de prefactibilidad</option>
                    <option value={10}>Suficiencia profesional</option>
                    <option value={11}>Tesis Segunda Especialidad</option>
                  </select>
                </div>
                <div className="flex flex-col w-full md:w-1/2">
                  <label className="text-sm font-medium">Tipo de Pago:</label>
                  <select
                    className="bg-[#E9E7E7] rounded-lg p-2"
                    value={formData.idTipoPago}
                    onChange={(e) =>
                      setFormData({ ...formData, idTipoPago: e.target.value })
                    }
                  >
                    <option >Seleccionar</option>
                    <option value={1}>Contado</option>
                    <option value={2}>Cuotas</option>
                  </select>
                </div>
              </div>

              {/* Fechas */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col w-full md:w-1/2">
                  <label className="text-sm font-medium">Fecha Inicio:</label>
                  <input
                    type="date"
                    className="bg-[#E9E7E7] rounded-lg p-2"
                    value={formData.fechaInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, fechaInicio: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col w-full md:w-1/2">
                  <label className="text-sm font-medium">Fecha Final:</label>
                  <input
                    type="date"
                    className="bg-[#E9E7E7] rounded-lg p-2"
                    value={formData.fechaFin}
                    onChange={(e) =>
                      setFormData({ ...formData, fechaFin: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="border border-[#1C1C34] rounded-md px-6 py-2 text-sm sm:text-base"
                onClick={() => setEditContrato(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-[#1C1C34] rounded-md px-8 py-2 text-sm sm:text-base text-white"
                onClick={handleEditSubmit}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {eliminar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setEliminar(false)}
        >
          <div
            className="w-[95%] max-w-md bg-white shadow-md rounded-xl p-6 sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-xl sm:text-2xl font-semibold mb-4">
              Eliminar Contrato
            </h1>
            <p className="text-sm sm:text-base mb-6">
              ¿Estás seguro de que deseas eliminar este contrato? Esta acción no
              se puede deshacer.
            </p>

            <div className="flex justify-end gap-4">
              <button
                className="border border-[#1C1C34] rounded-md px-6 py-2"
                onClick={() => setEliminar(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 rounded-md px-8 py-2 text-white"
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
