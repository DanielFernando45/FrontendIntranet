import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import eliminar from "../../../assets/icons/delete.svg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supervisorService } from "../../../services/supervisor/supervisorService";
import { clientesService } from "../../../services/clientesService";
import LayoutApp from "../../../layout/LayoutApp";
import { getUsuarioDesdeToken } from "../../../utils/validateToken";
import { asesoriasService } from "../../../services/asesoriasService";
import toast from "react-hot-toast";

// Helpers
const toId = (v) => (v == null ? "" : String(v));
const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const getSafeId = (c, idx) =>
  toId(c?.id ?? c?.id_estudiante ?? c?.idCliente ?? idx);

// Normaliza un cliente "libre" (del endpoint de sin asignar)
const normLibre = (c) => {
  const id = toNum(c?.id);
  const nombreCompleto = [c?.nombre, c?.apellido].filter(Boolean).join(" ");
  return {
    id, // number
    nombre: nombreCompleto || "—",
    carrera: c?.carrera ?? "—",
    fecha_creacion: c?.fecha_creacion ?? null,
    esDelegado: false,
  };
};

const EditAsig = () => {
  const [areaSeleccionada, setAreaSeleccionada] = useState(null);
  const [asesorSeleccionado, setAsesorSeleccionado] = useState(null);

  const [delegado, setDelegado] = useState(null); // { id, nombre, ... }
  const [estudiantes, setEstudiantes] = useState([]); // [{ id, nombre, ... }]
  const [clientesSeleccionados, setClientesSeleccionados] = useState([]); // [id:string]

  // Tabla “disponibles” se compone de:
  // - baseLibres (del endpoint) filtrados
  // - extrasDisponibles (los que devolvemos desde arriba y no están en base)
  const [extrasDisponibles, setExtrasDisponibles] = useState([]); // [{id:number, nombre, carrera, fecha_creacion}]

  const [referencia, setReferencia] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const { id } = useParams();
  const usuario = getUsuarioDesdeToken();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const idSupervisor = usuario?.id_supervisor;

  // 1) Asesoramiento
  const {
    data: asesoramiento,
    isLoading: loadingAsesoramiento,
    isError: errorAsesoramiento,
  } = useQuery({
    queryKey: ["asesoramiento", id],
    queryFn: () => asesoriasService.obtenerAsesoramiento(id),
    enabled: !!id,
  });

  // 2) Áreas por supervisor
  const {
    data: areas = [],
    isLoading: loadingAreas,
    isError: errorAreas,
  } = useQuery({
    queryKey: ["areasSupervisor", idSupervisor],
    queryFn: () => supervisorService.obtenerAreasPorSupervisor(idSupervisor),
    enabled: !!idSupervisor,
  });

  // 3) Clientes SIN asignar (base de la tabla)
  const {
    data: libresRaw = [],
    isLoading: loadingLibres,
    isError: errorLibres,
  } = useQuery({
    queryKey: ["clientesSinAsignar"],
    queryFn: clientesService.clientesSinAsignar,
  });
  // Cuando llegan los datos del asesoramiento, inicializar referencia
  // Cuando llegan los datos del asesoramiento, inicializar referencia, área y asesor
  useEffect(() => {
    if (asesoramiento && areas.length > 0) {
      // área
      const areaSel = areas.find(
        (a) => String(a.id) === String(asesoramiento.id_area)
      );
      if (areaSel) {
        setAreaSeleccionada(areaSel);

        // asesor
        const asesorSel = areaSel.asesores?.find(
          (a) => String(a.id) === String(asesoramiento.id_asesor)
        );
        if (asesorSel) {
          setAsesorSeleccionado(asesorSel);
        }
      }

      // referencia (profesion_asesoria)
      if (asesoramiento.profesion_asesoria) {
        setReferencia(asesoramiento.profesion_asesoria);
      }
    }
  }, [asesoramiento, areas]);

  // 4) Inicializa seleccionado (delegado y estudiantes) desde backend
  useEffect(() => {
    if (!asesoramiento?.clientesAsignados) return;

    const conIds = asesoramiento.clientesAsignados.map((c, idx) => ({
      ...c,
      id: getSafeId(c, idx), // string
    }));

    const del = conIds.find((c) => c.esDelegado) || null;
    const est = conIds.filter((c) => !c.esDelegado);

    const delegadoNorm = del
      ? { ...del, esDelegado: true, id: toId(del.id) }
      : null;
    const estudiantesNorm = est.map((e) => ({
      ...e,
      esDelegado: false,
      id: toId(e.id),
    }));

    setDelegado(delegadoNorm);
    setEstudiantes(estudiantesNorm);
    setClientesSeleccionados([
      ...[delegadoNorm?.id].filter(Boolean),
      ...estudiantesNorm.map((e) => e.id),
    ]);
  }, [asesoramiento]);

  // 5) Normaliza “libres” y filtra fuera los ya seleccionados
  const baseLibresFiltrados = useMemo(() => {
    const libres = (libresRaw || []).map(normLibre); // number ids
    const seleccionadosNum = new Set(
      (clientesSeleccionados || [])
        .map((x) => toNum(x))
        .filter((x) => x != null)
    );
    return libres.filter((c) => !seleccionadosNum.has(toNum(c.id)));
  }, [libresRaw, clientesSeleccionados]);

  // ---------- Helpers de estado ----------
  // Agregar a "extras" (cuando quitas alguien de arriba que no venía en libres)
  const addDisponibleNoDup = (cli) => {
    const idN = toNum(cli.id);
    setExtrasDisponibles((prev) => {
      if (prev.some((p) => toNum(p.id) === idN)) return prev;
      // defaults para que se vea bien en la tabla
      return [
        ...prev,
        {
          ...cli,
          id: idN,
          esDelegado: false,
          carrera: cli.carrera ?? "—",
          fecha_creacion: cli.fecha_creacion ?? null,
        },
      ];
    });
  };

  // Quitar de “disponibles extra” (si eligen alguien que estaba ahí)
  const removeDisponible = (idRem) => {
    const idN = toNum(idRem);
    setExtrasDisponibles((prev) => prev.filter((c) => toNum(c.id) !== idN));
  };

  const addSeleccionado = (idAdd) => {
    const idS = toId(idAdd);
    setClientesSeleccionados((prev) =>
      prev.includes(idS) ? prev : [...prev, idS]
    );
  };

  const removeSeleccionado = (idRem) => {
    const idS = toId(idRem);
    setClientesSeleccionados((prev) => prev.filter((id) => id !== idS));
  };

  // Quitar delegado → vuelve a la tabla (en “extras”) y deja de estar seleccionado
  const handleEliminarDelegado = () => {
    if (!delegado) return;
    const devuelto = {
      ...delegado,
      esDelegado: false,
      id: toNum(delegado.id),
    };

    setDelegado(null);
    removeSeleccionado(devuelto.id);
    addDisponibleNoDup(devuelto);
  };

  // Quitar estudiante → vuelve a la tabla (en “extras”) y deja de estar seleccionado
  const handleEliminarEstudiante = (idEst) => {
    const idN = toNum(idEst);
    setEstudiantes((prev) => {
      const eliminado = prev.find((e) => toNum(e.id) === idN);
      if (eliminado) addDisponibleNoDup({ ...eliminado, esDelegado: false });
      return prev.filter((e) => toNum(e.id) !== idN);
    });
    removeSeleccionado(idN);
  };

  // Elegir desde la tabla (un solo botón):
  // - si no hay delegado → será delegado
  // - si ya hay → va a estudiantes
  const handleElegirCliente = (cliente) => {
    const idN = toNum(cliente?.id);
    if (idN == null) return;

    const idS = toId(idN);
    if (clientesSeleccionados.includes(idS)) return; // evita duplicado

    // si estaba en extrasDisponibles, lo saco; si estaba en base, no hace falta
    removeDisponible(idN);

    if (!delegado) {
      setDelegado({ ...cliente, id: idS, esDelegado: true });
      addSeleccionado(idS);
      return;
    }

    setEstudiantes((prev) => {
      if (prev.some((e) => toId(e.id) === idS)) return prev;
      return [...prev, { ...cliente, id: idS, esDelegado: false }];
    });
    addSeleccionado(idS);
  };

  // MUTATION: actualizar con TanStack
  const actualizarMutation = useMutation({
    mutationFn: ({ idAsesoramiento, data }) =>
      asesoriasService.actualizarAsignamiento(idAsesoramiento, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["asesoria"] }),
        queryClient.invalidateQueries({ queryKey: ["asesoramiento", id] }),
        queryClient.invalidateQueries({ queryKey: ["clientesSinAsignar"] }),
      ]);

      toast.success("Asignación actualizada correctamente", {
        duration: 5000, // ⏳ duración visible más larga
      });

      // ⏱️ Espera 5.5s antes de redirigir
      setTimeout(() => {
        navigate("/supervisor/asignaciones?tab=asignados");
      }, 5500);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          "Error al guardar. Revisa la consola para más detalles.",
        { duration: 5000 }
      );
    },
  });
  // Guardado con payload que acepta tu backend
  const handleSubmit = () => {
    if (!asesorSeleccionado?.id) {
      toast.error("Selecciona un asesor.");
      return;
    }

    const idsSeleccionados = [
      toNum(delegado?.id),
      ...estudiantes.map((e) => toNum(e.id)),
    ].filter((x) => x != null);

    if (idsSeleccionados.length === 0) {
      toast.error("Debes seleccionar al menos un cliente.");
      return;
    }

    const payload = {
      asesorId: toNum(asesorSeleccionado.id),
      clientesIds: idsSeleccionados,
      profesionAsesoria: referencia || "Proyecto de Investigación",
      area: areaSeleccionada?.nombre || "Legal",
    };

    toast
      .promise(
        asesoriasService.actualizarAsignamiento(id, payload),
        {
          loading: "Actualizando asignación...",
          success: "Asignación actualizada correctamente",
          error: "Error al guardar asignación",
        },
        { duration: 5000 }
      )
      .then(() => {
        // invalidar después del éxito
        queryClient.invalidateQueries({ queryKey: ["asesoria"] });
        queryClient.invalidateQueries({ queryKey: ["asesoramiento", id] });
        queryClient.invalidateQueries({ queryKey: ["clientesSinAsignar"] });

        setTimeout(() => {
          navigate("/supervisor/asignaciones?tab=asignados");
        }, 5500);
      });
  };

  // Fusionar disponibles: baseLibresFiltrados + extrasDisponibles (únicos y no seleccionados)
  const disponiblesFusionados = useMemo(() => {
    const seleccionadosNum = new Set(
      (clientesSeleccionados || [])
        .map((x) => toNum(x))
        .filter((x) => x != null)
    );

    // base (del endpoint)
    const base = baseLibresFiltrados;

    // extras filtrados por no seleccionados
    const extras = (extrasDisponibles || []).filter(
      (e) => !seleccionadosNum.has(toNum(e.id))
    );

    // merge únicos por id (prefiere extras para no perder defaults que agregamos)
    const mapById = new Map();
    for (const item of base) mapById.set(toNum(item.id), item);
    for (const item of extras) mapById.set(toNum(item.id), item);

    return Array.from(mapById.values());
  }, [baseLibresFiltrados, extrasDisponibles, clientesSeleccionados]);

  // Búsqueda
  const disponiblesFiltrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    if (!term) return disponiblesFusionados;
    return disponiblesFusionados.filter((c) =>
      String(c.nombre ?? "")
        .toLowerCase()
        .includes(term)
    );
  }, [disponiblesFusionados, busqueda]);

  if (loadingAreas || loadingAsesoramiento || loadingLibres)
    return <div>Cargando datos...</div>;

  if (errorAsesoramiento || errorAreas || errorLibres)
    return <div>Error al cargar información.</div>;

  return (
    <LayoutApp>
      <div className="ml-16 flex flex-col gap-[10px] pt-3 p-[30px] w-[1200px] xl:w-full bg-white rounded-[10px] drop-shadow-lg border-3">
        <h1 className="text-[20px] font-medium">Editar Asignado</h1>

        {/* Delegado */}
        <div className="mb-2">
          <div className="flex flex-row gap-1 mb-2 items-center">
            <p className="font-medium">Delegado:</p>
            {delegado ? (
              <div className="flex items-center justify-between border gap-2 rounded px-2 py-[5px] bg-white shadow-sm">
                <span className="text-sm">{delegado.nombre}</span>
                <button
                  onClick={handleEliminarDelegado}
                  title="Quitar delegado"
                >
                  <img src={eliminar} alt="Eliminar" />
                </button>
              </div>
            ) : (
              <div className="flex w-64 items-center justify-between border gap-1 rounded px-2 py-[5px] bg-white shadow-sm">
                <span className="text-sm text-gray-400">
                  Sin delegado (elige desde la tabla)
                </span>
              </div>
            )}
          </div>

          {/* Estudiantes */}
          {estudiantes.length > 0 && (
            <div className="mb-2">
              <p className="font-medium">Estudiantes:</p>
              <div className="flex gap-2 flex-wrap">
                {estudiantes.map((est) => (
                  <div
                    key={est.id}
                    className="flex items-center justify-between border gap-1 rounded px-2 py-[5px] bg-white shadow-sm mt-1"
                  >
                    <span className="text-sm">{est.nombre}</span>
                    <button
                      onClick={() => handleEliminarEstudiante(est.id)}
                      title="Quitar estudiante"
                    >
                      <img src={eliminar} alt="Eliminar" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buscar */}
        <div className="rounded-md bg-[#E4E2E2] p-1 mb-4">
          <input
            className="bg-transparent w-full focus:outline-none text-black placeholder:text-[#888]"
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Tabla de clientes disponibles */}
        <div>
          <div className="flex justify-between text-[#495D72] font-medium p-[6px] rounded-md">
            <div className="w-[80px] flex justify-center">#</div>
            <div className="w-[300px] flex justify-center">Nombre</div>
            <div className="w-[200px] flex justify-center">
              Fecha de creación
            </div>
            <div className="w-[260px] flex justify-center">Carrera</div>
            <div className="w-[180px] flex justify-center">Acción</div>
          </div>

          {disponiblesFiltrados.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No hay clientes sin asignar o ya seleccionaste a todos.
            </div>
          ) : (
            disponiblesFiltrados.map((c, i) => (
              <div
                key={c.id}
                className={`flex justify-between text-[#2B2829] font-normal ${
                  i % 2 === 0 ? "bg-[#E9E7E7]" : ""
                } p-[6px] rounded-md`}
              >
                <div className="w-[80px] flex justify-center">{i + 1}</div>
                <div className="w-[300px] flex justify-center">{c.nombre}</div>
                <div className="w-[200px] flex justify-center">
                  {c.fecha_creacion
                    ? new Date(c.fecha_creacion).toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "—"}
                </div>
                <div className="w-[260px] flex justify-center">{c.carrera}</div>
                <div className="w-[180px] flex justify-center">
                  <button
                    className="px-2 py-1 rounded-md bg-[#1C1C34] text-white"
                    onClick={() => handleElegirCliente(c)}
                    title={
                      !delegado ? "Elegir como delegado" : "Elegir (estudiante)"
                    }
                  >
                    Elegir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Área y asesor */}
        <div className="flex justify-between xl:flex-row flex-col gap-4 mt-5">
          <select
            className="border border-black rounded-md px-[14px] xl:w-[275px] h-9"
            value={areaSeleccionada?.id ?? ""}
            onChange={(e) => {
              const areaSel = areas.find(
                (a) => String(a.id) === String(e.target.value)
              );
              setAreaSeleccionada(areaSel ?? null);
              setAsesorSeleccionado(null);
            }}
          >
            <option value="">Selecciona un área</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.nombre}
              </option>
            ))}
          </select>

          <select
            className="border border-black rounded-md px-[14px] xl:w-[555px] h-9"
            value={asesorSeleccionado?.id ?? ""}
            onChange={(e) => {
              const sel = areaSeleccionada?.asesores?.find(
                (a) => String(a.id) === String(e.target.value)
              );
              setAsesorSeleccionado(sel ?? null);
            }}
            disabled={!areaSeleccionada}
          >
            <option value="">Seleccionar asesor</option>
            {areaSeleccionada?.asesores?.map((asesor) => (
              <option key={asesor.id} value={asesor.id}>
                {asesor.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Referencia */}
        <div className="flex gap-5 mt-4 items-center">
          <p>Referencia: </p>
          <input
            className="rounded-md border border-black p-1 bg-transparent w-[350px] focus:outline-none text-black placeholder:text-[#888]"
            type="text"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-10">
          <button
            className="w-[200px] bg-[#1C1C34] text-white rounded-md py-2 mt-4"
            onClick={() => navigate("/supervisor/asignaciones?tab=asignados")}
          >
            Cancelar
          </button>
          <button
            className="w-[200px] bg-[#1C1C34] text-white rounded-md py-2 mt-4 disabled:opacity-70"
            onClick={handleSubmit}
            disabled={actualizarMutation.isPending}
          >
            {actualizarMutation.isPending ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </LayoutApp>
  );
};

export default EditAsig;
