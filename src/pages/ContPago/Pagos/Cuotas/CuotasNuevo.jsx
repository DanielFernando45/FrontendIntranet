import React, { useState, useEffect } from "react";
import AsignarPago from "../../../../Components/Administrador/Pagos/AsignarPago";

const CuotasNuevo = () => {
  const [asigPago, setAsigPago] = useState(false);
  const [selectedAsesoramiento, setSelectedAsesoramiento] = useState(null);
  const [cuotasSinPago, setCuotasSinPago] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Número de pagos por página

  useEffect(() => {
    const fetchCuotasSinPago = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_PORT_ENV}/pagos/pagosCuotas`,
          { timeout: 5000 }
        );
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const data = await response.json();
        setCuotasSinPago(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCuotasSinPago();
  }, []);

  const handleAsignarPago = (asesoramiento) => {
    if (asesoramiento && asesoramiento.id_asesoramiento) {
      setSelectedAsesoramiento(asesoramiento);
      setAsigPago(true);
    } else {
      setError("El asesoramiento seleccionado no tiene un ID válido.");
    }
  };

  // Paginación: Cálculo de las cuotas a mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCuotas = cuotasSinPago.slice(indexOfFirstItem, indexOfLastItem);

  // Paginación: Total de páginas
  const totalPages = Math.ceil(cuotasSinPago.length / itemsPerPage);

  // Cambiar de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Cargando...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-between text-[#495D72] font-medium p-[6px] pr-10 rounded-md">
          <div className="w-[100px] flex justify-center">IdContrato</div>
          <div className="w-[300px] flex justify-center">Cliente(Delegado)</div>
          <div className="w-[210px] flex justify-center">Contrato</div>
          <div className="w-[240px] flex justify-center">Tipo Trabajo</div>
          <div className="w-[360px] flex justify-center">
            Profesion Asesoria
          </div>
          <div className="w-[140px] flex justify-center ml-5">Acción</div>
        </div>

        {currentCuotas.length > 0 ? (
          currentCuotas.map((item, index) => (
            <div
              key={item.id_contrato}
              className={`flex justify-between items-center text-[#2B2829] font-normal ${
                index % 2 === 0 ? "" : "bg-[#E9E7E7]"
              } p-[6px] pr-10 rounded-md`}
            >
              <div className="w-[100px] flex justify-center">
                {"CT-" + (index + 1).toString().padStart(3, "0")}
              </div>
              <div className="w-[300px] flex justify-center">
                {item.delegado}
              </div>
              <div className="w-[210px] flex justify-center">
                {item.modalidad}
              </div>
              <div className="w-[240px] flex justify-center">
                {item.trabajo_investigacion}
              </div>
              <div className="w-[360px] flex justify-center">
                {item.profesion_asesoria}
              </div>
              <button
                onClick={() => handleAsignarPago(item)} // Aquí se pasa todo el objeto
                className="w-[140px] font-medium rounded-md px-3 py-1 bg-[#1C1C34] ml-5 flex justify-center text-white text-[14px]"
              >
                Asignar Pago
              </button>
            </div>
          ))
        ) : (
          <div className="text-center p-4">
            No hay asesoramientos con cuotas sin pago
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-5 gap-4">
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
      </div>

      {asigPago && (
        <AsignarPago
          Cerrar={() => setAsigPago(false)}
          asesoramiento={selectedAsesoramiento} // Cambié asesoramiento por pagoData
        />
      )}
    </>
  );
};

export default CuotasNuevo;
