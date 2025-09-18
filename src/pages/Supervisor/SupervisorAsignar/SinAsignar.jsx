import React, { useState } from "react";
import eliminar from "../../../assets/icons/delete.svg";
import { useMutation, useQuery } from "@tanstack/react-query";
import { clientesService } from "../../../services/clientesService";
import { supervisorService } from "../../../services/supervisor/supervisorService";
import { getUsuarioDesdeToken } from "../../../utils/validateToken";
import { asesoriasService } from "../../../services/asesoriasService";
import { useNavigate } from "react-router-dom";

const SinAsignar = () => {
  const [delegado, setDelegado] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [areaSeleccionada, setAreaSeleccionada] = useState(null);
  const [asesorSeleccionado, setAsesorSeleccionado] = useState(null);

  const [referencia, setReferencia] = useState("");

  const usuario = getUsuarioDesdeToken();
  const navigate = useNavigate();
  console.log(usuario?.id_supervisor);
  const idSupervisor = usuario?.id_supervisor;

  const {
    data: clientes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["clientesSinAsignar"],
    queryFn: clientesService.clientesSinAsignar,
  });

  const {
    data: areas = [],
    isLoading: loadingAreas,
    isError: errorAreas,
  } = useQuery({
    queryKey: ["areasSupervisor", idSupervisor],
    queryFn: () => supervisorService.obtenerAreasPorSupervisor(idSupervisor),
  });

  const mutationAsignar = useMutation({
    mutationFn: asesoriasService.crearAsignacion,
    onSuccess: () => {
      alert("¡Asignación creada exitosamente!");
      // Limpiar estados
      setDelegado(null);
      setEstudiantes([]);
      setClientesSeleccionados([]);
      setAreaSeleccionada(null);
      setAsesorSeleccionado(null);
      setReferencia("");
      // Redirigir si quieres
      navigate("/supervisor/asignaciones?tab=asignados");
    },
    onError: (err) => {
      console.error("Error al asignar:", err);
      alert("Ocurrió un error al asignar.");
    },
  });
  const handleElegir = (cliente) => {
    const totalSeleccionados = 1 + estudiantes.length;

    if (totalSeleccionados >= 5) {
      alert(
        "Solo puedes seleccionar hasta 5 alumnos (incluyendo al delegado)."
      );
      return;
    }

    if (!delegado) {
      setDelegado(cliente);
    } else {
      setEstudiantes([...estudiantes, cliente]);
    }

    setClientesSeleccionados([...clientesSeleccionados, cliente.id]);
  };

  const handleEliminarDelegado = () => {
    if (delegado) {
      setClientesSeleccionados(
        clientesSeleccionados.filter((id) => id !== delegado.id)
      );
      setDelegado(null);
    }
  };

  const handleEliminarEstudiante = (id) => {
    setEstudiantes(estudiantes.filter((e) => e.id !== id));
    setClientesSeleccionados(clientesSeleccionados.filter((cid) => cid !== id));
  };

  const filtrarClientes = (cliente) => {
    if (clientesSeleccionados.includes(cliente.id)) return false;
    const termino = busqueda.toLowerCase();
    return (
      cliente.nombre.toLowerCase().includes(termino) ||
      cliente.id.toString().includes(termino) ||
      (cliente.dni && cliente.dni.toString().includes(termino)) ||
      cliente.carrera.toLowerCase().includes(termino)
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
      profesionAsesoria: referencia || "Asesoría académica", // o como prefieras
      area: areaSeleccionada.nombre,
    };

    mutationAsignar.mutate(body);
  };
  if (isLoading || loadingAreas) return <p>Cargando...</p>;
  if (isError || errorAreas) return <p>Error al cargar datos.</p>;

  return (
    <div>
      <h1 className="text-[20px] font-medium">Clientes Sin Asignar</h1>

      {/* Delegado y estudiantes */}
      <div className="mb-2">
        <div className="flex flex-row gap-1 mb-2 items-center">
          <p className="font-medium">Delegado:</p>
          {delegado ? (
            <div className="flex items-center justify-between border gap-2 rounded px-2 py-[5px] bg-white shadow-sm">
              <span className="text-sm">{delegado.nombre}</span>
              <button onClick={handleEliminarDelegado}>
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
              {estudiantes.map((estudiante) => (
                <div
                  key={estudiante.id}
                  className="flex items-center justify-between border gap-1 rounded px-2 py-[5px] bg-white shadow-sm mt-1"
                >
                  <span className="text-sm">{estudiante.nombre}</span>
                  <button
                    onClick={() => handleEliminarEstudiante(estudiante.id)}
                  >
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
            <div className="w-[300px] flex justify-center">
              {cliente.nombre}
            </div>
            <div className="w-[160px] flex justify-center">
              {new Date(cliente.fecha_creacion).toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
            <div className="w-[360px] flex justify-center">
              {cliente.carrera}
            </div>
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
        {/* Área (fija desde backend) */}
        <select
          className="border border-black rounded-md px-[14px] xl:w-[275px] h-9"
          onChange={(e) => {
            const areaSeleccionada = areas.find((a) => a.id === e.target.value);
            setAreaSeleccionada(areaSeleccionada);
          }}
        >
          <option value="">Selecciona un área</option>
          {areas?.map((area) => (
            <option key={area.id} value={area.id}>
              {area.nombre}
            </option>
          ))}
        </select>
        <select
          className="border border-black rounded-md px-[14px] xl:w-[555px] h-9"
          value={asesorSeleccionado?.id || ""}
          onChange={(e) => {
            const selected = areaSeleccionada?.asesores.find(
              (a) => a.id === parseInt(e.target.value)
            );
            setAsesorSeleccionado(selected);
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

      <div className="flex justify-end">
        <button
          className="w-[200px] bg-[#1C1C34] text-white rounded-md py-2 mt-4"
          onClick={handleAsignar}
          disabled={mutationAsignar.isLoading}
        >
          {mutationAsignar.isLoading ? "Asignando..." : "Asignar"}
        </button>
      </div>
    </div>
  );
};

export default SinAsignar;
