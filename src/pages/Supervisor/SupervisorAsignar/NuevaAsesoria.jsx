import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import eliminar from "../../../assets/icons/delete.svg";
import LayoutApp from "../../../layout/LayoutApp";
import { useNavigate } from "react-router-dom";
import { supervisorService } from "../../../services/supervisor/supervisorService";
import { clientesService } from "../../../services/clientesService";
import { asesoriasService } from "../../../services/asesoriasService";
import { getUsuarioDesdeToken } from "../../../utils/validateToken";

const NuevaAsesoria = () => {
  // Estados similares a SinAsignar
  const [delegado, setDelegado] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [areaSeleccionada, setAreaSeleccionada] = useState(null);
  const [asesorSeleccionado, setAsesorSeleccionado] = useState(null);
  const [referencia, setReferencia] = useState("");

  const navigate = useNavigate();
  const usuario = getUsuarioDesdeToken();
  const idSupervisor = usuario?.id_supervisor;

  // Áreas por supervisor (igual que en tu código)
  const {
    data: areas = [],
    isLoading: loadingAreas,
    isError: errorAreas,
  } = useQuery({
    queryKey: ["areasSupervisor", idSupervisor],
    queryFn: () => supervisorService.obtenerAreasPorSupervisor(idSupervisor),
  });

  // 🔹 Lista completa de clientes (diferente a SinAsignar)
  const {
    data: clientes = [],
    isLoading: loadingClientes,
    isError: errorClientes,
  } = useQuery({
    queryKey: ["clientesAll"],
    queryFn: clientesService.listarClientesAll, // <-- acá usamos la lista "all"
  });

  // Crear asignación
  const mutationAsignar = useMutation({
    mutationFn: asesoriasService.crearAsignacion,
    onSuccess: () => {
      alert("¡Asignación creada exitosamente!");
      // limpiar
      setDelegado(null);
      setEstudiantes([]);
      setClientesSeleccionados([]);
      setAreaSeleccionada(null);
      setAsesorSeleccionado(null);
      setReferencia("");
      navigate("/supervisor/asignaciones?tab=asignados");
    },
    onError: (err) => {
      console.error("Error al asignar:", err);
      alert("Ocurrió un error al asignar.");
    },
  });

  // Handlers (idénticos a SinAsignar, adaptados aquí)
  const handleElegir = (cliente) => {
    const totalSeleccionados = 1 + estudiantes.length;
    if (totalSeleccionados >= 5) {
      alert("Solo puedes seleccionar hasta 5 alumnos (incluyendo al delegado).");
      return;
    }

    if (!delegado) {
      setDelegado(cliente);
    } else {
      // Evitar duplicados
      if (estudiantes.some((e) => e.id === cliente.id)) return;
      setEstudiantes((prev) => [...prev, cliente]);
    }
    setClientesSeleccionados((prev) => [...prev, cliente.id]);
  };

  const handleEliminarDelegado = () => {
    if (delegado) {
      setClientesSeleccionados((prev) => prev.filter((id) => id !== delegado.id));
      setDelegado(null);
    }
  };

  const handleEliminarEstudiante = (id) => {
    setEstudiantes((prev) => prev.filter((e) => e.id !== id));
    setClientesSeleccionados((prev) => prev.filter((cid) => cid !== id));
  };

  const filtrarClientes = (cliente) => {
    if (clientesSeleccionados.includes(cliente.id)) return false;
    const termino = busqueda.toLowerCase();
    return (
      cliente?.nombre?.toLowerCase().includes(termino) ||
      String(cliente?.id || "").includes(termino) ||
      (cliente?.dni && String(cliente.dni).includes(termino)) ||
      cliente?.carrera?.toLowerCase().includes(termino)
    );
  };

  const handleAsignar = () => {
    if (!delegado || !areaSeleccionada || !asesorSeleccionado) {
      alert("Debes seleccionar un delegado, un área y un asesor.");
      return;
    }

    const body = {
      asesorId: asesorSeleccionado.id,
      clientesIds: [delegado.id, ...estudiantes.map((e) => e.id)],
      profesionAsesoria: referencia || "Asesoría académica",
      area: areaSeleccionada.nombre,
    };

    mutationAsignar.mutate(body);
  };

  if (loadingAreas || loadingClientes) return <div>Cargando datos…</div>;
  if (errorAreas || errorClientes) return <div>Error al cargar datos.</div>;

  return (
    <LayoutApp>
      <div className="ml-16 flex flex-col gap-[10px] pt-3 p-[30px] w-[1200px] xl:w-full bg-white rounded-[10px] drop-shadow-lg border-3">
        <h1 className="text-[20px] font-medium">Nueva Asignación</h1>

        {/* Delegado y estudiantes */}
        <div className="mb-2">
          <div className="flex flex-row gap-1 mb-2 items-center">
            <p className="font-medium">Delegado:</p>
            {delegado ? (
              <div className="flex items-center justify-between border gap-2 rounded px-2 py-[5px] bg-white shadow-sm">
                <span className="text-sm">{delegado.nombre}</span>
                <button onClick={handleEliminarDelegado} title="Quitar delegado">
                  <img src={eliminar} alt="Eliminar" />
                </button>
              </div>
            ) : (
              <div className="flex w-52 items-center justify-between border gap-1 rounded px-2 py-[5px] bg-white shadow-sm">
                <span className="text-sm text-gray-400">Sin delegado</span>
              </div>
            )}
          </div>

          {estudiantes.length > 0 && (
            <div className="mb-2">
              <p className="font-medium">Estudiantes:</p>
              <div className="flex gap-2 flex-wrap">
                {estudiantes.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between border gap-1 rounded px-2 py-[5px] bg-white shadow-sm mt-1"
                  >
                    <span className="text-sm">{e.nombre}</span>
                    <button onClick={() => handleEliminarEstudiante(e.id)} title="Quitar estudiante">
                      <img src={eliminar} alt="Eliminar" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buscador */}
        <div className="rounded-md bg-[#E4E2E2] p-1 mb-4">
          <input
            className="bg-transparent w-full focus:outline-none text-black placeholder:text-[#888]"
            type="text"
            placeholder="Buscar por ID, DNI o nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Tabla de clientes */}
        <div>
          <div className="flex justify-between text-[#495D72] font-medium p-[6px] rounded-md">
            <div className="w-[40px] flex justify-center">ID</div>
            <div className="w-[300px] flex justify-center">Alumno</div>
            <div className="w-[160px] flex justify-center">Fecha de Creación</div>
            <div className="w-[360px] flex justify-center">Carrera</div>
            <div className="w-[180px] flex justify-center">Acción</div>
          </div>

          {clientes.filter(filtrarClientes).map((cliente, index) => (
            <div
              key={cliente.id}
              className={`flex justify-between text-[#2B2829] font-normal ${
                index % 2 === 0 ? "bg-[#E9E7E7]" : ""
              } p-[6px] rounded-md`}
            >
              <div className="w-[40px] flex justify-center">{cliente.id}</div>
              <div className="w-[300px] flex justify-center">{cliente.nombre}</div>
              <div className="w-[160px] flex justify-center">
                {cliente.fecha_creacion
                  ? new Date(cliente.fecha_creacion).toLocaleDateString("es-PE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "—"}
              </div>
              <div className="w-[360px] flex justify-center">{cliente.carrera || "—"}</div>
              <button
                className="w-[180px] rounded-md bg-[#1C1C34] flex justify-center text-white"
                onClick={() => handleElegir(cliente)}
              >
                Elegir
              </button>
            </div>
          ))}
        </div>

        {/* Selects y referencia */}
        <div className="flex justify-between xl:flex-row flex-col gap-4 mt-5">
          {/* Área */}
          <select
            className="border border-black rounded-md px-[14px] xl:w-[275px] h-9"
            value={areaSeleccionada?.id || ""}
            onChange={(e) => {
              const val = e.target.value;
              const found = areas.find((a) => String(a.id) === String(val));
              setAreaSeleccionada(found || null);
              setAsesorSeleccionado(null); // reset asesor si cambia el área
            }}
          >
            <option value="">Selecciona un área</option>
            {areas?.map((area) => (
              <option key={area.id} value={area.id}>
                {area.nombre}
              </option>
            ))}
          </select>

          {/* Asesor por área */}
          <select
            className="border border-black rounded-md px-[14px] xl:w-[555px] h-9"
            value={asesorSeleccionado?.id || ""}
            onChange={(e) => {
              const idSel = parseInt(e.target.value, 10);
              const selected = areaSeleccionada?.asesores?.find((a) => a.id === idSel);
              setAsesorSeleccionado(selected || null);
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

        <div className="flex gap-5 mt-4 items-center">
          <p>Referencia: </p>
          <input
            className="rounded-md border border-black p-1 bg-transparent w-[350px] focus:outline-none text-black placeholder:text-[#888]"
            type="text"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-10">
          <button
            className="w-[200px] bg-[#1C1C34] text-white rounded-md py-2 mt-4"
            onClick={() => navigate("/supervisor/asignaciones")}
          >
            Cancelar
          </button>
          <button
            className="w-[200px] bg-[#1C1C34] text-white rounded-md py-2 mt-4"
            onClick={handleAsignar}
            disabled={mutationAsignar.isLoading}
          >
            {mutationAsignar.isLoading ? "Asignando..." : "Asignar"}
          </button>
        </div>
      </div>
    </LayoutApp>
  );
};

export default NuevaAsesoria;
