import React, { useEffect, useState } from "react";
import Zoom from "../../../assets/icons/IconEstudiante/ZoomLink.svg";
import eliminar from "../../../assets/icons/eliminarZoom.svg";
import { useOutletContext } from "react-router-dom";

const ReunionAnteriores = () => {
  const { selectedAsesoriaId } = useOutletContext();
  const [reuniones, setReuniones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);

  // Obtener el ID del asesor del localStorage
  const userString = localStorage.getItem("user");
  const user = JSON.parse(userString);
  const idAsesor = user.id;

  useEffect(() => {
    const fetchReuniones = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_PORT_ENV
          }/reuniones/allReunionesAnteriores/${selectedAsesoriaId}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener las reuniones");
        }
        const data = await response.json();
        setReuniones(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedAsesoriaId) {
      fetchReuniones();
    }
  }, [selectedAsesoriaId]);

  // Función para formatear la fecha
  const formatFecha = (fechaString) => {
    const date = new Date(fechaString);
    const options = { month: "long" };
    // Extraer directamente la hora y minutos de la cadena ISO
    const timePart = fechaString.split("T")[1].substring(0, 5);

    return {
      month: new Intl.DateTimeFormat("es-ES", options).format(date),
      day: date.getUTCDate(),
      time: timePart,
    };
  };

  const handleDeleteClick = (meetingId) => {
    setMeetingToDelete(meetingId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_PORT_ENV
        }/reuniones/eliminar-reunion/${meetingToDelete}`,

        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_asesor: idAsesor,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la reunión");
      }

      // Actualizar la lista de reuniones después de eliminar
      setReuniones(
        reuniones.filter((reunion) => reunion.id !== meetingToDelete)
      );
      setShowConfirmModal(false);
    } catch (err) {
      setError(err.message);
      setShowConfirmModal(false);
    }
  };

  const cancelDelete = () => {
    setMeetingToDelete(null);
    setShowConfirmModal(false);
  };

  if (loading) return <div>Cargando reuniones...</div>;
  if (error) return <div>Error: {error}</div>;
  if (reuniones.length === 0)
    return <div>No hay reuniones anteriores registradas</div>;

  // Agrupar reuniones en grupos de 3 para el diseño
  const gruposDeReuniones = [];
  for (let i = 0; i < reuniones.length; i += 3) {
    gruposDeReuniones.push(reuniones.slice(i, i + 3));
  }

  return (
    <div className="flex flex-col gap-5">
      {gruposDeReuniones.map((grupo, grupoIndex) => (
        <div key={grupoIndex} className="flex gap-8">
          {grupo.map((reunion, index) => {
            const fechaFormateada = formatFecha(reunion.fecha_reunion);

            return (
              <div
                key={`${reunion.ID}-${index}`}
                className="flex w-[350px]  items-center"
              >
                <div className="flex flex-col justify-center items-center rounded-l-xl h-full w-[104px] bg-[#17162E] p-4 text-white">
                  <p>{fechaFormateada.month}</p>
                  <h1 className="text-[30px]">{fechaFormateada.day}</h1>
                  <p className="text-[12px]">{fechaFormateada.time}</p>
                </div>

                <div className="flex flex-col w-full h-full border bg-[#F0EFEF] border-[#AAA3A5] p-4 justify-between rounded-r-xl gap-5">
                  <div className="flex flex-col gap-[6px]">
                    <div className="flex  items-start">
                      <p className="font-medium">{reunion.delegado}</p>
                      <button
                        className="p-1"
                        onClick={() => handleDeleteClick(reunion.id)}
                      >
                        <img
                          src={eliminar}
                          className="w-12"
                          alt="Eliminar reunión"
                        />
                      </button>
                    </div>
                    <h1 className="text-[#666666]">
                      CodigoID: {reunion.meetingId}
                    </h1>
                  </div>
                  <button className="flex gap-4 justify-between px-1 h-12 items-center text-white rounded-2xl bg-[#1271ED]">
                    <a
                      href={reunion.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex justify-between items-center px-2"
                    >
                      <p className="font-medium">Enlace Zoom</p>
                      <img src={Zoom} alt="Zoom" className="w-6 h-6" />
                    </a>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>
            <p className="mb-6">
              ¿Estás seguro de que deseas eliminar esta reunión?
            </p>
            <div className="flex justify-end gap-4">
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
    </div>
  );
};

export default ReunionAnteriores;
