import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import desactivado from "../../../assets/icons/delete.svg"
import activado from "../../../assets/icons/check.svg"
import flechaabajo from "../../../assets/icons/Flecha.svg";
import flechaarriba from "../../../assets/icons/arrow-up.svg";
import eliminar from "../../../assets/icons/tacho.svg"
import axios from "axios";

const formatFecha = (fechaISO) => {
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  // Extraer directamente las partes de la cadena ISO (formato YYYY-MM-DD)
  const [anio, mes, dia] = fechaISO.split('T')[0].split('-');
  return `${parseInt(dia)} de ${meses[parseInt(mes) - 1]}, ${anio}`;
};

const ListarAsignados = () => {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState({});
  const [estadoLocal, setEstadoLocal] = useState({});
  const [asesoramientos, setAsesoramientos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [asesoramientoToDelete, setAsesoramientoToDelete] = useState(null);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [asesoramientoToChange, setAsesoramientoToChange] = useState(null);
  const [newEstado, setNewEstado] = useState(null);

  useEffect(() => {
    fetchAsesoramientos();
  }, []);

  const fetchAsesoramientos = () => {
    axios.get(`${import.meta.env.VITE_API_PORT_ENV}/asesoramiento/listar`)
      .then((res) => {
        setAsesoramientos(res.data);
        // Inicializar estados locales
        const initialEstados = {};
        res.data.forEach(a => {
          initialEstados[a.id_asesoramiento] = a.estado === "activo";
        });
        setEstadoLocal(initialEstados);
      })
      .catch((err) => console.error("Error al obtener asesoramientos:", err));
  };

  const toggleEstadoVisual = (id) => {
    const currentEstado = estadoLocal[id];
    setAsesoramientoToChange(id);
    setNewEstado(!currentEstado);
    setShowEstadoModal(true);
  };

  const confirmEstadoChange = () => {
    if (!asesoramientoToChange) return;

    const nuevoEstado = newEstado ? "activo" : "inactivo";

    axios.patch(`${import.meta.env.VITE_API_PORT_ENV}/asesoramiento/estado/${asesoramientoToChange}`, { estado: nuevoEstado })
      .then(() => {
        // Actualizar el estado local después de la confirmación del servidor
        setEstadoLocal(prev => ({ ...prev, [asesoramientoToChange]: newEstado }));
        setShowEstadoModal(false);
      })
      .catch(err => {
        console.error("Error al cambiar estado del asesoramiento:", err);
        setShowEstadoModal(false);
      });
  };

  const cancelEstadoChange = () => {
    setAsesoramientoToChange(null);
    setNewEstado(null);
    setShowEstadoModal(false);
  };

  const toggleClientes = (index) => {
    setExpandedRows(prev => ({ ...prev, [index]: !prev[index] }));
  }

  const handleNuevaAsesoria = () => {
    navigate('/admin/asignaciones/asesoria-nueva')
  }

  const handleEditarAsesoria = (id) => {
    navigate(`/admin/asignaciones/editar-asesoria/${id}`)
  }

  const handleDeleteClick = (id) => {
    setAsesoramientoToDelete(id);
    setShowDeleteModal(true);
  }

  const confirmDelete = () => {
    if (!asesoramientoToDelete) return;

    axios.delete(`${import.meta.env.VITE_API_PORT_ENV}/asesoramiento/delete/${asesoramientoToDelete}`)
      .then(() => {
        fetchAsesoramientos();
        setShowDeleteModal(false);
      })
      .catch(err => {
        console.error("Error al eliminar asesoramiento:", err);
        setShowDeleteModal(false);
      });
  }

  const cancelDelete = () => {
    setAsesoramientoToDelete(null);
    setShowDeleteModal(false);
  }

  const obtenerEstudiantes = (asesoramiento) => {
    const estudiantes = { ...asesoramiento };
    return estudiantes;
  };

  return (
    <div>
      {/* Modal de confirmación de cambio de estado */}
      {showEstadoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmar Cambio de Estado</h3>
            <p>¿Estás seguro que deseas cambiar el estado a {newEstado ? "Activado" : "Desactivado"}?</p>
            <div className="flex justify-env gap-4 mt-6">
              <button
                onClick={cancelEstadoChange}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={confirmEstadoChange}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
            <p>¿Estás seguro que deseas eliminar este asesoramiento? Esta acción no se puede deshacer.</p>
            <div className="flex justify-env gap-4 mt-6">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col">
        <div className="flex justify-between text-[#495D72] font-medium p-[6px] rounded-md">
          <div className="w-[80px] flex justify-center">IdAsesoria</div>
          <div className="w-[300px] flex justify-center">Delegado-Cliente</div>
          <div className="w-[250px] flex justify-center">Tipo Trabajo</div>
          <div className="w-[180px] flex justify-center">Fecha asignación</div>
          <div className="w-[350px] flex justify-center mx-3">Alumnos-Clientes</div>
          <div className="w-[300px] flex justify-center">Asesor</div>
          <div className="w-[60px] flex justify-center">Estado</div>
          <div className="w-[200px] flex justify-center ml-3">Acción</div>
          <div className='w-[40px]'></div>
        </div>
        {asesoramientos.map((item, index) => {
          const tieneEstudiantes = item.estudiantes.length > 0;
          const mostrarFlecha = item.estudiantes.length > 1;
          const mostrarTodos = expandedRows[index];
          const primerCliente = tieneEstudiantes ?
            (item.estudiantes.length > 1 && !mostrarTodos ? `${item.estudiantes[0].estudiante}...` : item.delegado)
            : "----------------------";
          const estadoActual = estadoLocal[item.id_asesoramiento] ?? (item.estado === "activo");
          
          return (
            <div key={item.id_asesoramiento} className={`flex justify-between items-center text-[#2B2829] font-normal ${index % 2 === 0 ? 'bg-[#E9E7E7]' : ''} p-[6px] rounded-md`}>
              <div className="w-[80px] flex justify-center mx-2">{item.id_asesoramiento}</div>
              <div className="w-[350px] flex justify-center">{item.delegado || "----------------------"}</div>
              <div className="w-[250px] flex justify-center">{item.tipo_trabajo}</div>
              <div className="w-[180px] flex justify-center">{formatFecha(item.fecha_inicio)}</div>
              <div className="w-[350px] flex flex-col justify-center items-center mx-3">
                {
                  tieneEstudiantes && item.estudiantes.length == 1 ? (
                    <div>{item.estudiantes[0].estudiante}</div>
                  ) : (
                    <div className="flex flex-col">
                      {mostrarTodos ? (
                        item.estudiantes.map((estudiante, i) => (
                          <div key={i}>{estudiante.estudiante}</div>
                        ))
                      ) : (
                        <div>{primerCliente}</div>
                      )}
                    </div>
                  )
                }
              </div>
              <div className="w-[310px] flex justify-center">{item.asesor}</div>
              <div className="w-[60px] text-[8px] flex flex-col items-center">
                <button onClick={() => toggleEstadoVisual(item.id_asesoramiento)}
                  className={`w-[60px] h-[25px] font-semibold rounded-3xl border border-black flex items-center transition-all duration-[700ms] ease-in-out ${estadoActual ? 'justify-env pr-1' : 'justify-start pl-1'}`}>
                  <img
                    className='h-[20px] w-[20px] transition-transform duration-[700ms] ease-in-out'
                    src={estadoActual ? activado : desactivado}
                    alt="estado"
                  />
                </button>
                {estadoActual ? 'Activado' : 'Desactivado'}
              </div>
              <div className="flex w-[200px] gap-1 items-center justify-center text-white ml-3">
                <button onClick={() => handleEditarAsesoria(item.id_asesoramiento)} className='bg-[#1C1C34] w-[100px] rounded-md px-3 py-1 flex justify-center'>
                  Editar
                </button>
                <button onClick={() => handleDeleteClick(item.id_asesoramiento)}>
                  <img src={eliminar} alt="Eliminar" className="hover:opacity-70" />
                </button>
              </div>
              <div className='w-[40px] flex justify-center'>
                {mostrarFlecha && (
                  <img
                    src={mostrarTodos ? flechaarriba : flechaabajo}
                    alt="toggle"
                    className="cursor-pointer transition-transform duration-300 transform hover:scale-110"
                    onClick={() => toggleClientes(index)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className='flex justify-env mt-4'>
        <button onClick={handleNuevaAsesoria} className='border-green-950 border-[3px] rounded-lg w-[180px] text-white bg-black'>Agregar Asesoría</button>
      </div>
    </div>
  );
};

export default ListarAsignados;